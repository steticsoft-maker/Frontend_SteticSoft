// src/features/roles/components/ConfirmDeleteRolModal.jsx
import React from 'react';

const ConfirmDeleteRolModal = ({ isOpen, onClose, onConfirm, roleName }) => {
  if (!isOpen) return null;

  return (
    <div className="rol-modalOverlay">
      <div className="rol-modalContent rol-modalContent-confirm">
        <h3>¿Eliminar rol?</h3>
        <p>¿Estás seguro de que deseas eliminar el rol <strong>{roleName}</strong>?</p>
        <div className="rol-form-actions">
          <button className="rol-form-buttonGuardar" /* Estilo de "confirmar/peligro" */ onClick={onConfirm}>
            Eliminar
          </button>
          <button className="rol-form-buttonCancelar" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteRolModal;