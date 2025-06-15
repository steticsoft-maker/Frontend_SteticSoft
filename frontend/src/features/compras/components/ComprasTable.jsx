// src/features/compras/components/ComprasTable.jsx
import React from 'react';
// NUEVO: Importamos los íconos que vamos a usar
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faFilePdf, faBan } from "@fortawesome/free-solid-svg-icons"; // faCheckCircle, faClock removed

// CAMBIO: La tabla ahora espera una función 'onEstadoChange'
const ComprasTable = ({ compras, onDetalle, onAnular, onEstadoChange, onGenerarPDF }) => {
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
          // El estado `true` es Recibida/Completado y `false` es Anulada
          // Para el selector, vamos a manejar 'Pendiente' y 'Completado' como estados activos.
          // Tu API parece manejar un estado booleano general y un estado de proceso. Aquí simplificaremos
          // basado en el estado booleano general, pero puedes adaptarlo.
          const estadoActual = compra.estado ? (compra.estadoProceso || 'Completado') : 'Anulada';

          return (
            <tr key={compra.idCompra}>
              <td data-label="ID:" className="text-center">{compra.idCompra}</td>
              <td data-label="Proveedor:">{compra.proveedor?.nombre || 'N/A'}</td>
              <td data-label="Fecha:" className="text-center">{new Date(compra.fecha).toLocaleDateString()}</td>
              <td data-label="Total:" className="text-right">${new Intl.NumberFormat('es-CO').format(compra.total)}</td>
              <td data-label="Estado:" className="text-center">
                {/* CAMBIO: Lógica para mostrar el estado */}
                {/* Si la compra está anulada, muestra la etiqueta. Si no, muestra el selector. */}
                {!compra.estado ? (
                  <span className="estado anulado">Anulada</span>
                ) : (
                  <select
                    value={estadoActual} // Deberías tener un estado para esto en la página principal
                    onChange={(e) => onEstadoChange(compra.idCompra, e.target.value)}
                    className={`estado-select estado-${estadoActual.toLowerCase()}`}
                    title="Cambiar estado de la compra"
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Completado">Completado</option>
                  </select>
                )}
              </td>
              <td data-label="Acciones:" className="acciones-compras">
                {/* CAMBIO: Botones con íconos */}
                <button onClick={() => onDetalle(compra)} className="btn-accion btn-ver" title="Ver Detalles">
                  <FontAwesomeIcon icon={faEye} />
                </button>
                <button onClick={() => onGenerarPDF(compra)} className="btn-accion btn-pdf-tabla" title="Descargar PDF">
                  <FontAwesomeIcon icon={faFilePdf} />
                </button>
                {/* Solo se puede anular si está activa */}
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