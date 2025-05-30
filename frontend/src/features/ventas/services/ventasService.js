// src/features/ventas/services/ventasService.js
// Importar servicios de clientes, productos y servicios si es necesario para obtener datos actualizados
// import { fetchClientesActivos } from '../../clientes/services/clientesService'; (Ejemplo)
// import { fetchProductosActivos } from '../../productosAdmin/services/productosAdminService'; (Ejemplo)
// import { fetchServiciosActivos } from '../../serviciosAdmin/services/serviciosAdminService'; (Ejemplo)

const VENTAS_STORAGE_KEY = 'ventas_steticsoft_v2'; // Nueva clave para evitar colisiones

const INITIAL_VENTAS = [ // Datos de ejemplo de Ventas.jsx
  { id: 1, fecha: "2025-03-28", cliente: "Juan Pérez", documento: "123456789", telefono: "3001234567", direccion: "Calle 1", total: 50000, estado: "Activa", items: [{ nombre: "Producto A", cantidad: 2, precio: 10000, total: 20000 }, { nombre: "Servicio C", cantidad: 1, precio: 30000, total: 30000 }], subtotal: 42016.81, iva: 7983.19 },
  { id: 2, fecha: "2025-03-29", cliente: "María Gómez", documento: "987654321", telefono: "3019876543", direccion: "Carrera 2", total: 120000, estado: "En proceso", items: [{ nombre: "Producto C", cantidad: 1, precio: 120000, total: 120000 }], subtotal: 100840.34, iva: 19159.66 },
];

// --- Funciones para el Proceso de Venta (Formulario) ---
export const getClientesParaVenta = () => {
    // En el futuro, llamar a fetchClientesActivos() de clientesService
    return JSON.parse(localStorage.getItem('clientes_steticsoft'))?.filter(c => c.estado === true) || 
           [{ id: 1, nombre: "Juan Pérez", documento: "123456789", telefono: "3001234567", direccion: "Calle 1" }]; // Ejemplo
};
export const getProductosParaVenta = () => {
    // En el futuro, llamar a fetchProductosActivos() de productosAdminService
    return JSON.parse(localStorage.getItem('productos_admin_steticsoft'))?.filter(p => p.estado === true) || 
           [{ id: 101, nombre: "Shampoo Pro", precio: 12000, tipo: 'producto' }]; // Ejemplo
};
export const getServiciosParaVenta = () => {
    // En el futuro, llamar a fetchServiciosActivos() de serviciosAdminService
    return JSON.parse(localStorage.getItem('servicios_admin_steticsoft_v2'))?.filter(s => s.estado === "Activo") || 
           [{ id: 201, nombre: "Corte Dama", precio: 50000, tipo: 'servicio' }]; // Ejemplo
};
// --- Fin Funciones para Proceso de Venta ---


export const fetchVentas = () => {
  const stored = localStorage.getItem(VENTAS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored).map(v => ({...v, id: v.id || Date.now() + Math.random()})); // Asegurar ID
    } catch (e) {
      console.error("Error parsing ventas from localStorage", e);
      localStorage.removeItem(VENTAS_STORAGE_KEY);
    }
  }
  persistVentas(INITIAL_VENTAS.map(v => ({...v, id: v.id || Date.now() + Math.random()})));
  return INITIAL_VENTAS;
};

const persistVentas = (ventas) => {
  localStorage.setItem(VENTAS_STORAGE_KEY, JSON.stringify(ventas));
};

export const getVentaById = (ventaId) => {
    const ventas = fetchVentas();
    return ventas.find(v => v.id === parseInt(ventaId));
};

export const saveNuevaVenta = (ventaData, existingVentas) => {
  // Validaciones básicas
  if (!ventaData.cliente) throw new Error("El cliente es obligatorio.");
  if (!ventaData.items || ventaData.items.length === 0) throw new Error("Debe agregar al menos un producto o servicio.");
  // Validaciones de ítems pueden ir aquí si es necesario

  const maxId = existingVentas.length > 0 ? Math.max(...existingVentas.map(v => v.id || 0)) : 0;
  const newId = maxId + 1;

  const ventaAGuardar = {
    ...ventaData, // cliente, documento, telefono, direccion, items, subtotal, iva, total, fecha
    id: newId,
    estado: ventaData.estado || "Activa", // Estado inicial por defecto
  };
  const updatedVentas = [...existingVentas, ventaAGuardar];
  persistVentas(updatedVentas);
  return updatedVentas; // Devolver todas las ventas actualizadas
};

export const anularVentaById = (ventaId, existingVentas) => {
  const updatedVentas = existingVentas.map(venta =>
    venta.id === ventaId ? { ...venta, estado: "Anulada" } : venta
  );
  persistVentas(updatedVentas);
  return updatedVentas;
};

export const cambiarEstadoVenta = (ventaId, nuevoEstado, existingVentas) => {
  const updatedVentas = existingVentas.map(venta =>
    venta.id === ventaId ? { ...venta, estado: nuevoEstado } : venta
  );
  persistVentas(updatedVentas);
  return updatedVentas;
};