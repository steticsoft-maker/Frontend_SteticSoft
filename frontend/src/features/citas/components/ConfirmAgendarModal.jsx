// src/features/citas/components/ConfirmAgendarModal.jsx
import React from 'react';
import moment from 'moment';
import Modal from 'react-modal';

const ConfirmAgendarModal = ({ isOpen, onClose, onConfirm, citaData }) => {
  if (!citaData) return null;

  const {
    cliente,
    empleado,
    servicios,
    fecha,
    hora,
    precioTotal,
  } = citaData;

  const modalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '90%',
      maxWidth: '550px',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
      border: 'none',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      zIndex: 1000,
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={modalStyles}
      contentLabel="Confirmar Cita"
      appElement={document.getElementById('root')}
    >
      <div className="confirm-agendar-modal">
        <h2 className="modal-title">Confirma los Datos de la Cita</h2>
        <p className="modal-subtitle">Por favor, revisa que toda la información sea correcta antes de agendar.</p>

        <div className="detalle-cita-resumen">
          <div className="detalle-item">
            <strong>Cliente:</strong>
            <span>{cliente?.label || 'No seleccionado'}</span>
          </div>
          <div className="detalle-item">
            <strong>Empleado:</strong>
            <span>{empleado?.label || 'No seleccionado'}</span>
          </div>
          <div className="detalle-item">
            <strong>Fecha y Hora:</strong>
            <span>
              {moment(fecha).format('dddd, D [de] MMMM [de] YYYY')} a las {moment(hora, 'HH:mm:ss').format('hh:mm A')}
            </span>
          </div>
          <div className="detalle-item servicios">
            <strong>Servicios:</strong>
            <ul>
              {(servicios || []).map(s => (
                <li key={s.value}>
                  <span>{s.label.split(' ($')[0]}</span>
                  <span>${Number(s.label.match(/\(\$([\d,]+)\)/)?.[1].replace(/,/g, '') || 0).toLocaleString('es-CO')}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="detalle-item total">
            <strong>Precio Total:</strong>
            <span className="precio-final">${(precioTotal || 0).toLocaleString('es-CO')}</span>
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onClose} className="btn-secondary">
            Cancelar y seguir editando
          </button>
          <button onClick={onConfirm} className="btn-primary">
            Confirmar y Agendar
          button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmAgendarModal;
