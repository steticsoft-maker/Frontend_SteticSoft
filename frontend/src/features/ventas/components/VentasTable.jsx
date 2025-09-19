import React from 'react';
import { FaEye, FaFilePdf, FaBan } from 'react-icons/fa';
import "../../../shared/styles/table-common.css";

const VentasTable = ({
    ventas,
    onShowDetails,
    onGenerarPDF,
    onAnularVenta,
    onEstadoChange,
    currentPage,
    itemsPerPage
}) => {
    // Escudo de protección: Si 'ventas' no es un array, no se intenta renderizar.
    if (!Array.isArray(ventas) || ventas.length === 0) {
        return <p>No hay ventas para mostrar.</p>;
    }

    const estadosDisponibles = [
        { id: 1, nombre: 'Activa' },
        { id: 2, nombre: 'En proceso' },
        { id: 3, nombre: 'Completada' },
        { id: 4, nombre: 'Anulada' }
    ];

    return (
        <table className="table-main">
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
                {/* Escudo de protección: Filtra cualquier posible valor nulo o undefined en el array. */}
                {ventas.filter(venta => venta).map((venta, index) => {
                    const estadoActualNombre = venta.estadoDetalle?.nombreEstado || "";
                    
                    return (
                        <tr key={venta.idVenta || index}>
                            <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                            <td>{new Date(venta.fecha).toLocaleDateString('es-CO')}</td>
                            <td>{venta.cliente ? `${venta.cliente.nombre} ${venta.cliente.apellido || ''}`.trim() : 'N/A'}</td>
                            {/* ✅ CORRECCIÓN: Usar 'numeroDocumento' como lo envía el backend. */}
                            <td>{venta.cliente?.numeroDocumento || 'N/A'}</td>
                            <td>${parseFloat(venta.total || 0).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                            <td>
                                <select
                                    value={venta.idEstado}
                                    onChange={(e) => onEstadoChange(venta.idVenta, e.target.value)}
                                    className={`estado-select estado-${estadoActualNombre.toLowerCase().replace(" ", "-")}`}
                                    disabled={estadoActualNombre === "Anulada"}
                                >
                                    {estadosDisponibles.map(estado => (
                                        <option 
                                            key={estado.id} 
                                            value={estado.id}
                                            disabled={estado.nombre === 'Anulada'}
                                        >
                                            {estado.nombre}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                <div className="table-iconos">
                                    <button className="table-button btn-view" onClick={() => onShowDetails(venta)} title="Ver detalles"><FaEye /></button>
                                    <button className="table-button btn-history" onClick={() => onGenerarPDF(venta)} title="Generar PDF"><FaFilePdf /></button>
                                    <button className="table-button btn-delete" onClick={() => onAnularVenta(venta)} title="Anular venta" disabled={estadoActualNombre === "Anulada"}><FaBan /></button>
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default VentasTable;