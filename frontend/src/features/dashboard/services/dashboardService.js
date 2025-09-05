// import apiClient from "../../../shared/services/apiClient";
import {
  ingresosPorCategoriaMock,
  serviciosMasVendidosMock,
  productosMasVendidosMock,
  evolucionVentasMock,
  subtotalIvaMock,
} from '../mocks/dashboardMockData';

// const DASHBOARD_API_URL = "/dashboard";

/**
 * Obtiene los ingresos totales agrupados por categoría.
 * @returns {Promise<Object>}
 */
export const getIngresosPorCategoria = async () => {
  // const response = await apiClient.get(
  //   `${DASHBOARD_API_URL}/ingresos-por-categoria`
  // );
  // return response.data;
  return Promise.resolve(ingresosPorCategoriaMock);
};

/**
 * Obtiene el top 5 de servicios más vendidos.
 * @returns {Promise<Array>}
 */
export const getServiciosMasVendidos = async () => {
  // const response = await apiClient.get(
  //   `${DASHBOARD_API_URL}/servicios-mas-vendidos`
  // );
  // return response.data;
  return Promise.resolve(serviciosMasVendidosMock);
};

/**
 * Obtiene el top 5 de productos más vendidos.
 * @returns {Promise<Array>}
 */
export const getProductosMasVendidos = async () => {
  // const response = await apiClient.get(
  //   `${DASHBOARD_API_URL}/productos-mas-vendidos`
  // );
  // return response.data;
  return Promise.resolve(productosMasVendidosMock);
};

/**
 * Obtiene la evolución de ventas de los últimos 12 meses.
 * @returns {Promise<Array>}
 */
export const getEvolucionVentas = async () => {
  // const response = await apiClient.get(`${DASHBOARD_API_URL}/evolucion-ventas`);
  // return response.data;
  return Promise.resolve(evolucionVentasMock);
};

/**
 * Obtiene la suma de subtotal e IVA de todas las ventas.
 * @returns {Promise<Object>}
 */
export const getSubtotalIva = async () => {
  // const response = await apiClient.get(`${DASHBOARD_API_URL}/subtotal-iva`);
  // return response.data;
  return Promise.resolve(subtotalIvaMock);
};
