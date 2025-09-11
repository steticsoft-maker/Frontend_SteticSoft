// RUTA: src/features/ventas/utils/pdfGeneratorVentas.js
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoEmpresa from "/logo.png";

// FUNCIÓN AUXILIAR 1: Formatea moneda.
const formatCurrency = (value) => {
    const number = parseFloat(value);
    if (isNaN(number)) {
        return '$0';
    }
    return `$${number.toLocaleString('es-CO')}`;
};

// FUNCIÓN AUXILILIA 2: Formatea fechas al estilo "dd/mm/yyyy".
const formatDate = (fechaString) => {
    if (!fechaString) return "N/A";
    try {
        const fechaPart = fechaString.split("T")[0];
        const [year, month, day] = fechaPart.split("-");
        return `${day}/${month}/${year}`;
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
        return 'Fecha inválida';
    }
};

export const generarPDFVentaUtil = (venta) => {
    if (!venta || typeof venta !== 'object') {
        console.error("No se proporcionaron datos válidos para generar el PDF de venta.");
        return null;
    }

    const doc = new jsPDF();
    const totalVenta = parseFloat(venta.total) || 0;
    const ivaVenta = parseFloat(venta.iva) || 0;
    const subtotalVenta = totalVenta - ivaVenta;

    // === ENCABEZADO ===
    doc.setFillColor(245, 240, 247); // fondo lila suave
    doc.rect(0, 0, 210, 35, "F");

    doc.addImage(logoEmpresa, "PNG", 15, 8, 30, 20);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(74, 42, 90); // morado corporativo
    doc.text("Factura de Venta", 105, 20, { align: "center" });

    // === INFO VENTA Y CLIENTE ===
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(40);

    doc.text(`Factura N°: ${venta.idVenta ?? 'N/A'}`, 15, 45);
    doc.text(`Fecha: ${formatDate(venta.fecha)}`, 15, 52);

    const nombreCliente = `${(venta.cliente?.nombre || '')} ${(venta.cliente?.apellido || '')}`.trim();
    doc.text(`Cliente: ${nombreCliente || "N/A"}`, 105, 45);
    doc.text(`Documento: ${venta.cliente?.numeroDocumento || 'N/A'}`, 105, 52);
    doc.text(`Estado: ${venta.estadoDetalle?.nombreEstado || 'N/A'}`, 15, 59);

    // === TABLA DE PRODUCTOS/SERVICIOS ===
    const tableColumn = ["Descripción", "Cantidad", "Valor Unitario", "Subtotal"];
    const tableRows = [];

    (venta.productos || []).forEach(p => {
        const cantidad = p.detalleProductoVenta?.cantidad ?? 0;
        const valorUnitario = p.detalleProductoVenta?.valorUnitario ?? 0;
        tableRows.push([
            p.nombre || 'Producto sin nombre',
            cantidad,
            formatCurrency(valorUnitario),
            formatCurrency(cantidad * valorUnitario)
        ]);
    });

    (venta.servicios || []).forEach(s => {
        const valorServicio = s.detalleServicioVenta?.valorServicio ?? 0;
        tableRows.push([
            s.nombre || 'Servicio sin nombre',
            1, // Cantidad para servicios es siempre 1
            formatCurrency(valorServicio),
            formatCurrency(valorServicio)
        ]);
    });

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows.length > 0 ? tableRows : [["-", "-", "-", "-"]],
        startY: 70,
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
    doc.text(formatCurrency(subtotalVenta), 195, finalY + 12, { align: "right" });

    doc.text(`IVA (19%):`, 150, finalY + 19, { align: "right" });
    doc.text(formatCurrency(ivaVenta), 195, finalY + 19, { align: "right" });

    doc.setFont("helvetica", "bold");
    doc.setTextColor(74, 42, 90);
    doc.text(`Total a Pagar:`, 150, finalY + 26, { align: "right" });
    doc.text(formatCurrency(totalVenta), 195, finalY + 26, { align: "right" });

    // === FOOTER ===
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text("SteticSoft - Reporte generado automáticamente", 105, pageHeight - 10, {
        align: "center",
    });

    return doc.output("blob");
};