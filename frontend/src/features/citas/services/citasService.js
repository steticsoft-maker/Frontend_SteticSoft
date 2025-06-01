// src/features/citas/services/citasService.js
import moment from "moment";
import {
  fetchHorarios,
  getEmpleadosParaHorarios as fetchEmpleadosConHorarioConfigurado,
} from "../../novedades/services/horariosService"; // Asegúrate que la ruta sea correcta
import { getClientesParaVenta } from "../../ventas/services/ventasService"; // Asegúrate que la ruta sea correcta
import { fetchServiciosAdmin } from "../../serviciosAdmin/services/serviciosAdminService"; // Asegúrate que la ruta sea correcta

const CITAS_STORAGE_KEY = "citas_steticsoft_v2";

// Datos iniciales de ejemplo (si localStorage está vacío)
// Estos datos deben tener IDs de empleado y servicio que realmente existan en tus otros módulos
// o en los datos de ejemplo de esos módulos.
const INITIAL_CITAS_EJEMPLO = [
  {
    id: 1,
    start: moment().startOf('day').add(1, 'days').set({ hour: 10, minute: 0, second: 0 }).toDate(),
    end: moment().startOf('day').add(1, 'days').set({ hour: 11, minute: 0, second: 0 }).toDate(), // Duración 1 hora
    tipo: "cita",
    cliente: "Maria Lucía Peña",
    empleadoId: 1, // Ejemplo: ID de un empleado existente
    empleado: "Ana Pérez", // Nombre del empleado con ID 1
    servicios: [{ id: "s1", nombre: "Corte Dama", precio: 50000, duracion_estimada: 60 }], // duracion_estimada en minutos
    precioTotal: 50000,
    estadoCita: "Programada", // Ej: Programada, Completada, Cancelada, En proceso
    title: "Maria Lucía Peña - Corte Dama (Ana Pérez)", // Se reconstruye en saveCita
  },
  {
    id: 2,
    start: moment().startOf('day').add(2, 'days').set({ hour: 14, minute: 30, second: 0 }).toDate(),
    end: moment().startOf('day').add(2, 'days').set({ hour: 15, minute: 30, second: 0 }).toDate(), // Duración 1 hora
    tipo: "cita",
    cliente: "Juan Gabriel Díaz",
    empleadoId: 2, // Ejemplo: ID de otro empleado existente
    empleado: "Carlos López", // Nombre del empleado con ID 2
    servicios: [{ id: "s2", nombre: "Masaje Relajante", precio: 80000, duracion_estimada: 60 }],
    precioTotal: 80000,
    estadoCita: "En proceso",
    title: "Juan Gabriel Díaz - Masaje Relajante (Carlos López)",
  }
];

const persistCitas = (citas) => {
  localStorage.setItem(CITAS_STORAGE_KEY, JSON.stringify(citas.map(c => ({
    ...c,
    // Asegurar que las fechas se guarden en un formato serializable estándar
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
        start: moment(cita.start).toDate(), // Convertir de ISOString a Date
        end: moment(cita.end).toDate(),   // Convertir de ISOString a Date
      }));
    } catch (e) {
      console.error("Error parsing citas from localStorage", e);
      localStorage.removeItem(CITAS_STORAGE_KEY); // Limpiar si está corrupto
    }
  }
  // Si no hay nada, o si hubo error, inicializar con ejemplos
  const citasInicialesConFechasDate = INITIAL_CITAS_EJEMPLO.map(c => ({
    ...c,
    start: new Date(c.start),
    end: new Date(c.end)
  }));
  persistCitas(citasInicialesConFechasDate); // Guardar los iniciales correctamente formateados
  return citasInicialesConFechasDate;
};

export const fetchServiciosDisponiblesParaCitas = () => {
  let serviciosActivos = [];
  try {
    // Asumimos que fetchServiciosAdmin devuelve todos los servicios
    const adminServicios = fetchServiciosAdmin();
    if (adminServicios && adminServicios.length > 0) {
      // Filtrar servicios activos y que tengan duración estimada
      serviciosActivos = adminServicios.filter(s => s.estado === "Activo" && s.duracion_estimada);
    }
  } catch (e) {
    console.warn("No se pudieron cargar servicios desde serviciosAdminService. Usando datos de fallback si es necesario.", e);
  }

  if (serviciosActivos.length > 0) {
    return serviciosActivos.map(s => ({
      ...s,
      // Asegurar que precio y duración sean números
      precio: parseFloat(s.precio) || 0,
      duracion_estimada: parseInt(s.duracion_estimada) || 30 // Fallback a 30 min si no está definido
    }));
  }
  
  console.warn("No hay servicios de admin activos con duración. Usando fallback de ejemplo para Citas.");
  return [{ id: "sdefault", nombre: "Servicio Ejemplo (Fallback Citas)", precio: 40000, duracion_estimada: 45, estado: "Activo" }];
};

