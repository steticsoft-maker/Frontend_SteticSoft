// src/features/serviciosAdmin/services/serviciosAdminService.js
import apiClient from '../../../shared/services/apiClient';
import { getCategoriasServicio } from '../../categoriasServicioAdmin/services/categoriasServicioService';

// --- FUNCIONES DE LA API PARA SERVICIOS ---

// Esta función es correcta, no necesita cambios.
export const getServicios = async (filtros = {}) => {
  try {
    const response = await apiClient.get('/servicios', { params: filtros });
    return response.data;
  } catch (error) {
    console.error("Error al obtener servicios:", error);
    throw error.response?.data || new Error(error.message);
  }
};

/**
 * Crea un nuevo servicio en la API usando FormData.
 * @param {FormData} formData - El objeto FormData que contiene los datos del servicio y el archivo de imagen.
 * @returns {Promise<object>} La respuesta de la API.
 */
export const createServicio = async (formData) => {
  try {
    const response = await apiClient.post('/servicios', formData); // Axios lo detecta automáticamente
    return response.data;
  } catch (error) {
    console.error("Error al crear el servicio:", error);
    throw error.response?.data || new Error(error.message);
  }
};

/**
 * Actualiza un servicio existente en la API usando FormData.
 * @param {number|string} id - ID del servicio a actualizar.
 * @param {FormData} formData - El objeto FormData con los datos a actualizar.
 * @returns {Promise<object>} La respuesta de la API.
 */
export const updateServicio = async (id, formData) => {
  try {
    const response = await apiClient.put(`/servicios/${id}`, formData); // Axios lo detecta automáticamente
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el servicio ${id}:`, error);
    throw error.response?.data || new Error(error.message);
  }
};

// Esta función es correcta, no necesita cambios.
export const deleteServicio = async (id) => {
  try {
    await apiClient.delete(`/servicios/${id}`);
  } catch (error) {
    console.error(`Error al eliminar el servicio ${id}:`, error);
    throw error.response?.data || new Error(error.message);
  }
};

// Esta función es correcta, no necesita cambios.
export const cambiarEstadoServicio = async (id, nuevoEstado) => {
  try {
    const response = await apiClient.patch(`/servicios/${id}/estado`, { estado: nuevoEstado });
    return response.data;
  } catch (error) {
    console.error(`Error al cambiar estado del servicio ${id}:`, error);
    throw error.response?.data || new Error(error.message);
  }
};


// --- FUNCIONES AUXILIARES (Estas son correctas) ---

export const getActiveCategoriasForSelect = async () => {
  try {
    const response = await getCategoriasServicio({ estado: true });
    // CORRECCIÓN: Acceder directamente a 'response.data' que contiene el arreglo.
     const todasCategoriasActivas = response.data || []; 
    
    if (todasCategoriasActivas.length === 0) {
      console.warn("No se encontraron categorías activas desde la API.");
    }
    return todasCategoriasActivas.map(cat => ({
      value: cat.idCategoriaServicio, // Usar 'value' y 'label' es una convención común en librerías de componentes
      label: cat.nombre
    }));
  } catch (error) {
   console.error("ERROR GRAVE al obtener categorías de servicio activas:", error);
    return []; 
  }
};