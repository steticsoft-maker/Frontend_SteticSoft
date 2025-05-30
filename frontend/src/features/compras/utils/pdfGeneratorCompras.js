// src/features/compras/utils/pdfGeneratorCompras.js
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generarPDFCompraUtil = (compraData) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Detalle de Compra", 14, 22); // Ajustar Y para más espacio

  doc.setFontSize(12);
  let currentY = 35;
  const lineHeight = 7;

  doc.text(`ID Compra: ${compraData.id}`, 14, currentY);
  currentY += lineHeight;
  doc.text(`Proveedor: ${compraData.proveedor}`, 14, currentY);
  currentY += lineHeight;
  doc.text(`Fecha: ${compraData.fecha}`, 14, currentY);
  currentY += lineHeight;
  if(compraData.metodoPago) { // Si existe metodoPago
    doc.text(`Método Pago: ${compraData.metodoPago}`, 14, currentY);
    currentY += lineHeight;
  }
  doc.text(`Estado: ${compraData.estado}`, 14, currentY);
  currentY += lineHeight * 1.5; // Más espacio antes de los totales

  // Sección de Totales
  doc.setFontSize(10);
  doc.text(`Subtotal: $${compraData.subtotal?.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0}) || '0'}`, 14, currentY);
  currentY += lineHeight -2;
  doc.text(`IVA (19%): $${compraData.iva?.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0}) || '0'}`, 14, currentY);
  currentY += lineHeight -2;
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold'); // Poner el total en negrita
  doc.text(`Total Compra: $${compraData.total?.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0}) || '0'}`, 14, currentY);
  doc.setFont(undefined, 'normal'); // Resetear a normal
  currentY += lineHeight + 5; // Espacio antes de la tabla

  const productos = (compraData.productos || compraData.items || []).map((prod, i) => [
    i + 1,
    prod.nombre,
    prod.cantidad,
    `$${prod.precio.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0})}`,
    `$${(prod.precio * prod.cantidad).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0})}`,
  ]);

  autoTable(doc, {
    head: [["#", "Producto", "Cantidad", "Precio Unitario", "Total Item"]],
    body: productos.length > 0 ? productos : [["-", "No hay productos detallados", "-", "-", "-"]],
    startY: currentY,
    theme: 'grid', // Otras opciones: 'striped', 'plain'
    headStyles: { fillColor: [233, 120, 208] }, // Color similar a tus encabezados de tabla
    styles: { fontSize: 9, cellPadding: 2 },
    columnStyles: {
        0: { cellWidth: 10 }, // #
        1: { cellWidth: 'auto' }, // Producto
        2: { cellWidth: 20, halign: 'right' }, // Cantidad
        3: { cellWidth: 35, halign: 'right' }, // Precio Unitario
        4: { cellWidth: 35, halign: 'right' }, // Total Item
    }
  });

  return doc.output("blob");
};