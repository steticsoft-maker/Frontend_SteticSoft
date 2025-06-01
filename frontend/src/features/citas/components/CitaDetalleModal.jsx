// src/features/citas/components/CitaDetalleModal.jsx
import React from 'react';
import moment from 'moment';
import 'moment/locale/es'; // Importar locale español para moment

moment.locale('es'); // Establecer moment en español globalmente o localmente donde se necesite

const CitaDetalleModal = ({ isOpen, onClose, cita, onEdit, onDeleteConfirm }) => {
  if (!isOpen || !cita) return null;

  const handleEditClick = () => {
    if (onEdit) {
      onEdit(cita); // Pasar la cita completa al editor
    }
    // No cerrar el modal aquí, se maneja desde la página principal si es necesario
  };

  const handleDeleteConfirmClick = () => {
    if (onDeleteConfirm) {
      onDeleteConfirm(cita); // Pasar la cita para confirmar eliminación
    }
  };

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
          <p><strong>Estado:</strong> <span className={`cita-estado-badge estado-${(cita.estadoCita || 'pendiente').toLowerCase().replace(/\s+/g, '-')}`}>{cita.estadoCita || 'Pendiente'}</span></p>
          {cita.notasCancelacion && cita.estadoCita === 'Cancelada' && (
            <p><strong>Motivo Cancelación:</strong> {cita.notasCancelacion}</p>
          )}
        </div>

        <div className="botonesModalCitas">
          {/* Botón de Editar/Reagendar: Mostrar si no está Completada o Cancelada */}
          {cita.estadoCita !== "Completada" && cita.estadoCita !== "Cancelada" && (
            <button
              className="boton-editar-cita"
              onClick={handleEditClick}
            >
              Editar/Reagendar
            </button>
          )}
          {/* Botón de Eliminar: Se podría mostrar siempre o con condiciones */}
          {/* Si se elimina, generalmente se hace a través de un modal de confirmación */}
           <button
            className="boton-eliminar-cita"
            onClick={handleDeleteConfirmClick} // Este debería abrir el ConfirmModal
          >
            Eliminar Cita
          </button>
        </div>
      </div>
    </div>
  );
};

export default CitaDetalleModal;