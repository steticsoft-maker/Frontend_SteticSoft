// src/features/clientes/components/ConfirmDeleteClienteModal.jsx
import React from 'react';

// Podríamos usar el ConfirmModal genérico de shared si lo creamos
const ConfirmDeleteClienteModal = ({ isOpen, onClose, onConfirm, clienteName }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-clientes"> {/* O usar .usuarios-modalOverlay */}
      <div className="modal-content-clientes"> {/* O usar .usuarios-modalContent-confirm */}
        <h3>Confirmar Eliminación</h3>
        <p>¿Estás seguro de que deseas eliminar al cliente <strong>{clienteName}</strong>?</p>
        <div className="clientes-form-actions"> {/* Reutilizar estilo de Usuarios o Clientes.css */}
          <button className="botonguardarClienteModal" /* Clase del CSS original */ onClick={onConfirm}>
            Eliminar
          </button>
          <button className="botonModalCancelar-Cerrar" /* Clase del CSS original */ onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteClienteModal;