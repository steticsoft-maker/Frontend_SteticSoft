// src/features/compras/components/CompraDetalleModal.jsx
import React from 'react';

const CompraDetalleModal = ({ isOpen, onClose, compra }) => {
  if (!isOpen || !compra) return null;

  return (
    <div className="modal-compras"> {/* Clase del CSS original */}
      <div className="modal-content-compras"> {/* Clase del CSS original */}
        <h2>Detalle de Compra #{compra.id}</h2>
        <p><strong>Proveedor:</strong> {compra.proveedor}</p>
        <p><strong>Fecha:</strong> {compra.fecha}</p>
        <p><strong>Total:</strong> {typeof compra.total === 'number' ? `$${compra.total.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : compra.totalFormateado || compra.total}</p>
        <p><strong>Estado:</strong> {compra.estado}</p>
        {compra.metodoPago && <p><strong>Método Pago:</strong> {compra.metodoPago}</p>}
        {compra.subtotal !== undefined && <p><strong>Subtotal:</strong> ${compra.subtotal.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</p>}
        {compra.iva !== undefined && <p><strong>IVA (19%):</strong> ${compra.iva.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</p>}


        <h4>Productos/Items:</h4>
        <table className="tablaDetallesCompras"> {/* Clase del CSS original */}
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {(compra.productos || compra.items || []).map((producto, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{producto.nombre}</td>
                <td>{producto.cantidad}</td>
                <td>${producto.precio.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
                <td>${(producto.precio * producto.cantidad).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="botonCerrarDetallesCompra" onClick={onClose}>Cerrar</button> {/* Clase del CSS original */}
      </div>
    </div>
  );
};
export default CompraDetalleModal;