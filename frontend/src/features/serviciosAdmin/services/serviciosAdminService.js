// src/features/serviciosAdmin/services/serviciosAdminService.js
import apiClient from '../../../shared/services/apiClient';
import { fetchCategoriasServicio } from '../../categoriasServicioAdmin/services/categoriasServicioService'; // Para las categorías

const SERVICIOS_STORAGE_KEY = 'servicios_admin_steticsoft_v2';

// Datos iniciales de ejemplo si localStorage está vacío
const INITIAL_SERVICIOS = [
    { id: 1, nombre: "Corte de Dama", precio: 50000, categoria: "Peluquería", estado: "Activo", imagenURL: null, descripcion: "Corte moderno y personalizado." },
    { id: 2, nombre: "Manicura Clásica", precio: 25000, categoria: "Uñas", estado: "Activo", imagenURL: null, descripcion: "Limpieza y esmaltado tradicional." },
    { id: 3, nombre: "Masaje Relajante", precio: 80000, categoria: "Corporales", estado: "Inactivo", imagenURL: null, descripcion: "Masaje para aliviar el estrés." },
];

// --------- FUNCIONES LOCALES (localStorage) ---------
export const fetchServiciosAdmin = () => {
  const stored = localStorage.getItem(SERVICIOS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error parsing serviciosAdmin from localStorage", e);
      localStorage.removeItem(SERVICIOS_STORAGE_KEY);
    }
  }
  persistServiciosAdmin(INITIAL_SERVICIOS);
  return INITIAL_SERVICIOS;
};

const persistServiciosAdmin = (servicios) => {
  localStorage.setItem(SERVICIOS_STORAGE_KEY, JSON.stringify(servicios));
};

export const getActiveCategoriasServicioForSelect = () => {
  const todasCategorias = fetchCategoriasServicio();
  return todasCategorias.filter(cat => cat.estado === "Activo").map(cat => cat.nombre);
};

export const saveServicioAdmin = (servicioData, existingServicios) => {
  if (!servicioData.nombre?.trim()) {
    throw new Error("El nombre del servicio es obligatorio.");
  }
  if (isNaN(parseFloat(servicioData.precio)) || parseFloat(servicioData.precio) <= 0) {
    throw new Error("El precio del servicio debe ser un número positivo.");
  }
  if (!servicioData.categoria) {
    // throw new Error("Debe seleccionar una categoría para el servicio.");
  }

  let updatedServicios;
  if (servicioData.id) { // Editando
    updatedServicios = existingServicios.map(s =>
      s.id === servicioData.id ? { ...s, ...servicioData, precio: parseFloat(servicioData.precio) } : s
    );
  } else { // Creando
    const newServicio = {
      id: Date.now(),
      ...servicioData,
      precio: parseFloat(servicioData.precio),
      estado: servicioData.estado || "Activo",
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

// --------- FUNCIONES API (asíncronas) ---------

/**
 * Obtiene todos los servicios desde la API.
 */
export const fetchServiciosAdminAPI = async () => {
  try {
    const response = await apiClient.get('/servicios');
    return response.data;
  } catch (error) {
    throw (
      error.response?.data ||
      new Error(error.message || "Error desconocido al obtener servicios")
    );
  }
};

/**
 * Crea un nuevo servicio en la API.
 */
export const createServicioAdminAPI = async (servicioData) => {
  try {
    const response = await apiClient.post('/servicios', servicioData);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data ||
      new Error(error.message || "Error desconocido al crear el servicio")
    );
  }
};

/**
 * Actualiza un servicio existente en la API.
 */
export const updateServicioAdminAPI = async (id, servicioData) => {
  try {
    const response = await apiClient.put(`/servicios/${id}`, servicioData);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data ||
      new Error(error.message || "Error desconocido al actualizar el servicio")
    );
  }
};

/**
 * Elimina un servicio en la API.
 */
export const deleteServicioAdminAPI = async (id) => {
  try {
    const response = await apiClient.delete(`/servicios/${id}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data ||
      new Error(error.message || "Error desconocido al eliminar el servicio")
    );
  }
};

/**
 * Anula (desactiva) un servicio en la API.
 */
export const anularServicioAdminAPI = async (id) => {
  try {
    const response = await apiClient.patch(`/servicios/${id}/anular`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data ||
      new Error(error.message || "Error desconocido al anular el servicio")
    );
  }
};

/**
 * Habilita (activa) un servicio en la API.
 */
export const habilitarServicioAdminAPI = async (id) => {
  try {
    const response = await apiClient.patch(`/servicios/${id}/habilitar`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data ||
      new Error(error.message || "Error desconocido al habilitar el servicio")
    );
  }
};