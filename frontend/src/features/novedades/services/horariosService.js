// src/services/novedadesAdminService.js
import apiClient from "../../../shared/services/apiClient"; // Asegúrate que la ruta a tu apiClient sea correcta

/**
 * Obtiene una lista de todas las novedades.
 * @param {object} params - Opciones para filtrar, ej: { estado: true, empleadoId: 5 }
 * @returns {Promise<Array>} Una promesa que resuelve a un array de novedades.
 */
export const obtenerTodasLasNovedades = async (params = {}) => {
  try {
    const response = await apiClient.get("/novedades", { params });
    return response.data.data; 
  } catch (error) {
    console.error("Error al obtener las novedades:", error);
    throw error;
  }
};

/**
 * Obtiene una novedad específica por su ID.
 * @param {number} id - El ID de la novedad.
 * @returns {Promise<object>} Una promesa que resuelve al objeto de la novedad.
 */
export const obtenerNovedadPorId = async (id) => {
  try {
    const response = await apiClient.get(`/novedades/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error al obtener la novedad con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Crea una nueva novedad y la asigna a los empleados.
 * @param {object} novedadData - Los datos de la novedad.
 * @param {string} novedadData.fechaInicio - Fecha de inicio en formato 'YYYY-MM-DD'.
 * @param {string} novedadData.fechaFin - Fecha de fin en formato 'YYYY-MM-DD'.
 * @param {string} novedadData.horaInicio - Hora de inicio en formato 'HH:mm'.
 * @param {string} novedadData.horaFin - Hora de fin en formato 'HH:mm'.
 * @param {number[]} novedadData.empleadosIds - Un array con los IDs de los empleados.
 * @returns {Promise<object>} Una promesa que resuelve a la nueva novedad creada.
 */
export const crearNovedad = async (novedadData) => {
  try {
    const response = await apiClient.post("/novedades", novedadData);
    return response.data.data;
  } catch (error) {
    console.error("Error al crear la novedad:", error);
    throw error;
  }
};

/**
 * Actualiza una novedad existente.
 * @param {number} id - El ID de la novedad a actualizar.
 * @param {object} novedadData - Los datos a actualizar. Puede incluir el array empleadosIds.
 * @returns {Promise<object>} Una promesa que resuelve a la novedad actualizada.
 */
export const actualizarNovedad = async (id, novedadData) => {
  try {
    const response = await apiClient.patch(`/novedades/${id}`, novedadData);
    return response.data.data;
  } catch (error) {
    console.error(`Error al actualizar la novedad con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Cambia el estado (activo/inactivo) de una novedad.
 * @param {number} id - El ID de la novedad.
 * @param {boolean} estado - El nuevo estado (true para activo, false para inactivo).
 * @returns {Promise<object>} Una promesa que resuelve a la novedad con su estado actualizado.
 */
export const cambiarEstadoNovedad = async (id, estado) => {
  try {
    const response = await apiClient.patch(`/novedades/${id}/estado`, { estado });
    return response.data.data;
  } catch (error) {
    console.error(`Error al cambiar el estado de la novedad con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Elimina una novedad por su ID.
 * @param {number} id - El ID de la novedad a eliminar.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la eliminación es exitosa.
 */
export const eliminarNovedad = async (id) => {
  try {
    await apiClient.delete(`/novedades/${id}`);
  } catch (error) {
    console.error(`Error al eliminar la novedad con ID ${id}:`, error);
    throw error;
  }
};