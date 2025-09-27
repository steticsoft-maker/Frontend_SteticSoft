// Ruta: src/features/categoriasServicioAdmin/services/categoriasServicioService.js

// Asegúrate que esta ruta sea correcta a tu cliente API configurado
import apiClient from '../../../shared/services/apiClient';

/**
 * Obtiene todas las categorías de servicio.
 * @param {boolean} [estado] - Opcional. Filtra por estado (true para activo, false para inactivo).
 * @returns {Promise<Object>} La respuesta de la API.
 */
export const getCategoriasServicio = (estado) => {
  const params = {};
  if (estado !== undefined) {
    params.estado = estado;
  }
  // CORRECCIÓN: Se añadió /api al inicio de la ruta.
  return apiClient.get("/categorias-servicio", { params });
};

/**
 * Obtiene una categoría de servicio por su ID.
 * @param {string|number} id - El ID de la categoría.
 * @returns {Promise<Object>} La respuesta de la API.
 */
export const getCategoriaServicioById = (id) => {
  // CORRECCIÓN: Se añadió /api al inicio de la ruta.
  return apiClient.get(`/categorias-servicio/${id}`);
};

/**
 * Crea una nueva categoría de servicio.
 * @param {Object} data - Datos de la categoría (ej: { nombre: "...", descripcion: "...", estado: true }).
 * @returns {Promise<Object>} La respuesta de la API.
 */
export const createCategoriaServicio = (data) => {
  // CORRECCIÓN: Se añadió /api al inicio de la ruta.
  return apiClient.post("/categorias-servicio", data);
};

/**
 * Actualiza una categoría de servicio existente.
 * @param {string|number} id - El ID de la categoría a actualizar.
 * @param {Object} data - Datos a actualizar (ej: { nombre: "...", descripcion: "..." }).
 * @returns {Promise<Object>} La respuesta de la API.
 */
export const updateCategoriaServicio = (id, data) => {
  // CORRECCIÓN: Se añadió /api al inicio de la ruta.
  return apiClient.put(`/categorias-servicio/${id}`, data);
};

/**
 * Cambia el estado (activo/inactivo) de una categoría de servicio.
 * @param {string|number} id - El ID de la categoría.
 * @param {boolean} estado - El nuevo estado (true para activo, false para inactivo).
 * @returns {Promise<Object>} La respuesta de la API.
 */
export const cambiarEstadoCategoriaServicio = (id, estado) => {
  // CORRECCIÓN: Se añadió /api al inicio de la ruta.
  return apiClient.patch(`/categorias-servicio/${id}/estado`, { estado });
};

/**
 * Elimina físicamente una categoría de servicio.
 * @param {string|number} id - El ID de la categoría a eliminar.
 * @returns {Promise<Object>} La respuesta de la API.
 */
export const deleteCategoriaServicio = (id) => {
  // CORRECCIÓN: Se añadió /api al inicio de la ruta.
  return apiClient.delete(`/categorias-servicio/${id}`);
};

/**
 * Obtiene servicios asociados a una categoría específica.
 * @param {string|number} idCategoria - El ID de la categoría.
 * @returns {Promise<Array>} Una promesa que resuelve con la lista de servicios asociados.
 */
export const getServiciosByCategoria = async (idCategoria) => {
  try {
    const response = await apiClient.get(`/servicios?idCategoriaServicio=${idCategoria}`);
    return response?.data?.data || response?.data || [];
  } catch (error) {
    console.error(`Error al obtener servicios de la categoría ${idCategoria}:`, error);
    return [];
  }
};