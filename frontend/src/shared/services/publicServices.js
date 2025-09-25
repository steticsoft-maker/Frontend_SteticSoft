// src/shared/services/publicServices.js
import publicApiClient from "./publicApiClient";

/**
 * Obtiene servicios públicos (sin autenticación requerida)
 * @param {object} [filtros={}] - Objeto con los parámetros de filtro.
 * @returns {Promise<object>} La respuesta de la API que contiene los servicios.
 */
export const getPublicServicios = async (filtros = {}) => {
  try {
    const response = await publicApiClient.get("/servicios/public", {
      params: filtros,
    });
    return response;
  } catch (error) {
    // Si no existe el endpoint público, intentar con el endpoint normal
    try {
      const response = await publicApiClient.get("/servicios", {
        params: filtros,
      });
      return response;
    } catch (fallbackError) {
      return { data: { data: [] } };
    }
  }
};

/**
 * Obtiene productos públicos (sin autenticación requerida)
 * @param {object} [filtros={}] - Objeto con los parámetros de filtro.
 * @returns {Promise<object>} La respuesta de la API que contiene los productos.
 */
export const getPublicProductos = async (filtros = {}) => {
  try {
    const response = await publicApiClient.get("/productos/public", {
      params: filtros,
    });
    return response;
  } catch (error) {
    // Si no existe el endpoint público, intentar con el endpoint normal
    try {
      const response = await publicApiClient.get("/productos", {
        params: filtros,
      });
      return response;
    } catch (fallbackError) {
      return { data: { data: [] } };
    }
  }
};
