// src/features/citas/services/citasService.js
import moment from "moment";
import {
  fetchHorarios,
  getEmpleadosParaHorarios as fetchEmpleadosConHorarioConfigurado,
} from "../../novedades/services/horariosService";
import { getClientesParaVenta } from "../../ventas/services/ventasService"; // Asumiendo que existe y es la fuente de clientes
import { fetchServiciosAdmin } from "../../serviciosAdmin/services/serviciosAdminService"; // Fuente principal de servicios

const CITAS_STORAGE_KEY = "citas_steticsoft_v2";

// Datos iniciales de ejemplo (si localStorage está vacío)
const INITIAL_CITAS_EJEMPLO = [
  {
    id: 1,
    title: "Maria L - Corte Dama (Ana Pérez)", // El title se reconstruirá en saveCita
    start: moment().startOf('day').add(1, 'days').set({ hour: 10, minute: 0, second: 0 }).toDate(),
    end: moment().startOf('day').add(1, 'days').set({ hour: 11, minute: 0, second: 0 }).toDate(),
    tipo: "cita",
    cliente: "Maria L",
    empleadoId: 1, // Asegúrate que este ID exista en tus usuarios/empleados
    empleado: "Ana Pérez",
    servicios: [{ id: "s1", nombre: "Corte Dama", precio: 50000, duracion_estimada: 60 }],
    precioTotal: 50000,
    estadoCita: "Programada"
  },
  {
    id: 2,
    title: "Juan G - Masaje Relajante (Carlos López)",
    start: moment().startOf('day').add(2, 'days').set({ hour: 14, minute: 30, second: 0 }).toDate(),
    end: moment().startOf('day').add(2, 'days').set({ hour: 15, minute: 30, second: 0 }).toDate(),
    tipo: "cita",
    cliente: "Juan G",
    empleadoId: 2, // Asegúrate que este ID exista
    empleado: "Carlos López",
    servicios: [{ id: "s2", nombre: "Masaje Relajante", precio: 80000, duracion_estimada: 60 }],
    precioTotal: 80000,
    estadoCita: "En proceso"
  }
];

export const fetchCitasAgendadas = () => {
  const stored = localStorage.getItem(CITAS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored).map((cita) => ({
        ...cita,
        start: new Date(cita.start),
        end: new Date(cita.end),
      }));
    } catch (e) {
      console.error("Error parsing citas from localStorage", e);
      localStorage.removeItem(CITAS_STORAGE_KEY);
    }
  }
  persistCitas(INITIAL_CITAS_EJEMPLO.map(c => ({...c, start: new Date(c.start), end: new Date(c.end)})));
  return INITIAL_CITAS_EJEMPLO.map(c => ({...c, start: new Date(c.start), end: new Date(c.end)}));
};

const persistCitas = (citas) => {
  localStorage.setItem(CITAS_STORAGE_KEY, JSON.stringify(citas));
};

export const fetchServiciosDisponiblesParaCitas = () => {
  let serviciosActivos = [];
  try {
    const adminServicios = fetchServiciosAdmin();
    if (adminServicios && adminServicios.length > 0) {
      serviciosActivos = adminServicios.filter(s => s.estado === "Activo" && s.duracion_estimada);
    }
  } catch (e) {
    console.warn("No se pudieron cargar servicios desde serviciosAdminService", e);
  }

  if (serviciosActivos.length > 0) {
    return serviciosActivos.map(s => ({...s, precio: parseFloat(s.precio) || 0, duracion_estimada: parseInt(s.duracion_estimada) || 30}));
  }
  
  console.warn("No hay servicios de admin, usando fallback de ejemplo para Citas.");
  return [{ id: "sdefault", nombre: "Servicio Ejemplo Citas", precio: 40000, duracion_estimada: 45 }];
};

export const fetchEmpleadosDisponiblesParaCitas = () => {
  try {
    const empleados = fetchEmpleadosConHorarioConfigurado();
    return empleados.filter(e => e && !e.anulado);
  } catch (e) {
    console.error("Error al cargar empleados para citas desde horariosService", e);
    return [];
  }
};

