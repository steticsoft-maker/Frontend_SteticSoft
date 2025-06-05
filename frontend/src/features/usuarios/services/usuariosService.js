// src/features/usuarios/services/usuariosService.js
import apiClient from "../../../shared/services/api"; // Ajusta la ruta a tu apiClient

/**
 * Obtiene la lista de todos los usuarios desde la API.
 */
export const getUsuariosAPI = async () => {
  try {
    const response = await apiClient.get("/usuarios");
    return response.data;
  } catch (error) {
    // console.error("[usuariosService.js] Error en getUsuariosAPI:", error.response?.data || error.message);
    throw (
      error.response?.data ||
      new Error(error.message || "Error al obtener la lista de usuarios.")
    );
  }
};

/**
 * Obtiene los detalles de un usuario específico por su ID.
 */
export const getUsuarioByIdAPI = async (idUsuario) => {
  try {
    const response = await apiClient.get(`/usuarios/${idUsuario}`);
    return response.data;
  } catch (error) {
    // console.error("[usuariosService.js] Error en getUsuarioByIdAPI:", error.response?.data || error.message);
    throw (
      error.response?.data ||
      new Error(error.message || "Error al obtener los detalles del usuario.")
    );
  }
};

/**
 * Crea un nuevo usuario en el sistema.
 */
export const createUsuarioAPI = async (nuevoUsuarioData) => {
  // console.log("[usuariosService.js] Creando usuario con datos:", nuevoUsuarioData);
  try {
    const response = await apiClient.post("/usuarios", nuevoUsuarioData);
    return response.data;
  } catch (error) {
    // console.error("[usuariosService.js] Error en createUsuarioAPI:", error.response?.data || error.message);
    throw (
      error.response?.data ||
      new Error(error.message || "Error al crear el nuevo usuario.")
    );
  }
};

/**
 * Actualiza un usuario existente en el sistema.
 */
export const updateUsuarioAPI = async (idUsuario, usuarioData) => {
  // console.log(`[usuariosService.js] Actualizando usuario ${idUsuario} con datos:`, usuarioData);
  try {
    const response = await apiClient.put(`/usuarios/${idUsuario}`, usuarioData);
    return response.data;
  } catch (error) {
    // console.error("[usuariosService.js] Error en updateUsuarioAPI:", error.response?.data || error.message);
    throw (
      error.response?.data ||
      new Error(error.message || "Error al actualizar el usuario.")
    );
  }
};

/**
 * Cambia el estado de un usuario (activo/inactivo) llamando al endpoint PATCH.
 * @param {number|string} idUsuario - El ID del usuario a modificar.
 * @param {boolean} nuevoEstado - El nuevo estado para el usuario (true para activo, false para inactivo).
 * @returns {Promise<object>} La respuesta de la API.
 */
export const toggleUsuarioEstadoAPI = async (idUsuario, nuevoEstado) => {
  // console.log(`[usuariosService.js] Cambiando estado del usuario ${idUsuario} a:`, nuevoEstado);
  try {
    // Se utiliza la ruta PATCH específica para cambiar el estado.
    // El backend espera un objeto con la propiedad 'estado' en el cuerpo de la solicitud.
    const response = await apiClient.patch(`/usuarios/${idUsuario}/estado`, {
      estado: nuevoEstado,
    });
    return response.data;
  } catch (error) {
    // console.error("[usuariosService.js] Error en toggleUsuarioEstadoAPI:", error.response?.data || error.message);
    throw (
      error.response?.data ||
      new Error(error.message || "Error al cambiar el estado del usuario.")
    );
  }
};

/**
 * Obtiene la lista de roles disponibles desde la API.
 */
export const getRolesAPI = async () => {
  try {
    const response = await apiClient.get("/roles");
    return response.data;
  } catch (error) {
    // console.error("[usuariosService.js] Error en getRolesAPI:", error.response?.data || error.message);
    throw (
      error.response?.data ||
      new Error(error.message || "Error al obtener la lista de roles.")
    );
  }
};