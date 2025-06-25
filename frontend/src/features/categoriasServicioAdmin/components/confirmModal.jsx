import React from 'react';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isConfirming = false,
}) => {
  if (!isOpen) {
    return null;
  }
const handleModalClick = (e) => e.stopPropagation();

  return (
    <div className="modal-Categoria" onClick={onClose}>
      {}
      <div className="modal-content-Categoria modal-confirmacion-content" onClick={handleModalClick}>
        <h3>{title}</h3>
        <div className="modal-body-content">
          {children}
        </div>
        
        <div className="containerBotonesAgregarCategoria">
          <button
            className="boton-confirmar-accion"
            onClick={onConfirm}
            disabled={isConfirming}
          >
            {isConfirming ? 'Procesando...' : confirmText}
          </button>

          <button
            className="boton-cancelar-accion" 
            onClick={onClose}
            disabled={isConfirming}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;