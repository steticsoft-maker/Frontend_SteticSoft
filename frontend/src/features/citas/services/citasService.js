// src/features/citas/services/citasService.js
import apiClient from "../../../shared/services/apiClient";

// --- SERVICIOS PARA GESTIÓN DE CITAS (TABLA) ---

/**
 * Obtiene todas las citas existentes para la tabla de gestión.
 */
export const fetchCitas = (filtros = {}) => {
  return apiClient.get('/citas', { params: filtros });
};

/**
 * Obtiene los detalles completos de una sola cita.
 */
export const fetchCitaPorId = (idCita) => {
  return apiClient.get(`/citas/${idCita}`);
};

/**
 * ✅ FUNCIÓN AÑADIDA: Actualiza una cita existente.
 * @param {number} idCita - El ID de la cita a actualizar.
 * @param {object} datosActualizar - Objeto con los campos a modificar.
 */
export const actualizarCita = (idCita, datosActualizar) => {
  // Usamos PUT, como se definió en el archivo de rutas del back-end.
  return apiClient.put(`/citas/${idCita}`, datosActualizar);
};

/**
 * Elimina una cita de forma permanente.
 */
export const deleteCitaById = (idCita) => {
  return apiClient.delete(`/citas/${idCita}`);
};

/**
 * Anula una cita (cambia su estado a inactivo).
 */
export const anularCita = (idCita) => {
  return apiClient.patch(`/citas/${idCita}/anular`);
};

/**
 * Reactiva una cita anulada.
 */
export const habilitarCita = (idCita) => {
    return apiClient.patch(`/citas/${idCita}/habilitar`);
};


// --- SERVICIOS PARA AGENDAR NUEVA CITA (PÁGINA DE AGENDAMIENTO) ---

/**
 * Crea una nueva cita.
 */
export const crearCita = (citaData) => {
  return apiClient.post('/citas', citaData);
};

/**
 * Obtiene las novedades activas disponibles para agendar.
 */
export const fetchNovedadesAgendables = () => {
  return apiClient.get('/novedades/agendables');
};

/**
 * Obtiene los días disponibles para una novedad en un mes y año específicos.
 */
export const fetchDiasDisponibles = (idNovedad, anio, mes) => {
  return apiClient.get(`/novedades/${idNovedad}/dias-disponibles`, { params: { anio, mes } });
};

/**
 * Obtiene las horas disponibles para una novedad en una fecha específica.
 */
export const fetchHorasDisponibles = (idNovedad, fecha) => {
  return apiClient.get(`/novedades/${idNovedad}/horas-disponibles`, { params: { fecha } });
};

/**
 * Obtiene los empleados asociados a una novedad específica.
 */
export const fetchEmpleadosPorNovedad = (idNovedad) => {
    return apiClient.get(`/novedades/${idNovedad}/empleados`);
};

/**
 * Obtiene todos los servicios que están activos.
 */
export const fetchServiciosDisponibles = () => {
    return apiClient.get('/servicios/disponibles');
};

/**
 * Busca clientes por un término de búsqueda.
 */
export const buscarClientes = (termino) => {
    return apiClient.get('/clientes/buscar', { params: { termino } });
};