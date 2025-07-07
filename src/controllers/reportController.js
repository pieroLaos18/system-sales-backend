const reportService = require('../services/reportService');

// Función para validar fechas en formato YYYY-MM-DD
function isValidDate(dateStr) {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr) && !isNaN(new Date(dateStr).getTime());
}

const getSalesByDate = async (req, res) => {
  const { from, to, user } = req.query;

  // Validar fechas antes de consultar la base de datos
  if ((from && !isValidDate(from)) || (to && !isValidDate(to))) {
    return res.status(400).json({ message: 'Parámetro de fecha inválido' });
  }

  try {
    const ventas = await reportService.getSalesByDate(from, to);

    const usuario =
      req.user?.nombre ||
      req.user?.correo_electronico ||
      user ||
      'Desconocido';

    const descripcion = `Reporte de ventas generado por ${usuario} (${from || 'inicio'} a ${to || 'hoy'})`;
    await reportService.logReportActivity(descripcion, usuario);

    res.status(200).json(ventas);
  } catch (error) {
    console.error('Error en reporte:', error);
    res.status(500).json({ message: 'Error al obtener el reporte de ventas' });
  }
};

module.exports = {
  getSalesByDate
};
