import apiClient from "../../../shared/services/apiClient";
import { getCategoriasServicio } from "../../categoriasServicioAdmin/services/categoriasServicioService";

// --- FUNCIONES DE LA API PARA SERVICIOS ---

/**
 * Obtiene una lista de servicios de la API, con filtros opcionales.
 * @param {object} [filtros={}] - Objeto con los parámetros de filtro.
 * @returns {Promise<object>} La respuesta de la API que contiene los servicios.
 */
export const getServicios = async (filtros = {}) => {
  try {
    const response = await apiClient.get("/servicios", { params: filtros });
    return response;
  } catch {
    return { data: { data: [] } };
  }
};

/**
 * Crea un nuevo servicio en la API usando FormData.
 * @param {object} servicioData - Objeto con los datos del servicio. La propiedad 'imagen' debe ser un objeto File si existe.
 * @returns {Promise<object>} La respuesta de la API.
 */
export const createServicio = async (servicioData) => {
  try {
    const formData = new FormData();
    // Construye el FormData a partir de los datos del servicio.
    for (const key in servicioData) {
      if (servicioData[key] !== null && servicioData[key] !== undefined) {
        formData.append(key, servicioData[key]);
      }
    }

    const response = await apiClient.post("/servicios", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error al crear el servicio:",
      error.response?.data || error.message
    );
    throw error.response?.data || new Error("Error al crear el servicio.");
  }
};

/**
 * Actualiza un servicio existente. Maneja inteligentemente la actualización de la imagen.
 * @param {number|string} id - El ID del servicio a actualizar.
 * @param {object} servicioData - Datos a actualizar. La propiedad 'imagen' puede ser:
 * - Un objeto File: para subir una nueva imagen.
 * - null: para eliminar la imagen existente.
 * - undefined o una string (URL): para no cambiar la imagen existente.
 * @returns {Promise<object>} La respuesta de la API.
 */
export const updateServicio = async (id, servicioData) => {
  try {
    const formData = new FormData();

    // Itera sobre los datos y los añade al FormData, manejando la imagen de forma especial.
    for (const key in servicioData) {
      if (key === "imagen") {
        if (servicioData.imagen instanceof File) {
          // Si es un archivo nuevo, lo añade para subirlo.
          formData.append("imagen", servicioData.imagen);
        } else if (servicioData.imagen === null) {
          // Si es null, añade un string vacío como señal para que el backend la elimine.
          formData.append("imagen", "");
        }
        // Si es una URL (string) o undefined, no hace nada, conservando la imagen existente.
      } else if (
        servicioData[key] !== null &&
        servicioData[key] !== undefined
      ) {
        formData.append(key, servicioData[key]);
      }
    }

    // IMPORTANTE: Se usa apiClient.put para la actualización.
    const response = await apiClient.put(`/servicios/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error al actualizar el servicio ${id}:`,
      error.response?.data || error.message
    );
    throw error.response?.data || new Error("Error al actualizar el servicio.");
  }
};

/**
 * Elimina un servicio de la API por su ID.
 * @param {number|string} id - ID del servicio a eliminar.
 * @returns {Promise<void>}
 */
export const deleteServicio = async (id) => {
  try {
    await apiClient.delete(`/servicios/${id}`);
  } catch (error) {
    console.error(`Error al eliminar el servicio ${id}:`, error);

    // Manejar errores específicos del backend
    if (error.response?.status === 400) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "No se puede eliminar el servicio porque está asociado a citas existentes.";
      throw new Error(errorMessage);
    }

    // Para otros errores, también intentar extraer el mensaje del response
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error(error.message || "Error al eliminar el servicio.");
  }
};

/**
 * Cambia el estado (activo/inactivo) de un servicio.
 * @param {number|string} id - ID del servicio.
 * @param {boolean} nuevoEstado - El nuevo estado a establecer.
 * @returns {Promise<object>} La respuesta de la API.
 */
export const cambiarEstadoServicio = async (id, nuevoEstado) => {
  try {
    const response = await apiClient.patch(`/servicios/${id}/estado`, {
      estado: nuevoEstado,
    });
    return response.data;
  } catch (error) {
    console.error(`Error al cambiar estado del servicio ${id}:`, error);
    throw error.response?.data || new Error(error.message);
  }
};

// --- FUNCIONES AUXILIARES ---

/**
 * Obtiene y formatea las categorías de servicio activas para un componente de selección.
 * @returns {Promise<Array<object>>} Array de objetos { value: id, label: nombre }.
 */
export const getActiveCategoriasForSelect = async () => {
  try {
    // Asume que getCategoriasServicio(true) filtra por activas.
    const response = await getCategoriasServicio({ estado: true });
    const categoriasArray = response?.data?.data;

    if (!Array.isArray(categoriasArray)) {
      console.error(
        "La respuesta de la API para categorías no contenía un array en la ubicación esperada.",
        response
      );
      return [];
    }

    return categoriasArray.map((cat) => ({
      value: cat.idCategoriaServicio,
      label: cat.nombre,
    }));
  } catch (error) {
    console.error(
      "Error en getActiveCategoriasForSelect al obtener las categorías:",
      error
    );
    return [];
  }
};
