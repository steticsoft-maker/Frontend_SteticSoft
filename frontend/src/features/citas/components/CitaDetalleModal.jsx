// src/features/citas/components/CitaDetalleModal.jsx
import React from 'react';
import moment from 'moment';
import 'moment/locale/es'; // Para idioma español

moment.locale('es');

const CitaDetalleModal = ({ isOpen, onClose, cita, onEdit, onDeleteConfirm }) => {
  if (!isOpen || !cita) return null;

  return (
    <div className="modal-citas"> {/* Reutilizar clase de Citas.css o una genérica */}
      <div className="modal-content-citas"> {/* Reutilizar clase de Citas.css o una genérica */}
        <h3>Detalles de la Cita</h3>
        <button className="cerrar-modal" onClick={onClose}>&times;</button>

        <div className="cita-detalle-content"> {/* Nueva clase para estilizar el contenido */}
          <p><strong>Cliente:</strong> {cita.cliente}</p>
          <p><strong>Empleado:</strong> {cita.empleado}</p>
          <p>
            <strong>Servicio(s):</strong> 
            {Array.isArray(cita.servicio) ? cita.servicio.join(', ') : cita.servicio}
          </p>
          <p><strong>Inicio:</strong> {moment(cita.start).format('dddd, D [de] MMMM [de] YYYY, h:mm a')}</p>
          <p><strong>Fin:</strong> {moment(cita.end).format('dddd, D [de] MMMM [de] YYYY, h:mm a')}</p>
          {/* Aquí podrías añadir más detalles si los tienes, como estado de la cita, notas, etc. */}
        </div>

        <div className="botonesModalCitas"> {/* Clase del CSS original */}
          <button
            className="boton-editar-cita" // Necesitarás estilos para este botón
            onClick={() => {
              onEdit(cita); // Llama a la función para abrir el modal de edición
              onClose();    // Cierra este modal de detalles
            }}
          >
            Editar
          </button>
          <button
            className="boton-eliminar-cita" // Necesitarás estilos para este botón
            onClick={() => {
              onDeleteConfirm(cita); // Llama a la función para confirmar eliminación
              onClose();       // Cierra este modal de detalles
            }}
          >
            Eliminar
          </button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default CitaDetalleModal;