import apiClient from "../../../shared/services/apiClient";

// --- FUNCIÓN CORREGIDA ---
// Ahora acepta un objeto de 'params' para la búsqueda
const getProveedoresAPI = async (params = {}) => {
  try {
    // apiClient (axios) enviará los params como una query string: /proveedores?busqueda=loquesea
    const response = await apiClient.get('/proveedores', { params });
    return response.data?.data || response.data || []; 
  } catch (error) {
    console.error("Error en getProveedoresAPI:", error.response?.data || error.message);
    throw error.response?.data || new Error("Error al obtener los proveedores.");
  }
};

const createProveedorAPI = async (proveedorData) => {
  try {
    const response = await apiClient.post('/proveedores', proveedorData);
    return response.data;
  } catch (error) {
    console.error("Error en createProveedorAPI:", error.response?.data || error.message);
    throw error.response?.data || new Error("Error al crear el proveedor.");
  }
};

const updateProveedorAPI = async (id, proveedorData) => {
    try {
        const response = await apiClient.put(`/proveedores/${id}`, proveedorData);
        return response.data;
    } catch (error) {
        console.error("Error en updateProveedorAPI:", error.response?.data || error.message);
        throw error.response?.data || new Error("Error al actualizar el proveedor.");
    }
};

const toggleProveedorEstadoAPI = async (id, estado) => {
    try {
        const response = await apiClient.patch(`/proveedores/${id}/estado`, { estado });
        return response.data;
    } catch (error) {
        console.error("Error en toggleProveedorEstadoAPI:", error.response?.data || error.message);
        throw error.response?.data || new Error("Error al cambiar el estado.");
    }
};

// src/features/proveedores/services/proveedoresService.js

// ... (otras funciones del servicio)

const deleteProveedorAPI = async (id) => {
  try {
    const response = await apiClient.delete(`/proveedores/${id}`);
    return response.data;
  } catch (error) {
    // LANZAR EL ERROR COMPLETO
    // Esto permite que el componente que lo llama pueda leer "error.response.data.message" de forma segura.
    console.error("Error en deleteProveedorAPI:", error.response?.data || error.message);
    throw error;
  }
};

const verificarDatosUnicosAPI = async (data) => {
  try {
    const response = await apiClient.post('/proveedores/verificar-unicidad', data);
    return response.data;
  } catch (error) {
    console.error("Error en verificarDatosUnicosAPI:", error.response?.data || error.message);
    return {};
  }
};


export const proveedoresService = {
  getProveedores: getProveedoresAPI,
  createProveedor: createProveedorAPI,
  updateProveedor: updateProveedorAPI,
  toggleEstado: toggleProveedorEstadoAPI,
  deleteProveedor: deleteProveedorAPI,
  verificarDatosUnicos: verificarDatosUnicosAPI,
};

export const getProveedoresParaCompra = getProveedoresAPI;