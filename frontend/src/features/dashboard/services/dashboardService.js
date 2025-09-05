import apiClient from "../../../shared/services/apiClient";

const DASHBOARD_API_URL = "/dashboard";

/**
 * Obtiene los ingresos totales agrupados por categoría.
 * @returns {Promise<Object>}
 */
export const getIngresosPorCategoria = async () => {
  const response = await apiClient.get(
    `${DASHBOARD_API_URL}/ingresos-por-categoria`
  );
  return response.data;
};

/**
 * Obtiene el top 5 de servicios más vendidos.
 * @returns {Promise<Array>}
 */
export const getServiciosMasVendidos = async (timePeriod) => {
  const response = await apiClient.get(
    `${DASHBOARD_API_URL}/servicios-mas-vendidos`,
    { params: { timePeriod } }
  );
  return response.data;
};

/**
 * Obtiene el top 5 de productos más vendidos.
 * @returns {Promise<Array>}
 */
export const getProductosMasVendidos = async (timePeriod) => {
  const response = await apiClient.get(
    `${DASHBOARD_API_URL}/productos-mas-vendidos`,
    { params: { timePeriod } }
  );
  return response.data;
};

/**
 * Obtiene la evolución de ventas de los últimos 12 meses.
 * @returns {Promise<Array>}
 */
export const getEvolucionVentas = async () => {
  const response = await apiClient.get(`${DASHBOARD_API_URL}/evolucion-ventas`);
  return response.data;
};

/**
 * Obtiene la suma de subtotal e IVA de todas las ventas.
 * @returns {Promise<Object>}
 */
export const getSubtotalIva = async (timePeriod) => {
  const response = await apiClient.get(`${DASHBOARD_API_URL}/subtotal-iva`, {
    params: { timePeriod },
  });
  return response.data;
};
