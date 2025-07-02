// src/shared/components/common/ConfirmModal.jsx
import React from 'react';
import './ConfirmModal.css'; // Crea este archivo CSS

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar"
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="shared-modal-overlay">
      <div className="shared-modal-content confirm-modal-content">
        <h2 className="shared-modal-title">{title || "¿Confirmar Acción?"}</h2>
        <p className="shared-modal-message">{message || "¿Estás seguro de que deseas proceder?"}</p>
        <div className="shared-modal-actions">
          <button
            type="button"
            className="shared-modal-button shared-modal-button-confirm"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
          <button
            type="button"
            className="shared-modal-button shared-modal-button-cancel"
            onClick={onClose}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;