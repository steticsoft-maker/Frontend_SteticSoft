// src/features/citas/services/citasService.js
import moment from "moment";
import {
  fetchHorarios,
  getEmpleadosParaHorarios as fetchEmpleadosConHorarioConfigurado,
} from "../../novedades/services/horariosService"; // Asegúrate que la ruta sea correcta
import { getClientesParaVenta } from "../../ventas/services/ventasService"; // Asegúrate que la ruta sea correcta

// ✅ CORRECCIÓN 1: Se importa la función correcta y asíncrona 'getServicios'
import { getServicios } from "../../serviciosAdmin/services/serviciosAdminService"; 

const CITAS_STORAGE_KEY = "citas_steticsoft_v2";

// Datos iniciales de ejemplo (si localStorage está vacío)
const INITIAL_CITAS_EJEMPLO = [
  // ... (tus datos de ejemplo se mantienen igual)
];

const persistCitas = (citas) => {
  localStorage.setItem(CITAS_STORAGE_KEY, JSON.stringify(citas.map(c => ({
    ...c,
    start: moment(c.start).toISOString(),
    end: moment(c.end).toISOString(),
  }))));
};

export const fetchCitasAgendadas = () => {
  const stored = localStorage.getItem(CITAS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored).map((cita) => ({
        ...cita,
        start: moment(cita.start).toDate(),
        end: moment(cita.end).toDate(),
      }));
    } catch (e) {
      console.error("Error parsing citas from localStorage", e);
      localStorage.removeItem(CITAS_STORAGE_KEY);
    }
  }
  const citasInicialesConFechasDate = INITIAL_CITAS_EJEMPLO.map(c => ({
    ...c,
    start: new Date(c.start),
    end: new Date(c.end)
  }));
  persistCitas(citasInicialesConFechasDate);
  return citasInicialesConFechasDate;
};

// ✅ CORRECCIÓN 2: Esta función ahora es ASÍNCRONA para poder llamar a la API
export const fetchServiciosDisponiblesParaCitas = async () => {
  let serviciosActivos = [];
  try {
    // Llama a la función de la API y espera la respuesta
    const response = await getServicios({ estado: true }); // Pedimos solo los activos
    const adminServicios = response?.data || [];

    if (adminServicios && adminServicios.length > 0) {
      // La API ya debería devolver solo los activos, pero un filtro extra no hace daño
      serviciosActivos = adminServicios.filter(s => s.estado === true && s.duracionEstimadaMin);
    }
  } catch (e) {
    console.warn("No se pudieron cargar servicios desde la API. Usando datos de fallback si es necesario.", e);
  }

  if (serviciosActivos.length > 0) {
    return serviciosActivos.map(s => ({
      ...s,
      id: s.idServicio, // Aseguramos que el id se llame 'id' para consistencia
      duracion_estimada: parseInt(s.duracionEstimadaMin) || 30,
      precio: parseFloat(s.precio) || 0,
    }));
  }
  
  console.warn("No hay servicios de admin activos con duración. Usando fallback de ejemplo para Citas.");
  return [{ id: "sdefault", nombre: "Servicio Ejemplo (Fallback Citas)", precio: 40000, duracion_estimada: 45, estado: "Activo" }];
};

// El resto de tus funciones que dependen de datos locales se mantienen igual por ahora...
// (El resto del código desde fetchEmpleadosDisponiblesParaCitas hacia abajo no necesita cambios inmediatos
// para solucionar ESTE error en particular, pero saveCita sí debe ser adaptada).

export const fetchEmpleadosDisponiblesParaCitas = () => {
  // ... (código sin cambios)
};

const obtenerDiasDeSemanaEntre = (inicio, fin) => {
    // ... (código sin cambios)
};
  
export const generarEventosDisponibles = () => {
    // ... (código sin cambios)
};

