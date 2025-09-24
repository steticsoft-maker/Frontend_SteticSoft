// src/features/home/services/publicProductosService.js
import apiClient from "../../../shared/services/apiClient";

/**
 * Obtiene la lista de productos públicos desde la API.
 * @returns {Promise<Object>} La respuesta de la API con la lista de productos.
 */
export const getPublicProducts = () => {
  return apiClient.get("/productos/public");
};
