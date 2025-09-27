// src/features/home/services/publicCitasService.js
import publicApiClient from "../../../shared/services/publicApiClient";
import moment from "moment";

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
 * Obtiene las novedades (horarios disponibles) desde la API.
 * @returns {Promise<Object>} La respuesta de la API con las novedades.
 */
export const getPublicNovedades = async () => {
  try {
    // Primero intentar el endpoint público
    const response = await publicApiClient.get("/novedades/public");
    return response;
  } catch (error) {
    console.warn(
      "Endpoint público falló, intentando endpoint agendables:",
      error
    );

    try {
      // Si el usuario está autenticado, usar el endpoint agendables
      const apiClient = (await import("../../../shared/services/apiClient"))
        .default;
      const response = await apiClient.get("/novedades/agendables");
      return response;
    } catch (authError) {
      console.warn(
        "No se pudieron cargar novedades, usando horario por defecto:",
        authError
      );

      // Crear una novedad por defecto que coincida con la migración
      const novedadPorDefecto = {
        idNovedad: 1, // ID que existe gracias a la migración
        nombre: "Horario General",
        descripcion: "Horario de atención general",
        horaInicio: "08:00:00",
        horaFin: "18:00:00",
        dias: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
        estado: true,
        fechaInicio: moment().format("YYYY-MM-DD"),
        fechaFin: moment().add(1, "year").format("YYYY-MM-DD"),
      };

      return { data: { data: [novedadPorDefecto] } };
    }
  }
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
