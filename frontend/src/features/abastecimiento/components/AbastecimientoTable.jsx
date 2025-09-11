
import React from 'react';
import { FaEye, FaEdit, FaTrash, FaExclamationTriangle } from 'react-icons/fa';

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
        <table className="tabla-abastecimiento">
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
                        <td data-label="Empleado">{item.usuario?.nombre || 'N/A'}</td>
                        <td data-label="Producto(s)">
                            {item.producto?.nombre || 'N/A'}
                            {item.estaAgotado && (
                                <span className="depleted-reason-text">
                                    Motivo: {item.razonAgotamiento || 'No especificado'}
                                </span>
                            )}
                        </td>
                        <td data-label="Fecha de Ingreso">{formatDate(item.fechaIngreso)}</td>
                        <td data-label="Estado">
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={item.estado}
                                    onChange={() => onToggleEstado(item)}
                                />
                                <span className="slider round"></span>
                            </label>
                        </td>
                        <td data-label="Acciones">
                            <div className="icon-actions-abastecimiento">
                                <button
                                    className="table-icons-abastecimiento view-button"
                                    onClick={() => onView(item)}
                                    title="Ver Detalles"
                                >
                                    <FaEye />
                                </button>
                                <button
                                    className="table-icons-abastecimiento edit-button"
                                    onClick={() => onEdit(item)}
                                    title="Editar Registro"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    className="table-icons-abastecimiento deplete-button-abastecimiento"
                                    onClick={() => onDeplete(item)}
                                    title="Razón de Agotamiento"
                                    disabled={item.estaAgotado} // Se deshabilita si ya está agotado
                                >
                                    <FaExclamationTriangle />
                                </button>
                                <button
                                    className="table-icons-abastecimiento delete-button-abastecimiento"
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