// src/features/citas/components/CitaDetalleModal.jsx
import React from 'react';
import moment from 'moment';
import 'moment/locale/es';

moment.locale('es');

const CitaDetalleModal = ({ isOpen, onClose, cita, onEdit, onDeleteConfirm }) => {
  if (!isOpen || !cita) return null;

  return (
    <div className="modal-citas">
      <div className="modal-content-citas">
        <h3>Detalles de la Cita</h3>
        <button className="cerrar-modal" onClick={onClose}>&times;</button>

        <div className="cita-detalle-content">
          <p><strong>ID Cita:</strong> {cita.id}</p>
          <p><strong>Cliente:</strong> {cita.cliente}</p>
          <p><strong>Empleado:</strong> {cita.empleado}</p>
          <p>
            <strong>Servicio(s):</strong> 
            {cita.servicios?.map(s => `${s.nombre} ($${(s.precio || 0).toLocaleString('es-CO')})`).join(', ') || 'N/A'}
          </p>
          <p><strong>Inicio:</strong> {moment(cita.start).format('dddd, D [de] MMMM [de] YYYY, h:mm a')}</p>
          <p><strong>Fin:</strong> {moment(cita.end).format('dddd, D [de] MMMM [de] YYYY, h:mm a')}</p>
          <p><strong>Precio Total:</strong> ${(cita.precioTotal || 0).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
          <p><strong>Estado:</strong> {cita.estadoCita || 'Pendiente'}</p>
          {cita.notasCancelacion && <p><strong>Motivo Cancelación:</strong> {cita.notasCancelacion}</p>}
        </div>

        <div className="botonesModalCitas">
          {cita.estadoCita !== "Cancelada" && cita.estadoCita !== "Completada" && (
            <button
              className="boton-editar-cita"
              onClick={() => {
                onClose(); 
                onEdit(cita); 
              }}
            >
              Editar/Reagendar
            </button>
          )}
          {/* El botón de eliminar ya no se muestra aquí si se maneja desde la tabla o el ConfirmModal */}
          {/* Si aún lo quieres, asegúrate que onDeleteConfirm se pase y funcione */}
           <button
            className="boton-eliminar-cita"
            onClick={() => {
              onClose();
              onDeleteConfirm(cita);
            }}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CitaDetalleModal;