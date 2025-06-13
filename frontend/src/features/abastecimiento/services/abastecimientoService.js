// src/features/abastecimiento/services/abastecimientoService.js
import apiClient from "../../../shared/services/apiClient";

/**
 * Calcula los días de vida útil restantes para una entrada de abastecimiento.
 * @param {object} abastecimientoEntry - El objeto de abastecimiento de la API.
 * @returns {string} - Una cadena de texto que indica los días restantes, si está vencido o si no hay datos.
 */
export const calculateRemainingLifetime = (abastecimientoEntry) => {
  // Primero, valida que los datos necesarios existan en el objeto.
  if (!abastecimientoEntry?.productoAbastecido?.categoriaProducto?.vidaUtilDias || !abastecimientoEntry.fechaIngreso) {
    return "N/A";
  }

  // Obtiene los días de vida útil y la fecha de ingreso.
  const vidaUtilDias = parseInt(abastecimientoEntry.productoAbastecido.categoriaProducto.vidaUtilDias, 10);
  const fechaIngreso = new Date(abastecimientoEntry.fechaIngreso);
  
  // Corrige el problema de la zona horaria para tratar la fecha como local.
  fechaIngreso.setMinutes(fechaIngreso.getMinutes() + fechaIngreso.getTimezoneOffset());

  // Calcula la fecha de vencimiento.
  const fechaVencimiento = new Date(fechaIngreso);
  fechaVencimiento.setDate(fechaVencimiento.getDate() + vidaUtilDias);

  // Obtiene la fecha de hoy, normalizada a la medianoche para una comparación precisa.
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  // Calcula la diferencia en días.
  const diffTime = fechaVencimiento - hoy;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return "Vencido";
  }
  return `${diffDays} días`;
};


// --- Métodos de la API ---



// Obtiene todos los registros de abastecimiento desde la API.
const getAbastecimientos = async () => {
  try {
    const response = await apiClient.get("/abastecimientos");
    return response.data?.data || [];
  } catch (error) {
    throw error.response?.data || new Error("Error al obtener los registros de abastecimiento.");
  }
};

// Crea un nuevo registro de abastecimiento.
const createAbastecimiento = async (data) => {
  try {
    const response = await apiClient.post("/abastecimientos", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Error al crear el registro de abastecimiento.");
  }
};

// Actualiza un registro de abastecimiento existente.
const updateAbastecimiento = async (id, data) => {
  try {
    const response = await apiClient.put(`/abastecimientos/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Error al actualizar el registro de abastecimiento.");
  }
};

// Cambia el estado (anula o habilita) de un registro.
const toggleEstadoAbastecimiento = async (id, estado) => {
  try {
    const response = await apiClient.patch(`/abastecimientos/${id}/estado`, { estado });
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Error al cambiar el estado del registro.");
  }
};

// Elimina físicamente un registro de abastecimiento.
const deleteAbastecimiento = async (id) => {
  try {
    const response = await apiClient.delete(`/abastecimientos/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Error al eliminar el registro de abastecimiento.");
  }
};

// Obtiene la lista de productos que están activos.
const getProductosActivos = async () => {
  try {
    const response = await apiClient.get('/productos?estado=true');
    return response.data?.data || [];
  } catch (error) {
    throw error.response?.data || new Error("Error al obtener los productos activos.");
  }
};

// Obtiene solo las categorías de productos que son para 'Uso Interno'.
const getCategoriasUsoInterno = async () => {
  try {
      // Asumimos que la API de categorías también soporta el filtro 'tipoUso'.
      // Tendremos que añadir esa lógica al backend de 'categoriaProducto.service.js' si no existe.
      const response = await apiClient.get('/categorias-producto?estado=true&tipoUso=Interno');
      return response.data?.data || [];
  } catch (error) {
      throw error.response?.data || new Error("Error al obtener las categorías de productos.");
  }
};

// Obtiene productos activos filtrados por categoría y que sean de uso interno.
const getProductosPorCategoria = async (categoriaId) => {
  if (!categoriaId) return []; // No hacer la llamada si no hay categoría seleccionada.
  try {
      const response = await apiClient.get(`/productos?estado=true&categoriaId=${categoriaId}&tipoUso=Interno`);
      return response.data?.data || [];
  } catch (error) {
      throw error.response?.data || new Error("Error al obtener los productos de la categoría seleccionada.");
  }
};

// Obtiene los usuarios con el rol de "Empleado" que están activos.
const getEmpleadosActivos = async () => {
  try {
    const response = await apiClient.get('/usuarios?estado=true');
    const allUsers = response.data?.data || [];
    return allUsers.filter(u => u.rol?.nombre === 'Empleado');
  } catch (error) {
    throw error.response?.data || new Error("Error al obtener los empleados activos.");
  }
};

// Se exporta un objeto que contiene todos los métodos del servicio.
export const abastecimientoService = {
  getAbastecimientos,
  createAbastecimiento,
  updateAbastecimiento,
  toggleEstadoAbastecimiento,
  deleteAbastecimiento,
  getProductosActivos,
  getCategoriasUsoInterno, 
  getProductosPorCategoria,
  getEmpleadosActivos,
};