// src/features/productosAdmin/services/productosAdminService.js
import apiClient from "../../../shared/services/apiClient";
import { fetchCategoriasProducto as getCategoriasAPI } from "../../categoriasProductoAdmin/services/categoriasProductoService";

// --- Funciones que se conectan a la API REAL ---

const getProductos = async (searchTerm = "") => {
  try {
    const url = searchTerm
      ? `/productos?search=${encodeURIComponent(searchTerm)}`
      : "/productos";
    const response = await apiClient.get(url);
    // CORRECCIÓN: Extrae el array de datos sin importar el anidamiento.
    const productosData = response.data?.data?.productos || response.data?.data || response.data;
    
    // Asegura que siempre se retorne un array.
    return Array.isArray(productosData) ? productosData : [];
  } catch (error) {
    console.error(
      "Error en getProductos:",
      error.response?.data || error.message
    );
    throw error.response?.data || new Error("Error al obtener los productos.");
  }
};

// --- INICIO DE LA CORRECCIÓN CRÍTICA ---
// Se reestructura para usar FormData, que es necesario para la subida de archivos.
const createProducto = async (productoData) => {
  try {
    console.log("🔧 Creando FormData con:", productoData);
    const formData = new FormData();

    // Iteramos sobre los datos del producto y los añadimos al FormData.
    // Esto funciona para texto, números, booleanos y, lo más importante, archivos.
    for (const key in productoData) {
      if (productoData[key] !== null && productoData[key] !== undefined) {
        console.log(`📝 Agregando al FormData: ${key} =`, productoData[key]);
        formData.append(key, productoData[key]);
      }
    }

    // Verificar que el archivo esté en el FormData
    console.log("📁 Archivo en FormData:", formData.get('imagen'));

    // Enviamos el formData. Axios se encarga de poner el 'Content-Type' correcto ('multipart/form-data').
    const response = await apiClient.post("/productos", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    // AÑADIDO PARA DEBUG: Muestra los errores de validación específicos en la consola.
    if (error.response?.data?.errors) {
      console.error(
        "⛔ DETALLE DE ERRORES DE VALIDACIÓN:",
        error.response.data.errors
      );
    }
    console.error(
      "Error en createProducto:",
      error.response?.data || error.message
    );
    throw error.response?.data || new Error("Error al crear el producto.");
  }
};

// Se aplica la misma lógica de FormData para la función de actualizar.
const updateProducto = async (id, productoData) => {
  try {
    const formData = new FormData();
    for (const key in productoData) {
      if (productoData[key] !== null && productoData[key] !== undefined) {
        formData.append(key, productoData[key]);
      }
    }

    const response = await apiClient.put(`/productos/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.errors) {
      console.error(
        "⛔ DETALLE DE ERRORES DE VALIDACIÓN:",
        error.response.data.errors
      );
    }
    console.error(
      "Error en updateProducto:",
      error.response?.data || error.message
    );
    throw error.response?.data || new Error("Error al actualizar el producto.");
  }
};
// --- FIN DE LA CORRECCIÓN CRÍTICA ---

const toggleProductoEstado = async (id, estado) => {
  try {
    const response = await apiClient.patch(`/productos/${id}/estado`, {
      estado,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error en toggleProductoEstado:",
      error.response?.data || error.message
    );
    throw (
      error.response?.data ||
      new Error("Error al cambiar el estado del producto.")
    );
  }
};

const deleteProducto = async (id) => {
  try {
    const response = await apiClient.delete(`/productos/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error en deleteProducto:",
      error.response?.data || error.message
    );
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
  getActiveCategorias: async () => {
    try {
      const categorias = await getCategoriasAPI();
      return categorias.filter((c) => c.estado === true);
    } catch (error) {
      console.error("Error al obtener categorías activas:", error);
      return [];
    }
  },
};