// src/features/compras/components/ComprasTable.jsx
import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faFilePdf, faBan } from "@fortawesome/free-solid-svg-icons";

// CAMBIO 1: Se elimina 'onEstadoChange' de las props.
const ComprasTable = ({ compras, onDetalle, onAnular, onGenerarPDF }) => {
  if (!compras || compras.length === 0) {
    return <p>No hay compras para mostrar.</p>;
  }

  return (
    <table className="tabla-compras">
      <thead>
        <tr>
          <th className="text-center">ID</th>
          <th>Proveedor</th>
          <th className="text-center">Fecha</th>
          <th className="text-right">Total</th>
          <th className="text-center">Estado</th>
          <th className="text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {compras.map((compra) => {
          // Mantenemos esta lógica para determinar el nombre del estado a mostrar
          const estadoNombre = compra.estado ? (compra.estadoProceso || 'Completado') : 'Anulada';

          return (
            <tr key={compra.idCompra}>
              <td data-label="ID:" className="text-center">{compra.idCompra}</td>
              <td data-label="Proveedor:">{compra.proveedor?.nombre || 'N/A'}</td>
              <td data-label="Fecha:" className="text-center">{new Date(compra.fecha).toLocaleDateString()}</td>
              <td data-label="Total:" className="text-right">${new Intl.NumberFormat('es-CO').format(compra.total)}</td>
              
              {/* CAMBIO 2: Se reemplaza el <select> por un <span> que solo muestra el texto del estado. */}
              <td data-label="Estado:" className="text-center">
                <span className={`estado ${estadoNombre.toLowerCase().replace(' ', '-')}`}>
                  {estadoNombre}
                </span>
              </td>

              <td data-label="Acciones:" className="acciones-compras">
                <button onClick={() => onDetalle(compra)} className="btn-accion btn-ver" title="Ver Detalles">
                  <FontAwesomeIcon icon={faEye} />
                </button>
                <button onClick={() => onGenerarPDF(compra)} className="btn-accion btn-pdf-tabla" title="Descargar PDF">
                  <FontAwesomeIcon icon={faFilePdf} />
                </button>
                {/* La lógica para el botón de anular no cambia */}
                {compra.estado && (
                  <button onClick={() => onAnular(compra.idCompra)} className="btn-accion btn-anular" title="Anular Compra">
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