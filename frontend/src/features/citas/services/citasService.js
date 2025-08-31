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
      // El backend devuelve fecha + hora, aquí lo convertimos a objetos Date
      start: moment(`${c.fecha} ${c.horaInicio}`).toDate(),
      end: moment(`${c.fecha} ${c.horaFin}`).toDate(),
    }));
  } catch (error) {
    console.error("Error al obtener citas:", error);
    return [];
  }
};

/**
 * ✅ Guardar una nueva cita o editar una existente
 */
export const saveCita = async (citaData) => {
  try {
    // 🔹 Adaptar la estructura a lo que tu backend espera
    const dataToSend = {
      clienteId: citaData.cliente?.idCliente || citaData.clienteId,
      empleadoId: citaData.empleadoId,
      idServicios: citaData.servicioIds || [], // array de IDs de servicios
      fecha: moment(citaData.start).format("YYYY-MM-DD"),
      horaInicio: moment(citaData.start).format("HH:mm:ss"),
      horaFin: moment(citaData.end).format("HH:mm:ss"),
      estadoCitaId: citaData.estadoCitaId || 1, // Ejemplo: 1=Programada
    };

    if (citaData.id) {
      // Editar cita existente
      const response = await apiClient.put(`/citas/${citaData.id}`, dataToSend);
      return response.data.data;
    } else {
      // Crear nueva cita
      const response = await apiClient.post("/citas", dataToSend);
      return response.data.data;
    }
  } catch (error) {
    console.error("Error al guardar cita:", error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
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
    return true;
  } catch (error) {
    console.error("Error al eliminar cita:", error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

/**
 * ✅ Cambiar estado de una cita
 */
export const cambiarEstadoCita = async (citaId, nuevoEstadoId, motivo = "") => {
  try {
    const response = await apiClient.patch(`/citas/${citaId}/estado`, {
      estadoCitaId: nuevoEstadoId, // ahora se manda ID en lugar de string
      motivoCancelacion: motivo,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error al cambiar estado de cita:", error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

/**
 * ✅ Traer servicios disponibles desde la API
 */
export const fetchServiciosDisponiblesParaCitas = async () => {
  try {
    const response = await getServicios({ estado: true }); // Solo activos
    const adminServicios = response?.data?.data || []; // 🔥 CORREGIDO

    return adminServicios
      .filter(s => s.estado === true && s.duracionEstimadaMin)
      .map(s => ({
        ...s,
        id: s.idServicio, // backend lo manda como idServicio
        nombre: s.nombre,
        duracion_estimada: parseInt(s.duracionEstimadaMin) || 30,
        precio: parseFloat(s.precio) || 0,
      }));
  } catch (error) {
    console.error("Error al obtener servicios:", error);
    return [];
  }
};

/**
 * ✅ Traer empleados disponibles para citas
 */
export const fetchEmpleadosDisponiblesParaCitas = async () => {
  try {
    const response = await apiClient.get("/empleados");
    return response.data?.data || [];
  } catch (error) {
    console.error("Error al obtener empleados:", error);
    return [];
  }
};

/**
 * ✅ Traer clientes disponibles para citas
 */
export const fetchClientesParaCitas = async () => {
  try {
    const response = await apiClient.get("/clientes");
    return response.data?.data || [];
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    return [];
  }
};
