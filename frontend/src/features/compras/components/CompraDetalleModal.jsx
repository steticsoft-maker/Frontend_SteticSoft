import React from 'react';
import '../css/Compras.css';

const CompraDetalleModal = ({ compra, onClose }) => {
  if (!compra) {
    return null;
  }

  const { idCompra, fecha, proveedor, usuario, total, iva, estado } = compra;
  const productosDeLaCompra = compra.productos || [];
  const subtotal = total - iva;

  return (
    <div className="modal-Proveedores" onClick={onClose}>
      <div className="modal-content-Proveedores detalle-modal" onClick={(e) => e.stopPropagation()}>
        
        <h3 className="proveedores-modal-title">Detalle de la Compra</h3>
        
        {/* --- Información General --- */}
        <div className="proveedor-details-list">
            <p><strong>ID Compra:</strong> {idCompra}</p>
            <p><strong>Fecha:</strong> {new Date(fecha).toLocaleDateString('es-CO')}</p>
            <p><strong>Proveedor:</strong> {proveedor?.nombre || 'N/A'}</p>
            <p><strong>Registrado por:</strong> {usuario?.nombre || 'N/A'}</p>
            <p><strong>Estado:</strong> 
                <span className={`estado ${estado ? 'completado' : 'anulada'}`}>
                    {estado ? 'Completado' : 'Anulada'}
                </span>
            </p>
        </div>

        {/* --- Productos y Totales --- */}
        <h4 className="modal-subtitle-proveedores">Productos y Totales</h4>
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

        <div className="proveedores-form-actions">
            <button className="proveedores-detalle-modal-button-cerrar" onClick={onClose}>
                Cerrar
            </button>
            {/* El botón de PDF ha sido eliminado */}
        </div>

      </div>
    </div>
  );
};

export default CompraDetalleModal;