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
 * Obtiene la lista completa de roles desde la API.
 */
export const fetchRolesAPI = async () => {
  try {
    const response = await apiClient.get("/roles");
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
 * Guarda (crea o actualiza) un rol y sus permisos.
 * @param {object} roleData - Los datos del rol. Si incluye un 'id', se actualiza; si no, se crea.
 */
export const saveRoleAPI = async (roleData) => {
  const { id, idPermisos, ...dataToSend } = roleData;
  try {
    let roleResponse;
    if (id) {
      // Actualizar un rol existente (PUT)
      roleResponse = await apiClient.put(`/roles/${id}`, dataToSend);
      if (idPermisos) {
        await apiClient.post(`/roles/${id}/permisos`, { idPermisos });
      }
    } else {
      // Crear un nuevo rol (POST)
      roleResponse = await apiClient.post("/roles", dataToSend);
      const newRoleId = roleResponse.data?.data?.idRol;
      if (newRoleId && idPermisos?.length > 0) {
        await apiClient.post(`/roles/${newRoleId}/permisos`, { idPermisos });
      }
    }
    return roleResponse.data;
  } catch (error) {
    console.error(
      "Error al guardar el rol:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Error al guardar el rol."
    );
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
