import React from 'react';

const ServicioAdminDetalleModal = ({ isOpen, onClose, servicio }) => {
  if (!isOpen || !servicio) return null;

  const formatCurrency = (value) => {
    // Asegurarse de que el valor sea un número para el formato
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) {
      return 'N/A'; // O un valor por defecto si el precio no es válido
    }
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2, // Limita a 2 decimales
    }).format(numericValue);
  };

  // Construir la URL completa de la imagen
  const getFullImageUrl = (relativePath) => {
    if (!relativePath) return null;
    return `http://localhost:3000/${relativePath}`;
  };

  const imageUrl = getFullImageUrl(servicio.imagen);
  return (
    <div className="modalServicio-overlay">
      <div className="modal-content-Servicio detalle">
        <h3>Detalles del Servicio</h3>
        <div className="servicio-details-list">
          <p><strong>Nombre:</strong> {servicio.nombre}</p>
          <p><strong>Descripción:</strong> {servicio.descripcion || 'No aplica'}</p>
          <p><strong>Precio:</strong> {formatCurrency(servicio.precio)}</p>
          <p>
            <strong>Duración Estimada:</strong>{' '}
            {servicio.duracionEstimadaMin ? `${servicio.duracionEstimadaMin} minutos` : 'No aplica'}
          </p>
          <p><strong>Categoría:</strong> {servicio.categoria?.nombre || 'No aplica'}</p>
          <p><strong>Especialidad:</strong> {servicio.especialidad?.nombre || 'No requiere'}</p>
          <p><strong>Estado:</strong> {servicio.estado ? 'Activo' : 'Inactivo'}</p>

          {imageUrl && (
            <div className="detalle-imagen-container">
              <p><strong>Imagen:</strong></p>
              <img src={imageUrl} alt={servicio.nombre} className="servicio-imagen-detalle" />
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