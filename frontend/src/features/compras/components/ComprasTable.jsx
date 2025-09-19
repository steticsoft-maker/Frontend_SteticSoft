import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faFilePdf, faBan } from "@fortawesome/free-solid-svg-icons";
import "../../../shared/styles/table-common.css";

// ✅ FUNCIÓN CLAVE: Formatea la fecha sin ser afectada por la zona horaria.
const formatFechaSinTimezone = (fechaString) => {
  if (!fechaString) return 'N/A';

  // Extrae solo la parte de la fecha (ej: "2025-07-04") del string que viene de la BD.
  const fechaPart = fechaString.split('T')[0];
  const [year, month, day] = fechaPart.split('-');

  // Reordena al formato DÍA/MES/AÑO.
  return `${day}/${month}/${year}`;
};

const ComprasTable = ({ compras, onDetalle, onAnular, onGenerarPDF, startIndex }) => {
  if (!compras || compras.length === 0) {
    return (
      <table className="table-main">
        <thead>
          <tr>
            <th>#</th>
            <th>Proveedor</th>
            <th>Fecha</th>
            <th className="text-right">Total</th>
            <th className="text-center">Estado</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="6" style={{ textAlign: 'center' }}>No hay compras para mostrar.</td>
          </tr>
        </tbody>
      </table>
    );
  }

  return (
    <table className="table-main">
        <thead>
          <tr>
            <th>#</th>
            <th>Proveedor</th>
            <th>Fecha</th>
            <th className="text-right">Total</th>
            <th className="text-center">Estado</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {compras.map((compra, index) => {
            const estadoNombre = compra.estado ? 'Completado' : 'Anulada';

            return (
              <tr key={compra.idCompra}>
                <td data-label="#">{startIndex + index + 1}</td>
                <td data-label="Proveedor:">{compra.proveedor?.nombre || 'N/A'}</td>
                
                {/* ✅ CAMBIO APLICADO: Se usa la nueva función para mostrar la fecha correcta. */}
                <td data-label="Fecha:" className="text-center">
                  {formatFechaSinTimezone(compra.fecha)}
                </td>

                <td data-label="Total:" className="text-right">${new Intl.NumberFormat('es-CO').format(compra.total)}</td>
                <td data-label="Estado:" className="text-center">
                  <span className={`estado ${estadoNombre.toLowerCase()}`}>
                    {estadoNombre}
                  </span>
                </td>
                <td data-label="Acciones:" className="table-iconos">
                  <button onClick={() => onDetalle(compra)} className="table-button btn-view" title="Ver Detalles">
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button onClick={() => onGenerarPDF(compra)} className="table-button btn-history" title="Descargar PDF">
                    <FontAwesomeIcon icon={faFilePdf} />
                  </button>
                  {compra.estado && (
                    <button onClick={() => onAnular(compra)} className="table-button btn-delete" title="Anular Compra">
                      <FontAwesomeIcon icon={faBan} />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
  );
};

export default ComprasTable;