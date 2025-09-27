// src/controllers/movil/novedades.controller.js
const novedadesService = require("../../services/novedades.service.js");

/**
 * Obtiene novedades disponibles para citas (solo información pública)
 * Para uso en aplicación móvil de clientes
 */
const obtenerNovedadesDisponibles = async (req, res, next) => {
  try {
    const novedades = await novedadesService.obtenerNovedadesDisponiblesMovil();

    res.status(200).json({
      success: true,
      message: "Novedades disponibles obtenidas exitosamente.",
      data: novedades,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerNovedadesDisponibles,
};
