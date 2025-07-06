// app.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const pool = require('./config/db');
const appInsights = require('applicationinsights');
const http = require('http');
const { WebSocketServer } = require('ws');

// Inicializar express y Application Insights
const app = express();
appInsights.setup(process.env.APPINSIGHTS_CONNECTION_STRING).start();

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Ruta base
app.get('/', (req, res) => {
  res.send('✅ Backend funcionando correctamente');
});

// Rutas API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/sales', require('./routes/sales'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/users', require('./routes/users'));
app.use('/api/actividades', require('./routes/activity'));

// Crear servidor HTTP para usar con WebSocket
const server = http.createServer(app);

// WebSocket Server en la ruta /ws
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws) => {
  console.log('🔌 Cliente WebSocket conectado');

  ws.send(JSON.stringify({
    type: 'connection',
    message: '🟢 Conexión WebSocket establecida'
  }));

  ws.on('message', (message) => {
    console.log('📨 Mensaje recibido por WebSocket:', message);
    // Aquí puedes manejar comandos como { type: 'force_update' } si deseas
  });

  ws.on('close', () => {
    console.log('❌ Cliente WebSocket desconectado');
  });

  ws.on('error', (err) => {
    console.error('⚠️ Error en WebSocket:', err.message);
  });
});

// Limpiar usuarios y sesiones al iniciar
(async () => {
  try {
    await pool.query('UPDATE users SET is_online = 0');
    await pool.query('DELETE FROM sessions');
    console.log('🧹 Usuarios desconectados y sesiones eliminadas al iniciar el servidor.');
  } catch (err) {
    console.error('❌ Error al limpiar usuarios o sesiones:', err);
  }
})();

// Iniciar el servidor HTTP (Express + WebSocket)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT} (HTTP + WebSocket)`);
});

// Ejecutar limpieza de tokens expirados periódicamente
const limpiarTokensExpirados = require('./jobs/cleanExpiredTokens');
limpiarTokensExpirados(); // Primera ejecución inmediata
setInterval(limpiarTokensExpirados, 15 * 60 * 1000); // Cada 15 minutos

module.exports = app;
