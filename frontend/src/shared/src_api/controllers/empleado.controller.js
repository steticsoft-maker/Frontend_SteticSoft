// src/controllers/empleado.controller.js
const empleadoService = require("../services/empleado.service.js");

/**
 * Crea un nuevo empleado.
 */
const crearEmpleado = async (req, res, next) => {
  try {
    const nuevoEmpleado = await empleadoService.crearEmpleado(req.body);
    res.status(201).json({
      success: true,
      message: "Empleado creado exitosamente.",
      data: nuevoEmpleado,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene una lista de todos los empleados.
 */
const listarEmpleados = async (req, res, next) => {
  try {
    const opcionesDeFiltro = {};
    if (req.query.estado === "true") {
      opcionesDeFiltro.estado = true;
    } else if (req.query.estado === "false") {
      opcionesDeFiltro.estado = false;
    }
    const empleados =
      await empleadoService.obtenerTodosLosEmpleados(opcionesDeFiltro);
    res.status(200).json({
      success: true,
      data: empleados,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene un empleado específico por su ID.
 */
const obtenerEmpleadoPorId = async (req, res, next) => {
  try {
    const { idEmpleado } = req.params;
    const empleado = await empleadoService.obtenerEmpleadoPorId(
      Number(idEmpleado)
    );
    res.status(200).json({
      success: true,
      data: empleado,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualiza (Edita) un empleado existente por su ID.
 */
const actualizarEmpleado = async (req, res, next) => {
  try {
    const { idEmpleado } = req.params;
    const empleadoActualizado = await empleadoService.actualizarEmpleado(
      Number(idEmpleado),
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Empleado actualizado exitosamente.",
      data: empleadoActualizado,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cambia el estado (activo/inactivo) de un empleado.
 */
const cambiarEstadoEmpleado = async (req, res, next) => {
  try {
    const { idEmpleado } = req.params;
    const { estado } = req.body; // Se espera un booleano

    const empleadoActualizado = await empleadoService.cambiarEstadoEmpleado(
      Number(idEmpleado),
      estado
    );
    res.status(200).json({
      success: true,
      message: `Estado del empleado ID ${idEmpleado} cambiado a ${estado} exitosamente.`,
      data: empleadoActualizado,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Anula un empleado (borrado lógico, estado = false).
 */
const anularEmpleado = async (req, res, next) => {
  try {
    const { idEmpleado } = req.params;
    const empleadoAnulado = await empleadoService.anularEmpleado(
      Number(idEmpleado)
    );
    res.status(200).json({
      success: true,
      message: "Empleado anulado (deshabilitado) exitosamente.",
      data: empleadoAnulado,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Habilita un empleado (estado = true).
 */
const habilitarEmpleado = async (req, res, next) => {
  try {
    const { idEmpleado } = req.params;
    const empleadoHabilitado = await empleadoService.habilitarEmpleado(
      Number(idEmpleado)
    );
    res.status(200).json({
      success: true,
      message: "Empleado habilitado exitosamente.",
      data: empleadoHabilitado,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Elimina físicamente un empleado por su ID.
 */
const eliminarEmpleadoFisico = async (req, res, next) => {
  try {
    const { idEmpleado } = req.params;
    await empleadoService.eliminarEmpleadoFisico(Number(idEmpleado));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene una lista de todos los empleados ACTIVOS.
 * Ideal para poblar listas desplegables en la UI.
 */
const listarEmpleadosActivos = async (req, res, next) => {
  try {
    const empleados = await empleadoService.obtenerEmpleadosActivos();
    res.status(200).json({
      success: true,
      data: empleados,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  crearEmpleado,
  listarEmpleados,
  obtenerEmpleadoPorId,
  actualizarEmpleado,
  anularEmpleado,
  habilitarEmpleado,
  eliminarEmpleadoFisico,
  cambiarEstadoEmpleado,
  listarEmpleadosActivos,
};
