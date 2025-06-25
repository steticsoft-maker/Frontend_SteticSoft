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
 * Verifica si un nombre de rol ya está en uso.
 * @param {string} nombre - El nombre del rol a verificar.
 * @param {number|null} idRolActual - El ID del rol actual (si se está editando), o null.
 * @returns {Promise<object>} Respuesta de la API.
 */
export const verificarNombreRolAPI = async (nombre, idRolActual = null) => {
  try {
    const payload = { nombre };
    if (idRolActual) {
      payload.idRolActual = idRolActual;
    }
    const response = await apiClient.post("/roles/verificar-nombre", payload);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error(error.message || "Error al verificar el nombre del rol.");
  }
};

/**
 * Obtiene la lista completa de roles desde la API.
 * @param {object} params - Objeto con parámetros de consulta.
 * @param {string} params.busqueda - Término de búsqueda.
 * @param {boolean} params.estado - Estado para filtrar (true para activos, false para inactivos).
 */
export const fetchRolesAPI = async (params = {}) => {
  try {
    // Construir los query params solo si los valores están definidos
    const queryParams = new URLSearchParams();
    if (params.busqueda) {
      queryParams.append('busqueda', params.busqueda);
    }
    // Para el estado, queremos enviarlo incluso si es false.
    // Si params.estado es undefined, no se envía. Si es true o false, se envía.
    if (params.estado !== undefined) {
      queryParams.append('estado', params.estado);
    }

    const queryString = queryParams.toString();
    const url = queryString ? `/roles?${queryString}` : '/roles';

    const response = await apiClient.get(url);
    return response.data; // Asumiendo que la API devuelve { data: [...] } o similar
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
