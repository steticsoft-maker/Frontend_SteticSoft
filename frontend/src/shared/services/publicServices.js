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

/**
 * Crea una venta pública desde la landing (requiere autenticación de cliente)
 * @param {Object} ventaData Los datos de la nueva venta con productos del carrito.
 * @returns {Promise<Object>} Una promesa que resuelve con el objeto de la venta creada.
 */
export const createPublicVenta = async (ventaData) => {
  try {
    // Usar el endpoint móvil que está diseñado para clientes
    const apiClient = (await import("./apiClient")).default;
    const response = await apiClient.post("/movil/ventas", ventaData);
    return response.data;
  } catch (error) {
    console.error("Error al crear venta pública:", error);
    throw error;
  }
};

/**
 * Crea una cita pública desde la landing (requiere autenticación de cliente)
 * @param {Object} citaData Los datos de la nueva cita.
 * @returns {Promise<Object>} Una promesa que resuelve con el objeto de la cita creada.
 */
export const createPublicCita = async (citaData) => {
  try {
    // Usar el endpoint móvil que sabemos que funciona hasta que se actualice el backend
    const apiClient = (await import("./apiClient")).default;

    // Convertir los datos al formato que espera el endpoint móvil /movil/citas
    const dataToSend = {
      fecha: citaData.fecha, // Formato: YYYY-MM-DD
      horaInicio: citaData.horaInicio, // Formato: HH:MM
      empleadoId: citaData.empleadoId,
      servicios: citaData.servicios || [],
      novedadId: citaData.novedadId,
    };

    console.log(
      "Datos convertidos para endpoint móvil /movil/citas:",
      dataToSend
    );

    const response = await apiClient.post("/movil/citas", dataToSend);
    return response.data;
  } catch (error) {
    console.error("Error al crear cita pública:", error);
    throw error;
  }
};