const obtenerDiasDeSemanaEntre = (inicio, fin) => {
  const dias = [];
  let actual = moment(inicio).startOf("day");
  const fechaFinMoment = moment(fin).endOf("day");
  while (actual.isSameOrBefore(fechaFinMoment)) {
    dias.push(moment(actual));
    actual.add(1, "day");
  }
  return dias;
};

export const generarEventosDisponibles = () => {
  const empleados = fetchEmpleadosDisponiblesParaCitas();
  const horariosDefinidos = fetchHorarios().filter((h) => h.estado === true);
  const citasAgendadas = fetchCitasAgendadas();

  const eventosDisponibles = [];
  const hoy = moment(); // Para no generar slots en el pasado inmediato
  const rangoSemanas = moment().add(4, "weeks"); // Generar slots para las próximas 4 semanas

  if (empleados.length === 0) {
    // console.warn("[CitasService] No hay empleados disponibles para citas.");
    return [];
  }
  if (horariosDefinidos.length === 0) {
    // console.warn("[CitasService] No hay horarios de trabajo definidos activos.");
    return [];
  }

  empleados.forEach((empleado) => {
    const horariosParaEsteEmpleado = horariosDefinidos.filter(
      (h) => parseInt(h.empleadoId) === empleado.id && h.estado === true
    );

    horariosParaEsteEmpleado.forEach((configHorario) => {
      const diasDelPeriodo = obtenerDiasDeSemanaEntre(
        moment.max(hoy.clone().startOf('day'), moment(configHorario.fechaInicio)), // Empezar desde hoy o fechaInicio del horario
        moment.min(rangoSemanas, moment(configHorario.fechaFin))
      );

      diasDelPeriodo.forEach((diaCalendario) => {
        const diaSemanaCalendario = diaCalendario.format("dddd");
        const horarioDia = configHorario.dias.find(
          (d) => d.dia === diaSemanaCalendario
        );

        if (horarioDia) {
          const fechaHoraInicioBase = moment(
            `${diaCalendario.format("YYYY-MM-DD")}T${horarioDia.horaInicio}`
          );
          const fechaHoraFinBase = moment(
            `${diaCalendario.format("YYYY-MM-DD")}T${horarioDia.horaFin}`
          );
          let slotActualInicio = moment(fechaHoraInicioBase);

          while (slotActualInicio.isBefore(fechaHoraFinBase)) {
            const slotActualFin = moment(slotActualInicio).add(30, "minutes");
            if (slotActualFin.isAfter(fechaHoraFinBase)) break;

            const ocupado = citasAgendadas.some(
              (cita) =>
                parseInt(cita.empleadoId) === empleado.id &&
                (moment(slotActualInicio).isBetween(moment(cita.start), moment(cita.end), undefined, '[)') ||
                 moment(slotActualFin).isBetween(moment(cita.start), moment(cita.end), undefined, '(]') ||
                 (moment(cita.start).isBetween(moment(slotActualInicio), moment(slotActualFin), undefined, '[)')))
            );
            
            // Asegurar que el slot no sea en el pasado
            if (!ocupado && slotActualInicio.isSameOrAfter(hoy, 'minute')) {
              eventosDisponibles.push({
                id: `disponible-${empleado.id}-${slotActualInicio.valueOf()}`,
                title: `Disponible - ${empleado.nombre}`,
                start: slotActualInicio.toDate(),
                end: slotActualFin.toDate(),
                tipo: "disponible",
                empleadoId: empleado.id,
                resource: { empleadoId: empleado.id },
              });
            }
            slotActualInicio.add(30, "minutes");
          }
        }
      });
    });
  });
  return eventosDisponibles;
};

