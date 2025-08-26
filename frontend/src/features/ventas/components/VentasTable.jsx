// src/features/ventas/components/VentasTable.jsx
import React from 'react';
import { FaEye, FaFilePdf, FaBan } from 'react-icons/fa';

const VentasTable = ({
    ventas,
    onShowDetails,
    onGenerarPDF,
    onAnularVenta,
    onEstadoChange,
}) => {
    // Validación inicial para asegurar que `ventas` sea un array
    if (!ventas || !Array.isArray(ventas) || ventas.length === 0) {
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
                {ventas.map((venta) => (
                    <tr key={venta.id || venta.fecha}>
                        <td>{venta.id || 'N/A'}</td>
                        <td>{venta.fecha || 'N/A'}</td>
                        <td>{venta.cliente || 'N/A'}</td>
                        <td>{venta.documento || 'N/A'}</td>
                        <td>
                            {venta.total ? `$${venta.total.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : '$0'}
                        </td>
                        <td>
                            <select
                                value={venta.estado || 'Activa'}
                                onChange={(e) => onEstadoChange(venta.id, e.target.value)}
                                className={`estado-select estado-${(venta.estado || 'activa').toLowerCase().replace(" ", "-")}`}
                                disabled={venta.estado === "Anulada"}
                            >
                                <option value="En proceso">En proceso</option>
                                <option value="Activa">Activa</option>
                                <option value="Completada">Completada</option>
                                <option value="Anulada" disabled={venta.estado !== "Anulada"}>Anulada</option>
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