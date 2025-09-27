// src/controllers/movil/clientes.controller.js
const clienteService = require("../../services/cliente.service.js");

/**
 * Obtiene el perfil del cliente autenticado
 */
const obtenerMiPerfil = async (req, res, next) => {
  try {
    const idUsuario = req.usuario.idUsuario;
    const perfil = await clienteService.getPerfilClientePorUsuarioId(idUsuario);

    res.status(200).json({
      success: true,
      message: "Perfil obtenido exitosamente.",
      data: perfil,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualiza el perfil del cliente autenticado
 */
const actualizarMiPerfil = async (req, res, next) => {
  try {
    const idUsuario = req.usuario.idUsuario;
    const datosActualizar = req.body;

    const perfilActualizado =
      await clienteService.updatePerfilClientePorUsuarioId(
        idUsuario,
        datosActualizar
      );

    res.status(200).json({
      success: true,
      message: "Perfil actualizado exitosamente.",
      data: perfilActualizado,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerMiPerfil,
  actualizarMiPerfil,
};
