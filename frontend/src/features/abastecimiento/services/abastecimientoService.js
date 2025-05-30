// src/features/abastecimiento/services/abastecimientoService.js

const ABASTECIMIENTO_STORAGE_KEY = 'abastecimiento_steticsoft';

// Datos que antes estaban hardcodeados en el componente
const NUEVAS_CATEGORIAS = ["Cejas", "Pestañas", "Cabello", "Uñas", "Facial", "Corporal"];
const PRODUCTOS_DISPONIBLES = [
  { nombre: "Sérum para Cejas", category: "Cejas", lifetimeDays: 365 },
  { nombre: "Extensiones de Pestañas", category: "Pestañas", lifetimeDays: 730 },
  { nombre: "Shampoo Profesional", category: "Cabello", lifetimeDays: 365 },
  { nombre: "Tijeras de Corte", category: "Cabello", lifetimeDays: 1825 },
  { nombre: "Esmalte Permanente", category: "Uñas", lifetimeDays: 730 },
  { nombre: "Mascarilla Facial", category: "Facial", lifetimeDays: 365 },
  { nombre: "Aceite de Masaje", category: "Corporal", lifetimeDays: 730 },
  { nombre: "Secadora", category: "Cabello", lifetimeDays: 2555 },
  { nombre: "Peine", category: "Cabello", lifetimeDays: 730 },
];
const EMPLEADOS_DISPONIBLES = ["Carlos López", "Ana Pérez", "Luis Torres", "Sofía Rodríguez"];

const INITIAL_ENTRIES = [ // Renombrado de initialProductos para evitar confusión
  { id: 1, nombre: "Shampoo Profesional", cantidad: 50, fechaIngreso: "2025-04-01", empleado: "Carlos López", category: "Cabello", isDepleted: false, depletionReason: "" },
  { id: 2, nombre: "Tijeras de Corte", cantidad: 20, fechaIngreso: "2025-04-02", empleado: "Ana Pérez", category: "Cabello", isDepleted: false, depletionReason: "" },
  { id: 3, nombre: "Sérum para Cejas", cantidad: 15, fechaIngreso: "2025-04-03", empleado: "Luis Torres", category: "Cejas", isDepleted: false, depletionReason: "" },
];

export const getCategorias = () => NUEVAS_CATEGORIAS;
export const getProductosDisponibles = () => PRODUCTOS_DISPONIBLES;
export const getEmpleados = () => EMPLEADOS_DISPONIBLES;

export const fetchAbastecimientoEntries = () => {
  const stored = localStorage.getItem(ABASTECIMIENTO_STORAGE_KEY);
  return stored ? JSON.parse(stored) : INITIAL_ENTRIES;
};

const persistEntries = (entries) => {
  localStorage.setItem(ABASTECIMIENTO_STORAGE_KEY, JSON.stringify(entries));
};

export const addAbastecimientoEntry = (newEntryData, existingEntries) => {
  // Validación básica (más detallada podría estar en el formulario o aquí)
  if (!newEntryData.nombre || !newEntryData.cantidad || !newEntryData.empleado || !newEntryData.category) {
    throw new Error("Por favor, completa todos los campos obligatorios (Categoría, Producto, Cantidad, Empleado).");
  }
  const productDefinition = PRODUCTOS_DISPONIBLES.find(p => p.nombre === newEntryData.nombre);
  if (!productDefinition) {
    throw new Error("Producto no encontrado en la lista de productos disponibles.");
  }

  const entryToAdd = {
    ...newEntryData,
    id: Date.now(),
    fechaIngreso: new Date().toISOString().split("T")[0],
    isDepleted: false,
    depletionReason: "",
  };
  const updatedEntries = [...existingEntries, entryToAdd];
  persistEntries(updatedEntries);
  return updatedEntries;
};

export const updateAbastecimientoEntry = (updatedEntryData, existingEntries) => {
   if (!updatedEntryData.nombre || !updatedEntryData.cantidad || !updatedEntryData.empleado || !updatedEntryData.category) {
    throw new Error("Por favor, completa todos los campos obligatorios.");
  }
  const productDefinition = PRODUCTOS_DISPONIBLES.find(p => p.nombre === updatedEntryData.nombre);
  if (!productDefinition) {
    throw new Error("Producto no encontrado en la lista de productos disponibles.");
  }

  const updatedEntries = existingEntries.map(entry =>
    entry.id === updatedEntryData.id ? { ...entry, ...updatedEntryData } : entry
  );
  persistEntries(updatedEntries);
  return updatedEntries;
};

export const deleteAbastecimientoEntryById = (entryId, existingEntries) => {
  const updatedEntries = existingEntries.filter(entry => entry.id !== entryId);
  persistEntries(updatedEntries);
  return updatedEntries;
};

export const depleteEntry = (entryId, reason, existingEntries) => {
  if (!reason.trim()) {
    throw new Error("El motivo de agotamiento es obligatorio.");
  }
  const updatedEntries = existingEntries.map(entry =>
    entry.id === entryId
      ? { ...entry, isDepleted: true, depletionReason: reason, depletionDate: new Date().toISOString().split("T")[0] }
      : entry
  );
  persistEntries(updatedEntries);
  return updatedEntries;
};

export const calculateRemainingLifetime = (entry) => {
  const productDefinition = PRODUCTOS_DISPONIBLES.find(p => p.nombre === entry.nombre);
  if (!productDefinition || !entry.fechaIngreso) return "N/A";

  const ingressDate = new Date(entry.fechaIngreso);
  if (isNaN(ingressDate.getTime())) return "Fecha Inválida";

  const currentDate = new Date();
  const lifetimeDays = productDefinition.lifetimeDays;
  const expiryDate = new Date(ingressDate.getTime() + lifetimeDays * 24 * 60 * 60 * 1000);
  const timeDiff = expiryDate.getTime() - currentDate.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  if (daysDiff < 0) return "Expirado";
  if (daysDiff === 0) return "Expira hoy";
  return `${daysDiff} días restantes`;
};