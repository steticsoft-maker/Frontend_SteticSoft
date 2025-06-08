// src/features/proveedores/services/proveedoresService.js
import apiClient from "../../../shared/services/apiClient";

// CORRECCIÓN: Esta función ahora devolverá el array de datos directamente.
const getProveedoresAPI = async () => {
  try {
    const response = await apiClient.get('/proveedores');
    // La API devuelve { success, data: [...] }, así que accedemos a 'data.data'
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

const deleteProveedorAPI = async (id) => {
    try {
        const response = await apiClient.delete(`/proveedores/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error en deleteProveedorAPI:", error.response?.data || error.message);
        throw error.response?.data || new Error("Error al eliminar el proveedor.");
    }
};

export const proveedoresService = {
  getProveedores: getProveedoresAPI,
  createProveedor: createProveedorAPI,
  updateProveedor: updateProveedorAPI,
  toggleEstado: toggleProveedorEstadoAPI,
  deleteProveedor: deleteProveedorAPI,
};

export const getProveedoresParaCompra = getProveedoresAPI;