import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faFilePdf, faBan } from "@fortawesome/free-solid-svg-icons";

// ✅ CAMBIO: Se añade 'startIndex' para la enumeración
const ComprasTable = ({ compras, onDetalle, onAnular, onGenerarPDF, startIndex }) => {
  if (!compras || compras.length === 0) {
    // Usamos una celda que ocupe toda la fila para el mensaje
    return (
        <table className="tablaProveedores"> {/* Usamos la clase de proveedores */}
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
    // ✅ CAMBIO: Se usa la clase 'tablaProveedores' para heredar el estilo
    <div className="tablaProveedores">
        <table>
            <thead>
                <tr>
                    {/* El ID ya lo habías cambiado por #, se mantiene */}
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
                            {/* La enumeración se mantiene */}
                            <td data-label="#">{startIndex + index + 1}</td>
                            <td data-label="Proveedor:">{compra.proveedor?.nombre || 'N/A'}</td>
                            <td data-label="Fecha:" className="text-center">{new Date(compra.fecha).toLocaleDateString()}</td>
                            <td data-label="Total:" className="text-right">${new Intl.NumberFormat('es-CO').format(compra.total)}</td>
                            <td data-label="Estado:" className="text-center">
                                {/* Se mantiene el span para el estilo del estado */}
                                <span className={`estado ${estadoNombre.toLowerCase()}`}>
                                    {estadoNombre}
                                </span>
                            </td>
                            {/* ✅ CAMBIO: Se usan las clases de los botones de la tabla de proveedores */}
                            <td data-label="Acciones:" className="proveedores-table-actions">
                                <button onClick={() => onDetalle(compra)} className="botonVerDetallesProveedor" title="Ver Detalles">
                                    <FontAwesomeIcon icon={faEye} />
                                </button>
                                <button onClick={() => onGenerarPDF(compra)} className="botonEditarProveedor" title="Descargar PDF">
                                    <FontAwesomeIcon icon={faFilePdf} />
                                </button>
                                {compra.estado && (
                                    <button onClick={() => onAnular(compra.idCompra)} className="botonEliminarProveedor" title="Anular Compra">
                                        <FontAwesomeIcon icon={faBan} />
                                    </button>
                                )}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    </div>
  );
};

export default ComprasTable;