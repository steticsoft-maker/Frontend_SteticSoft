// src/features/serviciosAdmin/services/serviciosAdminService.js
import { fetchCategoriasServicio } from '../../categoriasServicioAdmin/services/categoriasServicioService'; // Para las categorías

const SERVICIOS_STORAGE_KEY = 'servicios_admin_steticsoft_v2'; // Nueva clave para evitar conflictos con la vieja 'servicios'

// Datos iniciales de ejemplo si localStorage está vacío
const INITIAL_SERVICIOS = [
    { id: 1, nombre: "Corte de Dama", precio: 50000, categoria: "Peluquería", estado: "Activo", imagenURL: null, descripcion: "Corte moderno y personalizado." },
    { id: 2, nombre: "Manicura Clásica", precio: 25000, categoria: "Uñas", estado: "Activo", imagenURL: null, descripcion: "Limpieza y esmaltado tradicional." },
    { id: 3, nombre: "Masaje Relajante", precio: 80000, categoria: "Corporales", estado: "Inactivo", imagenURL: null, descripcion: "Masaje para aliviar el estrés." },
];

export const fetchServiciosAdmin = () => {
  const stored = localStorage.getItem(SERVICIOS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error parsing serviciosAdmin from localStorage", e);
      localStorage.removeItem(SERVICIOS_STORAGE_KEY); // Limpiar si está corrupto
    }
  }
  // Si no hay nada o estaba corrupto, guardar y devolver los iniciales
  persistServiciosAdmin(INITIAL_SERVICIOS);
  return INITIAL_SERVICIOS;
};

const persistServiciosAdmin = (servicios) => {
  localStorage.setItem(SERVICIOS_STORAGE_KEY, JSON.stringify(servicios));
};

// Obtener categorías activas para el select del formulario de servicios
export const getActiveCategoriasServicioForSelect = () => {
  const todasCategorias = fetchCategoriasServicio(); // Usa el servicio de categorías de servicio
  return todasCategorias.filter(cat => cat.estado === "Activo").map(cat => cat.nombre);
};

export const saveServicioAdmin = (servicioData, existingServicios) => {
  // Validaciones
  if (!servicioData.nombre?.trim()) {
    throw new Error("El nombre del servicio es obligatorio.");
  }
  if (isNaN(parseFloat(servicioData.precio)) || parseFloat(servicioData.precio) <= 0) {
    throw new Error("El precio del servicio debe ser un número positivo.");
  }
  if (!servicioData.categoria) {
      // throw new Error("Debe seleccionar una categoría para el servicio."); // Opcional si la categoría no es estrictamente requerida
  }
  // Aquí podrías añadir validación de unicidad de nombre si es necesario
  // const nombreExists = existingServicios.some(
  //   s => s.nombre.toLowerCase() === servicioData.nombre.toLowerCase() && s.id !== servicioData.id
  // );
  // if (nombreExists) {
  //   throw new Error("Ya existe un servicio con este nombre.");
  // }

  let updatedServicios;
  if (servicioData.id) { // Editando
    updatedServicios = existingServicios.map(s =>
      s.id === servicioData.id ? { ...s, ...servicioData, precio: parseFloat(servicioData.precio) } : s
    );
  } else { // Creando
    const newServicio = {
      id: Date.now(), // Simple ID generation
      ...servicioData,
      precio: parseFloat(servicioData.precio),
      estado: servicioData.estado || "Activo", // Default a Activo si es nuevo
    };
    updatedServicios = [...existingServicios, newServicio];
  }
  persistServiciosAdmin(updatedServicios);
  return updatedServicios;
};

export const deleteServicioAdminById = (servicioId, existingServicios) => {
  const updatedServicios = existingServicios.filter(s => s.id !== servicioId);
  persistServiciosAdmin(updatedServicios);
  return updatedServicios;
};

export const toggleServicioAdminEstado = (servicioId, existingServicios) => {
  const updatedServicios = existingServicios.map(s =>
    s.id === servicioId ? { ...s, estado: s.estado === "Activo" ? "Inactivo" : "Activo" } : s
  );
  persistServiciosAdmin(updatedServicios);
  return updatedServicios;
};