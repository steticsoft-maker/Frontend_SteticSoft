// src/features/ventas/utils/pdfGeneratorVentas.js
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generarPDFVentaUtil = (ventaData) => {
  const doc = new jsPDF();

  // Encabezado del documento
  doc.setFontSize(18);
  doc.text("Factura de Venta", 105, 20, { align: "center" });
  doc.setFontSize(10);
  doc.text(`SteticSoft - NIT XXXXXXXX-X`, 105, 28, { align: "center" });
  doc.text(`Dirección: Tu Dirección Aquí - Tel: Tu Teléfono`, 105, 33, { align: "center" });
  doc.line(14, 38, 196, 38); // Línea divisoria

  // Datos de la Venta y Cliente
  let currentY = 45;
  const lineHeight = 6;
  doc.setFontSize(12);
  doc.text(`Factura N°: ${ventaData.id}`, 14, currentY);
  doc.text(`Fecha: ${ventaData.fecha}`, 130, currentY);
  currentY += lineHeight * 1.5;

  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text("Cliente:", 14, currentY);
  doc.setFont(undefined, 'normal');
  doc.text(`${ventaData.cliente}`, 35, currentY);
  currentY += lineHeight;
  doc.text(`Documento:`, 14, currentY);
  doc.text(`${ventaData.documento || 'N/A'}`, 35, currentY);
  currentY += lineHeight;
  doc.text(`Teléfono:`, 14, currentY);
  doc.text(`${ventaData.telefono || 'N/A'}`, 35, currentY);
  currentY += lineHeight;
  doc.text(`Dirección:`, 14, currentY);
  doc.text(`${ventaData.direccion || 'N/A'}`, 35, currentY);
  currentY += lineHeight * 1.5; // Espacio antes de la tabla

  // Tabla de Items
  const items = (ventaData.items || []).map((item, index) => [
    index + 1,
    item.nombre,
    item.cantidad,
    `$${item.precio.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
    `$${(item.precio * item.cantidad).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
  ]);

  autoTable(doc, {
    head: [["#", "Producto/Servicio", "Cant.", "Vlr. Unit.", "Vlr. Total"]],
    body: items.length > 0 ? items : [["-", "No hay ítems", "-", "-", "-"]],
    startY: currentY,
    theme: 'grid',
    headStyles: { fillColor: [233, 120, 208], textColor: 0, fontStyle: 'bold' }, // Color similar a tus encabezados
    styles: { fontSize: 9, cellPadding: 1.5, overflow: 'linebreak' },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' }, // #
      1: { cellWidth: 'auto' }, // Producto/Servicio
      2: { cellWidth: 15, halign: 'center' }, // Cantidad
      3: { cellWidth: 30, halign: 'right' }, // Vlr. Unit.
      4: { cellWidth: 30, halign: 'right' }, // Vlr. Total
    },
    didDrawPage: function () { // data parameter removed as it's unused
        // Footer de página (si es necesario)
        // doc.text('Página ' + doc.internal.getNumberOfPages(), data.settings.margin.left, doc.internal.pageSize.height - 10);
    }
  });

  currentY = doc.lastAutoTable.finalY + 10; // Posición después de la tabla

  // Sección de Totales
  const totalsXPosition = 130; // Alinear a la derecha
  doc.setFontSize(10);
  doc.text("Subtotal:", totalsXPosition, currentY, { align: 'left' });
  doc.text(`$${ventaData.subtotal.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 196, currentY, { align: 'right' });
  currentY += lineHeight;
  doc.text("IVA (19%):", totalsXPosition, currentY, { align: 'left' });
  doc.text(`$${ventaData.iva.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 196, currentY, { align: 'right' });
  currentY += lineHeight;
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text("TOTAL A PAGAR:", totalsXPosition, currentY, { align: 'left'});
  doc.text(`$${ventaData.total.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 196, currentY, { align: 'right'});
  doc.setFont(undefined, 'normal');

  currentY += lineHeight * 2;
  doc.setFontSize(9);
  doc.text(`Estado de la Venta: ${ventaData.estado}`, 14, currentY);

  return doc.output("blob");
};