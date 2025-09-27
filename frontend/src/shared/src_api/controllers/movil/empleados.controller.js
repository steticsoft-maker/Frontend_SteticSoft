// src/controllers/movil/empleados.controller.js
const empleadoService = require("../../services/empleado.service.js");

/**
 * Obtiene empleados disponibles para citas (solo información pública)
 * Para uso en aplicación móvil de clientes
 */
const obtenerEmpleadosDisponibles = async (req, res, next) => {
  try {
    const empleados = await empleadoService.obtenerEmpleadosDisponiblesMovil();

    res.status(200).json({
      success: true,
      message: "Empleados disponibles obtenidos exitosamente.",
      data: empleados,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerEmpleadosDisponibles,
};
