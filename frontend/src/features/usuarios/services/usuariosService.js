// src/features/usuarios/services/usuariosService.js
import apiClient from "../../../shared/services/api"; // Ajusta la ruta a tu apiClient

/**
 * Obtiene la lista de todos los usuarios desde la API.
 */
export const getUsuariosAPI = async () => {
  try {
    const response = await apiClient.get("/usuarios");
    // Asumiendo que el backend devuelve { success: true, data: [...] }
    return response.data.data; // Devolver directamente el array de usuarios
  } catch (error) {
    // console.error("[usuariosService.js] Error en getUsuariosAPI:", error.response?.data || error.message);
    throw (
      error.response?.data ||
      new Error(error.message || "Error al obtener la lista de usuarios.")
    );
  }
};

/**
 * Verifica si un correo electrónico ya existe en el sistema.
 * @param {string} correo - El correo electrónico a verificar.
 * @returns {Promise<object>} La respuesta de la API, que podría incluir un booleano o un mensaje.
 *                            Ej. { existe: true } o { existe: false }
 * @throws {Error} Relanza el error si la llamada a la API falla.
 */
export const verificarCorreoAPI = async (correo) => {
  try {
    const response = await apiClient.get(
      `/usuarios/verificar-correo?correo=${encodeURIComponent(correo)}`
    );
    // El backend devuelve { success: true, estaEnUso: boolean, message: "..." }
    // El hook usará response.estaEnUso
    return response.data;
  } catch (error) {
    // console.error("[usuariosService.js] Error en verificarCorreoAPI:", error.response?.data || error.message);
    throw (
      error.response?.data ||
      new Error(error.message || "Error al verificar el correo.")
    );
  }
};

/**
 * Obtiene los detalles de un usuario específico por su ID.
 */
export const getUsuarioByIdAPI = async (idUsuario) => {
  try {
    const response = await apiClient.get(`/usuarios/${idUsuario}`);
    // Asumiendo que el backend devuelve { success: true, data: {} }
    return response.data.data;
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
    // Asumiendo que el backend devuelve { success: true, message: "...", data: {} }
    return response.data.data;
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
    // Asumiendo que el backend devuelve { success: true, message: "...", data: {} }
    return response.data.data;
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
    // Asumiendo que el backend devuelve { success: true, message: "...", data: {} }
    return response.data.data;
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
    // Asumiendo que el backend de roles devuelve { success: true, data: [...] }
    return response.data.data; // Devolver directamente el array de roles
  } catch (error) {
    // console.error("[usuariosService.js] Error en getRolesAPI:", error.response?.data || error.message);
    throw (
      error.response?.data ||
      new Error(error.message || "Error al obtener la lista de roles.")
    );
  }
};

/**
 * Elimina físicamente un usuario del sistema.
 * @param {number} idUsuario - El ID del usuario a eliminar.
 */
export const eliminarUsuarioFisicoAPI = async (idUsuario) => {
  try {
    // La respuesta a un DELETE exitoso (204 No Content) no tiene cuerpo.
    await apiClient.delete(`/usuarios/${idUsuario}`);
    return true; // Retornamos true para indicar éxito.
  } catch (error) {
    // Lanzamos el mensaje de error que viene de la API o uno genérico.
    throw (
      error.response?.data || new Error("Error al eliminar permanentemente el usuario.")
    );
  }
};
