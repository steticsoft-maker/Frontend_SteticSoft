import apiClient from "../../../shared/services/api"; 
// Importa el objeto completo que contiene las funciones de productos.
import { productosAdminService } from '../../productosAdmin/services/productosAdminService';
// Importa la función de servicios.
import { getServicios as fetchServiciosAdmin } from '../../serviciosAdmin/services/serviciosAdminService';
// Importa la función de clientes.
import { fetchClientes as getClientesActivos } from '../../clientes/services/clientesService';

const VENTAS_API_URL = '/ventas';

// --- Funciones para el Proceso de Venta (Formulario) ---

/**
 * Obtiene la lista de clientes activos llamando a la API real.
 * @returns {Promise<Array>} Una promesa que resuelve con un array de clientes.
 */
export const getClientesParaVenta = async () => {
    try {
        const response = await getClientesActivos();
        return response.data?.data || [];
    } catch (error) {
        console.error("Error al obtener clientes para la venta:", error);
        throw error;
    }
};

/**
 * Obtiene la lista de productos activos llamando a la API real.
 * @returns {Promise<Array>} Una promesa que resuelve con un array de productos.
 */
export const getProductosParaVenta = async () => {
    try {
        // Asumiendo que getProductos() de productosAdminService ya llama a la API.
        const productos = await productosAdminService.getProductos();
        // Filtra los productos con estado activo (true).
        return productos.filter(p => p.estado === true);
    } catch (error) {
        console.error("Error al obtener productos para la venta:", error);
        throw error;
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
        throw error;
    }
};

// --- Funciones de CRUD para Ventas (Lista de Ventas) ---

/**
 * Obtiene la lista de todas las ventas desde la API, con filtros opcionales.
 * @param {Object} filters - Objeto con los filtros a aplicar (e.g., { idEstado: 1 }).
 * @returns {Promise<Array>} Una promesa que resuelve con un array de ventas.
 */
export const fetchVentas = async (filters = {}) => {
    try {
        const params = new URLSearchParams();
        // ✅ Cambio clave: Usa 'idEstado' para construir los parámetros
        if (filters.idEstado) {
            params.append('idEstado', filters.idEstado);
        }
        
        const response = await apiClient.get(VENTAS_API_URL, { params });
        return response.data?.data || [];
    } catch (error) {
        console.error("Error al obtener las ventas:", error);
        throw error;
    }
};

/**
 * Obtiene una venta específica por su ID desde la API.
 * @param {string|number} ventaId El ID de la venta.
 * @returns {Promise<Object>} Una promesa que resuelve con el objeto de la venta.
 */
export const getVentaById = async (ventaId) => {
    try {
        const response = await apiClient.get(`${VENTAS_API_URL}/${ventaId}`);
        return response.data?.data;
    } catch (error) {
        console.error(`Error al obtener la venta con ID ${ventaId}:`, error);
        throw error;
    }
};

/**
 * Guarda una nueva venta en la API.
 * @param {Object} ventaData Los datos de la nueva venta.
 * @returns {Promise<Object>} Una promesa que resuelve con el objeto de la venta creada.
 */
export const saveNuevaVenta = async (ventaData) => {
    try {
        // El backend debe manejar la generación del ID y la validación.
        const response = await apiClient.post(VENTAS_API_URL, ventaData);
        return response.data;
    } catch (error) {
        console.error("Error al guardar la nueva venta:", error);
        throw error;
    }
};

/**
 * Anula una venta específica actualizando su estado en la API.
 * @param {string|number} ventaId El ID de la venta a anular.
 * @returns {Promise<Object>} Una promesa que resuelve con el objeto de la venta actualizada.
 */
export const anularVentaById = async (ventaId) => {
    try {
        // Asumiendo un endpoint para actualizar el estado.
        const response = await apiClient.patch(`${VENTAS_API_URL}/${ventaId}/anular`);
        return response.data;
    } catch (error) {
        console.error(`Error al anular la venta con ID ${ventaId}:`, error);
        throw error;
    }
};

/**
 * Cambia el estado de una venta específica en la API.
 * @param {string|number} ventaId El ID de la venta.
 * @param {number} nuevoIdEstado El nuevo ID de estado (ej: 1, 2).
 * @returns {Promise<Object>} Una promesa que resuelve con el objeto de la venta actualizada.
 */
export const cambiarEstadoVenta = async (ventaId, nuevoIdEstado) => {
    try {
        // ✅ Cambio clave: Usa 'idEstado' en el cuerpo de la solicitud
        const response = await apiClient.patch(`${VENTAS_API_URL}/${ventaId}`, { idEstado: nuevoIdEstado });
        return response.data;
    } catch (error) {
        console.error(`Error al cambiar el estado de la venta con ID ${ventaId}:`, error);
        throw error;
    }
};