import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

const ServicioAdminDetalleModal = ({ isOpen, onClose, servicio }) => {
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

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

  // 🔑 Función para construir URL de imagen
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // Si ya es una URL completa (http o https)
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Para rutas relativas, concatenar con API_URL
    return `${API_URL}${imagePath}`;
  };

  // Actualizar la URL de imagen cuando cambie el servicio
  React.useEffect(() => {
    if (isOpen && servicio) {
      setImageError(false);
      const url = getImageUrl(servicio.imagen);
      setImageUrl(url);
    }
  }, [isOpen, servicio]);

  const handleImageError = (e) => {
    console.error("❌ Error cargando la imagen:", e.target.src);
    setImageError(true);
  };

  const handleImageLoad = (e) => {
    console.log("✅ Imagen cargada correctamente:", e.target.src);
    setImageError(false);
  };

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

            {/* Imagen con manejo de errores mejorado */}
            {imageUrl ? (
              <div className="servicio-detalle-imagen">
                <strong>Imagen:</strong>
                <img
                  src={imageUrl}
                  alt={servicio.nombre}
                  className="servicio-detalle-preview"
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                />
                {imageError && (
                  <div style={{ color: 'red', marginTop: '10px' }}>
                    <p>❌ Error al cargar la imagen</p>
                    <p>URL intentada: {imageUrl}</p>
                    <button 
                      onClick={() => window.open(imageUrl, '_blank')}
                      style={{ marginTop: '5px', padding: '5px 10px' }}
                    >
                      Abrir imagen en nueva pestaña
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p><strong>Imagen:</strong> No disponible</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ServicioAdminDetalleModal;

