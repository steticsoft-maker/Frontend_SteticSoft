// src/features/citas/services/citasService.js
import apiClient from "../../../shared/services/apiClient";
import moment from "moment";
import { getServicios } from "../../serviciosAdmin/services/serviciosAdminService";

/**
 * ✅ CORREGIDO: Guardar una nueva cita o editar una existente
 */
export const saveCita = async (citaData) => {
  try {
    const dataToSend = {
      start: citaData.start, 
      clienteId: citaData.clienteId,
      empleadoId: citaData.empleadoId, 
      servicios: citaData.servicios || [],
      idEstado: citaData.estadoCitaId || 2, // Por defecto "pendiente"
      novedadId: citaData.novedadId, 
      precio_total: citaData.precioTotal || 0
    };

    console.log("➡️ Enviando payload a la API:", dataToSend);

    if (citaData.id) {
      const response = await apiClient.patch(`/citas/${citaData.id}`, dataToSend);
      return response.data.data;
    } else {
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
 * ✅ CORREGIDO: Eliminar cita por ID
 */
export const deleteCitaById = async (citaId) => {
  try {
    await apiClient.delete(`/citas/${citaId}`);
    return true; // Es buena práctica devolver algo en caso de éxito.
  } catch (error) {
    console.error("Error al eliminar cita:", error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

/**
 * ✅ CORREGIDO: Cambiar estado de una cita
 */
export const cambiarEstadoCita = async (citaId, nuevoEstadoId, motivo = "") => {
  try {
    const response = await apiClient.patch(`/citas/${citaId}/estado`, {
      idEstado: nuevoEstadoId,
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
export const fetchClientesParaCitas = async (searchTerm = '') => {
  try {
    const params = searchTerm ? { search: searchTerm } : {};
    const response = await apiClient.get("/clientes", { params }); 
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
    const novedades = response.data?.data || [];
    
    // Filtrar y desactivar automáticamente novedades que ya finalizaron
    const novedadesFiltradas = [];
    for (const novedad of novedades) {
      const fechaFin = moment(novedad.fechaFin);
      const hoy = moment();
      
      // Si la novedad ya finalizó y está activa, desactivarla automáticamente
      if (novedad.estado && fechaFin.isBefore(hoy, 'day')) {
        try {
          await apiClient.patch(`/novedades/${novedad.idNovedad}/estado`, { estado: false });
          console.log(`Novedad ${novedad.idNovedad} desactivada automáticamente por fecha vencida`);
        } catch (error) {
          console.warn(`No se pudo desactivar la novedad ${novedad.idNovedad}:`, error);
        }
      } else {
        novedadesFiltradas.push(novedad);
      }
    }
    
    return novedadesFiltradas;
  } catch (error) {
    console.error("Error al obtener novedades:", error);
    throw new Error("No se pudieron cargar los horarios disponibles.");
  }
};

/**
 * ✅ Traer empleados disponibles para una novedad específica
 */
export const fetchEmpleadosDisponiblesParaCitas = async (novedadId) => {
  try {
    if (!novedadId) return [];
    const response = await apiClient.get(`/novedades/${novedadId}`);
    const novedad = response.data?.data;
    return novedad?.empleados || [];
  } catch (error) {
    console.error("Error al obtener empleados de la novedad:", error);
    return [];
  }
};

export const fetchCitasAgendadas = async () => {
  try {
    const response = await apiClient.get("/citas");
    const citas = response.data?.data || [];

    return citas.map(c => {
      const startDateTime = moment(`${c.fecha} ${c.hora_inicio}`).toDate();
      const endDateTime = moment(startDateTime).add(60, 'minutes').toDate();

      return {
        ...c,
        start: startDateTime,
        end: endDateTime,
      };
    });
  } catch (error) {
    console.error("Error al obtener citas:", error);
    return [];
  }
};

/**
 * ✅ NUEVA FUNCIÓN: Obtiene los estados posibles para una cita desde la API.
 */
export const fetchEstadosCita = async () => {
  try {
    const response = await apiClient.get("/citas/estados");
    return response.data?.data || [];
  } catch (error) {
    console.error("Error al obtener los estados de cita:", error);
    throw new Error("No se pudieron cargar los estados de las citas.");
  }
};