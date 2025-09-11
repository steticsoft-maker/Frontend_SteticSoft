
import apiClient from "../../../shared/services/apiClient";

const API_PATH = "/productos";

/**
 * Obtiene una lista de productos desde la API, permitiendo filtros avanzados.
 * @param {object} params - Parámetros de consulta como { tipoUso, estado }.
 * @returns {Promise<Array>} - Una promesa que resuelve a un array de productos.
 */
export const fetchProductosConFiltros = async (params = {}) => {
  try {
    const response = await apiClient.get(API_PATH, { params });
    // Extraemos el array de datos de la respuesta.
    const productosData = response.data?.data?.productos || response.data?.data || response.data;
    
    // Aseguramos que siempre se retorne un array.
    return Array.isArray(productosData) ? productosData : [];
  } catch (error) {
    console.error("Error al obtener los productos con filtros:", error);
    throw error; // Lanza el error para que el componente que llama lo maneje.
  }
};