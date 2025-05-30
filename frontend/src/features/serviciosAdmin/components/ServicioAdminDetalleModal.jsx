// src/features/serviciosAdmin/components/ServicioAdminDetalleModal.jsx
import React from 'react';

const ServicioAdminDetalleModal = ({ isOpen, onClose, servicio }) => {
  if (!isOpen || !servicio) return null;

  return (
    <div className="modalServicio"> {/* Clase del CSS original */}
      <div className="modal-content-Servicio"> {/* Clase del CSS original */}
        <h3 className="tituloModalDetalleServicio">Detalles del Servicio</h3>
        <p><strong>Nombre:</strong> {servicio.nombre}</p>
        <p><strong>Precio:</strong> ${servicio.precio ? servicio.precio.toFixed(2) : '0.00'}</p>
        <p><strong>Categoría:</strong> {servicio.categoria || "—"}</p>
        <p><strong>Descripción:</strong> {servicio.descripcion || 'N/A'}</p>
        <p><strong>Estado:</strong> {servicio.estado}</p>
        {servicio.imagenURL && (
          <div>
            <strong>Imagen:</strong>
            <img
              src={servicio.imagenURL}
              alt={servicio.nombre}
              style={{ maxWidth: '200px', display: 'block', margin: '10px auto', borderRadius: '4px' }}
            />
          </div>
        )}
        <button className="botonEliminarServicios" /* Clase original para el botón cerrar */ onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default ServicioAdminDetalleModal;