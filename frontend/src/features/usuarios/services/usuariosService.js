// src/features/usuarios/services/usuariosService.js

import apiClient from "../../../shared/services/api";

/**
 * REFINAMIENTO: Centraliza el manejo de errores de la API para evitar repetición.
 * Extrae el mensaje de error de la respuesta de Axios o crea un error genérico.
 * @param {Error} error - El objeto de error capturado.
 * @param {string} defaultMessage - Mensaje por defecto si no se encuentra uno específico.
 * @throws {Error} Lanza un nuevo error con un mensaje limpio.
 */
const handleApiError = (error, defaultMessage) => {
  const errorMessage =
    error.response?.data?.message || error.message || defaultMessage;
  throw new Error(errorMessage);
};

/**
 * Obtiene la lista de todos los usuarios.
 * @returns {Promise<Array>} Una promesa que resuelve a un array de usuarios.
 */
export const getUsuariosAPI = async () => {
  try {
    const response = await apiClient.get("/usuarios");
    return response.data;
  } catch (error) {
    handleApiError(error, "Error al obtener la lista de usuarios.");
  }
};

/**
 * Obtiene los detalles de un usuario por su ID.
 * @param {string} idUsuario - El ID del usuario.
 * @returns {Promise<object>} Una promesa que resuelve al objeto del usuario.
 */
export const getUsuarioByIdAPI = async (idUsuario) => {
  try {
    const response = await apiClient.get(`/usuarios/${idUsuario}`);
    return response.data;
  } catch (error) {
    handleApiError(error, "Error al obtener los detalles del usuario.");
  }
};

/**
 * Crea un nuevo usuario en el sistema.
 * @param {object} nuevoUsuarioData - Datos completos del usuario a crear.
 * @returns {Promise<object>} El nuevo usuario creado.
 */
export const createUsuarioAPI = async (nuevoUsuarioData) => {
  try {
    const response = await apiClient.post("/usuarios", nuevoUsuarioData);
    return response.data;
  } catch (error) {
    handleApiError(error, "Error al crear el nuevo usuario.");
  }
};

/**
 * Actualiza un usuario existente.
 * @param {string} idUsuario - El ID del usuario a actualizar.
 * @param {object} usuarioData - Datos del usuario a modificar.
 * @returns {Promise<object>} El usuario actualizado.
 */
export const updateUsuarioAPI = async (idUsuario, usuarioData) => {
  try {
    const response = await apiClient.put(`/usuarios/${idUsuario}`, usuarioData);
    return response.data;
  } catch (error) {
    handleApiError(error, "Error al actualizar el usuario.");
  }
};

/**
 * CORRECCIÓN: Cambia el estado de un usuario (activo/inactivo).
 * El backend espera una petición PATCH a /usuarios/:id/estado con { "activo": boolean }.
 * @param {string} idUsuario - El ID del usuario.
 * @param {boolean} nuevoEstado - `true` para activar, `false` para desactivar.
 * @returns {Promise<object>} El usuario con el estado modificado.
 */
export const toggleUsuarioEstadoAPI = async (idUsuario, nuevoEstado) => {
  try {
    const response = await apiClient.patch(`/usuarios/${idUsuario}/estado`, {
      activo: nuevoEstado, // CORRECCIÓN: El backend espera la clave 'activo'.
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "Error al cambiar el estado del usuario.");
  }
};

/**
 * NUEVA FUNCIÓN: Elimina un usuario físicamente del sistema.
 * @param {string} idUsuario - El ID del usuario a eliminar.
 * @returns {Promise<void>} No devuelve contenido en caso de éxito.
 */
export const deleteUsuarioAPI = async (idUsuario) => {
  try {
    await apiClient.delete(`/usuarios/${idUsuario}`);
  } catch (error) {
    handleApiError(error, "Error al eliminar el usuario.");
  }
};

/**
 * CORRECCIÓN: Verifica si un correo ya existe usando POST.
 * El backend espera una petición POST a /usuarios/verificar-correo.
 * @param {string} correo - El correo a verificar.
 * @returns {Promise<{existe: boolean}>} Un objeto indicando si el correo existe.
 */
export const verificarCorreoAPI = async (correo) => {
  try {
    const response = await apiClient.post("/usuarios/verificar-correo", {
      correo,
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "Error al verificar el correo.");
  }
};

/**
 * Obtiene la lista de roles disponibles.
 * @returns {Promise<Array>} Una promesa que resuelve a un array de roles.
 */
export const getRolesAPI = async () => {
  try {
    const response = await apiClient.get("/roles");
    return response.data;
  } catch (error) {
    handleApiError(error, "Error al obtener la lista de roles.");
  }
};
