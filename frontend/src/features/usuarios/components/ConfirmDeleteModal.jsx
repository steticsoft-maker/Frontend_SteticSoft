// src/features/usuarios/components/ConfirmDeleteModal.jsx
import React from 'react';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, userName }) => {
  if (!isOpen) return null;

  return (
    <div className="usuarios-modalOverlay">
      <div className="usuarios-modalContent usuarios-modalContent-confirm">
        <h3>Confirmar Eliminación</h3>
        <p>¿Estás seguro de que deseas eliminar al usuario <strong>{userName}</strong>?</p>
        <div className="usuarios-form-actions">
          <button className="usuarios-form-buttonGuardar" /* Estilo de "confirmar/peligro" */ onClick={onConfirm}>
            Eliminar
          </button>
          <button className="usuarios-form-buttonCancelar" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;