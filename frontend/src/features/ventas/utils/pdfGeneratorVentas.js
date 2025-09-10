import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ✅ FUNCIÓN AUXILIAR 1: Formatea moneda de forma segura, evitando errores.
const formatCurrency = (value) => {
    const number = parseFloat(value);
    // Si el valor es nulo, indefinido o no es un número, devuelve un valor por defecto.
    if (isNaN(number)) {
        return '$0';
    }
    return `$${number.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

// ✅ FUNCIÓN AUXILIAR 2: Formatea fechas de forma segura.
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        // Asegura que la fecha se interprete correctamente antes de formatearla.
        return new Date(dateString).toLocaleDateString('es-CO', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
        return 'Fecha inválida';
    }
};

export const generarPDFVentaUtil = (venta) => {
    // ✅ CORRECCIÓN: Validación inicial para asegurar que los datos de la venta existen.
    if (!venta || typeof venta !== 'object') {
        throw new Error("No se proporcionaron datos válidos para generar el PDF.");
    }

    const doc = new jsPDF();

    // Encabezado del documento (tu información de negocio)
    doc.setFontSize(18);
    doc.text("Factura de Venta", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.text(`SteticSoft - NIT XXXXXXXX-X`, 105, 28, { align: "center" });
    doc.text(`Dirección: Tu Dirección Aquí - Tel: Tu Teléfono`, 105, 33, { align: "center" });
    doc.line(14, 38, 196, 38);

    // Datos de la Venta y Cliente
    let currentY = 45;
    const lineHeight = 6;
    doc.setFontSize(12);
    // ✅ CORRECCIÓN: Usar los nombres de propiedad correctos y las funciones seguras.
    doc.text(`Factura N°: ${venta.idVenta ?? 'N/A'}`, 14, currentY);
    doc.text(`Fecha: ${formatDate(venta.fecha)}`, 130, currentY);
    currentY += lineHeight * 1.5;

    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text("Cliente:", 14, currentY);
    doc.setFont(undefined, 'normal');
    // ✅ CORRECCIÓN: Acceder a los datos anidados del cliente de forma segura.
    doc.text(`${(venta.cliente?.nombre || '')} ${(venta.cliente?.apellido || '')}`.trim(), 35, currentY);
    currentY += lineHeight;
    doc.text(`Documento:`, 14, currentY);
    doc.text(`${venta.cliente?.numeroDocumento || 'N/A'}`, 35, currentY);
    currentY += lineHeight;
    doc.text(`Teléfono:`, 14, currentY);
    doc.text(`${venta.cliente?.telefono || 'N/A'}`, 35, currentY);
    currentY += lineHeight;
    doc.text(`Dirección:`, 14, currentY);
    doc.text(`${venta.cliente?.direccion || 'N/A'}`, 35, currentY);
    currentY += lineHeight * 1.5;

    // ✅ CORRECCIÓN: Construir la tabla a partir de 'productos' y 'servicios'.
    const tableRows = [];
    let itemCounter = 1;

    (venta.productos || []).forEach(item => {
        const cantidad = item.detalleProductoVenta?.cantidad ?? 1;
        const valorUnitario = item.detalleProductoVenta?.valorUnitario ?? 0;
        tableRows.push([
            itemCounter++,
            item.nombre || 'Producto sin nombre',
            cantidad,
            formatCurrency(valorUnitario),
            formatCurrency(cantidad * valorUnitario)
        ]);
    });

    (venta.servicios || []).forEach(item => {
        const valorServicio = item.detalleServicioVenta?.valorServicio ?? 0;
        tableRows.push([
            itemCounter++,
            item.nombre || 'Servicio sin nombre',
            1, // Los servicios suelen tener cantidad 1
            formatCurrency(valorServicio),
            formatCurrency(valorServicio)
        ]);
    });
    
    autoTable(doc, {
        head: [["#", "Producto/Servicio", "Cant.", "Vlr. Unit.", "Vlr. Total"]],
        body: tableRows.length > 0 ? tableRows : [["-", "No hay ítems registrados", "-", "-", "-"]],
        startY: currentY,
        theme: 'grid',
        headStyles: { fillColor: [233, 120, 208], textColor: 255, fontStyle: 'bold' },
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

    // ✅ CORRECCIÓN: Calcular subtotal de forma segura y usar formateadores para todos los totales.
    const totalVenta = parseFloat(venta.total) || 0;
    const ivaVenta = parseFloat(venta.iva) || 0;
    const subtotalVenta = totalVenta - ivaVenta;
    
    const totalsXPosition = 130;
    doc.setFontSize(10);
    doc.text("Subtotal:", totalsXPosition, currentY, { align: 'left' });
    doc.text(formatCurrency(subtotalVenta), 196, currentY, { align: 'right' });
    currentY += lineHeight;
    doc.text("IVA (19%):", totalsXPosition, currentY, { align: 'left' });
    doc.text(formatCurrency(ivaVenta), 196, currentY, { align: 'right' });
    currentY += lineHeight;
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text("TOTAL A PAGAR:", totalsXPosition, currentY, { align: 'left'});
    doc.text(formatCurrency(totalVenta), 196, currentY, { align: 'right'});
    doc.setFont(undefined, 'normal');

    currentY += lineHeight * 2;
    doc.setFontSize(9);
    // ✅ CORRECCIÓN: Acceder al nombre del estado de forma segura.
    doc.text(`Estado de la Venta: ${venta.estadoDetalle?.nombreEstado || 'N/A'}`, 14, currentY);

    return doc.output("blob");
};