// ✅ CORRECCIÓN 3: Esta función también debe ser ASÍNCRONA porque llama a una función async
export const saveCita = async (citaData, existingCitasAgendadas) => {
  if (!citaData.cliente?.trim()) throw new Error("El nombre del cliente es obligatorio.");
  if (!citaData.empleadoId) throw new Error("Debe seleccionar un empleado.");
  if (!citaData.servicio || citaData.servicio.length === 0) throw new Error("Debe seleccionar al menos un servicio.");
  if (!citaData.start) throw new Error("La fecha y hora de inicio de la cita son obligatorias.");

  // Ahora se usa 'await' porque la función es asíncrona
  const serviciosDisponibles = await fetchServiciosDisponiblesParaCitas();
  let duracionTotalMinutos = 0;
  let precioTotalCalculado = 0;
  
  const serviciosSeleccionadosDetalle = citaData.servicio.map(nombreServicio => {
    const servicioInfo = serviciosDisponibles.find(s => s.nombre === nombreServicio);
    if (servicioInfo) {
      duracionTotalMinutos += parseInt(servicioInfo.duracion_estimada) || 30;
      precioTotalCalculado += parseFloat(servicioInfo.precio) || 0;
      return {
        id: servicioInfo.id,
        nombre: servicioInfo.nombre,
        precio: parseFloat(servicioInfo.precio) || 0,
        duracion_estimada: parseInt(servicioInfo.duracion_estimada) || 30,
      };
    }
    console.warn(`Servicio con nombre "${nombreServicio}" no encontrado durante el guardado de la cita.`);
    return null;
  }).filter(s => s !== null);

  if (serviciosSeleccionadosDetalle.length !== citaData.servicio.length) {
     throw new Error("Algunos servicios seleccionados no se pudieron procesar. Verifique la disponibilidad y reintente.");
  }
  if (serviciosSeleccionadosDetalle.length === 0) {
     throw new Error("No se procesaron servicios válidos para la cita.");
  }

  const fechaInicioCita = moment(citaData.start);
  const fechaFinCalculada = fechaInicioCita.clone().add(duracionTotalMinutos, "minutes").toDate();

  const solapamiento = existingCitasAgendadas.some(
    (cita) =>
      cita.id !== citaData.id &&
      parseInt(cita.empleadoId) === parseInt(citaData.empleadoId) &&
      cita.estadoCita !== "Cancelada" &&
      (
        moment(fechaInicioCita).isBetween(moment(cita.start),moment(cita.end),undefined,"[)") ||
        moment(fechaFinCalculada).isBetween(moment(cita.start),moment(cita.end),undefined,"(]") ||
        (
          moment(cita.start).isSameOrAfter(fechaInicioCita) && 
          moment(cita.end).isSameOrBefore(moment(fechaFinCalculada))
        )
      )
  );

  if (solapamiento) {
    throw new Error("El empleado ya tiene una cita agendada que se solapa con este horario.");
  }
  
  const empleadoInfo = fetchEmpleadosDisponiblesParaCitas().find(e => e.id === parseInt(citaData.empleadoId));

  const citaParaGuardar = {
    id: citaData.id || Date.now(),
    cliente: citaData.cliente.trim(),
    empleadoId: parseInt(citaData.empleadoId),
    empleado: empleadoInfo?.nombre || "Empleado Desconocido",
    start: fechaInicioCita.toDate(),
    end: fechaFinCalculada,
    servicios: serviciosSeleccionadosDetalle,
    precioTotal: precioTotalCalculado,
    estadoCita: citaData.id ? (citaData.estadoCita || "Programada") : "Programada",
    tipo: "cita",
    title: `${citaData.cliente.trim()} - ${serviciosSeleccionadosDetalle.map(s => s.nombre).join(", ")} (${empleadoInfo?.nombre || 'N/A'})`,
    notasCancelacion: citaData.id && citaData.estadoCita === "Cancelada" ? citaData.notasCancelacion : undefined,
  };
  
  let nuevasCitas;
  if (citaData.id) {
    nuevasCitas = existingCitasAgendadas.map(c => c.id === citaData.id ? citaParaGuardar : c);
  } else {
    nuevasCitas = [...existingCitasAgendadas, citaParaGuardar];
  }

  persistCitas(nuevasCitas);
  return citaParaGuardar;
};


export const deleteCitaById = (citaId) => {
    // ... (código sin cambios)
};
  
export const cambiarEstadoCita = (citaId, nuevoEstado, notas = "") => {
    // ... (código sin cambios)
};

export const fetchClientesParaCitas = () => {
    // ... (código sin cambios)
};