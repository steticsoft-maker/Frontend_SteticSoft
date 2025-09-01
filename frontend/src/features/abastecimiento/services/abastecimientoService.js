// src/features/abastecimiento/services/abastecimientoService.js
import apiClient from "../../../shared/services/api"; // Asegúrate de que esta ruta sea correcta

/**
 * Obtiene todos los abastecimientos del backend, con soporte para filtros.
 * @param {Object} filters - Un objeto con los filtros a aplicar.
 * @returns {Promise<Array>} Una promesa que resuelve con la lista de abastecimientos.
 */
export const getAbastecimientos = async (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  try {
    const response = await apiClient.get(`/abastecimientos?${query}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || new Error("Error al obtener la lista de abastecimientos.");
  }
};

/**
 * Obtiene la lista de productos activos de uso interno desde la API.
 */
export const getProductosActivosUsoInterno = async () => {
  try {
    const response = await apiClient.get("/productos/interno");
    return response.data.data;
  } catch (error) {
    throw error.response?.data || new Error("Error al obtener productos.");
  }
};

/**
 * Obtiene la lista de empleados activos desde la API.
 */
export const getEmpleadosActivos = async () => {
  try {
    const response = await apiClient.get("/empleados/activos");
    return response.data.data;
  } catch (error) {
    throw error.response?.data || new Error("Error al obtener empleados.");
  }
};

/**
 * Crea un nuevo registro de abastecimiento en el sistema.
 */
export const createAbastecimiento = async (data) => {
  try {
    const response = await apiClient.post("/abastecimientos", data);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || new Error("Error al crear el abastecimiento.");
  }
};

/**
 * Actualiza un registro de abastecimiento existente en el sistema.
 */
export const updateAbastecimiento = async (id, data) => {
  try {
    const response = await apiClient.put(`/abastecimientos/${id}`, data);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || new Error("Error al actualizar el abastecimiento.");
  }
};

/**
 * Elimina un registro de abastecimiento del sistema.
 */
export const deleteAbastecimiento = async (id) => {
  try {
    await apiClient.delete(`/abastecimientos/${id}`);
    return true;
  } catch (error) {
    throw error.response?.data || new Error("Error al eliminar el abastecimiento.");
  }
};

/**
 * Calcula la vida útil restante de un producto.
 * @param {Object} entry El objeto de registro de abastecimiento.
 * @returns {string} Una cadena de texto con la vida útil restante.
 */
export const calculateRemainingLifetime = (entry) => {
  if (!entry || !entry.producto || !entry.producto.vida_util_dias || !entry.fechaIngreso) {
    return "N/A";
  }

  const fechaIngreso = new Date(entry.fechaIngreso);
  const vidaUtilMs = entry.producto.vida_util_dias * 24 * 60 * 60 * 1000;
  const fechaExpiracion = new Date(fechaIngreso.getTime() + vidaUtilMs);
  const hoy = new Date();
  const msRestantes = fechaExpiracion.getTime() - hoy.getTime();

  if (msRestantes <= 0) {
    return "Expirado";
  }

  const dias = Math.floor(msRestantes / (1000 * 60 * 60 * 24));
  return `${dias} días`;
};