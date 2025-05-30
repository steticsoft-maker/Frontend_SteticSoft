// src/features/compras/components/ComprasTable.jsx
import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faFilePdf, faBan } from "@fortawesome/free-solid-svg-icons";

const ComprasTable = ({ compras, onShowDetails, onGenerarPDF, onAnular, onEstadoChange }) => {
  return (
    <div className="tablaCompras"> {/* Clase del CSS original */}
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Proveedor</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {compras.map((compra, index) => (
            <tr key={compra.id || index}>
              <td>{index + 1}</td>
              <td>{compra.proveedor}</td>
              <td>{compra.fecha}</td>
              <td>{typeof compra.total === 'number' ? `$${compra.total.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : compra.totalFormateado || compra.total}</td>
              <td className={`estado ${compra.estado?.toLowerCase()}`}>
                {compra.estado === "Anulada" ? (
                  <span>Anulada</span>
                ) : (
                  <select
                    value={compra.estado}
                    onChange={(e) => onEstadoChange(compra.id, e.target.value)}
                    className={`estado-select estado-${(compra.estado || "").toLowerCase().replace(" ", "-")}`}
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Completado">Completado</option>
                    {/* <option value="Anulada" disabled>Anulada</option> */}
                  </select>
                )}
              </td>
              <td className="accionesTablaCompras">
                <button className="botonVerDetallesCompra" onClick={() => onShowDetails(compra)} title="Ver detalles">
                  <FontAwesomeIcon icon={faEye} />
                </button>
                <button className="botonGenerarPDF" onClick={() => onGenerarPDF(compra)} title="Generar PDF">
                  <FontAwesomeIcon icon={faFilePdf} />
                </button>
                {compra.estado !== "Anulada" && (
                  <button className="botonAnularCompra" onClick={() => onAnular(compra)} title="Anular compra">
                    <FontAwesomeIcon icon={faBan} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default ComprasTable;