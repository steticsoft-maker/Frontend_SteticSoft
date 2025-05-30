// src/features/citas/services/horariosService.js
const HORARIOS_STORAGE_KEY = "horarios_empleados_steticsoft"; // Usar la misma clave que en Citas.jsx original: "horarios"

// Asumimos que los empleados se obtienen de otra parte (ej. localStorage o un servicio de empleados)
// const EMPLEADOS_DISPONIBLES = JSON.parse(localStorage.getItem("empleados")) || [];
// No es necesario aquí si ConfigHorariosPage los obtiene por su cuenta para el select.

const INITIAL_HORARIOS = []; // Empezar vacío o con ejemplos si es necesario

export const fetchHorarios = () => {
  const stored = localStorage.getItem(HORARIOS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : INITIAL_HORARIOS;
};

const persistHorarios = (horarios) => {
  localStorage.setItem(HORARIOS_STORAGE_KEY, JSON.stringify(horarios));
};

// Obtener la lista de empleados para el select en el formulario de horarios
// Esta función podría estar en un empleadosService.js más adelante
export const getEmpleadosParaHorarios = () => {
  return JSON.parse(localStorage.getItem("empleados")) || []; // Simulación
};

export const saveHorario = (horarioData, existingHorarios) => {
  // Validaciones: Asegurar que los campos obligatorios están, que las horas son válidas, etc.
  if (
    !horarioData.empleadoId ||
    !horarioData.fechaInicio ||
    !horarioData.fechaFin
  ) {
    throw new Error(
      "Empleado, fecha de inicio y fecha de fin son obligatorios."
    );
  }
  if (!horarioData.dias || horarioData.dias.length === 0) {
    throw new Error("Debe definir al menos un día y horario.");
  }
  for (const dia of horarioData.dias) {
    if (!dia.dia || !dia.horaInicio || !dia.horaFin) {
      throw new Error(
        "Todos los campos de día, hora de inicio y hora de fin son obligatorios para cada horario definido."
      );
    }
    if (dia.horaInicio >= dia.horaFin) {
      throw new Error(
        `En el día ${dia.dia}, la hora de inicio debe ser anterior a la hora de fin.`
      );
    }
  }

  let updatedHorarios;
  if (horarioData.id) {
    // Editando (asumiendo que cada entrada de horario tiene un ID único)
    updatedHorarios = existingHorarios.map((h) =>
      h.id === horarioData.id ? { ...h, ...horarioData } : h
    );
  } else {
    // Creando
    const newHorario = {
      ...horarioData,
      id: Date.now(), // ID simple
      estado: horarioData.estado !== undefined ? horarioData.estado : true, // Activo por defecto
    };
    updatedHorarios = [...existingHorarios, newHorario];
  }
  persistHorarios(updatedHorarios);
  return updatedHorarios;
};

export const deleteHorarioById = (horarioId, existingHorarios) => {
  const updatedHorarios = existingHorarios.filter((h) => h.id !== horarioId);
  persistHorarios(updatedHorarios);
  return updatedHorarios;
};

export const toggleHorarioEstado = (horarioId, existingHorarios) => {
  const updatedHorarios = existingHorarios.map((h) =>
    h.id === horarioId ? { ...h, estado: !h.estado } : h
  );
  persistHorarios(updatedHorarios);
  return updatedHorarios;
};
