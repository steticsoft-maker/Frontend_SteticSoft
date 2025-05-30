// src/features/ventas/components/VentasTable.jsx
import React from 'react';
import { FaEye, FaFilePdf, FaBan } from 'react-icons/fa';

const VentasTable = ({
  ventas,
  onShowDetails,
  onGenerarPDF,
  onAnularVenta,
  onEstadoChange,
  currentPage, // Para la enumeración correcta si usas paginación en la página
  itemsPerPage // Para la enumeración correcta
}) => {
  if (!ventas || ventas.length === 0) {
    return <p>No hay ventas para mostrar.</p>;
  }

  return (
    <table className="ventas-table"> {/* Clase del CSS original */}
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
          <tr key={venta.id}>
            <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
            <td>{venta.fecha}</td>
            <td>{venta.cliente}</td>
            <td>{venta.documento || 'N/A'}</td>
            <td>${venta.total ? venta.total.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : '0'}</td>
            <td>
              <select
                value={venta.estado}
                onChange={(e) => onEstadoChange(venta.id, e.target.value)}
                className={`estado-select estado-${(venta.estado || "").toLowerCase().replace(" ", "-")}`}
                disabled={venta.estado === "Anulada"}
              >
                <option value="En proceso">En proceso</option>
                <option value="Activa">Activa</option>
                <option value="Completada">Completada</option> {/* Estado adicional común */}
                <option value="Anulada" disabled={venta.estado !== "Anulada"}>Anulada</option>
              </select>
            </td>
            <td>
              <div className="accionesTablaVentas"> {/* Clase del CSS original */}
                <button
                  className="botonDetalleVenta" /* Clase del CSS original */
                  onClick={() => onShowDetails(venta)}
                  title="Ver detalles"
                >
                  <FaEye />
                </button>
                <button
                  className="botonPdfVenta" /* Clase del CSS original */
                  onClick={() => onGenerarPDF(venta)}
                  title="Generar PDF"
                >
                  <FaFilePdf />
                </button>
                <button
                  className="botonAnularVenta" /* Clase del CSS original */
                  onClick={() => onAnularVenta(venta)}
                  title="Anular venta"
                  disabled={venta.estado === "Anulada"}
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