// src/features/compras/services/comprasService.js
// NO necesitas importar jsPDF ni autoTable aquí si la generación se hace en utils

const COMPRAS_STORAGE_KEY = 'compras_steticsoft';

const PRODUCTOS_POR_CATEGORIA_COMPRA = [
    { categoria: "Cabello", productos: [ { nombre: "Shampoo", precio: 5000 }, { nombre: "Acondicionador", precio: 6000 } ] },
    { categoria: "Maquillaje", productos: [ { nombre: "Labial", precio: 15000 }, { nombre: "Base de Maquillaje", precio: 30000 } ] },
    { categoria: "Unas", productos: [ { nombre: "Esmalte Tradicional", precio: 8000 } ] }
];
const PROVEEDORES_COMPRA = [
    "Proveedor Cosmeticos ABC", "Distribuidora Belleza Total", "Suministros Estetica Pro",
];
const METODOS_PAGO_COMPRA = ["Efectivo", "Transferencia Bancaria", "Tarjeta de Credito", "Nequi/Daviplata"];

const INITIAL_COMPRAS = [
    { id: 1, proveedor: "Proveedor A", fecha: "2025-03-24", totalFormateado: "$500,000", total: 500000, estado: "Completado", items: [ { nombre: "Shampoo", cantidad: 2, precio: 10000, total: 20000 }, { nombre: "Tinte", cantidad: 3, precio: 25000, total: 75000 }], subtotal: 420168.07, iva: 79831.93, metodoPago: "Efectivo" },
    { id: 2, proveedor: "Proveedor B", fecha: "2025-03-22", totalFormateado: "$320,000", total: 320000, estado: "Pendiente", items: [ { nombre: "Gel para cabello", cantidad: 4, precio: 40000, total: 160000 }, { nombre: "Labial", cantidad: 4, precio: 20000, total: 80000 }], subtotal: 268907.56, iva: 51092.44, metodoPago: "Transferencia Bancaria" },
];

export const fetchCompras = () => {
  const stored = localStorage.getItem(COMPRAS_STORAGE_KEY);
  if (!stored) {
    const comprasConId = INITIAL_COMPRAS.map((c, index) => ({ ...c, id: c.id || Date.now() + index }));
    persistCompras(comprasConId);
    return comprasConId;
  }
  try {
    return JSON.parse(stored).map((c, index) => ({ ...c, id: c.id || Date.now() + index }));
  } catch (e) {
    console.error("Error parsing compras from localStorage", e);
    const comprasConId = INITIAL_COMPRAS.map((c, index) => ({ ...c, id: c.id || Date.now() + index }));
    persistCompras(comprasConId);
    return comprasConId;
  }
};

const persistCompras = (compras) => {
  localStorage.setItem(COMPRAS_STORAGE_KEY, JSON.stringify(compras));
};

export const getProductosPorCategoriaParaCompra = () => PRODUCTOS_POR_CATEGORIA_COMPRA;
export const getProveedoresParaCompra = () => PROVEEDORES_COMPRA;
export const getMetodosPagoParaCompra = () => METODOS_PAGO_COMPRA;

export const saveNuevaCompra = (compraData, existingCompras) => {
  if (!compraData.proveedor) throw new Error("Debe seleccionar un proveedor válido.");
  if (!compraData.metodoPago) throw new Error("Debe seleccionar un método de pago.");
  if (!compraData.items || compraData.items.length === 0) throw new Error("Debe agregar al menos un producto a la compra.");
  for (const item of compraData.items) {
    if (item.cantidad <= 0) throw new Error(`La cantidad para "${item.nombre}" debe ser mayor a 0.`);
    if (item.precio <= 0 && item.nombre) throw new Error(`El precio para "${item.nombre}" debe ser mayor a 0.`);
  }

  const maxId = existingCompras.length > 0 ? Math.max(...existingCompras.map(c => c.id || 0)) : 0;
  const newId = maxId + 1;

  const compraAGuardar = {
    ...compraData,
    id: newId,
    estado: "Pendiente",
    totalFormateado: `$${compraData.total.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
  };
  const updatedCompras = [...existingCompras, compraAGuardar];
  persistCompras(updatedCompras);
  return updatedCompras;
};

export const anularCompraById = (compraId, existingCompras) => {
  const updatedCompras = existingCompras.map(compra =>
    compra.id === compraId ? { ...compra, estado: "Anulada" } : compra
  );
  persistCompras(updatedCompras);
  return updatedCompras;
};

export const cambiarEstadoCompra = (compraId, nuevoEstado, existingCompras) => {
  const updatedCompras = existingCompras.map(compra =>
    compra.id === compraId ? { ...compra, estado: nuevoEstado } : compra
  );
  persistCompras(updatedCompras);
  return updatedCompras;
};

