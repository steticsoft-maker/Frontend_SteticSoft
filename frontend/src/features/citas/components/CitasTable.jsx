// src/features/citas/components/CitasTable.jsx
import React from 'react';
import moment from 'moment';
import { FaEye, FaCheckCircle, FaTimesCircle, FaEdit } from 'react-icons/fa';

const CitasTable = ({ citas, onViewDetails, onMarkAsCompleted, onCancel, onEdit }) => {
  if (!citas || citas.length === 0) {
    return <p className="citas-table-empty-message">No hay citas para mostrar.</p>;
  }

  return (
    <div className="citas-table-container">
      <table className="citas-table-content">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Cliente</th>
            <th>Empleado</th>
            <th>Servicios</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {citas.map((cita) => (
            <tr key={cita.id}>
              <td data-label="ID:">{cita.id}</td>
              <td data-label="Fecha:">{moment(cita.start).format('DD/MM/YYYY')}</td>
              <td data-label="Hora:">{moment(cita.start).format('HH:mm A')}</td>
              <td data-label="Cliente:">{cita.cliente}</td>
              <td data-label="Empleado:">{cita.empleado}</td>
              <td data-label="Servicios:">
                {cita.servicios?.map(s => s.nombre).join(', ').substring(0, 30) || 'N/A'}
                {cita.servicios?.map(s => s.nombre).join(', ').length > 30 && '...'}
              </td>
              <td data-label="Total:" className="text-right">
                ${(cita.precioTotal || 0).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </td>
              <td data-label="Estado:" className="text-center">
                <span className={`cita-estado-badge estado-${(cita.estadoCita || 'pendiente').toLowerCase().replace(/\s+/g, '-')}`}>
                  {cita.estadoCita || 'Pendiente'}
                </span>
              </td>
              <td data-label="Acciones:" className="citas-table-actions">
                <button onClick={() => onViewDetails(cita)} className="citas-action-button citas-button-view" title="Ver Detalles">
                  <FaEye />
                </button>
                {cita.estadoCita !== 'Completada' && cita.estadoCita !== 'Cancelada' && (
                  <>
                    <button onClick={() => onEdit(cita)} className="citas-action-button citas-button-edit" title="Editar/Reagendar">
                        <FaEdit />
                    </button>
                    <button onClick={() => onMarkAsCompleted(cita.id)} className="citas-action-button citas-button-complete" title="Marcar como Completada">
                      <FaCheckCircle />
                    </button>
                    <button onClick={() => onCancel(cita.id)} className="citas-action-button citas-button-cancel" title="Cancelar Cita">
                      <FaTimesCircle />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CitasTable;