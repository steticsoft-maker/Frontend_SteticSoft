// src/features/serviciosAdmin/services/serviciosAdminService.js
import apiClient from "../../../shared/services/apiClient";
import { getCategoriasServicio } from "../../categoriasServicioAdmin/services/categoriasServicioService";

// --- FUNCIONES DE LA API PARA SERVICIOS ---

// Esta función es correcta, no necesita cambios.
export const getServicios = async (filtros = {}) => {
  try {
    const response = await apiClient.get("/api/servicios", { params: filtros }); // Añadido /api
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
    const response = await apiClient.post("/api/servicios", formData); // Añadido /api
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
    const response = await apiClient.put(`/api/servicios/${id}`, formData); // Añadido /api
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el servicio ${id}:`, error);
    throw error.response?.data || new Error(error.message);
  }
};

// Esta función es correcta, no necesita cambios.
export const deleteServicio = async (id) => {
  try {
    await apiClient.delete(`/api/servicios/${id}`); // Añadido /api
  } catch (error) {
    console.error(`Error al eliminar el servicio ${id}:`, error);
    throw error.response?.data || new Error(error.message);
  }
};

// Esta función es correcta, no necesita cambios.
export const cambiarEstadoServicio = async (id, nuevoEstado) => {
  try {
    const response = await apiClient.patch(`/api/servicios/${id}/estado`, {
      estado: nuevoEstado,
    }); // Añadido /api
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
    const response = await getCategoriasServicio(true); // Pasar directamente el booleano

    // El array de datos está dentro de response.data.data
    const categoriasArray = response?.data?.data;

    // Se valida que sea un array antes de continuar
    if (!Array.isArray(categoriasArray)) {
      console.error(
        "La respuesta de la API para categorías de servicio no contenía un array en la ubicación esperada (response.data.data). Respuesta recibida:",
        response
      );
      // toast.error("Error al procesar las categorías de servicio."); // Ya se maneja en el catch
      return []; // Devuelve un array vacío para no romper la aplicación
    }

    return categoriasArray.map((cat) => ({
      value: cat.idCategoriaServicio, // Asegúrate que estos nombres de campo coincidan con tu API
      label: cat.nombre,
    }));
  } catch{
    // El error ya debería ser manejado y logueado por getCategoriasServicio o el interceptor de apiClient
    // Solo necesitamos asegurarnos de que toast se importe y use aquí si es necesario un mensaje específico.
    // Por ahora, el toast.error que estaba aquí se comenta o elimina si ya se maneja globalmente.
    // console.error("Error en getActiveCategoriasForSelect al obtener las categorías:", error);
    // toast.error("No se pudieron cargar las categorías para el selector."); // Considerar si este toast es redundante
    return [];
  }
};
