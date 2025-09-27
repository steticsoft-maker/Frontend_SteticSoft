// src/features/home/services/publicCitasService.js
import publicApiClient from "../../../shared/services/publicApiClient";

/**
 * Obtiene la lista de servicios disponibles para agendar citas desde la API pública.
 * @returns {Promise<Object>} La respuesta de la API con la lista de servicios.
 */
export const getPublicServicios = async () => {
  try {
    const response = await publicApiClient.get("/servicios");
    return response;
  } catch (error) {
    console.error("Error al obtener servicios públicos:", error);
    throw error;
  }
};

/**
 * Obtiene la lista de empleados disponibles para citas desde la API pública.
 * @returns {Promise<Object>} La respuesta de la API con la lista de empleados.
 */
export const getPublicEmpleados = async () => {
  // Por ahora, retornar datos vacíos ya que no hay endpoint público para empleados
  // En el futuro se puede implementar un endpoint específico
  return { data: { data: [] } };
};

/**
 * Obtiene las novedades (horarios disponibles) desde la API pública.
 * @returns {Promise<Object>} La respuesta de la API con las novedades.
 */
export const getPublicNovedades = async () => {
  // Por ahora, retornar datos vacíos ya que no hay endpoint público funcional para novedades
  // En el futuro se puede implementar un endpoint específico
  return { data: { data: [] } };
};

/**
 * Obtiene las citas existentes para verificar disponibilidad.
 * @returns {Promise<Object>} La respuesta de la API con las citas.
 */
export const getPublicCitas = async () => {
  // Por ahora, retornar datos vacíos ya que no hay endpoint público para citas
  // En el futuro se puede implementar un endpoint específico
  return { data: { data: [] } };
};
