// src/features/roles/services/rolesService.js

import apiClient from "../../../shared/services/apiClient";

/**
 * Obtiene todos los permisos (módulos) desde la API.
 */
export const getPermisosAPI = async () => {
  try {
    const response = await apiClient.get("/permisos");
    return response.data?.data || [];
  } catch (error) {
    console.error(
      "Error al obtener permisos:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "No se pudieron obtener los permisos."
    );
  }
};

/**
 * Verifica si ciertos datos de un rol ya existen en la base de datos.
 * @param {object} data - Objeto con los campos a verificar. Ej: { nombre: 'SuperAdmin' }
 */
export const verificarDatosUnicos = async (data) => {
  try {
    const response = await apiClient.post("/roles/verificar-unicidad", data);
    return response.data;
  } catch (error) {
    console.error(
      "Error al verificar datos únicos del rol:",
      error.response?.data || error.message
    );
    // Devuelve un objeto de error estándar para que el formulario pueda procesarlo.
    return {
      success: false,
      errors: {
        api:
          error.response?.data?.message ||
          "No se pudo conectar con el servidor para la verificación.",
      },
    };
  }
};

/**
 * Obtiene la lista completa de roles desde la API, opcionalmente filtrada por un término de búsqueda.
 * @param {string} [searchTerm] - Término opcional para buscar roles.
 */
export const fetchRolesAPI = async (searchTerm) => {
  try {
    let url = "/roles";
    if (searchTerm && searchTerm.trim() !== "") {
      url += `?search=${encodeURIComponent(searchTerm.trim())}`;
    }
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error(
      "Error al obtener roles:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "No se pudieron obtener los roles."
    );
  }
};

/**
 * Crea un nuevo rol con sus permisos.
 * @param {object} roleData - Datos del rol, incluyendo nombre, descripcion, tipoPerfil, y idPermisos.
 */
export const createRoleAPI = async (roleData) => {
  try {
    const response = await apiClient.post("/roles", roleData);
    return response.data;
  } catch (error) {
    console.error(
      "Error al crear el rol:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Actualiza un rol existente y sus permisos.
 * @param {string|number} roleId - El ID del rol a actualizar.
 * @param {object} roleData - Datos del rol a actualizar (nombre, descripcion, tipoPerfil, estado, idPermisos).
 */
export const updateRoleAPI = async (roleId, roleData) => {
  try {
    const response = await apiClient.put(`/roles/${roleId}`, roleData);
    return response.data;
  } catch (error) {
    console.error(
      `Error al actualizar el rol con ID ${roleId}:`,
      error.response?.data || error.message
    );

    throw error.response?.data || error;
  }
};

/**
 * Cambia el estado (activo/inactivo) de un rol.
 */
export const toggleRoleStatusAPI = async (roleId, newStatus) => {
  try {
    const response = await apiClient.patch(`/roles/${roleId}/estado`, {
      estado: newStatus,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error al cambiar el estado del rol:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "No se pudo cambiar el estado."
    );
  }
};

/**
 * Elimina un rol de forma física de la base de datos.
 */
export const deleteRoleAPI = async (roleId) => {
  try {
    const response = await apiClient.delete(`/roles/${roleId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error al eliminar el rol:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "No se pudo eliminar el rol."
    );
  }
};

/**
 * Obtiene los detalles completos de un rol, incluyendo sus permisos.
 */
export const getRoleDetailsAPI = async (roleId) => {
  try {
    const response = await apiClient.get(`/roles/${roleId}`);
    return response.data.data;
  } catch (error) {
    console.error(
      "Error al obtener detalles del rol:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message ||
        "No se pudieron obtener los detalles del rol."
    );
  }
};
