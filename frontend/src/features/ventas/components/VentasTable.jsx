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
    // ✅ ESCUDO DE PROTECCIÓN: Si 'ventas' no es un array, no intentes renderizar.
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
                {/* ✅ ESCUDO DE PROTECCIÓN: Filtra cualquier posible valor nulo o undefined en el array antes de mapear. */}
                {ventas.filter(venta => venta).map((venta, index) => {
                    const estadoActualNombre = venta.estadoDetalle?.nombreEstado || "";
                    
                    return (
                        <tr key={venta.idVenta || index}>
                            <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                            <td>{new Date(venta.fecha).toLocaleDateString('es-CO')}</td>
                            <td>{venta.cliente ? `${venta.cliente.nombre} ${venta.cliente.apellido || ''}`.trim() : 'N/A'}</td>
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
                                <div className="accionesTablaVentas">
                                    <button className="botonDetalleVenta" onClick={() => onShowDetails(venta)} title="Ver detalles"><FaEye /></button>
                                    <button className="botonPdfVenta" onClick={() => onGenerarPDF(venta)} title="Generar PDF"><FaFilePdf /></button>
                                    <button className="botonAnularVenta" onClick={() => onAnularVenta(venta)} title="Anular venta" disabled={estadoActualNombre === "Anulada"}><FaBan /></button>
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