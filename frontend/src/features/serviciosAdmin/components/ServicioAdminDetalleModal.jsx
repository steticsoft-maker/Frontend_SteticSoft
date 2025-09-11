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

  // La URL de Cloudinary es absoluta y viene en el campo 'imagen'. No se necesita lógica extra.
  const imageUrl = servicio.imagen || '';

  return (
    <>
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

            {/* Se utiliza la URL directa de 'imageUrl' (que viene de servicio.imagen) */}
            {imageUrl && (
              <div className="servicio-detalle-imagen">
                <strong>Imagen:</strong>
                <img
                  src={imageUrl}
                  alt={servicio.nombre}
                  className="servicio-detalle-preview"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ServicioAdminDetalleModal;

