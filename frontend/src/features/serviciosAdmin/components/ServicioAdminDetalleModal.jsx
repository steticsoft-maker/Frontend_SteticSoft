// src/features/serviciosAdmin/components/ServicioAdminDetalleModal.jsx
import React from 'react';
import "../css/ServiciosAdmin.css";

const API_URL = import.meta.env.VITE_API_URL;

const ServicioAdminDetalleModal = ({ isOpen, onClose, servicio }) => {
  if (!isOpen || !servicio) return null;

  const formatCurrency = (value) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return 'N/A';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(numericValue);
  };

  const getFullImageUrl = (relativeUrl) => {
    if (!relativeUrl) return '';
    if (relativeUrl.startsWith('http')) return relativeUrl;
    return `${API_URL}${relativeUrl}`;
  };

  return (
    <div className="servicios-admin-modal-overlay" onClick={onClose}>
      <div
        className="servicios-admin-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close-button"
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          &times;
        </button>

        <h3>Detalles del Servicio</h3>
        <div className="servicio-details-list">
          <p><strong>Nombre:</strong> {servicio.nombre}</p>
          <p><strong>Descripción:</strong> {servicio.descripcion || 'No aplica'}</p>
          <p><strong>Precio:</strong> {formatCurrency(servicio.precio)}</p>
          <p><strong>Categoría:</strong> {servicio.categoria?.nombre || 'No aplica'}</p>
          <p><strong>Estado:</strong> {servicio.estado ? 'Activo' : 'Inactivo'}</p>

          {servicio.imagenUrl && (
            <div className="servicio-detalle-imagen">
              <strong>Imagen:</strong>
              <img
                src={getFullImageUrl(servicio.imagenUrl)}
                alt={servicio.nombre}
                className="servicio-detalle-preview"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServicioAdminDetalleModal;
