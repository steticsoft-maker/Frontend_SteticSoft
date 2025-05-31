// src/features/serviciosAdmin/components/ServicioAdminDetalleModal.jsx
import React from 'react';

const ServicioAdminDetalleModal = ({ isOpen, onClose, servicio }) => {
  if (!isOpen || !servicio) return null;

  return (
    <div className="modalServicio">
      <div className="modal-content-Servicio detalle">
        <h3 className="tituloModalDetalleServicio">Detalles del Servicio</h3>
        
        <div className="servicio-details-list">
          <p><strong>Nombre:</strong> {servicio.nombre}</p>
          <p><strong>Precio:</strong> ${servicio.precio ? servicio.precio.toFixed(2) : '0.00'}</p>
          <p><strong>Categoría:</strong> {servicio.categoria || "—"}</p>
          <p><strong>Descripción:</strong> {servicio.descripcion || 'N/A'}</p>
          <p><strong>Estado:</strong> {servicio.estado}</p>
          {servicio.imagenURL && (
            <div className="detalle-imagen-container">
              <p>
                <strong>Imagen:</strong> 
                <img
                  src={servicio.imagenURL}
                  alt={servicio.nombre}
                  className="servicio-imagen-detalle"
                />
              </p>
            </div>
          )}
        </div>
        
        <button className="servicios-modalButton-cerrar" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ServicioAdminDetalleModal;