const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Validación de variables de entorno requeridas
const requiredEnv = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Falta la variable de entorno: ${key}`);
  }
}

// Configuración de la conexión a la base de datos
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
};

// Habilitar SSL si se especifica en las variables de entorno
if (process.env.DB_SSL === 'true') {
  dbConfig.ssl = {
    ca: [
      fs.readFileSync(path.join(__dirname, 'BaltimoreCyberTrustRoot.crt.pem'), 'utf8'),
      fs.readFileSync(path.join(__dirname, 'DigiCertGlobalRootCA.crt.pem'), 'utf8'),
      fs.readFileSync(path.join(__dirname, 'DigiCertGlobalRootG2.crt.pem'), 'utf8')
    ],
    rejectUnauthorized: false // Solo para pruebas locales
  };
}

// Crear el pool de conexiones a la base de datos
const pool = mysql.createPool(dbConfig);

module.exports = pool;
