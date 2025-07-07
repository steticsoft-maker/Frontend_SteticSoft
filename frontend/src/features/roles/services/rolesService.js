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
 * Obtiene la lista completa de roles desde la API, opcionalmente filtrada por un término de búsqueda.
 * @param {string} [searchTerm] - Término opcional para buscar roles.
 */
export const fetchRolesAPI = async (searchTerm) => {
  // Añadido searchTerm como parámetro
  try {
    let url = "/roles";
    if (searchTerm && searchTerm.trim() !== "") {
      url += `?search=${encodeURIComponent(searchTerm.trim())}`; // Añadir query param si searchTerm existe
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
 * El backend espera idPermisos en el mismo payload.
 * @param {object} roleData - Datos del rol, incluyendo nombre, descripcion, estado (opcional), y idPermisos.
 */
export const createRoleAPI = async (roleData) => {
  try {
    // Aseguramos que idPermisos (si existe) se envíe junto con otros datos del rol.
    // El backend espera recibir: { nombre, descripcion, idPermisos: [...] }
    const response = await apiClient.post("/roles", roleData);
    return response.data; // Devuelve la respuesta completa del backend (ej: { message: "...", data: { idRol: ... } })
  } catch (error) {
    console.error(
      "Error al crear el rol:",
      error.response?.data || error.message
    );
    // Propagar el error para que useRoles.js pueda manejarlo y mostrar el mensaje de error de la API
    throw error;
  }
};

/**
 * Actualiza un rol existente y sus permisos.
 * @param {string|number} roleId - El ID del rol a actualizar.
 * @param {object} roleData - Datos del rol a actualizar (nombre, descripcion, estado, idPermisos).
 */
export const updateRoleAPI = async (roleId, roleData) => {
  // roleData puede contener: { nombre, descripcion, estado, idPermisos }
  const { idPermisos, ...dataToUpdate } = roleData; // Separamos idPermisos del resto

  try {
    // 1. Actualizar los datos básicos del rol (nombre, descripción, estado)
    // La URL es PUT /api/roles/:roleId
    const roleResponse = await apiClient.put(`/roles/${roleId}`, dataToUpdate);

    // 2. Actualizar los permisos del rol si se proporcionaron idPermisos.
    // Esta llamada es POST /api/roles/:roleId/permisos y espera un cuerpo como { idPermisos: [...] }
    // Es importante que esta llamada se haga incluso si idPermisos es un array vacío,
    // para que el backend pueda eliminar todos los permisos existentes si ese es el caso.
    if (typeof idPermisos !== 'undefined') { // Chequea si la propiedad idPermisos existe, incluso si es []
      await apiClient.post(`/roles/${roleId}/permisos`, { idPermisos });
    }

    // Si ambas operaciones son exitosas, devolvemos la respuesta de la actualización del rol.
    // Podríamos necesitar combinar respuestas o devolver un mensaje genérico.
    // Por ahora, devolvemos la respuesta de la primera llamada, asumiendo que es la principal.
    return roleResponse.data; // Devuelve { message: "...", data: { ... } }
  } catch (error) {
    console.error(
      "Error al actualizar el rol:",
      error.response?.data || error.message
    );
    // Propagar el error para que useRoles.js pueda manejarlo
    throw error;
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
