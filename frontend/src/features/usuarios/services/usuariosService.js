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
 * Cambia/alterna el estado de un usuario (activo <-> inactivo) llamando al endpoint PATCH.
 * El backend ahora infiere el nuevo estado.
 * @param {number|string} idUsuario - El ID del usuario a modificar.
 * @returns {Promise<object>} Los datos del usuario actualizado devueltos por la API.
 */
export const toggleUsuarioEstadoAPI = async (idUsuario) => {
  // console.log(`[usuariosService.js] Toggling estado del usuario ${idUsuario}`);
  try {
    // Llama al nuevo endpoint PATCH que no requiere body.
    const response = await apiClient.patch(`/usuarios/${idUsuario}/toggle-estado`);
    // Asumiendo que el backend devuelve { success: true, message: "...", data: { ...usuarioActualizado } }
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
 * Realiza un borrado lógico (desactiva y bloquea) de un usuario.
 * Llama al endpoint PATCH /usuarios/:idUsuario/desactivar.
 * @param {number|string} idUsuario - El ID del usuario a desactivar.
 * @returns {Promise<object>} La respuesta de la API (puede ser solo un mensaje de éxito).
 */
export const desactivarUsuarioAPI = async (idUsuario) => {
  // console.log(`[usuariosService.js] Desactivando (soft delete) usuario ${idUsuario}`);
  try {
    const response = await apiClient.patch(`/usuarios/${idUsuario}/desactivar`);
    // El backend para desactivar devuelve: { message: 'Usuario desactivado y bloqueado exitosamente.' }
    return response.data; // Devolver el objeto de respuesta completo { message: "..." }
  } catch (error) {
    // console.error("[usuariosService.js] Error en desactivarUsuarioAPI:", error.response?.data || error.message);
    throw (
      error.response?.data ||
      new Error(error.message || 'Error al desactivar el usuario.')
    );
  }
};

/**
 * Elimina físicamente un usuario del sistema (Hard Delete).
 * Llama al endpoint DELETE /usuarios/:idUsuario.
 * @param {number|string} idUsuario - El ID del usuario a eliminar permanentemente.
 * @returns {Promise<boolean>} True si la eliminación fue exitosa (status 204).
 */
export const eliminarUsuarioFisicoAPI = async (idUsuario) => {
  // console.log(`[usuariosService.js] Eliminando físicamente (hard delete) usuario ${idUsuario}`);
  try {
    const response = await apiClient.delete(`/usuarios/${idUsuario}`);
    // El backend para delete físico devuelve 204 No Content.
    // Validar el status code es una buena práctica aquí.
    if (response.status === 204) {
      return true; // Éxito, no hay contenido que devolver
    }
    // Si por alguna razón no es 204, pero no lanzó error, tratarlo como un caso inesperado.
    // Aunque apiClient usualmente lanza error para status no exitosos.
    return response.data; // O manejar como un error si se espera estrictamente 204
  } catch (error) {
    // console.error("[usuariosService.js] Error en eliminarUsuarioFisicoAPI:", error.response?.data || error.message);
    throw (
      error.response?.data ||
      new Error(error.message || 'Error al eliminar permanentemente el usuario.')
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
