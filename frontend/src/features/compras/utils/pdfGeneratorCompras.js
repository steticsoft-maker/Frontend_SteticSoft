// RUTA: src/features/compras/utils/pdfGeneratorCompras.js
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoEmpresa from "/logo.png";

const formatFechaSinTimezone = (fechaString) => {
  if (!fechaString) return "N/A";
  const fechaPart = fechaString.split("T")[0];
  const [year, month, day] = fechaPart.split("-");
  return `${day}/${month}/${year}`;
};

export const generarPDFCompraUtil = (compra) => {
  if (!compra) {
    console.error("Se intentó generar un PDF sin datos de la compra.");
    return null;
  }

  const doc = new jsPDF();
  const subtotal = compra.total - compra.iva;

  // === ENCABEZADO ===
  doc.setFillColor(245, 240, 247); // fondo lila suave
  doc.rect(0, 0, 210, 35, "F");

  doc.addImage(logoEmpresa, "PNG", 15, 8, 30, 20);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(74, 42, 90);
  doc.text("Reporte de Compra", 105, 20, { align: "center" });

  // === INFO COMPRA ===
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(40);

  doc.text(`ID Compra: ${compra.idCompra}`, 15, 45);
  doc.text(`Fecha: ${formatFechaSinTimezone(compra.fecha)}`, 15, 52);

  doc.text(`Proveedor: ${compra.proveedor?.nombre || "N/A"}`, 105, 45);
  doc.text(`Estado: ${compra.estado ? "Activa" : "Anulada"}`, 105, 52);

  // === TABLA ===
  const tableColumn = ["Producto", "Cantidad", "Valor Unitario", "Subtotal"];
  const tableRows = (compra.productos || []).map((p) => {
    const pivot = p.detalleCompra;
    const cantidad = pivot?.cantidad || 0;
    const valorUnitario = pivot?.valorUnitario || 0;
    const subtotalItem = cantidad * valorUnitario;
    return [
      p.nombre,
      cantidad,
      `$${Number(valorUnitario).toLocaleString("es-CO")}`,
      `$${Number(subtotalItem).toLocaleString("es-CO")}`,
    ];
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows.length > 0 ? tableRows : [["-", "-", "-", "-"]],
    startY: 65,
    theme: "grid",
    headStyles: {
      fillColor: [154, 122, 159], // morado corporativo
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
    },
    bodyStyles: {
      textColor: [60, 60, 60],
    },
    alternateRowStyles: { fillColor: [252, 248, 253] },
    styles: {
      halign: "center",
      fontSize: 10,
      cellPadding: 4,
    },
    columnStyles: {
      0: { halign: "left" },
      2: { halign: "right" },
      3: { halign: "right" },
    },
  });

  // === TOTALES ===
  const finalY = doc.lastAutoTable.finalY || 100;
  doc.setFillColor(245, 240, 247);
  doc.roundedRect(120, finalY + 5, 75, 25, 3, 3, "F");

  doc.setFontSize(11);
  doc.setTextColor(40);
  doc.text(`Subtotal:`, 150, finalY + 12, { align: "right" });
  doc.text(`$${Number(subtotal).toLocaleString("es-CO")}`, 195, finalY + 12, {
    align: "right",
  });

  doc.text(`IVA (19%):`, 150, finalY + 19, { align: "right" });
  doc.text(`$${Number(compra.iva).toLocaleString("es-CO")}`, 195, finalY + 19, {
    align: "right",
  });

  doc.setFont("helvetica", "bold");
  doc.setTextColor(74, 42, 90);
  doc.text(`Total Compra:`, 150, finalY + 26, { align: "right" });
  doc.text(`$${Number(compra.total).toLocaleString("es-CO")}`, 195, finalY + 26, {
    align: "right",
  });

  // === FOOTER ===
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text("SteticSoft - Reporte generado automáticamente", 105, pageHeight - 10, {
    align: "center",
  });

  return doc.output("datauristring");
};
