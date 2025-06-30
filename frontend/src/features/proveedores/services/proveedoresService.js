// src/features/proveedores/services/proveedoresService.js
import apiClient from "../../../shared/services/apiClient";

const getProveedoresAPI = async (params = {}) => {
  try {
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
    // --- INICIO DE CORRECCIÓN BLINDADA ---
    // No importa lo que llegue, lo forzamos a ser un número entero.
    // Esto nos protege de cualquier mutación de estado que ocurra antes.
    const cleanId = parseInt(id, 10);

    // Verificamos si el resultado es un número válido. Si no, lanzamos un error claro.
    if (isNaN(cleanId)) {
        console.error("¡ID INVÁLIDO DETECTADO EN EL SERVICIO!", id);
        throw new Error("El ID del proveedor es inválido y no se puede actualizar.");
    }
    
    console.log(`[Servicio] ID Recibido: ${id}, ID Limpio: ${cleanId}`);
    console.log(`[Servicio] URL Final a construir: /proveedores/${cleanId}`);
    // --- FIN DE CORRECCIÓN BLINDADA ---

    try {
        // Usamos el ID limpio y seguro para la llamada a la API.
        const response = await apiClient.put(`/proveedores/${cleanId}`, proveedorData);
        return response.data;
    } catch (error) {
        console.error("Error en updateProveedorAPI:", error.response?.data || error.message);
        // Lanzamos el error completo
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
    throw error;
  }
};

const verificarDatosUnicosAPI = async (data, idExcluir = null) => {
  try {
    const url = idExcluir
      ? `/proveedores/${idExcluir}/verificar-unicidad`
      : '/proveedores/verificar-unicidad';
    
    const response = await apiClient.post(url, data);
    return response.data?.errors || {};
  } catch (error) {
    console.error("Error en verificarDatosUnicosAPI:", error.response?.data || error.message);
    return error.response?.data?.errors || { api: "No se pudo validar el campo." };
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