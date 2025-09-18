import React from 'react';
import moment from 'moment';
import '../../../shared/styles/admin-layout.css';

const CitaDetalleModal = ({ isOpen, onClose, cita, onEdit, onDeleteConfirm }) => {
  if (!isOpen || !cita) return null;

  const getEstadoClass = (estado) => {
    return (estado || "desconocido").toLowerCase().replace(/\s+/g, "-");
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">Detalles de la Cita #{cita.id}</h2>
          <button className="admin-modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="admin-modal-body">

        <div className="cita-detalle-content">
          <p><strong>Cliente:</strong> {cita.clienteNombre}</p>
          <p><strong>Empleado:</strong> {cita.empleadoNombre}</p>
          <p><strong>Fecha y Hora:</strong> {moment(cita.start).format("dddd, D [de] MMMM, YYYY hh:mm A")}</p>
          <p><strong>Servicios:</strong> {cita.serviciosNombres}</p>
          <p><strong>Total Estimado:</strong> ${(cita.precioTotal || 0).toLocaleString("es-CO")}</p>
          <p><strong>Estado:</strong> 
            <span className={`cita-estado-badge estado-${getEstadoClass(cita.estadoCita)}`}>
                {cita.estadoCita}
            </span>
          </p>
        </div>

        </div>
        <div className="admin-modal-footer">
          <button className="admin-form-button secondary" onClick={onClose}>Cerrar</button>
          <button className="admin-form-button" onClick={() => onEdit(cita)}>Editar</button>
          <button className="admin-form-button" onClick={() => onDeleteConfirm(cita)}>Eliminar</button>
        </div>
      </div>
    </div>
  );
};

export default CitaDetalleModal;
