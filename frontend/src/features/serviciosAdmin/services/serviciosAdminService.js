// src/features/serviciosAdmin/services/serviciosAdminService.js
import apiClient from '../../../shared/services/apiClient';

// Se importa la función REAL del servicio de categorías para obtener los datos de la API.
import { getCategoriasServicio } from '../../categoriasServicioAdmin/services/categoriasServicioService';

// --- FUNCIONES DE LA API PARA SERVICIOS ---

/**
 * Obtiene todos los servicios desde la API.
 * @param {object} [filtros] - Opcional. Objeto con filtros como { estado: true }.
 * @returns {Promise<object>} La respuesta de la API.
 */
export const getServicios = async (filtros = {}) => {
  try {
    const response = await apiClient.get('/servicios', { params: filtros });
    return response.data; // La data de la API usualmente está en response.data
  } catch (error) {
    console.error("Error al obtener servicios:", error);
    throw error.response?.data || new Error(error.message);
  }
};

/**
 * Crea un nuevo servicio en la API.
 * @param {object} servicioData - Datos del nuevo servicio.
 * @returns {Promise<object>} La respuesta de la API.
 */
export const createServicio = async (servicioData) => {
  try {
    const response = await apiClient.post('/servicios', servicioData);
    return response.data;
  } catch (error) {
    console.error("Error al crear el servicio:", error);
    throw error.response?.data || new Error(error.message);
  }
};

/**
 * Actualiza un servicio existente en la API.
 * @param {number|string} id - ID del servicio a actualizar.
 * @param {object} servicioData - Datos a actualizar.
 * @returns {Promise<object>} La respuesta de la API.
 */
export const updateServicio = async (id, servicioData) => {
  try {
    const response = await apiClient.put(`/servicios/${id}`, servicioData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el servicio ${id}:`, error);
    throw error.response?.data || new Error(error.message);
  }
};

/**
 * Elimina un servicio en la API.
 * @param {number|string} id - ID del servicio a eliminar.
 * @returns {Promise<object>} La respuesta de la API.
 */
export const deleteServicio = async (id) => {
  try {
    // La petición DELETE puede no devolver contenido, pero sí una respuesta exitosa.
    await apiClient.delete(`/servicios/${id}`);
  } catch (error) {
    console.error(`Error al eliminar el servicio ${id}:`, error);
    throw error.response?.data || new Error(error.message);
  }
};

/**
 * Cambia el estado de un servicio en la API.
 * @param {number|string} id - ID del servicio.
 * @param {boolean} nuevoEstado - El nuevo estado (true para activar, false para desactivar).
 * @returns {Promise<object>} La respuesta de la API.
 */
export const cambiarEstadoServicio = async (id, nuevoEstado) => {
    try {
      const response = await apiClient.patch(`/servicios/${id}/estado`, { estado: nuevoEstado });
      return response.data;
    } catch (error) {
      console.error(`Error al cambiar estado del servicio ${id}:`, error);
      throw error.response?.data || new Error(error.message);
    }
  };


// --- FUNCIONES AUXILIARES (relacionadas con otros módulos) ---

/**
 * Obtiene solo las categorías de servicio activas, ideal para un dropdown/select en el formulario.
 * @returns {Promise<Array>} Un array de objetos de categoría con { id, nombre }.
 */
export const getActiveCategoriasForSelect = async () => {
  try {
    const response = await getCategoriasServicio({ estado: true });
    // La data real de la API está en response.data.data
    const todasCategoriasActivas = response?.data?.data || []; 
    
    if (!todasCategoriasActivas || todasCategoriasActivas.length === 0) {
      console.warn("No se encontraron categorías activas desde la API.");
    }
    
    return todasCategoriasActivas.map(cat => ({
      id: cat.idCategoriaServicio,
      nombre: cat.nombre
    }));
  } catch (error) {
    console.error("ERROR GRAVE al obtener categorías de servicio activas:", error);
    // Devolvemos un array vacío para que el formulario no se rompa
    return [];
  }
};