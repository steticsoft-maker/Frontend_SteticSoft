// RUTA: src/features/compras/components/CompraDetalleModal.jsx
import React from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faTimes } from "@fortawesome/free-solid-svg-icons";
import '../css/Compras.css';
import logoEmpresa from '/logo.png'; 

const CompraDetalleModal = ({ compra, onClose }) => {
  if (!compra) {
    return null;
  }

  const {
    idCompra,
    fecha,
    proveedor,
    usuario,
    total,
    iva,
    estado
  } = compra;

  const productosDeLaCompra = compra.productos || [];
  const subtotal = total - iva;

  const handleGeneratePdf = () => {
    const doc = new jsPDF();
    doc.addImage(logoEmpresa, 'PNG', 10, 10, 30, 30);
    doc.setFontSize(18);
    doc.text(`Detalle de Compra N°: ${idCompra}`, 50, 25);
    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date(fecha).toLocaleDateString()}`, 10, 50);
    doc.text(`Proveedor: ${proveedor?.nombre || 'No especificado'}`, 10, 57);
    doc.text(`Registrado por: ${usuario?.nombre || 'N/A'}`, 10, 64);
    doc.text(`Estado: ${estado ? 'Recibida' : 'Anulada'}`, 10, 71);
    
    const tableColumn = ["Producto", "Cant.", "Vlr. Unitario", "Total"];
    const tableRows = productosDeLaCompra.map(detalle => {
      // ===== CORRECCIÓN #1 (Para la lógica del PDF) =====
      const pivot = detalle.detalleCompra || detalle.CompraXProducto || {}; 
      
      const cantidad = pivot.cantidad || 0;
      const valorUnitario = pivot.valorUnitario || 0;
      const subtotalItem = cantidad * valorUnitario;
      return [ detalle.nombre, cantidad, `$${Number(valorUnitario).toLocaleString('es-CO')}`, `$${subtotalItem.toLocaleString('es-CO')}`];
    });

    doc.autoTable(tableColumn, tableRows, { startY: 80 });
    const finalY = doc.lastAutoTable.finalY || 90;
    doc.text(`Subtotal: $${Number(subtotal).toLocaleString('es-CO')}`, 190, finalY + 10, { align: 'right' });
    doc.text(`IVA (19%): $${Number(iva).toLocaleString('es-CO')}`, 190, finalY + 17, { align: 'right' });
    doc.setFontSize(14);
    doc.text(`Total: $${Number(total).toLocaleString('es-CO')}`, 190, finalY + 25, { align: 'right' });
    doc.save(`compra_${idCompra}.pdf`);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content rol-details-modal-content">
        <div className="modal-header">
          <h2>Detalle de la Compra</h2>
          <button onClick={onClose} className="close-button">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="modal-body">
          <div className="rol-details-grid">
            <div className="details-section">
              <h3>Información General</h3>
              <div className="info-item"><span className="info-label">ID Compra:</span><span className="info-value">{idCompra}</span></div>
              <div className="info-item"><span className="info-label">Fecha:</span><span className="info-value">{new Date(fecha).toLocaleDateString()}</span></div>
              <div className="info-item"><span className="info-label">Proveedor:</span><span className="info-value">{proveedor?.nombre || 'N/A'}</span></div>
              <div className="info-item"><span className="info-label">Registrado por:</span><span className="info-value">{usuario?.nombre || 'N/A'}</span></div>
              <div className="info-item"><span className="info-label">Estado:</span><span className="info-value"><span className={`estado ${estado ? 'activo' : 'anulado'}`}>{estado ? 'Recibida' : 'Anulada'}</span></span></div>
            </div>

            <div className="permissions-section">
              <h3>Productos y Totales</h3>
              <table className="detalle-productos-simple">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th className="text-center">Cant.</th>
                    <th className="text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {productosDeLaCompra.length > 0 ? productosDeLaCompra.map((detalle, index) => {
                    // ===== CORRECCIÓN #2 (Para la tabla que se ve en pantalla) =====
                    const pivot = detalle.detalleCompra || detalle.CompraXProducto || {};

                    const cantidad = pivot.cantidad || 0;
                    const valorUnitario = pivot.valorUnitario || 0;
                    const subtotalItem = cantidad * valorUnitario;
                    return (
                      <tr key={detalle.idProducto || index}>
                        <td>{detalle.nombre || 'N/A'}</td>
                        <td className="text-center">{cantidad}</td>
                        <td className="text-right">${subtotalItem.toLocaleString('es-CO')}</td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center', fontStyle: 'italic' }}>No hay productos en esta compra.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="compra-totales-detalle">
                  <div className="total-row"><span>Subtotal:</span><span>${Number(subtotal).toLocaleString('es-CO')}</span></div>
                  <div className="total-row"><span>IVA (19%):</span><span>${Number(iva).toLocaleString('es-CO')}</span></div>
                  <div className="total-row total-final"><strong>Total:</strong><strong>${Number(total).toLocaleString('es-CO')}</strong></div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={handleGeneratePdf} className="btn-pdf">
            <FontAwesomeIcon icon={faFilePdf} /> Descargar PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompraDetalleModal;