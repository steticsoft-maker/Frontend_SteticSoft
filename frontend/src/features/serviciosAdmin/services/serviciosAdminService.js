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
    // La función getCategoriasServicio devuelve la respuesta completa de Axios
    const response = await getCategoriasServicio({ estado: true });

    // CAMBIO CLAVE: El array de datos está dentro de response.data.data
    const categoriasArray = response.data?.data;

    // Se valida que sea un array antes de continuar
    if (!Array.isArray(categoriasArray)) {
      console.error("La respuesta de la API no contenía un array de categorías en la ubicación esperada.");
      return []; // Devuelve un array vacío para no romper la aplicación
    }

    return categoriasArray.map(cat => ({
      value: cat.idCategoriaServicio,
      label: cat.nombre
    }));

  } catch (error) {
    console.error("Error al obtener las categorías:", error);
    toast.error("No se pudieron cargar las categorías.");
    return []; 
  }
};