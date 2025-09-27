import apiClient from "../../../shared/services/api"; // Asegúrate de que esta ruta sea correcta para tu `apiClient`

const API_BASE_PATH = "/categorias-producto"; // Ruta base de la API para categorías de producto

/**
 * Función para obtener todas las categorías de producto desde el backend.
 * Permite filtrar por estado, tipo de uso y un término de búsqueda general.
 * @param {object} [filters={}] - Opciones de filtro ({ estado, tipoUso, search }).
 * @returns {Promise<Array>} Una promesa que resuelve con la lista de categorías.
 */
export const fetchCategoriasProducto = async (filters = {}) => {
  try {
    // Objeto para construir los parámetros de la URL de forma limpia.
    const params = new URLSearchParams();

    // Añade cada filtro a los parámetros solo si tiene un valor.
    if (filters.search) {
      params.append('search', filters.search);
    }
    if (filters.estado !== undefined) {
      params.append('estado', filters.estado);
    }
    if (filters.tipoUso) {
      params.append('tipoUso', filters.tipoUso);
    }

    // Define el endpoint específico para esta solicitud.
    const endpoint = `/categorias-producto?${params.toString()}`;

    // Llama a la API usando el cliente (ej. axios) y el endpoint construido.
    const response = await apiClient.get(endpoint);

    // --- CORRECCIÓN CLAVE ---
    // Se verifica de forma segura que la respuesta contenga los datos esperados.
    // Si `response.data` o `response.data.data` no existen, devuelve un array vacío
    // para evitar que la aplicación se rompa.
    return response?.data?.data || [];

  } catch (error) {
    console.error("Error al obtener categorías de producto desde la API:", error);
    // Se retorna un array vacío también en caso de error para mantener la consistencia
    // y evitar que la UI falle. El error ya se registró en la consola.
    return [];
  }
};

/**
 * Función para obtener una categoría de producto por su ID desde el backend.
 * @param {number} idCategoria - El ID de la categoría a buscar.
 * @returns {Promise<object>} Una promesa que resuelve con la categoría encontrada.
 */
export const getCategoriaProductoById = async (idCategoria) => {
  try {
    const response = await apiClient.get(`${API_BASE_PATH}/${idCategoria}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error al obtener categoría con ID ${idCategoria} desde la API:`, error);
    throw error;
  }
};

/**
 * Función para guardar (crear o actualizar) una categoría de producto en el backend.
 * @param {object} categoriaData - Los datos de la categoría (nombre, descripcion, vidaUtilDias, tipoUso, estado, etc.).
 * @returns {Promise<object>} Una promesa que resuelve con la categoría creada o actualizada.
 */
export const saveCategoriaProducto = async (categoriaData) => {
  try {
    let response;
    // La validación de campos obligatorios y formato debe hacerse en el frontend
    // antes de llamar a esta función, o se manejará el error del backend.
    if (categoriaData.idCategoriaProducto) { // Si tiene ID, es una actualización (PUT)
      response = await apiClient.put(`${API_BASE_PATH}/${categoriaData.idCategoriaProducto}`, {
        nombre: categoriaData.nombre,
        descripcion: categoriaData.descripcion,
        vidaUtilDias: categoriaData.vidaUtilDias, // Asegúrate que el nombre de campo coincida con el backend
        tipoUso: categoriaData.tipoUso,
        estado: categoriaData.estado,
      });
    } else { // Si no tiene ID, es una creación (POST)
      response = await apiClient.post(API_BASE_PATH, {
        nombre: categoriaData.nombre,
        descripcion: categoriaData.descripcion,
        vidaUtilDias: categoriaData.vidaUtilDias,
        tipoUso: categoriaData.tipoUso,
        estado: categoriaData.estado,
      });
    }
    return response.data.data;
  } catch (error) {
    console.error("Error al guardar categoría de producto en la API:", error);
    throw error;
  }
};

/**
 * Función para cambiar el estado de una categoría de producto (habilitar/anular) en el backend.
 * @param {number} idCategoria - El ID de la categoría.
 * @param {boolean} nuevoEstado - El nuevo estado (true para habilitar, false para anular).
 * @returns {Promise<object>} Una promesa que resuelve con la categoría actualizada.
 */
export const toggleCategoriaProductoEstado = async (idCategoria, nuevoEstado) => {
  try {
    const endpoint = nuevoEstado ? `${API_BASE_PATH}/${idCategoria}/habilitar` : `${API_BASE_PATH}/${idCategoria}/anular`;
    const response = await apiClient.patch(endpoint); // Para anular/habilitar no necesitamos body según tus rutas
    return response.data.data;
  } catch (error) {
    console.error(`Error al cambiar el estado de la categoría con ID ${idCategoria} a ${nuevoEstado} en la API:`, error);
    throw error;
  }
};


/**
 * Función para eliminar físicamente una categoría de producto del backend.
 * @param {number} idCategoria - El ID de la categoría a eliminar.
 * @returns {Promise<void>} Una promesa que resuelve cuando la eliminación es exitosa.
 */
export const deleteCategoriaProductoById = async (idCategoria) => {
  try {
    await apiClient.delete(`${API_BASE_PATH}/${idCategoria}`);
    // No hay data en la respuesta 204, solo se confirma la eliminación.
  } catch (error) {
    console.error(`Error al eliminar categoría con ID ${idCategoria} desde la API:`, error);
    throw error;
  }
};

/**
 * Función para obtener productos asociados a una categoría específica.
 * @param {number} idCategoria - El ID de la categoría.
 * @returns {Promise<Array>} Una promesa que resuelve con la lista de productos asociados.
 */
export const getProductosByCategoria = async (idCategoria) => {
  try {
    const response = await apiClient.get(`/productos?idCategoria=${idCategoria}`);
    // La respuesta tiene estructura: { data: { totalItems, totalPages, currentPage, productos: [...] } }
    return response?.data?.data?.productos || response?.data?.productos || [];
  } catch (error) {
    console.error(`Error al obtener productos de la categoría ${idCategoria}:`, error);
    return [];
  }
};