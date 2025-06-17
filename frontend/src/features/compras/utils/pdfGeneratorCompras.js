// RUTA: src/features/compras/utils/pdfGeneratorCompras.js

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoEmpresa from '/logo.png'; // La importación del logo se mantiene, aunque no lo arreglemos ahora.

export const generarPDFCompraUtil = (compra) => {
  if (!compra) {
    console.error("Se intentó generar un PDF sin datos de la compra.");
    return null;
  }

  const doc = new jsPDF();
  const subtotal = compra.total - compra.iva;

  // --- Encabezado del Documento ---
  doc.addImage(logoEmpresa, 'PNG', 15, 10, 30, 10);
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.text("Reporte de Compra", 105, 25, { align: 'center' });
  doc.setFont(undefined, 'normal');

  // --- Información de la Compra ---
  doc.setFontSize(10);
  doc.text(`ID Compra: ${compra.idCompra}`, 15, 40);
  doc.text(`Fecha: ${new Date(compra.fecha).toLocaleDateString('es-CO')}`, 15, 47);
  doc.text(`Proveedor: ${compra.proveedor?.nombre || 'N/A'}`, 105, 40);
  doc.text(`Estado: ${compra.estado ? 'Activa' : 'Anulada'}`, 105, 47);
  
  // --- Tabla de Productos ---
  const tableColumn = ["Producto", "Cantidad", "Valor Unitario", "Subtotal"];

  // ✅ CORRECCIÓN 1: Usar `compra.productos` en lugar de `compra.productosComprados`.
  const tableRows = (compra.productos || []).map(p => {
    
    // ✅ CORRECCIÓN 2: Usar `p.CompraXProducto` para acceder a los datos de la tabla intermedia.
    const pivot = p.detalleCompra; 
    
    const cantidad = pivot?.cantidad || 0;
    const valorUnitario = pivot?.valorUnitario || 0;

    const subtotalItem = cantidad * valorUnitario;
    return [
        p.nombre,
        cantidad,
        `$${Number(valorUnitario).toLocaleString('es-CO')}`,
        `$${Number(subtotalItem).toLocaleString('es-CO')}`
    ];
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows.length > 0 ? tableRows : [['-']], // Muestra un guion si no hay productos
    startY: 60,
    theme: 'grid',
    headStyles: { fillColor: [182, 96, 163] },
    styles: { halign: 'center' },
    columnStyles: {
        0: { halign: 'left' },
        2: { halign: 'right' },
        3: { halign: 'right' }
    }
  });

  // --- Totales al Final de la Página ---
  const finalY = doc.lastAutoTable.finalY || 100;
  doc.setFontSize(12);
  doc.text(`Subtotal:`, 150, finalY + 10, { align: 'right' });
  doc.text(`$${Number(subtotal).toLocaleString('es-CO')}`, 195, finalY + 10, { align: 'right' });
  
  doc.text(`IVA (19%):`, 150, finalY + 17, { align: 'right' });
  doc.text(`$${Number(compra.iva).toLocaleString('es-CO')}`, 195, finalY + 17, { align: 'right' });

  doc.setFont(undefined, 'bold');
  doc.text(`Total Compra:`, 150, finalY + 24, { align: 'right' });
  doc.text(`$${Number(compra.total).toLocaleString('es-CO')}`, 195, finalY + 24, { align: 'right' });
  
  return doc.output('datauristring');
};