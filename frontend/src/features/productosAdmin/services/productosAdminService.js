// src/features/productosAdmin/services/productosAdminService.js
import { fetchCategoriasProducto } from '../../categoriasProductoAdmin/services/categoriasProductoService'; // Para obtener categorías

const PRODUCTOS_STORAGE_KEY = 'productos_admin_steticsoft';

const INITIAL_PRODUCTOS = [
  { id: 1, nombre: "Producto A Ejemplo", categoria: "Categoría 1", precio: 10000, stock: 50, estado: true, foto: null, descripcion: "Descripción del Producto A" },
  { id: 2, nombre: "Producto B Ejemplo", categoria: "Categoría 2", precio: 20000, stock: 30, estado: false, foto: null, descripcion: "Descripción del Producto B" },
];

export const fetchProductosAdmin = () => {
  const stored = localStorage.getItem(PRODUCTOS_STORAGE_KEY);
  // Si no hay productos, inicializar con los de ejemplo (o un array vacío)
  if (!stored) {
    persistProductosAdmin(INITIAL_PRODUCTOS);
    return INITIAL_PRODUCTOS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error("Error parsing productos from localStorage", e);
    persistProductosAdmin(INITIAL_PRODUCTOS); // Reset a iniciales si hay error
    return INITIAL_PRODUCTOS;
  }
};

const persistProductosAdmin = (productos) => {
  localStorage.setItem(PRODUCTOS_STORAGE_KEY, JSON.stringify(productos));
};

// Función para obtener las categorías activas para el select del formulario
export const getActiveCategoriasForSelect = () => {
  const todasCategorias = fetchCategoriasProducto(); // Usa el servicio de categorías
  return todasCategorias.filter(cat => cat.estado === true).map(cat => cat.nombre);
};

export const saveProductoAdmin = (productoData, existingProductos) => {
  // Validaciones básicas
  if (!productoData.nombre?.trim() || !productoData.categoria || isNaN(parseFloat(productoData.precio)) || parseFloat(productoData.precio) <= 0 || isNaN(parseInt(productoData.stock)) || parseInt(productoData.stock) < 0) {
    throw new Error("Por favor, completa todos los campos obligatorios (Nombre, Categoría, Precio válido, Stock válido).");
  }

  let updatedProductos;
  if (productoData.id) { // Editando
    updatedProductos = existingProductos.map(p =>
      p.id === productoData.id ? { ...p, ...productoData } : p
    );
  } else { // Creando
    const newProducto = {
      ...productoData,
      id: Date.now(),
      estado: productoData.estado !== undefined ? productoData.estado : true, // Default a true si es nuevo
      // foto: se maneja en el componente de formulario y se pasa en productoData
    };
    updatedProductos = [...existingProductos, newProducto];
  }
  persistProductosAdmin(updatedProductos);
  return updatedProductos;
};

export const deleteProductoAdminById = (productoId, existingProductos) => {
  const updatedProductos = existingProductos.filter(p => p.id !== productoId);
  persistProductosAdmin(updatedProductos);
  return updatedProductos;
};

export const toggleProductoAdminEstado = (productoId, existingProductos) => {
  const updatedProductos = existingProductos.map(p =>
    p.id === productoId ? { ...p, estado: !p.estado } : p
  );
  persistProductosAdmin(updatedProductos);
  return updatedProductos;
};