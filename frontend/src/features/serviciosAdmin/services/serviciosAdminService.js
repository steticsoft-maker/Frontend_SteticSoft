// src/features/serviciosAdmin/services/serviciosAdminService.js
import apiClient from "../../../shared/services/apiClient";
import { getCategoriasServicio } from "../../categoriasServicioAdmin/services/categoriasServicioService";

// --- FUNCIONES DE LA API PARA SERVICIOS ---

/**
 * Obtiene una lista de servicios de la API, con filtros opcionales.
 * @param {object} [filtros={}] - Objeto con los parámetros de filtro.
 * @returns {Promise<object>} La respuesta de la API que contiene los servicios.
 */
export const getServicios = async (filtros = {}) => {
  try {
    const response = await apiClient.get("/api/servicios", { params: filtros });
    // CORRECCIÓN CLAVE: Retorna la respuesta completa de la API.
    return response;
  } catch (error) {
    console.error("Error al obtener servicios:", error);
    // Devuelve un objeto con datos vacíos en caso de error.
    return { data: { data: [] } };
  }
};

/**
 * Crea un nuevo servicio en la API usando FormData.
 * @param {FormData} formData - El objeto FormData que contiene los datos del servicio y el archivo de imagen.
 * @returns {Promise<object>} La respuesta de la API.
 */
export const createServicio = async (formData) => {
  try {
    const response = await apiClient.post("/api/servicios", formData);
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
    const response = await apiClient.put(`/api/servicios/${id}`, formData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el servicio ${id}:`, error);
    throw error.response?.data || new Error(error.message);
  }
};

/**
 * Elimina un servicio de la API por su ID.
 * @param {number|string} id - ID del servicio a eliminar.
 * @returns {Promise<void>}
 */
export const deleteServicio = async (id) => {
  try {
    // La ruta para eliminar un servicio es la misma que la del PUT o GET
    await apiClient.delete(`/api/servicios/${id}`);
  } catch (error) {
    console.error(`Error al eliminar el servicio ${id}:`, error);
    throw error.response?.data || new Error(error.message);
  }
};

/**
 * Cambia el estado (activo/inactivo) de un servicio.
 * @param {number|string} id - ID del servicio.
 * @param {boolean} nuevoEstado - El nuevo estado a establecer.
 * @returns {Promise<object>} La respuesta de la API.
 */
export const cambiarEstadoServicio = async (id, nuevoEstado) => {
  try {
    const response = await apiClient.patch(`/api/servicios/${id}/estado`, {
      estado: nuevoEstado,
    });
    return response.data;
  } catch (error) {
    console.error(`Error al cambiar estado del servicio ${id}:`, error);
    throw error.response?.data || new Error(error.message);
  }
};

// --- FUNCIONES AUXILIARES ---

/**
 * Obtiene y formatea las categorías de servicio activas para un componente de selección.
 * @returns {Promise<Array<object>>} Array de objetos { value: id, label: nombre }.
 */
export const getActiveCategoriasForSelect = async () => {
  try {
    const response = await getCategoriasServicio(true);
    const categoriasArray = response?.data;

    if (!Array.isArray(categoriasArray)) {
      console.error(
        "La respuesta de la API para categorías no contenía un array en la ubicación esperada.",
        response
      );
      return [];
    }

    return categoriasArray.map((cat) => ({
      value: cat.id_categoria_servicio,
      label: cat.nombre,
    }));
  } catch (error) {
    console.error(
      "Error en getActiveCategoriasForSelect al obtener las categorías:",
      error
    );
    return [];
  }
};