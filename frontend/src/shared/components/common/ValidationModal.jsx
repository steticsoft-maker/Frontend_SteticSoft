// src/shared/components/common/ValidationModal.jsx
import React from "react";
import "./ValidationModal.css"; // Crea este archivo CSS o usa el global de modales

const ValidationModal = ({
  isOpen,
  onClose,
  title,
  message,
  buttonText = "Entendido",
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="shared-modal-overlay">
      <div className="shared-modal-content validation-modal-content">
        <h2 className="shared-modal-title">{title || "Aviso"}</h2>
        <p className="shared-modal-message">
          {message || "Ha ocurrido un evento."}
        </p>
        <div className="shared-modal-actions">
          <button
            type="button"
            className="shared-modal-button shared-modal-button-primary" // Un botón primario para cerrar
            onClick={onClose}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValidationModal;