export const saveCita = (citaData, existingCitasAgendadas) => {
  if (!citaData.cliente?.trim()) throw new Error("El nombre del cliente es obligatorio.");
  if (!citaData.empleadoId) throw new Error("Debe seleccionar un empleado.");
  if (!citaData.servicio?.length) throw new Error("Debe seleccionar al menos un servicio.");
  if (!citaData.start) throw new Error("La fecha y hora de inicio de la cita son obligatorias.");

  const serviciosDisponibles = fetchServiciosDisponiblesParaCitas();
  let duracionTotalMinutos = 0;
  let precioTotalCalculado = 0;
  
  const serviciosSeleccionadosDetalle = citaData.servicio.map(nombreServicio => {
    const servicioInfo = serviciosDisponibles.find(s => s.nombre === nombreServicio);
    if (servicioInfo) {
      duracionTotalMinutos += parseInt(servicioInfo.duracion_estimada) || 30;
      precioTotalCalculado += parseFloat(servicioInfo.precio) || 0;
      return {
        id: servicioInfo.id || `serv-${nombreServicio.replace(/\s+/g, '')}`,
        nombre: servicioInfo.nombre,
        precio: parseFloat(servicioInfo.precio) || 0,
        duracion_estimada: parseInt(servicioInfo.duracion_estimada) || 30,
      };
    }
    console.warn(`Servicio con nombre "${nombreServicio}" no encontrado durante guardado.`);
    return null;
  }).filter(s => s !== null);

  if (serviciosSeleccionadosDetalle.length !== citaData.servicio.length) {
      throw new Error("Algunos servicios seleccionados no se encontraron. Verifique y reintente.");
  }
  if (serviciosSeleccionadosDetalle.length === 0) {
      throw new Error("No se procesaron servicios para la cita.");
  }

  const fechaFinCalculada = moment(citaData.start)
    .add(duracionTotalMinutos, "minutes")
    .toDate();

  const solapamiento = existingCitasAgendadas.some(
    (cita) =>
      cita.id !== citaData.id && 
      parseInt(cita.empleadoId) === parseInt(citaData.empleadoId) &&
      (moment(citaData.start).isBetween(moment(cita.start),moment(cita.end),undefined,"[)") ||
       moment(fechaFinCalculada).isBetween(moment(cita.start),moment(cita.end),undefined,"(]") ||
       (moment(cita.start).isSameOrAfter(moment(citaData.start)) && moment(cita.end).isSameOrBefore(moment(fechaFinCalculada))))
  );

  if (solapamiento) {
    throw new Error("El empleado ya tiene una cita que se solapa con este horario.");
  }
  
  const empleadoInfo = fetchEmpleadosDisponiblesParaCitas().find(e => e.id === parseInt(citaData.empleadoId));

  const citaParaGuardar = {
    id: citaData.id || Date.now(),
    cliente: citaData.cliente,
    empleadoId: parseInt(citaData.empleadoId),
    empleado: empleadoInfo?.nombre || "Empleado Desconocido",
    start: new Date(citaData.start),
    end: fechaFinCalculada,
    servicios: serviciosSeleccionadosDetalle,
    precioTotal: precioTotalCalculado,
    estadoCita: citaData.id ? (citaData.estadoCita || "Programada") : "Programada",
    tipo: "cita",
    title: `${citaData.cliente} - ${serviciosSeleccionadosDetalle.map(s => s.nombre).join(", ")} (${empleadoInfo?.nombre || 'N/A'})`,
  };
  
  let nuevasCitas;
  if (citaData.id) {
    nuevasCitas = existingCitasAgendadas.map(c => c.id === citaData.id ? citaParaGuardar : c);
  } else {
    nuevasCitas = [...existingCitasAgendadas, citaParaGuardar];
  }

  persistCitas(nuevasCitas);
  return nuevasCitas;
};

export const deleteCitaById = (citaId, existingCitasAgendadas) => {
  const updatedCitas = existingCitasAgendadas.filter((c) => c.id !== citaId);
  persistCitas(updatedCitas);
  return updatedCitas;
};

export const cambiarEstadoCita = (citaId, nuevoEstado, notas = "") => {
  let citas = fetchCitasAgendadas();
  const citaIndex = citas.findIndex(c => c.id === citaId);

  if (citaIndex > -1) {
    citas[citaIndex].estadoCita = nuevoEstado;
    if (nuevoEstado === "Cancelada" && notas) {
      citas[citaIndex].notasCancelacion = notas;
    }
    persistCitas(citas);
    return citas;
  }
  throw new Error("Cita no encontrada para cambiar estado.");
};