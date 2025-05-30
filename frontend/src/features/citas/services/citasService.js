// src/features/citas/services/citasService.js
import moment from "moment"; // Necesitarás moment
// src/features/citas/services/citasService.js
import {
  fetchHorarios,
  getEmpleadosParaHorarios as fetchEmpleados,
} from "../../novedades/services/horariosService";

const CITAS_STORAGE_KEY = "citas_steticsoft"; // Usar la misma clave que en Citas.jsx original: "citas"
const SERVICIOS_STORAGE_KEY = "servicios_admin_steticsoft_v2"; // Clave de servicios admin

export const fetchCitasAgendadas = () => {
  const stored = localStorage.getItem(CITAS_STORAGE_KEY);
  return stored
    ? JSON.parse(stored).map((cita) => ({
        ...cita,
        start: new Date(cita.start), // Convertir a Date objects
        end: new Date(cita.end),
      }))
    : [];
};

const persistCitas = (citas) => {
  localStorage.setItem(CITAS_STORAGE_KEY, JSON.stringify(citas));
};

export const fetchServiciosDisponiblesParaCitas = () => {
  const stored = localStorage.getItem(SERVICIOS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored).filter((s) => s.estado === "Activo");
    } catch (e) {
      return [];
    }
  }
  return [];
};

export const fetchEmpleadosDisponiblesParaCitas = () => {
  return fetchEmpleados().filter((e) => e.estado === true); // Asumiendo que empleados tienen 'estado'
};

const obtenerDiasDeSemanaEntre = (inicio, fin) => {
  const dias = [];
  let actual = moment(inicio).startOf("day"); // Asegurar que empezamos al inicio del día
  const fechaFin = moment(fin).endOf("day"); // Asegurar que comparamos hasta el final del día
  while (actual.isSameOrBefore(fechaFin)) {
    // Usar isSameOrBefore para incluir el último día
    // Excluir fines de semana (0 = Domingo, 6 = Sábado)
    // if (actual.day() !== 0 && actual.day() !== 6) {
    dias.push(moment(actual)); // Incluir todos los días por ahora, el filtro de horario lo refinará
    // }
    actual.add(1, "day");
  }
  return dias;
};

