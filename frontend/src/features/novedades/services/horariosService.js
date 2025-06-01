// src/features/novedades/services/horariosService.js
const HORARIOS_STORAGE_KEY = "horarios_empleados_steticsoft";
// Clave correcta para obtener los usuarios que pueden ser empleados
const USUARIOS_STORAGE_KEY = "usuarios_steticsoft";

// Ejemplo de empleados iniciales (SOLO COMO RESPALDO si localStorage está vacío la primera vez)
// Lo ideal es que los usuarios/empleados ya existan desde el módulo de Usuarios.
const INITIAL_EMPLEADOS_EJEMPLO_PARA_HORARIOS = [
    { id: 1, nombre: "Ana Pérez", rol: "Empleado", estado: true }, // Asegúrate que los IDs coincidan con los usados en horarios
    { id: 2, nombre: "Carlos López", rol: "Empleado", estado: true },
    // ... más empleados de ejemplo si es necesario
];

const INITIAL_HORARIOS_EJEMPLO = [
  {
    id: 1,
    empleadoId: 1, // ID de Ana Pérez
    fechaInicio: "2025-06-01",
    fechaFin: "2025-06-30",
    dias: [
      { dia: "Lunes", horaInicio: "09:00", horaFin: "17:00" },
      { dia: "Martes", horaInicio: "09:00", horaFin: "17:00" },
    ],
    estado: true,
  },
  {
    id: 2,
    empleadoId: 2, // ID de Carlos López
    fechaInicio: "2025-07-01",
    fechaFin: "2025-07-31",
    dias: [{ dia: "Miércoles", horaInicio: "10:00", horaFin: "18:00" }],
    estado: false,
  },
];

export const fetchHorarios = () => {
  const stored = localStorage.getItem(HORARIOS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error parsing horarios from localStorage", e);
      localStorage.removeItem(HORARIOS_STORAGE_KEY);
    }
  }
  persistHorarios(INITIAL_HORARIOS_EJEMPLO);
  return INITIAL_HORARIOS_EJEMPLO;
};

const persistHorarios = (horarios) => {
  localStorage.setItem(HORARIOS_STORAGE_KEY, JSON.stringify(horarios));
};

export const getEmpleadosParaHorarios = () => {
  const storedUsuarios = localStorage.getItem(USUARIOS_STORAGE_KEY);
  let empleados = [];
  console.log("Stored usuarios (raw from localStorage):", storedUsuarios); // Log 1

  if (storedUsuarios) {
    try {
      const usuarios = JSON.parse(storedUsuarios);
      console.log("Parsed usuarios:", JSON.stringify(usuarios, null, 2)); // Log 2

      empleados = usuarios.filter((usr) => {
        const esRolValido =
          usr.rol === "Empleado" || usr.rol === "Administrador";
        const noEstaAnulado = !usr.anulado; // o usr.estado === true, según tu lógica de estado
        // console.log(`Usuario: ${usr.nombre}, Rol: ${usr.rol}, Anulado: ${usr.anulado}, EsValido: ${esRolValido && noEstaAnulado}`); // Log 3 (opcional, puede ser mucho)
        return esRolValido && noEstaAnulado;
      });
    } catch (e) {
      console.error(
        "Error parsing usuarios from localStorage in horariosService:",
        e
      );
      return []; // Devolver vacío en caso de error de parseo
    }
  }

  console.log(
    "Empleados filtrados para horarios:",
    JSON.stringify(empleados, null, 2)
  ); // Log 4

  // Fallback si no hay empleados (para desarrollo, considera quitarlo en producción)
  if (empleados.length === 0) {
    // console.warn("No se encontraron empleados activos en localStorage. Considera agregar datos de ejemplo si es necesario para desarrollo.");
    // return INITIAL_EMPLEADOS_EJEMPLO_PARA_HORARIOS.filter(e => e.estado === true); // Esto era de la sugerencia anterior
  }
  return empleados;
};

// ... (el resto de las funciones: saveHorario, deleteHorarioById, toggleHorarioEstado)
// Tu función saveHorario ya maneja la creación de IDs y el estado por defecto.
// Las validaciones en saveHorario también son importantes.

export const saveHorario = (horarioData, existingHorarios) => {
  if (
    !horarioData.empleadoId ||
    !horarioData.fechaInicio ||
    !horarioData.fechaFin
  ) {
    throw new Error(
      "Empleado, fecha de inicio y fecha de fin son obligatorios."
    );
  }
  if (new Date(horarioData.fechaFin) < new Date(horarioData.fechaInicio)) {
    throw new Error("La fecha de fin no puede ser anterior a la fecha de inicio.");
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
    updatedHorarios = existingHorarios.map((h) =>
      h.id === horarioData.id ? { ...h, ...horarioData } : h
    );
  } else {
    const newHorario = {
      ...horarioData,
      id: Date.now(),
      estado: horarioData.estado !== undefined ? horarioData.estado : true,
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