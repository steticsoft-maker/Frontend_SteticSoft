// Ubicación: src/features/dashboard/mocks/dashboardMockData.js

// 1. Datos para getIngresosPorCategoria
export const ingresosPorCategoriaMock = [
  { categoria: 'Tratamientos Faciales', total: 12500.50 },
  { categoria: 'Masajes Corporales', total: 8750.00 },
  { categoria: 'Depilación', total: 6300.75 },
  { categoria: 'Manicura y Pedicura', total: 4500.25 },
  { categoria: 'Venta de Productos', total: 11200.00 },
];

// 2. Datos para getServiciosMasVendidos
export const serviciosMasVendidosMock = [
  { nombre: 'Limpieza Facial Profunda', totalVendido: 85 },
  { nombre: 'Masaje Relajante con Aromaterapia', totalVendido: 60 },
  { nombre: 'Depilación Láser de Piernas Completas', totalVendido: 45 },
  { nombre: 'Manicura Spa', totalVendido: 110 },
  { nombre: 'Pedicura Deluxe', totalVendido: 95 },
];

// 3. Datos para getProductosMasVendidos
export const productosMasVendidosMock = [
  { nombre: 'Crema Hidratante con Ácido Hialurónico', totalVendido: 150 },
  { nombre: 'Protector Solar SPF 50+', totalVendido: 120 },
  { nombre: 'Sérum de Vitamina C', totalVendido: 90 },
  { nombre: 'Aceite Esencial de Lavanda', totalVendido: 200 },
  { nombre: 'Exfoliante Corporal de Azúcar', totalVendido: 75 },
];

// 4. Datos para getEvolucionVentas (últimos 6 meses para brevedad)
export const evolucionVentasMock = [
  { mes: 'Marzo 2024', totalVentas: 18500.00, transacciones: 150 },
  { mes: 'Abril 2024', totalVentas: 21000.50, transacciones: 165 },
  { mes: 'Mayo 2024', totalVentas: 23500.75, transacciones: 180 },
  { mes: 'Junio 2024', totalVentas: 22000.00, transacciones: 170 },
  { mes: 'Julio 2024', totalVentas: 25500.25, transacciones: 195 },
  { mes: 'Agosto 2024', totalVentas: 27800.50, transacciones: 210 },
];

// 5. Datos para getSubtotalIva
export const subtotalIvaMock = {
  subtotal: 150000.00,
  iva: 28500.00,
};