export const fetchEmpleadosDisponiblesParaCitas = () => {
  try {
    // Asumimos que esta función devuelve empleados que tienen configuración de horario
    const empleados = fetchEmpleadosConHorarioConfigurado(); 
    return empleados.filter(e => e && !e.anulado); // Filtrar empleados no anulados/activos
  } catch (e) {
    console.error("Error al cargar empleados para citas desde horariosService", e);
    return []; // Devolver vacío en caso de error
  }
};

const obtenerDiasDeSemanaEntre = (inicio, fin) => {
  const dias = [];
  let actual = moment(inicio).startOf("day");
  const fechaFinMoment = moment(fin).endOf("day");
  while (actual.isSameOrBefore(fechaFinMoment)) {
    dias.push(moment(actual)); // Guardar como objeto moment
    actual.add(1, "day");
  }
  return dias;
};

export const generarEventosDisponibles = () => {
  const empleados = fetchEmpleadosDisponiblesParaCitas();
  const horariosDefinidos = fetchHorarios().filter((h) => h.estado === true); // Solo horarios activos
  const citasAgendadas = fetchCitasAgendadas();

  const eventosDisponibles = [];
  const hoy = moment(); // Para no generar slots en el pasado inmediato
  const rangoSemanasGeneracion = moment().add(4, "weeks"); // Generar slots para las próximas 4 semanas

  if (empleados.length === 0) {
    // console.warn("[CitasService] No hay empleados disponibles para generar slots de citas.");
    return [];
  }
  if (horariosDefinidos.length === 0) {
    // console.warn("[CitasService] No hay horarios de trabajo definidos activos para generar slots.");
    return [];
  }

  empleados.forEach((empleado) => {
    // Filtrar horarios específicos para este empleado y que estén activos
    const horariosParaEsteEmpleado = horariosDefinidos.filter(
      (h) => parseInt(h.empleadoId) === empleado.id && h.estado === true
    );

    horariosParaEsteEmpleado.forEach((configHorario) => {
      // Determinar el rango de fechas para generar slots para esta configuración de horario
      const inicioRangoHorario = moment.max(hoy.clone().startOf('day'), moment(configHorario.fechaInicio));
      const finRangoHorario = moment.min(rangoSemanasGeneracion, moment(configHorario.fechaFin));
      
      const diasDelPeriodo = obtenerDiasDeSemanaEntre(inicioRangoHorario, finRangoHorario);

      diasDelPeriodo.forEach((diaCalendario) => {
        const diaSemanaCalendario = diaCalendario.format("dddd").toLowerCase(); // ej: "lunes"
        
        // Encontrar la configuración para este día de la semana en el horario del empleado
        const horarioDia = configHorario.dias.find(
          (d) => d.dia.toLowerCase() === diaSemanaCalendario
        );

        if (horarioDia && horarioDia.trabaja) { // Si el empleado trabaja este día
          const fechaHoraInicioTrabajo = moment(diaCalendario).set({
            hour: parseInt(horarioDia.horaInicio.split(":")[0]),
            minute: parseInt(horarioDia.horaInicio.split(":")[1]),
            second: 0
          });
          const fechaHoraFinTrabajo = moment(diaCalendario).set({
            hour: parseInt(horarioDia.horaFin.split(":")[0]),
            minute: parseInt(horarioDia.horaFin.split(":")[1]),
            second: 0
          });

          let slotActualInicio = moment(fechaHoraInicioTrabajo);

          while (slotActualInicio.isBefore(fechaHoraFinTrabajo)) {
            const slotActualFin = moment(slotActualInicio).add(30, "minutes"); // Slots de 30 minutos
            if (slotActualFin.isAfter(fechaHoraFinTrabajo)) break; // No exceder la hora de fin de trabajo

            // Verificar si el slot está ocupado por una cita existente para este empleado
            const ocupado = citasAgendadas.some(
              (cita) =>
                parseInt(cita.empleadoId) === empleado.id &&
                cita.estadoCita !== "Cancelada" && // Las citas canceladas no ocupan slot
                (moment(slotActualInicio).isBetween(moment(cita.start), moment(cita.end), undefined, '[)') || // Inicio del slot dentro de una cita
                 moment(slotActualFin).isBetween(moment(cita.start), moment(cita.end), undefined, '(]') ||   // Fin del slot dentro de una cita
                 (moment(cita.start).isBetween(moment(slotActualInicio), moment(slotActualFin), undefined, '[)'))) // Cita contenida en el slot
            );
            
            // Asegurar que el slot no sea en el pasado (comparando con la hora actual)
            if (!ocupado && slotActualInicio.isSameOrAfter(hoy, 'minute')) {
              eventosDisponibles.push({
                id: `disponible-${empleado.id}-${slotActualInicio.valueOf()}`, // ID único para el slot
                title: `Disponible - ${empleado.nombre}`,
                start: slotActualInicio.toDate(),
                end: slotActualFin.toDate(),
                tipo: "disponible",
                empleadoId: empleado.id, // ID del empleado para este slot
                resource: { empleadoId: empleado.id }, // Para react-big-calendar si se usan resources
              });
            }
            slotActualInicio.add(30, "minutes"); // Avanzar al siguiente slot
          }
        }
      });
    });
  });
  return eventosDisponibles;
};
export const saveCita = (citaData, existingCitasAgendadas) => {
  // Validaciones básicas
  if (!citaData.cliente?.trim()) throw new Error("El nombre del cliente es obligatorio.");
  if (!citaData.empleadoId) throw new Error("Debe seleccionar un empleado.");
  if (!citaData.servicio || citaData.servicio.length === 0) throw new Error("Debe seleccionar al menos un servicio.");
  if (!citaData.start) throw new Error("La fecha y hora de inicio de la cita son obligatorias.");

  const serviciosDisponibles = fetchServiciosDisponiblesParaCitas();
  let duracionTotalMinutos = 0;
  let precioTotalCalculado = 0;
  
  const serviciosSeleccionadosDetalle = citaData.servicio.map(nombreServicio => {
    const servicioInfo = serviciosDisponibles.find(s => s.nombre === nombreServicio);
    if (servicioInfo) {
      duracionTotalMinutos += parseInt(servicioInfo.duracion_estimada) || 30; // Sumar duración
      precioTotalCalculado += parseFloat(servicioInfo.precio) || 0; // Sumar precio
      return { // Guardar detalle del servicio en la cita
        id: servicioInfo.id || `serv-${nombreServicio.replace(/\s+/g, '')}`, // ID del servicio
        nombre: servicioInfo.nombre,
        precio: parseFloat(servicioInfo.precio) || 0,
        duracion_estimada: parseInt(servicioInfo.duracion_estimada) || 30,
      };
    }
    console.warn(`Servicio con nombre "${nombreServicio}" no encontrado durante el guardado de la cita.`);
    return null; // Marcar para filtrar si no se encuentra
  }).filter(s => s !== null); // Eliminar nulos si algún servicio no se encontró

  if (serviciosSeleccionadosDetalle.length !== citaData.servicio.length) {
      throw new Error("Algunos servicios seleccionados no se pudieron procesar. Verifique la disponibilidad y reintente.");
  }
  if (serviciosSeleccionadosDetalle.length === 0) { // Si después de filtrar no queda ninguno
      throw new Error("No se procesaron servicios válidos para la cita.");
  }

  const fechaInicioCita = moment(citaData.start);
  const fechaFinCalculada = fechaInicioCita.clone().add(duracionTotalMinutos, "minutes").toDate();

  // Verificación de solapamiento con otras citas del mismo empleado (excluyendo citas canceladas)
  const solapamiento = existingCitasAgendadas.some(
    (cita) =>
      cita.id !== citaData.id && // No comparar consigo misma si es una edición
      parseInt(cita.empleadoId) === parseInt(citaData.empleadoId) &&
      cita.estadoCita !== "Cancelada" && // Ignorar citas canceladas para solapamiento
      ( // Abre el grupo de condiciones OR
        moment(fechaInicioCita).isBetween(moment(cita.start),moment(cita.end),undefined,"[)") ||
        moment(fechaFinCalculada).isBetween(moment(cita.start),moment(cita.end),undefined,"(]") ||
        ( // Abre el grupo de condiciones AND anidado
            moment(cita.start).isSameOrAfter(fechaInicioCita) && 
            moment(cita.end).isSameOrBefore(moment(fechaFinCalculada))
        ) // Cierra el grupo de condiciones AND anidado
      ) // Cierra el grupo de condiciones OR
      // ANTERIORMENTE AQUÍ HABÍA DOS PARÉNTESIS EXTRA: )))), AHORA ES )))
  );

  if (solapamiento) {
    throw new Error("El empleado ya tiene una cita agendada que se solapa con este horario.");
  }
  
  const empleadoInfo = fetchEmpleadosDisponiblesParaCitas().find(e => e.id === parseInt(citaData.empleadoId));

  const citaParaGuardar = {
    id: citaData.id || Date.now(), // ID nuevo si es creación, existente si es edición
    cliente: citaData.cliente.trim(),
    empleadoId: parseInt(citaData.empleadoId),
    empleado: empleadoInfo?.nombre || "Empleado Desconocido", // Nombre del empleado
    start: fechaInicioCita.toDate(), // Guardar como objeto Date
    end: fechaFinCalculada,       // Guardar como objeto Date
    servicios: serviciosSeleccionadosDetalle, // Array de objetos servicio
    precioTotal: precioTotalCalculado,
    estadoCita: citaData.id ? (citaData.estadoCita || "Programada") : "Programada",
    tipo: "cita", // Para diferenciar en el calendario si es necesario
    title: `${citaData.cliente.trim()} - ${serviciosSeleccionadosDetalle.map(s => s.nombre).join(", ")} (${empleadoInfo?.nombre || 'N/A'})`,
    notasCancelacion: citaData.id && citaData.estadoCita === "Cancelada" ? citaData.notasCancelacion : undefined,
  };
  
  let nuevasCitas;
  if (citaData.id) { // Si es una edición
    nuevasCitas = existingCitasAgendadas.map(c => c.id === citaData.id ? citaParaGuardar : c);
  } else { // Si es una creación
    nuevasCitas = [...existingCitasAgendadas, citaParaGuardar];
  }

  persistCitas(nuevasCitas);
  return citaParaGuardar; // Devolver la cita guardada/actualizada
};

