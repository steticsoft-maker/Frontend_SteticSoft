import apiClient from "../../../shared/services/apiClient";

// Función para obtener la configuración de la cabecera con el token de autenticación
const getAuthenticatedConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Función para obtener los datos de los productos más vendidos
export const getProductosMasVendidos = async (periodo) => {
  const response = await apiClient.get(
    `/dashboard/productos-mas-vendidos?periodo=${periodo}`,
    getAuthenticatedConfig()
  );
  return response.data;
};

// Función para obtener los datos de los servicios más vendidos
export const getServiciosMasVendidos = async (periodo) => {
  const response = await apiClient.get(
    `/dashboard/servicios-mas-vendidos?periodo=${periodo}`,
    getAuthenticatedConfig()
  );
  return response.data;
};

// Función para obtener los datos de la evolución de ventas mensuales
export const getEvolucionVentas = async () => {
  const response = await apiClient.get(
    `/dashboard/evolucion-ventas`,
    getAuthenticatedConfig()
  );
  return response.data;
};

// Función para obtener los datos de subtotal e IVA
export const getSubtotalIva = async (periodo) => {
  const response = await apiClient.get(
    `/dashboard/subtotal-iva?periodo=${periodo}`,
    getAuthenticatedConfig()
  );
  return response.data;
};

// Función para obtener los datos de ingresos por categoría
export const getIngresosPorCategoria = async () => {
  const response = await apiClient.get(
    `/dashboard/ingresos-por-categoria`,
    getAuthenticatedConfig()
  );
  return response.data;
};
