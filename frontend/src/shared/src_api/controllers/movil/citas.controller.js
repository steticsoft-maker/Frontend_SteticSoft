// src/controllers/movil/citas.controller.js
const citaService = require("../../services/cita.service.js");
const servicioService = require("../../services/servicio.service.js");
const empleadoService = require("../../services/empleado.service.js");
const novedadesService = require("../../services/novedades.service.js");

/**
 * Obtiene las citas del cliente autenticado
 */
const obtenerMisCitas = async (req, res, next) => {
  try {
    const idCliente = req.usuario.clienteInfo.idCliente;
    const { pagina = 1, limite = 10, estado } = req.query;

    const citas = await citaService.obtenerCitasPorCliente(idCliente, {
      pagina: parseInt(pagina),
      limite: parseInt(limite),
      estado,
    });

    res.status(200).json({
      success: true,
      message: "Citas obtenidas exitosamente.",
      data: citas,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Crea una nueva cita para el cliente autenticado
 * Implementa asignación automática de empleado si no se especifica
 */
const crearCitaMovil = async (req, res, next) => {
  try {
    const { fecha, hora_inicio, usuarioId, servicios = [] } = req.body;
    const idCliente = req.usuario.clienteInfo.idCliente;

    // Si no se especifica empleado, asignar automáticamente
    let empleadoAsignado = usuarioId;

    if (
      !empleadoAsignado ||
      empleadoAsignado === "" ||
      empleadoAsignado === null
    ) {
      empleadoAsignado = await empleadoService.asignarEmpleadoAutomatico(
        fecha,
        hora_inicio
      );
    } else {
      // Validar disponibilidad del empleado especificado
      await empleadoService.validarDisponibilidadEmpleado(
        empleadoAsignado,
        fecha,
        hora_inicio
      );
    }

    // Obtener novedad del empleado para esa fecha
    const novedadId = await novedadesService.obtenerNovedadEmpleado(
      empleadoAsignado,
      fecha
    );

    // Estado por defecto para citas móviles (Pendiente)
    const idEstadoPendiente = 2;

    const datosCita = {
      fecha,
      hora_inicio,
      clienteId: idCliente,
      usuarioId: empleadoAsignado,
      idEstado: idEstadoPendiente,
      novedadId,
      servicios,
    };

    const cita = await citaService.crearCita(datosCita);

    res.status(201).json({
      success: true,
      message:
        "Cita agendada exitosamente. Recibirás una confirmación por correo.",
      data: cita,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Permite al cliente cancelar su cita
 */
const cancelarCita = async (req, res, next) => {
  try {
    const { idCita } = req.params;
    const idCliente = req.usuario.clienteInfo.idCliente;

    const cita = await citaService.cancelarCitaPorCliente(idCita, idCliente);

    res.status(200).json({
      success: true,
      message: "Cita cancelada exitosamente.",
      data: cita,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene los servicios disponibles para agendar citas
 */
const obtenerServiciosDisponibles = async (req, res, next) => {
  try {
    const servicios = await servicioService.obtenerServiciosPublicos();

    res.status(200).json({
      success: true,
      message: "Servicios obtenidos exitosamente.",
      data: servicios,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerMisCitas,
  crearCitaMovil,
  cancelarCita,
  obtenerServiciosDisponibles,
};
