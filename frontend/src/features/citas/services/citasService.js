// src/features/citas/services/citasService.js
import apiClient from "../../../shared/services/apiClient";

/**
 * Módulo de servicio para todas las operaciones relacionadas con las Citas.
 */

// --- SERVICIOS PARA LA GESTIÓN DE CITAS (VISTAS DE TABLA, DETALLES) ---

/**
 * Obtiene una lista paginada y filtrada de todas las citas.
 * @param {object} [filtros={}] - Opciones de filtrado (ej. estado, fecha, busqueda).
 * @returns {Promise<object>} La respuesta de la API con la lista de citas.
 */
export const fetchCitas = (filtros = {}) => {
  return apiClient.get('/citas', { params: filtros });
};

/**
 * Obtiene los detalles completos de una sola cita por su ID.
 * @param {number} idCita - El ID de la cita a obtener.
 * @returns {Promise<object>} La respuesta de la API con los datos de la cita.
 */
export const fetchCitaPorId = (idCita) => {
  return apiClient.get(`/citas/${idCita}`);
};

/**
 * Actualiza los datos de una cita existente.
 * @param {number} idCita - El ID de la cita a actualizar.
 * @param {object} datosActualizar - Objeto con los campos a modificar.
 * @returns {Promise<object>} La respuesta de la API con la cita actualizada.
 */
export const actualizarCita = (idCita, datosActualizar) => {
  // CORRECCIÓN: Usamos PATCH para actualizaciones parciales, según la definición de nuestra API.
  return apiClient.patch(`/citas/${idCita}`, datosActualizar);
};

/**
 * Cambia el estado de una cita. Esta es la función central para anular, activar, etc.
 * @param {number} idCita - El ID de la cita.
 * @param {string} nuevoEstado - El nuevo estado para la cita (ej. 'Cancelada', 'Activa').
 * @returns {Promise<object>} La respuesta de la API con la cita actualizada.
 */
export const cambiarEstadoCita = (idCita, nuevoEstado) => {
  // ROBUSTEZ: Centralizamos todos los cambios de estado en un solo endpoint.
  return apiClient.patch(`/citas/${idCita}/estado`, { estado: nuevoEstado });
};

/**
 * Elimina una cita de forma permanente (borrado físico).
 * @param {number} idCita - El ID de la cita a eliminar.
 * @returns {Promise<object>} La respuesta de la API.
 */
export const deleteCitaById = (idCita) => {
  return apiClient.delete(`/citas/${idCita}`);
};

// --- SERVICIOS PARA EL FORMULARIO DE AGENDAMIENTO ---

/**
 * Crea una nueva cita en el sistema.
 * @param {object} citaData - Los datos de la nueva cita.
 * @returns {Promise<object>} La respuesta de la API con la cita creada.
 */
export const crearCita = (citaData) => {
  return apiClient.post('/citas', citaData);
};

/**
 * Obtiene la lista de posibles estados para una cita.
 * @returns {Promise<object>} La respuesta de la API con un array de strings de estados.
 */
export const fetchEstadosCita = () => {
  // CORRECCIÓN: Se apunta a la ruta correcta que creamos en el backend.
  return apiClient.get('/citas/estados');
};

/**
 * Obtiene las novedades (horarios de empleados) que están activas.
 * @returns {Promise<object>} La respuesta de la API con la lista de novedades.
 */
export const fetchNovedadesAgendables = () => {
  return apiClient.get('/novedades/agendables');
};

/**
 * Obtiene los días laborables para una novedad en un mes y año específicos.
 * @param {number} idNovedad - El ID de la novedad.
 * @param {number} anio - El año a consultar.
 * @param {number} mes - El mes a consultar (1-12).
 * @returns {Promise<object>} La respuesta de la API con los días disponibles.
 */
export const fetchDiasDisponibles = (idNovedad, anio, mes) => {
  return apiClient.get(`/novedades/${idNovedad}/dias-disponibles`, { params: { anio, mes } });
};

/**
 * Obtiene las horas disponibles para una novedad en una fecha específica.
 * @param {number} idNovedad - El ID de la novedad.
 * @param {string} fecha - La fecha en formato YYYY-MM-DD.
 * @returns {Promise<object>} La respuesta de la API con las horas disponibles.
 */
export const fetchHorasDisponibles = (idNovedad, fecha) => {
  return apiClient.get(`/novedades/${idNovedad}/horas-disponibles`, { params: { fecha } });
};

/**
 * Obtiene los empleados asociados a una novedad (horario) específica.
 * @param {number} idNovedad - El ID de la novedad.
 * @returns {Promise<object>} La respuesta de la API con la lista de empleados.
 */
export const fetchEmpleadosPorNovedad = (idNovedad) => {
  return apiClient.get(`/novedades/${idNovedad}/empleados`);
};

/**
 * Obtiene todos los servicios que están activos para ser agendados.
 * @returns {Promise<object>} La respuesta de la API con la lista de servicios.
 */
export const fetchServiciosDisponibles = () => {
  return apiClient.get('/servicios/disponibles');
};

/**
 * Busca clientes activos por un término de búsqueda (nombre, apellido, documento).
 * @param {string} termino - El término a buscar.
 * @returns {Promise<object>} La respuesta de la API con los clientes encontrados.
 */
export const buscarClientes = (termino) => {
  return apiClient.get('/clientes/buscar', { params: { termino } });
};