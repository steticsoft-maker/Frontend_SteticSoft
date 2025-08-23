// src/features/ventas/services/ventasService.js
// Importa el objeto completo que contiene las funciones de productos.
import { productosAdminService } from '../../productosAdmin/services/productosAdminService';
// Importa la función de servicios.
import { getServicios as fetchServiciosAdmin } from '../../serviciosAdmin/services/serviciosAdminService';
// Importa la función de clientes.
import { fetchClientes as getClientesActivos } from '../../clientes/services/clientesService';

const VENTAS_STORAGE_KEY = 'ventas_steticsoft_v2';

const INITIAL_VENTAS = [
    { id: 1, fecha: "2025-03-28", cliente: "Juan Pérez", documento: "123456789", telefono: "3001234567", direccion: "Calle 1", total: 50000, estado: "Activa", items: [{ nombre: "Producto A", cantidad: 2, precio: 10000, total: 20000 }, { nombre: "Servicio C", cantidad: 1, precio: 30000, total: 30000 }], subtotal: 42016.81, iva: 7983.19 },
    { id: 2, fecha: "2025-03-29", cliente: "María Gómez", documento: "987654321", telefono: "3019876543", direccion: "Carrera 2", total: 120000, estado: "En proceso", items: [{ nombre: "Producto C", cantidad: 1, precio: 120000, total: 120000 }], subtotal: 100840.34, iva: 19159.66 },
];

// --- Funciones para el Proceso de Venta (Formulario) ---

export const getClientesParaVenta = async () => {
    try {
        const response = await getClientesActivos();
        return response.data?.data || [];
    } catch (error) {
        console.error("Error al obtener clientes para la venta:", error);
        return [];
    }
};

/**
 * Obtiene la lista de productos activos llamando a la API real.
 * @returns {Promise<Array>} Una promesa que resuelve con un array de productos.
 */
export const getProductosParaVenta = async () => {
    try {
        const productos = await productosAdminService.getProductos();
        return productos.filter(p => p.estado === true);
    } catch (error) {
        console.error("Error al obtener productos para la venta:", error);
        return [];
    }
};

/**
 * Obtiene la lista de servicios activos llamando a la API real.
 * @returns {Promise<Array>} Una promesa que resuelve con un array de servicios.
 */
export const getServiciosParaVenta = async () => {
    try {
        // Se pasa el filtro "estado: true" directamente a la función de la API.
        // Esto optimiza el código ya que la API se encarga de filtrar los servicios.
        const response = await fetchServiciosAdmin({ estado: true });
        const serviciosActivos = response?.data?.data || [];
        return serviciosActivos;
    } catch (error) {
        console.error("Error al obtener servicios para la venta:", error);
        return [];
    }
};

// --- Fin Funciones para Proceso de Venta ---

export const fetchVentas = () => {
    const stored = localStorage.getItem(VENTAS_STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored).map(v => ({ ...v, id: v.id || Date.now() + Math.random() }));
        } catch (e) {
            console.error("Error parsing ventas from localStorage", e);
            localStorage.removeItem(VENTAS_STORAGE_KEY);
        }
    }
    persistVentas(INITIAL_VENTAS.map(v => ({ ...v, id: v.id || Date.now() + Math.random() })));
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
    if (!ventaData.cliente) throw new Error("El cliente es obligatorio.");
    if (!ventaData.items || ventaData.items.length === 0) throw new Error("Debe agregar al menos un producto o servicio.");

    const maxId = existingVentas.length > 0 ? Math.max(...existingVentas.map(v => v.id || 0)) : 0;
    const newId = maxId + 1;

    const ventaAGuardar = {
        ...ventaData,
        id: newId,
        estado: ventaData.estado || "Activa",
    };
    const updatedVentas = [...existingVentas, ventaAGuardar];
    persistVentas(updatedVentas);
    return updatedVentas;
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