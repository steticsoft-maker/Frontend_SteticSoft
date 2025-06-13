// src/features/productosAdmin/services/productosAdminService.js
import apiClient from "../../../shared/services/apiClient";
import { fetchCategoriasProducto as getCategoriasAPI } from '../../categoriasProductoAdmin/services/categoriasProductoService';

// --- Funciones que se conectan a la API REAL ---

const getProductos = async () => {
  try {
    const response = await apiClient.get('/productos');
    // Asumiendo que la data viene en response.data.data
    return response.data?.data || response.data;
  } catch (error) {
    console.error("Error en getProductos:", error.response?.data || error.message);
    throw error.response?.data || new Error("Error al obtener los productos.");
  }
};

const createProducto = async (productoData) => {
  try {
    const response = await apiClient.post('/productos', productoData);
    return response.data;
  } catch (error) {
    console.error("Error en createProducto:", error.response?.data || error.message);
    throw error.response?.data || new Error("Error al crear el producto.");
  }
};

const updateProducto = async (id, productoData) => {
    try {
        const response = await apiClient.put(`/productos/${id}`, productoData);
        return response.data;
    } catch (error) {
        console.error("Error en updateProducto:", error.response?.data || error.message);
        throw error.response?.data || new Error("Error al actualizar el producto.");
    }
};

const toggleProductoEstado = async (id, estado) => {
    try {
        const response = await apiClient.patch(`/productos/${id}/estado`, { estado });
        return response.data;
    } catch (error) {
        console.error("Error en toggleProductoEstado:", error.response?.data || error.message);
        throw error.response?.data || new Error("Error al cambiar el estado del producto.");
    }
};

const deleteProducto = async (id) => {
    try {
        const response = await apiClient.delete(`/productos/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error en deleteProducto:", error.response?.data || error.message);
        throw error.response?.data || new Error("Error al eliminar el producto.");
    }
};

// --- Exportamos un único objeto con todas las funciones ---
export const productosAdminService = {
  getProductos,
  createProducto,
  updateProducto,
  toggleEstado: toggleProductoEstado,
  deleteProducto,
  // CORRECCIÓN CLAVE: Devolver el objeto completo de la categoría, no solo el nombre.
  getActiveCategorias: async () => {
      try {
          const categorias = await getCategoriasAPI();
          // Solo filtramos por estado, pero devolvemos el objeto completo de la categoría
          // ¡Esto es lo que ProductoAdminForm espera!
          return categorias.filter(c => c.estado === true); 
      } catch (error) {
          console.error("Error al obtener categorías activas:", error);
          return [];
      }
  }
};