import React from 'react';

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

  const getFullImageUrl = (relativePath) => {
    if (!relativePath) return null;
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
    return `${backendUrl}/${relativePath}`;
  };

  const imageUrl = getFullImageUrl(servicio.imagen);

  return (
    // Se usan las clases CSS del módulo de servicios
    <div className="servicios-admin-modal-overlay" onClick={onClose}>
      <div className="servicios-admin-modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* CAMBIO: Botón 'X' para cerrar el modal */}
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        
        <h3>Detalles del Servicio</h3>

        <div className="servicio-details-list">
          <p><strong>Nombre:</strong> {servicio.nombre}</p>
          <p><strong>Descripción:</strong> {servicio.descripcion || 'No aplica'}</p>
          <p><strong>Precio:</strong> {formatCurrency(servicio.precio)}</p>
          <p><strong>Duración Estimada:</strong> {servicio.duracionEstimadaMin ? `${servicio.duracionEstimadaMin} minutos` : 'No aplica'}</p>
          <p><strong>Categoría:</strong> {servicio.categoria?.nombre || 'No aplica'}</p>
          <p><strong>Estado:</strong> {servicio.estado ? 'Activo' : 'Inactivo'}</p>

          {imageUrl && (
            <div className="detalle-imagen-container">
              <strong>Imagen:</strong>
              <img src={imageUrl} alt={servicio.nombre} className="servicio-imagen-detalle" />
            </div>
          )}
        </div>

        {/* CAMBIO: Se eliminó el botón 'Cerrar' de la parte inferior */}
      </div>
    </div>
  );
};

export default ServicioAdminDetalleModal;