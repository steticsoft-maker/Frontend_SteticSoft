import React from 'react';
import '../css/Compras.css';

// ✅ FUNCIÓN AUXILIAR: Añadida para formatear la fecha de forma segura.
const formatFechaSinTimezone = (fechaString) => {
  if (!fechaString) return 'N/A';
  // Extrae solo la parte de la fecha (ej: "2025-07-01") del string que viene de la BD.
  const fechaPart = fechaString.split('T')[0];
  const [year, month, day] = fechaPart.split('-');
  // Reordena al formato DÍA/MES/AÑO.
  return `${day}/${month}/${year}`;
};

const CompraDetalleModal = ({ compra, onClose }) => {
  if (!compra) {
    return null;
  }

  const { idCompra, fecha, proveedor, usuario, total, iva, estado } = compra;
  const productosDeLaCompra = compra.productos || [];
  const subtotal = total - iva;

  return (
    <div className="modal-Proveedores" onClick={onClose}>
      <div
        className="modal-content-Proveedores detalle-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="proveedores-modal-title">Detalle de la Compra</h3>

        <div className="proveedor-details-list">
          <p>
            <strong>ID Compra:</strong> {idCompra}
          </p>

          {/* ✅ CAMBIO APLICADO: Usamos la nueva función para mostrar la fecha. */}
          <p>
            <strong>Fecha:</strong> {formatFechaSinTimezone(fecha)}
          </p>

          <p>
            <strong>Proveedor:</strong> {proveedor?.nombre || 'N/A'}
          </p>
          <p>
            <strong>
              {proveedor?.tipo === 'Natural'
                ? 'Documento:'
                : proveedor?.tipo === 'Juridico'
                ? 'NIT'
                : 'Documento'}
              :
            </strong>{' '}
            {proveedor?.estado
              ? proveedor?.tipo === 'Natural'
                ? `${proveedor?.tipoDocumento || ''} ${
                    proveedor?.numeroDocumento || 'N/A'
                  }`
                : proveedor?.tipo === 'Juridico'
                ? proveedor?.nitEmpresa || 'N/A'
                : 'N/A'
              : 'Proveedor inactivo'}
          </p>
          <p>
            <strong>Registrado por:</strong> {usuario?.nombre || 'N/A'}
          </p>
          <p>
            <strong>Estado:</strong>
            <span className={`estado ${estado ? 'completado' : 'anulada'}`}>
              {estado ? 'Completado' : 'Anulada'}
            </span>
          </p>
        </div>

        <h4 className="modal-subtitle-proveedores">Productos y Totales</h4>
        <table className="detalle-productos-simple">
          <thead>
            <tr>
              <th>Producto</th>
              <th className="text-center">Cant.</th>
              <th className="text-right">V. Unitario</th>
              <th className="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {productosDeLaCompra.length > 0 ? (
              productosDeLaCompra.map((detalle, index) => {
                const pivot =
                  detalle.detalleCompra || detalle.CompraXProducto || {};
                const cantidad = pivot.cantidad || 0;
                const valorUnitario = pivot.valorUnitario || 0;
                const subtotalItem = cantidad * valorUnitario;
                return (
                  <tr key={detalle.idProducto || index}>
                    <td>{detalle.nombre || 'N/A'}</td>
                    <td className="text-center">{cantidad}</td>
                    <td className="text-right">
                      $
                      {Math.round(valorUnitario).toLocaleString('es-CO')}
                    </td>
                    <td className="text-right">
                      ${Math.round(subtotalItem).toLocaleString('es-CO')}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="4"
                  style={{ textAlign: 'center', fontStyle: 'italic' }}
                >
                  No hay productos en esta compra.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="compra-totales-detalle">
          <div className="total-row">
            <span>Subtotal:</span>
            <span>${Math.round(subtotal).toLocaleString('es-CO')}</span>
          </div>
          <div className="total-row">
            <span>IVA (19%):</span>
            <span>${Math.round(iva).toLocaleString('es-CO')}</span>
          </div>
          <div className="total-row total-final">
            <strong>Total:</strong>
            <strong>${Math.round(total).toLocaleString('es-CO')}</strong>
          </div>
        </div>

        <div className="proveedores-form-actions">
          <button
            className="proveedores-detalle-modal-button-cerrar"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompraDetalleModal;
