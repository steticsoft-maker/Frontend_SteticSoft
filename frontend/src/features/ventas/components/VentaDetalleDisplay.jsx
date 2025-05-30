// src/features/ventas/components/VentaDetalleDisplay.jsx
import React from 'react';

const VentaDetalleDisplay = ({ venta }) => {
  if (!venta) return <p>No hay datos de la venta para mostrar.</p>;

  return (
    <>
      <h2>Detalle de Venta #{venta.id}</h2>
      <p><strong>Cliente:</strong> {venta.cliente}</p>
      <p><strong>Documento:</strong> {venta.documento || 'N/A'}</p>
      <p><strong>Teléfono:</strong> {venta.telefono || 'N/A'}</p>
      <p><strong>Dirección:</strong> {venta.direccion || 'N/A'}</p>
      <p><strong>Fecha:</strong> {venta.fecha}</p>
      <p><strong>Estado:</strong> {venta.estado}</p>

      <table className="tablaDetallesVentas"> {/* Clase del CSS original */}
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Total Ítem</th>
          </tr>
        </thead>
        <tbody>
          {(venta.items || []).map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.nombre}</td>
              <td>{item.cantidad}</td>
              <td>${item.precio.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
              <td>${(item.precio * item.cantidad).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{marginTop: '20px', textAlign: 'right'}}>
        <p><strong>Subtotal:</strong> ${venta.subtotal.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
        <p><strong>IVA (19%):</strong> ${venta.iva.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
        <p><strong>Total Venta:</strong> ${venta.total.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
      </div>
    </>
  );
};

export default VentaDetalleDisplay;