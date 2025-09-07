import React from 'react';
import moment from 'moment';

const CitaDetalleModal = ({ isOpen, onClose, cita, onEdit, onDeleteConfirm }) => {
  if (!isOpen || !cita) return null;

  const getEstadoClass = (estado) => {
    return (estado || "desconocido").toLowerCase().replace(/\s+/g, "-");
  };

  return (
    <div className="modal-citas">
      <div className="modal-content-citas">
        <h3>Detalles de la Cita #{cita.id}</h3>
        <button className="cerrar-modal" onClick={onClose}>&times;</button>

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

        <div className="botonesModalCitas">
            <button className="cerrar-modal" onClick={onClose}>&times;</button>
            <button className="citas-action-button" onClick={() => onEdit(cita)}>Editar</button>
           <button className="citas-action-button" onClick={() => onDeleteConfirm(cita)}>Eliminar</button>
        </div>
        </div>
      </div>
  );
};

export default CitaDetalleModal;
