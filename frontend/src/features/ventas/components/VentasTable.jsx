// src/features/ventas/components/VentasTable.jsx
import React from 'react';
import { FaEye, FaFilePdf, FaBan } from 'react-icons/fa';

const VentasTable = ({
  ventas,
  onShowDetails,
  onGenerarPDF,
  onAnularVenta,
  onEstadoChange,
  currentPage,
  itemsPerPage
}) => {
  if (!ventas || ventas.length === 0) {
    return <p>No hay ventas para mostrar.</p>;
  }

  return (
    <table className="ventas-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Fecha</th>
          <th>Cliente</th>
          <th>Documento</th>
          <th>Total</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {ventas.map((venta, index) => (
          <tr key={venta.idVenta || venta.id || index}>
            <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
            <td>{new Date(venta.fecha).toLocaleDateString()}</td>
            <td>{venta.cliente ? `${venta.cliente.nombre} ${venta.cliente.apellido}` : 'N/A'}</td>
            <td>{venta.cliente?.numeroDocumento || 'N/A'}</td>
            <td>${venta.total ? parseFloat(venta.total).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : '0'}</td>
            <td>
              <select
                value={venta.idEstado}
                onChange={(e) => onEstadoChange(venta.idVenta, e.target.value)}
                className={`estado-select estado-${(venta.estado?.nombre || "").toLowerCase().replace(" ", "-")}`}
                disabled={venta.estado?.nombre === "Anulada"}
              >
                <option value="1">Activa</option>
                <option value="2">En proceso</option>
                <option value="3">Completada</option>
                <option value="4" disabled>Anulada</option>
              </select>
            </td>
            <td>
              <div className="accionesTablaVentas">
                <button
                  className="botonDetalleVenta"
                  onClick={() => onShowDetails(venta)}
                  title="Ver detalles"
                >
                  <FaEye />
                </button>
                <button
                  className="botonPdfVenta"
                  onClick={() => onGenerarPDF(venta)}
                  title="Generar PDF"
                >
                  <FaFilePdf />
                </button>
                <button
                  className="botonAnularVenta"
                  onClick={() => onAnularVenta(venta)}
                  title="Anular venta"
                  disabled={venta.estado?.nombre === "Anulada"}
                >
                  <FaBan />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default VentasTable;