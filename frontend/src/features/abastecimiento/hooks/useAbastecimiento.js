import apiClient from "../../../shared/services/apiClient";

const API_PATH = "/abastecimientos";

/**
 * Obtiene una lista paginada de todos los registros de abastecimiento.
 * @param {object} params - Parámetros de consulta como { page, limit, busqueda, estado }.
 * @returns {Promise<object>} - Una promesa que resuelve a un objeto con { totalItems, totalPages, currentPage, data }.
 */
export const fetchAbastecimientos = async (params = {}) => {
  try {
    const response = await apiClient.get(API_PATH, { params });
    return response.data;
  } catch (error) {
    console.error("Error al obtener los abastecimientos:", error);
    throw error;
  }
};

/**
 * Obtiene un único registro de abastecimiento por su ID.
 * @param {number} id - El ID del abastecimiento.
 * @returns {Promise<object>} - El registro de abastecimiento encontrado.
 */
export const getAbastecimientoById = async (id) => {
  try {
    const response = await apiClient.get(`${API_PATH}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el abastecimiento con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Crea un nuevo registro de abastecimiento.
 * @param {object} abastecimientoData - Datos del nuevo abastecimiento { idProducto, cantidad, idUsuario }.
 * @returns {Promise<object>} - El nuevo abastecimiento creado.
 */
export const createAbastecimiento = async (abastecimientoData) => {
  try {
    const response = await apiClient.post(API_PATH, abastecimientoData);
    return response.data;
  } catch (error) {
    console.error("Error al crear el abastecimiento:", error);
    throw error;
  }
};

/**
 * Actualiza un registro de abastecimiento existente.
 * @param {number} id - El ID del abastecimiento a actualizar.
 * @param {object} updateData - Los datos a actualizar { cantidad, estado, idUsuario }.
 * @returns {Promise<object>} - El abastecimiento actualizado.
 */
export const updateAbastecimiento = async (id, updateData) => {
  try {
    const response = await apiClient.put(`${API_PATH}/${id}`, updateData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el abastecimiento con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Cambia el estado (activo/inactivo) de un registro de abastecimiento.
 * @param {number} id - El ID del abastecimiento.
 * @param {boolean} estado - El nuevo estado.
 * @returns {Promise<object>} - La respuesta de la API.
 */
export const toggleAbastecimientoEstado = async (id, estado) => {
  try {
    const response = await apiClient.patch(`${API_PATH}/${id}/estado`, {
      estado,
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error al cambiar estado del abastecimiento con ID ${id}:`,
      error
    );
    throw error;
  }
};

/**
 * Marca un registro de abastecimiento como agotado.
 * @param {number} id - El ID del abastecimiento.
 * @param {string} razon_agotamiento - La razón por la que se agotó.
 * @returns {Promise<object>} - La respuesta de la API.
 */
export const agotarAbastecimiento = async (id, razon_agotamiento) => {
  try {
    const response = await apiClient.patch(`${API_PATH}/${id}/agotar`, {
      razon_agotamiento,
    });
    return response.data;
  } catch (error) {
    console.error(`Error al agotar el abastecimiento con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Elimina un registro de abastecimiento de forma permanente.
 * @param {number} id - El ID del abastecimiento a eliminar.
 * @returns {Promise<void>}
 */
export const deleteAbastecimientoById = async (id) => {
  try {
    await apiClient.delete(`${API_PATH}/${id}`);
  } catch (error) {
    console.error(`Error al eliminar el abastecimiento con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Obtiene la lista de usuarios con rol de empleado.
 * @returns {Promise<Array>} - Una lista de empleados.
 */
export const fetchEmpleados = async () => {
  try {
    const response = await apiClient.get(`${API_PATH}/empleados`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener la lista de empleados:", error);
    throw error;
  }
};
