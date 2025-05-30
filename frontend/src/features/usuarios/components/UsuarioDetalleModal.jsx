// src/features/usuarios/components/UsuarioDetalleModal.jsx
import React from 'react';

const UsuarioDetalleModal = ({ isOpen, onClose, usuario }) => {
  if (!isOpen || !usuario) return null;

  return (
    <div className="usuarios-modalOverlay">
      <div className="usuarios-modalContent usuarios-modalContent-details">
        <h2>Detalles del Usuario</h2>
        <p><strong>Nombre:</strong> {usuario.nombre}</p>
        <p><strong>Tipo de Documento:</strong> {usuario.tipoDocumento}</p>
        <p><strong>Número de Documento:</strong> {usuario.documento}</p>
        <p><strong>Email:</strong> {usuario.email}</p>
        <p><strong>Teléfono:</strong> {usuario.telefono}</p>
        <p><strong>Dirección:</strong> {usuario.direccion}</p>
        <p><strong>Rol:</strong> {usuario.rol}</p>
        <p><strong>Estado:</strong> {usuario.anulado ? "Inactivo (Anulado)" : "Activo"}</p>
        <button className="usuarios-modalButton-cerrar" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default UsuarioDetalleModal;