// src/controllers/usuario.controller.js
const usuarioService = require("../services/usuario.service.js");

/**
 * Crea un nuevo usuario.
 */
const crearUsuario = async (req, res, next) => {
  try {
    const nuevoUsuario = await usuarioService.crearUsuario(req.body);
    res.status(201).json({
      success: true,
      message: "Usuario creado exitosamente.",
      data: nuevoUsuario,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene una lista de todos los usuarios.
 */
const listarUsuarios = async (req, res, next) => {
  try {
    const opcionesDeFiltro = {};
    if (req.query.estado === "true") {
      opcionesDeFiltro.estado = true;
    } else if (req.query.estado === "false") {
      opcionesDeFiltro.estado = false;
    }
    if (req.query.idRol) {
      const idRol = Number(req.query.idRol);
      if (!isNaN(idRol) && idRol > 0) {
        opcionesDeFiltro.idRol = idRol;
      }
    }
    const usuarios =
      await usuarioService.obtenerTodosLosUsuarios(opcionesDeFiltro);
    res.status(200).json({
      success: true,
      data: usuarios,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene un usuario específico por su ID.
 */
const obtenerUsuarioPorId = async (req, res, next) => {
  try {
    const { idUsuario } = req.params;
    const usuario = await usuarioService.obtenerUsuarioPorId(Number(idUsuario));
    res.status(200).json({
      success: true,
      data: usuario,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualiza (Edita) un usuario existente por su ID.
 */
const actualizarUsuario = async (req, res, next) => {
  try {
    const { idUsuario } = req.params;
    if (req.body.contrasena === "") {
      delete req.body.contrasena;
    }
    const usuarioActualizado = await usuarioService.actualizarUsuario(
      Number(idUsuario),
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Usuario actualizado exitosamente.",
      data: usuarioActualizado,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cambia/ alterna el estado (activo <-> inactivo) de un usuario.
 * Este controlador corresponde a la ruta PATCH /:idUsuario/toggle-estado
 */
const toggleUsuarioEstado = async (req, res, next) => {
  try {
    const { idUsuario } = req.params;
    // El servicio toggleUsuarioEstado ahora infiere el nuevo estado.
    const usuarioActualizado = await usuarioService.toggleUsuarioEstado(
      Number(idUsuario)
    );
    res.status(200).json({
      success: true,
      message: `Estado del usuario ID ${idUsuario} cambiado a ${usuarioActualizado.estado} exitosamente.`,
      data: usuarioActualizado,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controlador para el borrado lógico (desactivar y bloquear cuenta).
 * Este controlador corresponde a la ruta PATCH /:idUsuario/desactivar
 */
const desactivarUsuario = async (req, res, next) => {
  try {
    const { id } = req.params; // La ruta usa :id, pero el servicio espera un número.
                               // Corregido en rutas a :idUsuario para consistencia.
                               // Si la ruta realmente usa :id, aquí sería req.params.id
    const { idUsuario } = req.params;
    await usuarioService.desactivarYBloquearUsuario(Number(idUsuario));
    res.status(200).json({ message: 'Usuario desactivado y bloqueado exitosamente.' });
  } catch (error) {
    next(error);
  }
};

/**
 * Elimina físicamente un usuario por su ID.
 */
const eliminarUsuarioFisico = async (req, res, next) => {
  try {
    const { idUsuario } = req.params;
    await usuarioService.eliminarUsuarioFisico(Number(idUsuario));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const verificarCorreo = async (req, res, next) => {
  try {
    const { correo } = req.query;
    // El servicio ahora devuelve true si está en uso, false si no.
    const enUso = await usuarioService.verificarCorreoExistente(correo); 
    
    // La respuesta al frontend es la misma que antes, solo cambia cómo se obtiene 'enUso'
    return res.status(200).json({
      success: true,
      estaEnUso: enUso, // Usar el valor booleano directamente
      message: enUso
        ? "El correo electrónico ya está registrado."
        : "El correo electrónico está disponible.",
    });
  } catch (error) {
    console.error(`[usuario.controller.js] Error en verificarCorreo para el correo "${req.query.correo}":`, error.message, error.stack);
    next(error);
  }
};

module.exports = {
  crearUsuario,
  listarUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  anularUsuario, 
  habilitarUsuario, 
  eliminarUsuarioFisico, 
  cambiarEstadoUsuario, 
  verificarCorreo,
};