export const deleteCitaById = (citaId) => {
  const existingCitasAgendadas = fetchCitasAgendadas();
  const citaAEliminar = existingCitasAgendadas.find((c) => c.id === citaId);
  if (!citaAEliminar) {
    throw new Error(`No se encontró la cita con ID ${citaId} para eliminar.`);
  }
  // Opcional: Podrías cambiar el estado a "Eliminada" en lugar de borrarla físicamente
  // o verificar si la cita ya pasó, etc. Por ahora, la eliminamos.
  const updatedCitas = existingCitasAgendadas.filter((c) => c.id !== citaId);
  persistCitas(updatedCitas);
  return updatedCitas;  // Devuelve la lista actualizada
};

export const cambiarEstadoCita = (citaId, nuevoEstado, notas = "") => {
  let citas = fetchCitasAgendadas();
  const citaIndex = citas.findIndex((c) => c.id === citaId);

  if (citaIndex > -1) {
    citas[citaIndex].estadoCita = nuevoEstado;
    if (nuevoEstado === "Cancelada") {
      citas[citaIndex].notasCancelacion = notas || "Cancelada por el sistema";
      // Opcional: podrías querer liberar el slot o hacer otras lógicas aquí
    } else {
      // Si se cambia a otro estado, podríamos querer limpiar las notas de cancelación
      delete citas[citaIndex].notasCancelacion;
    }
    persistCitas(citas);
    return citas[citaIndex]; // Devuelve la cita actualizada
  }
  throw new Error("Cita no encontrada para cambiar estado.");
};

// Función para obtener clientes (ejemplo, adaptar a tu sistema)
export const fetchClientesParaCitas = () => {
    try {
        // Suponiendo que getClientesParaVenta devuelve un array de objetos cliente {id, nombre, ...}
        const clientes = getClientesParaVenta(); 
        return clientes.map(c => ({ value: c.nombre, label: c.nombre, id: c.id })); // Adaptar al formato que necesite react-select o tu input

    } catch (e) {
        console.error("Error al cargar clientes para citas:", e);
        return [];
    }
};