export const generarEventosDisponibles = () => {
  const empleados = fetchEmpleadosDisponiblesParaCitas(); // Empleados activos
  const horariosDefinidos = fetchHorarios().filter((h) => h.estado === true); // Horarios activos
  const citasAgendadas = fetchCitasAgendadas();
  const servicios = fetchServiciosDisponiblesParaCitas();

  const eventosDisponibles = [];
  const hoy = moment();
  const dosSemanasDespues = moment().add(2, "weeks");

  empleados.forEach((empleado) => {
    const horariosParaEsteEmpleado = horariosDefinidos.filter(
      (h) => parseInt(h.empleadoId) === empleado.id
    );

    horariosParaEsteEmpleado.forEach((configHorario) => {
      const diasDelPeriodo = obtenerDiasDeSemanaEntre(
        moment.max(hoy, moment(configHorario.fechaInicio)), // No generar para días pasados del periodo
        moment.min(dosSemanasDespues, moment(configHorario.fechaFin)) // No generar más allá del periodo o 2 semanas
      );

      diasDelPeriodo.forEach((diaCalendario) => {
        const diaSemanaCalendario = diaCalendario.format("dddd").toLowerCase();
        const horarioDia = configHorario.dias.find(
          (d) => d.dia.toLowerCase() === diaSemanaCalendario
        );

        if (horarioDia) {
          const fechaHoraInicio = moment(
            `<span class="math-inline">\{diaCalendario\.format\("YYYY\-MM\-DD"\)\}T</span>{horarioDia.horaInicio}`
          );
          const fechaHoraFin = moment(
            `<span class="math-inline">\{diaCalendario\.format\("YYYY\-MM\-DD"\)\}T</span>{horarioDia.horaFin}`
          );
          let slotActualInicio = moment(fechaHoraInicio);

          while (slotActualInicio.isBefore(fechaHoraFin)) {
            const slotActualFin = moment(slotActualInicio).add(30, "minutes"); // Duración base del slot
            if (slotActualFin.isAfter(fechaHoraFin)) break; // No exceder el horario del empleado

            // Verificar si este slot está ocupado por una cita ya agendada para este empleado
            const ocupado = citasAgendadas.some(
              (cita) =>
                (parseInt(cita.empleadoId) === empleado.id &&
                  moment(slotActualInicio).isBetween(
                    moment(cita.start).subtract(1, "minute"),
                    moment(cita.end).add(1, "minute"),
                    undefined,
                    "()"
                  )) || // Solapamiento parcial
                moment(slotActualFin).isBetween(
                  moment(cita.start).subtract(1, "minute"),
                  moment(cita.end).add(1, "minute"),
                  undefined,
                  "()"
                ) ||
                (moment(slotActualInicio).isSameOrBefore(moment(cita.start)) &&
                  moment(slotActualFin).isSameOrAfter(moment(cita.end)))
            );

            if (!ocupado && slotActualInicio.isSameOrAfter(hoy)) {
              // Solo slots futuros
              eventosDisponibles.push({
                id: `disponible-<span class="math-inline">\{empleado\.id\}\-</span>{slotActualInicio.format()}`,
                title: `Disponible - ${empleado.nombre}`,
                start: slotActualInicio.toDate(),
                end: slotActualFin.toDate(),
                tipo: "disponible",
                empleadoId: empleado.id, // Para el modal
                resource: { empleadoId: empleado.id }, // Para el onSelectSlot
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

export const saveCita = (nuevaCitaData, existingCitasAgendadas) => {
  // Validaciones
  if (
    !nuevaCitaData.cliente ||
    !nuevaCitaData.empleadoId ||
    !nuevaCitaData.servicio?.length ||
    !nuevaCitaData.start
  ) {
    throw new Error(
      "Por favor, completa todos los campos: Cliente, Empleado, Servicio(s) y Horario."
    );
  }

  const serviciosData = fetchServiciosDisponiblesParaCitas();
  const duracionTotal = nuevaCitaData.servicio.reduce(
    (total, nombreServicio) => {
      const servicio = serviciosData.find((s) => s.nombre === nombreServicio);
      return total + (parseInt(servicio?.duracion_estimada) || 30); // Asumir 30 min si no hay duración
    },
    0
  );

  const fechaFinCalculada = moment(nuevaCitaData.start)
    .add(duracionTotal, "minutes")
    .toDate();

  // Validar solapamiento
  const solapamiento = existingCitasAgendadas.some(
    (cita) =>
      cita.empleadoId === nuevaCitaData.empleadoId &&
      (moment(nuevaCitaData.start).isBetween(
        moment(cita.start),
        moment(cita.end),
        undefined,
        "[)"
      ) || // El nuevo inicio está dentro de una cita existente
        moment(fechaFinCalculada).isBetween(
          moment(cita.start),
          moment(cita.end),
          undefined,
          "(]"
        ) || // El nuevo fin está dentro de una cita existente
        moment(cita.start).isBetween(
          moment(nuevaCitaData.start),
          moment(fechaFinCalculada),
          undefined,
          "[)"
        )) // Una cita existente está contenida en el nuevo slot
  );

  if (solapamiento) {
    throw new Error(
      "El empleado ya tiene una cita programada que se solapa con este horario."
    );
  }

  // Validar que el slot esté dentro de un horario disponible (esto es más complejo y se simplifica asumiendo que el slot se seleccionó de `eventosDisponibles`)
  // En una implementación real, el backend haría una validación final.

  const newId =
    existingCitasAgendadas.length > 0
      ? Math.max(...existingCitasAgendadas.map((c) => c.id || 0)) + 1
      : 1;
  const empleadoSeleccionado = fetchEmpleados().find(
    (e) => e.id === nuevaCitaData.empleadoId
  );

  const citaAGuardar = {
    ...nuevaCitaData,
    id: newId,
    title: `${nuevaCitaData.cliente} - ${nuevaCitaData.servicio.join(", ")} - ${
      empleadoSeleccionado?.nombre || "Empleado no encontrado"
    }`,
    end: fechaFinCalculada, // Usar la fecha de fin calculada
    tipo: "cita",
    // empleado: ya viene en nuevaCitaData.empleado (nombre)
  };

  const nuevasCitas = [...existingCitasAgendadas, citaAGuardar];
  persistCitas(nuevasCitas);
  return nuevasCitas; // Devolver solo las citas agendadas para luego combinar con disponibles
};

export const deleteCitaById = (citaId, existingCitasAgendadas) => {
  const updatedCitas = existingCitasAgendadas.filter((c) => c.id !== citaId);
  persistCitas(updatedCitas);
  return updatedCitas;
};
