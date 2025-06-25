// src/features/usuarios/services/usuariosService.js
import apiClient from "../../../shared/services/api"; // Ajusta la ruta a tu apiClient

/**
 * Obtiene la lista de todos los usuarios desde la API.
 * @param {object} params - Objeto con parámetros de consulta.
 * @param {string} params.busqueda - Término de búsqueda.
 * @param {boolean} params.estado - Estado para filtrar.
 */
export const getUsuariosAPI = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.busqueda) {
      queryParams.append('busqueda', params.busqueda);
    }
    if (params.estado !== undefined) {
      queryParams.append('estado', params.estado);
    }

    const queryString = queryParams.toString();
    const url = queryString ? `/usuarios?${queryString}` : '/usuarios';

    const response = await apiClient.get(url);
    return response.data; // Asumiendo que la API devuelve { data: [...] } o similar
  } catch (error) {
    // console.error("[usuariosService.js] Error en getUsuariosAPI:", error.response?.data || error.message);
    throw (
      error.response?.data ||
      new Error(error.message || "Error al obtener la lista de usuarios.")
    );
  }
};

/**
 * Verifica si un correo electrónico ya está en uso.
 * @param {string} correo - El correo a verificar.
 * @param {number|null} idUsuarioActual - El ID del usuario actual (si se está editando), o null.
 * @returns {Promise<object>} Respuesta de la API.
 */
export const verificarCorreoUsuarioAPI = async (correo, idUsuarioActual = null) => {
  try {
    const payload = { correo };
    if (idUsuarioActual) {
      payload.idUsuarioActual = idUsuarioActual;
    }
    const response = await apiClient.post("/usuarios/verificar-correo", payload);
    return response.data; // Espera { success: true, message: "..." } o error con { success: false, message: "...", field: "correo" }
  } catch (error) {
    // Si el backend devuelve 409, apiClient debería lanzarlo como un error.
    // El error.response.data contendrá el mensaje y el campo.
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error(error.message || "Error al verificar el correo.");
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