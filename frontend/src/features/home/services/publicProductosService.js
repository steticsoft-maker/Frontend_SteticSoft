// src/features/home/services/publicProductosService.js
import publicApiClient from "../../../shared/services/publicApiClient";

/**
 * Obtiene la lista de productos públicos desde la API.
 * @returns {Promise<Object>} La respuesta de la API con la lista de productos.
 */
export const getPublicProducts = async () => {
  try {
    // Intentar primero con el endpoint público
    const response = await publicApiClient.get("/productos/public");
    return response;
  } catch (error) {
    // Si no existe el endpoint público, intentar con el endpoint normal
    try {
      const response = await publicApiClient.get("/productos");
      return response;
    } catch (fallbackError) {
      return { data: { data: { productos: [] } } };
    }
  }
};
