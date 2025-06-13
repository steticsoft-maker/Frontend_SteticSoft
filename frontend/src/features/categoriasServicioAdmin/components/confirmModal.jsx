// src/shared/components/ui/ConfirmModal.jsx
import React from 'react';

// Asumimos que el CSS del modal ya está cargado globalmente o en la página que lo usa.
// Si no, importa aquí los estilos necesarios del modal.

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children, // Usamos children para un mensaje más flexible
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isConfirming = false, // Para mostrar un estado de carga
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    // Usamos las clases de tu CSS para el overlay y el contenido
    <div className="modal-Categoria">
      <div className="modal-content-Categoria">
        <h3>{title}</h3>
        <div style={{ margin: '20px 0', lineHeight: '1.6' }}>
          {children}
        </div>
        
        {/* Usamos el contenedor de botones de tu CSS */}
        <div className="containerBotonesAgregarCategoria">
          <button
            className="botonCancelarEditarProveedor" // Clase de tu botón de cancelar
            onClick={onClose}
            disabled={isConfirming}
          >
            {cancelText}
          </button>
          <button
            className="botonEliminarCategoria" // Usamos la clase del botón de eliminar para darle un estilo de "peligro"
            onClick={onConfirm}
            disabled={isConfirming}
          >
            {isConfirming ? 'Procesando...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;