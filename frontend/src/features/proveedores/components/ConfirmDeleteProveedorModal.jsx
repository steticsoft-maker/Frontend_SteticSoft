// src/features/proveedores/components/ConfirmDeleteProveedorModal.jsx
import React from 'react';

const ConfirmDeleteProveedorModal = ({ isOpen, onClose, onConfirm, proveedorName }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-Proveedores">
      <div className="modal-content-Proveedores"> {/* Reutilizar clase de modal-content-Proveedores o crear una específica */}
        <h3>¿Eliminar proveedor?</h3>
        <p>¿Estás seguro de que deseas eliminar al proveedor <strong>{proveedorName}</strong>?</p>
        <div className="botonesEliminarProveedor"> {/* Clase del CSS original */}
          <button className="botonModalEliminarProveedor" onClick={onConfirm}>Eliminar</button>
          <button className="botonModalCancelarEliminarProveedor" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteProveedorModal;