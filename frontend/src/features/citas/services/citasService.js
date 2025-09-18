// src/features/citas/services/citasService.js
import apiClient from "../../../shared/services/apiClient";
import moment from "moment";
import { getServicios } from "../../serviciosAdmin/services/serviciosAdminService";

/**
 * ✅ Obtener todas las citas desde la API
 */
export const fetchCitasAgendadas = async () => {
  try {
    const response = await apiClient.get("/citas");
    const citas = response.data?.data || [];
    return citas.map(c => ({
      ...c,
      title: c.cliente?.nombre || 'Cita',
      start: moment(`${c.fecha} ${c.horaInicio}`).toDate(),
      end: moment(`${c.fecha} ${c.horaFin}`).toDate(),
    }));
  } catch (error) {
    console.error("Error al obtener citas:", error);
    throw new Error("No se pudieron cargar las citas agendadas.");
  }
};

/**
 * ✅ Guardar una nueva cita o editar una existente
 */
export const saveCita = async (citaData) => {
  try {
    const dataToSend = {
      clienteId: citaData.clienteId,
      usuarioId: citaData.d,
      servicios: citaData.servicioIds || [],
      fechaHora: moment(citaData.start).toISOString(),
      idEstado: citaData.estadoCitaId || 5,
      novedadId: citaData.novedadId,
    };

    console.log("➡️ Payload definitivo para la API:", dataToSend);

    if (citaData.id) {
      const response = await apiClient.put(`/citas/${citaData.id}`, dataToSend);
      return response.data.data;
    } else {
      const response = await apiClient.post("/citas", dataToSend);
      return response.data.data;
    }
  } catch (error) {
    console.error("Error en el servicio al guardar cita:", error);
    if (error.response?.data?.errors) {
      const errorMessages = Object.values(error.response.data.errors).flat().join(', ');
      throw new Error(errorMessages);
    }
    throw error;
  }
};

/**
 * ✅ Eliminar cita por ID
 */
export const deleteCitaById = async (citaId) => {
  try {
    await apiClient.delete(`/citas/${citaId}`);
  } catch (error) {
    console.error("Error al eliminar cita:", error);
    throw new Error(error.response?.data?.message || "No se pudo eliminar la cita.");
  }
};

/**
 * ✅ Cambiar estado de una cita
 */
export const cambiarEstadoCita = async (citaId, nuevoEstado, motivo = "") => {
  try {
    const response = await apiClient.patch(`/citas/${citaId}/estado`, {
      estado: nuevoEstado,
      motivoCancelacion: motivo,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error al cambiar estado de cita:", error);
    throw new Error(error.response?.data?.message || "No se pudo cambiar el estado de la cita.");
  }
};

/**
 * ✅ Traer servicios disponibles para el formulario de citas
 */
export const fetchServiciosDisponiblesParaCitas = async () => {
  try {
    const response = await getServicios({ estado: true });
    return (response?.data?.data || []).map(s => ({
      ...s,
      id: s.idServicio, // Normaliza el ID para el frontend
      nombre: s.nombre,
      precio: parseFloat(s.precio) || 0,
    }));
  } catch (error) {
    console.error("Error al obtener servicios:", error);
    throw new Error("No se pudieron cargar los servicios.");
  }
};

/**
 * ✅ Traer clientes disponibles para el formulario de citas
 */
export const fetchClientesParaCitas = async () => {
  try {
    const response = await apiClient.get("/clientes"); 
    return response.data?.data || [];
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    throw new Error("No se pudieron cargar los clientes.");
  }
};

/**
 * ✅ NUEVA FUNCIÓN: Traer novedades de horario (agendables)
 */
export const fetchNovedades = async () => {
  try {
    const response = await apiClient.get("/novedades");
    return response.data?.data || [];
  } catch (error) {
    console.error("Error al obtener novedades:", error);
    throw new Error("No se pudieron cargar los horarios disponibles.");
  }
};

/**
 * ✅ Traer empleados disponibles
 */
export const fetchEmpleadosDisponiblesParaCitas = async () => {
  try {
    const response = await apiClient.get("/empleados");
    return (response.data?.data || []).map(emp => ({
        ...emp,
        id: emp.idUsuario 
    }));
  } catch (error) {
    console.error("Error al obtener empleados:", error);
    return [];
  }
};