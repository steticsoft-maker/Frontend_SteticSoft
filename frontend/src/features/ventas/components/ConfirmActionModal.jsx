// src/shared/components/common/ConfirmModal.jsx (Ejemplo de cómo debería ser el genérico)
import React from 'react';
// import './ConfirmModal.css'; // Estilos para el modal genérico

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Sí, Confirmar", cancelText = "Cancelar" }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay"> {/* Tu clase de overlay global */}
      <div className="modal-content"> {/* Tu clase de contenido de modal global */}
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="modal-actions"> {/* Contenedor para los botones */}
          <button className="button-primary" onClick={onConfirm}>
            {confirmText}
          </button>
          <button className="button-secondary" onClick={onClose}>
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;