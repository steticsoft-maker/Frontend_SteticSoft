const citaService = require("../services/cita.service.js");
const db = require("../models/index.js");
const moment = require("moment");

const crearCita = async (req, res, next) => {
  try {
    const {
      start,
      clienteId,
      empleadoId,
      servicios,
      idEstado,
      novedadId,
      precio_total,
    } = req.body;
    const datosParaServicio = {
      fecha: moment(start).format("YYYY-MM-DD"),
      hora_inicio: moment(start).format("HH:mm:ss"),
      clienteId,
      usuarioId: empleadoId,
      servicios,
      idEstado,
      novedadId,
      precio_total,
    };

    const nuevaCita = await citaService.crearCita(datosParaServicio);
    res.status(201).json({
      success: true,
      message: "Cita creada exitosamente.",
      data: nuevaCita,
    });
  } catch (error) {
    next(error);
  }
};

const listarCitas = async (req, res, next) => {
  try {
    const { idCliente, idUsuario, idEstado, fecha, busqueda } = req.query;

    const opcionesDeFiltro = {
      idCliente: idCliente ? Number(idCliente) : undefined,
      idUsuario: idUsuario ? Number(idUsuario) : undefined,
      idEstado: idEstado ? Number(idEstado) : undefined,
      fecha: fecha || undefined,
      busqueda: busqueda || undefined,
    };
    const citas = await citaService.obtenerTodasLasCitas(opcionesDeFiltro);
    res.status(200).json({
      success: true,
      data: citas,
    });
  } catch (error) {
    next(error);
  }
};

const obtenerCitaPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cita = await citaService.obtenerCitaPorId(Number(id));
    res.status(200).json({
      success: true,
      data: cita,
    });
  } catch (error) {
    next(error);
  }
};

const actualizarCita = async (req, res, next) => {
  try {
    const { id } = req.params;
    const datosActualizar = req.body;
    if (datosActualizar.start) {
      datosActualizar.fecha = moment(datosActualizar.start).format(
        "YYYY-MM-DD"
      );
      datosActualizar.hora_inicio = moment(datosActualizar.start).format(
        "HH:mm:ss"
      );
      delete datosActualizar.start;
    }
    if (datosActualizar.empleadoId) {
      datosActualizar.usuarioId = datosActualizar.empleadoId;
      delete datosActualizar.empleadoId;
    }

    const citaActualizada = await citaService.actualizarCita(
      Number(id),
      datosActualizar
    );
    res.status(200).json({
      success: true,
      message: "Cita actualizada exitosamente.",
      data: citaActualizada,
    });
  } catch (error) {
    next(error);
  }
};

const cambiarEstadoCita = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { idEstado } = req.body;
    const citaActualizada = await citaService.cambiarEstadoCita(
      Number(id),
      idEstado
    );
    res.status(200).json({
      success: true,
      message: `Estado de la cita cambiado exitosamente.`,
      data: citaActualizada,
    });
  } catch (error) {
    next(error);
  }
};

const eliminarCitaFisica = async (req, res, next) => {
  try {
    const { id } = req.params;
    await citaService.eliminarCitaFisica(Number(id));
    res.status(200).json({
      success: true,
      message: "Cita eliminada exitosamente.",
    });
  } catch (error) {
    next(error);
  }
};

const obtenerDiasDisponiblesPorNovedad = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { anio, mes } = req.query;
    const dias = await citaService.obtenerDiasDisponiblesPorNovedad(
      Number(id),
      anio,
      mes
    );
    res.status(200).json({ success: true, data: dias });
  } catch (error) {
    next(error);
  }
};

const obtenerHorariosDisponiblesPorNovedad = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fecha } = req.query;
    const horarios = await citaService.obtenerHorariosDisponiblesPorNovedad(
      Number(id),
      fecha
    );
    res.status(200).json({ success: true, data: horarios });
  } catch (error) {
    next(error);
  }
};

const buscarClientes = async (req, res, next) => {
  try {
    const { search } = req.query;
    const clientes = await citaService.buscarClientes(search);
    res.status(200).json({ success: true, data: clientes });
  } catch (error) {
    next(error);
  }
};

const obtenerEmpleadosPorNovedad = async (req, res, next) => {
  try {
    const { id } = req.params;
    const empleados = await citaService.obtenerEmpleadosPorNovedad(Number(id));
    res.status(200).json({ success: true, data: empleados });
  } catch (error) {
    next(error);
  }
};

const obtenerServiciosDisponibles = async (req, res, next) => {
  try {
    const { search } = req.query;
    const servicios = await citaService.obtenerServiciosDisponibles(search);
    res.status(200).json({ success: true, data: servicios });
  } catch (error) {
    next(error);
  }
};

const obtenerEstadosCita = async (req, res, next) => {
  try {
    const estados = await db.Estado.findAll({
      attributes: [
        ["id_estado", "idEstado"],
        ["nombre_estado", "nombreEstado"],
      ],
      order: [["id_estado", "ASC"]],
    });
    res.status(200).json({ success: true, data: estados });
  } catch (error) {
    next(error);
  }
};

const listarMisCitas = async (req, res, next) => {
  try {
    const idCliente = req.user.clienteInfo?.idCliente;
    if (!idCliente) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Acceso denegado. Perfil de cliente no encontrado.",
        });
    }

    const citas = await citaService.obtenerCitasPorCliente(idCliente);
    res.status(200).json({
      success: true,
      data: citas,
    });
  } catch (error) {
    next(error);
  }
};

const crearMiCita = async (req, res, next) => {
  try {
    const idCliente = req.user.clienteInfo?.idCliente;
    if (!idCliente) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Acceso denegado. Perfil de cliente no encontrado.",
        });
    }
    const nuevaCita = await citaService.crearCitaParaCliente(
      req.body,
      idCliente
    );
    res.status(201).json({
      success: true,
      message: "Cita creada exitosamente.",
      data: nuevaCita,
    });
  } catch (error) {
    next(error);
  }
};

const obtenerMiCitaPorId = async (req, res, next) => {
  try {
    const idCliente = req.user.clienteInfo?.idCliente;
    if (!idCliente) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Acceso denegado. Perfil de cliente no encontrado.",
        });
    }
    const { id } = req.params;
    const cita = await citaService.obtenerCitaDeClientePorId(
      Number(id),
      idCliente
    );
    res.status(200).json({
      success: true,
      data: cita,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  crearCita,
  listarCitas,
  listarMisCitas,
  obtenerCitaPorId,
  actualizarCita,
  cambiarEstadoCita,
  eliminarCitaFisica,
  obtenerDiasDisponiblesPorNovedad,
  obtenerHorariosDisponiblesPorNovedad,
  buscarClientes,
  obtenerEmpleadosPorNovedad,
  obtenerServiciosDisponibles,
  obtenerEstadosCita,
  crearMiCita,
  obtenerMiCitaPorId,
};
