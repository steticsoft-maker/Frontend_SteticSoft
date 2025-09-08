// src/features/ventas/components/VentaDetalleDisplay.jsx
import React from 'react';

const VentaDetalleDisplay = ({ venta }) => {
  if (!venta) return <p>No hay datos de la venta para mostrar.</p>;

  // Función para formatear moneda de forma segura
  const formatCurrency = (value) => {
    const number = parseFloat(value);
    if (isNaN(number)) {
      return '$0.00';
    }
    return number.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const clienteNombre = venta.cliente ? `${venta.cliente.nombre} ${venta.cliente.apellido}`.trim() : 'N/A';
  const fechaFormateada = venta.fecha ? new Date(venta.fecha).toLocaleDateString('es-CO') : 'N/A';
  const estadoNombre = venta.estado?.nombre || 'N/A';

  return (
    <>
      <h2>Detalle de Venta #{venta.idVenta || venta.id}</h2>
      <p><strong>Cliente:</strong> {clienteNombre}</p>
      <p><strong>Documento:</strong> {venta.cliente?.documento || 'N/A'}</p>
      <p><strong>Teléfono:</strong> {venta.cliente?.telefono || 'N/A'}</p>
      <p><strong>Dirección:</strong> {venta.cliente?.direccion || 'N/A'}</p>
      <p><strong>Fecha:</strong> {fechaFormateada}</p>
      <p><strong>Estado:</strong> {estadoNombre}</p>

      <table className="tablaDetallesVentas">
        <thead>
          <tr>
            <th>#</th>
            <th>Ítem</th>
            <th>Cantidad</th>
            <th>Valor Unitario</th>
            <th>Total Ítem</th>
          </tr>
        </thead>
        <tbody>
          {(venta.productos || []).map((item, index) => (
            <tr key={`prod-${item.idProducto || index}`}>
              <td>{index + 1}</td>
              <td>{item.nombre}</td>
              <td>{item.cantidad}</td>
              <td>{formatCurrency(item.valorUnitario)}</td>
              <td>{formatCurrency((item.valorUnitario || 0) * (item.cantidad || 0))}</td>
            </tr>
          ))}
          {(venta.servicios || []).map((item, index) => (
            <tr key={`serv-${item.idServicio || index}`}>
              <td>{index + 1 + (venta.productos?.length || 0)}</td>
              <td>{item.nombre}</td>
              <td>1</td>
              <td>{formatCurrency(item.valorServicio)}</td>
              <td>{formatCurrency(item.valorServicio)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <p><strong>Subtotal:</strong> {formatCurrency(venta.subtotal)}</p>
        <p><strong>IVA (19%):</strong> {formatCurrency(venta.iva)}</p>
        <p><strong>Total Venta:</strong> {formatCurrency(venta.total)}</p>
      </div>
    </>
  );
};

export default VentaDetalleDisplay;