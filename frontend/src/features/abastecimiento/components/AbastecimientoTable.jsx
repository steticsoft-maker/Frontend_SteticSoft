
import React from 'react';
import { FaEye, FaEdit, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import '../../../shared/styles/table-common.css';

const AbastecimientoTable = ({ 
    abastecimientos, 
    onView, 
    onEdit, 
    onDeleteConfirm, 
    onDeplete, 
    onToggleEstado, 
    startIndex 
}) => {

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-CO', options);
    };

    return (
        <table className="table-main">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Empleado</th>
                    <th>Producto(s)</th>
                    <th>Fecha de Ingreso</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {abastecimientos.map((item, index) => (
                    <tr key={item.idAbastecimiento} className={item.estaAgotado ? 'depleted-row' : ''}>
                        <td data-label="#">{startIndex + index + 1}</td>
                        <td data-label="Empleado:">
                            {`${item.usuario?.rol?.nombre || 'Empleado'} (${item.usuario?.correo || 'N/A'})`}
                        </td>
                        <td data-label="Producto(s):">
                            {item.producto?.nombre || 'N/A'}
                            {item.estaAgotado && (
                                <span className="depleted-reason-text">
                                    Motivo: {item.razonAgotamiento || 'No especificado'}
                                </span>
                            )}
                        </td>
                        <td data-label="Fecha de Ingreso:">{formatDate(item.fechaIngreso)}</td>
                        <td data-label="Estado:">
                            <label className="table-switch">
                                <input
                                    type="checkbox"
                                    checked={item.estado}
                                    onChange={() => onToggleEstado(item)}
                                />
                                <span className="table-slider"></span>
                            </label>
                        </td>
                        <td data-label="Acciones:">
                            <div className="table-iconos">
                                <button
                                    className="table-button btn-view"
                                    onClick={() => onView(item)}
                                    title="Ver Detalles"
                                >
                                    <FaEye />
                                </button>
                                <button
                                    className="table-button btn-edit"
                                    onClick={() => onEdit(item)}
                                    title="Editar Registro"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    className="table-button btn-warning"
                                    onClick={() => onDeplete(item)}
                                    title="Razón de Agotamiento"
                                    disabled={item.estaAgotado}
                                >
                                    <FaExclamationTriangle />
                                </button>
                                <button
                                    className="table-button btn-delete"
                                    onClick={() => onDeleteConfirm(item)}
                                    title="Eliminar Registro"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default AbastecimientoTable;