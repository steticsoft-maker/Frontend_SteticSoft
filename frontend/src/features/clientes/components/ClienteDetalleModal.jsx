// src/features/clientes/components/ClienteDetalleModal.jsx
import React from 'react';

const ClienteDetalleModal = ({ isOpen, onClose, cliente }) => {
  if (!isOpen || !cliente) return null;

  return (
    <div className="modal-clientes">
      <div className="modal-content-clientes">
        <h2>Detalles del Cliente</h2>
        <div className="cliente-details-list"> 
          <p><strong>Nombre:</strong> {cliente.nombre}</p>
          <p><strong>Apellido:</strong> {cliente.apellido}</p>
          <p><strong>Correo:</strong> {cliente.email}</p>
          <p><strong>Teléfono:</strong> {cliente.telefono}</p>
          <p><strong>Tipo de Documento:</strong> {cliente.tipoDocumento}</p>
          <p><strong>Número de Documento:</strong> {cliente.numeroDocumento}</p>
          <p><strong>Dirección:</strong> {cliente.direccion}</p>
          <p><strong>Ciudad:</strong> {cliente.ciudad || 'N/A'}</p>
          <p><strong>Fecha de Nacimiento:</strong> {cliente.fechaNacimiento}</p>
          <p><strong>Estado:</strong> {cliente.estado ? "Activo" : "Inactivo"}</p>
        </div>
        <button className="botonModalCancelar-Cerrar detalle-modal-cerrar-btn" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};
 
export default ClienteDetalleModal;