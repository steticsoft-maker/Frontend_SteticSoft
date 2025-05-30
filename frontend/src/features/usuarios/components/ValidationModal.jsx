// src/features/usuarios/components/ValidationModal.jsx
import React from "react";

const ValidationModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="usuarios-modalOverlay">
      <div className="usuarios-modalContent usuarios-modalContent-validation">
        <h3>Aviso</h3>
        <p>{message || "Por favor, revise la información proporcionada."}</p>
        <button className="usuarios-modalButton-cerrar" onClick={onClose}>
          Entendido
        </button>
      </div>
    </div>
  );
};

export default ValidationModal;
