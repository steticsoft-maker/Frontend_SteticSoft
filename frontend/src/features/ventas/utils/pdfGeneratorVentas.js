import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoBase64 from './logoBase64';

export const generarPDFVentaUtil = (ventaData) => {
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const logoWidth = 40;
    const logoHeight = 40;

    // Aquí está la clave: la llamada a addImage
    doc.addImage(logoBase64, 'JPEG', margin, margin, logoWidth, logoHeight);

    doc.setFontSize(18);
    doc.text("Factura de Venta", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.text(`SteticSoft - NIT XXXXXXXX-X`, 105, 28, { align: "center" });
    doc.text(`Dirección: Tu Dirección Aquí - Tel: Tu Teléfono`, 105, 33, { align: "center" });
    doc.line(14, 38, 196, 38);

    let currentY = 45;
    const lineHeight = 6;
    doc.setFontSize(12);
    doc.text(`Factura N°: ${ventaData.id}`, margin, currentY);
    doc.text(`Fecha: ${ventaData.fecha}`, pageWidth - margin, currentY, { align: "right" });
    currentY += lineHeight * 1.5;

    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text("Cliente:", margin, currentY);
    doc.setFont(undefined, 'normal');
    doc.text(`${ventaData.cliente}`, margin + 20, currentY);
    currentY += lineHeight;
    doc.text(`Documento:`, margin, currentY);
    doc.text(`${ventaData.documento || 'N/A'}`, margin + 20, currentY);
    currentY += lineHeight;
    doc.text(`Teléfono:`, margin, currentY);
    doc.text(`${ventaData.telefono || 'N/A'}`, margin + 20, currentY);
    currentY += lineHeight;
    doc.text(`Dirección:`, margin, currentY);
    doc.text(`${ventaData.direccion || 'N/A'}`, margin + 20, currentY);
    currentY += lineHeight * 1.5;

    const items = (ventaData.items || []).map((item, index) => [
        index + 1,
        item.nombre,
        item.cantidad,
        `$${(item.precio || 0).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
        `$${((item.precio || 0) * item.cantidad).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
    ]);

    autoTable(doc, {
        head: [["#", "Producto/Servicio", "Cant.", "Vlr. Unit.", "Vlr. Total"]],
        body: items.length > 0 ? items : [["-", "No hay ítems", "-", "-", "-"]],
        startY: currentY,
        theme: 'grid',
        headStyles: { fillColor: [233, 120, 208], textColor: 0, fontStyle: 'bold' },
        styles: { fontSize: 9, cellPadding: 1.5, overflow: 'linebreak' },
        columnStyles: {
            0: { cellWidth: 10, halign: 'center' },
            1: { cellWidth: 'auto' },
            2: { cellWidth: 15, halign: 'center' },
            3: { cellWidth: 30, halign: 'right' },
            4: { cellWidth: 30, halign: 'right' },
        },
    });

    currentY = doc.lastAutoTable.finalY + 10;

    const totalsXPosition = 130;
    doc.setFontSize(10);
    doc.text("Subtotal:", totalsXPosition, currentY, { align: 'left' });
    doc.text(`$${(ventaData.subtotal || 0).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 196, currentY, { align: 'right' });
    currentY += lineHeight;
    doc.text("IVA (19%):", totalsXPosition, currentY, { align: 'left' });
    doc.text(`$${(ventaData.iva || 0).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 196, currentY, { align: 'right' });
    currentY += lineHeight;
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text("TOTAL A PAGAR:", totalsXPosition, currentY, { align: 'left'});
    doc.text(`$${(ventaData.total || 0).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 196, currentY, { align: 'right'});
    doc.setFont(undefined, 'normal');

    currentY += lineHeight * 2;
    doc.setFontSize(9);
    doc.text(`Estado de la Venta: ${ventaData.estado}`, margin, currentY);

    return doc.output("blob");
};