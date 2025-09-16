import React, { useState, useEffect } from 'react';

const ServicioAdminDetalleModal = ({ isOpen, onClose, servicio }) => {
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageLoading, setImageLoading] = useState(false);

  // 🔑 Función mejorada para construir URL de imagen
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // Si ya es una URL completa (http o https)
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Si es una ruta que empieza con /, usar la URL base del proxy
    if (imagePath.startsWith('/')) {
      return `/api${imagePath}`;
    }
    
    // Para otras rutas relativas, usar el proxy
    return `/api/${imagePath}`;
  };

  // Actualizar la URL de imagen cuando cambie el servicio
  useEffect(() => {
    if (isOpen && servicio) {
      setImageError(false);
      setImageLoading(true);
      const url = getImageUrl(servicio.imagen);
      setImageUrl(url);
      console.log("🖼️ Construyendo URL de imagen:", {
        imagenOriginal: servicio.imagen,
        urlConstruida: url,
        servicio: servicio.nombre
      });
    }
  }, [isOpen, servicio]);

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

  const handleImageError = (e) => {
    console.error("❌ Error cargando la imagen:", {
      src: e.target.src,
      servicio: servicio.nombre,
      imagenOriginal: servicio.imagen
    });
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = (e) => {
    console.log("✅ Imagen cargada correctamente:", {
      src: e.target.src,
      servicio: servicio.nombre
    });
    setImageError(false);
    setImageLoading(false);
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
            <div className="servicio-detalle-imagen">
              <strong>Imagen:</strong>
              {imageUrl ? (
                <>
                  {imageLoading && (
                    <div style={{ 
                      textAlign: 'center', 
                      padding: '20px', 
                      color: '#666',
                      fontSize: '14px'
                    }}>
                      Cargando imagen...
                    </div>
                  )}
                  <img
                    src={imageUrl}
                    alt={servicio.nombre}
                    className="servicio-detalle-preview"
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                    style={{ 
                      display: imageLoading ? 'none' : 'block',
                      maxWidth: '100%',
                      maxHeight: '250px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                    }}
                  />
                  {imageError && (
                    <div style={{ 
                      color: 'red', 
                      marginTop: '10px',
                      padding: '10px',
                      backgroundColor: '#ffe6e6',
                      borderRadius: '5px',
                      border: '1px solid #ffcccc'
                    }}>
                      <p>❌ Error al cargar la imagen</p>
                      <p><strong>URL intentada:</strong> {imageUrl}</p>
                      <p><strong>Imagen original:</strong> {servicio.imagen}</p>
                      <button 
                        onClick={() => window.open(imageUrl, '_blank')}
                        style={{ 
                          marginTop: '5px', 
                          padding: '5px 10px',
                          backgroundColor: '#ff6b6b',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer'
                        }}
                      >
                        Abrir imagen en nueva pestaña
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ 
                  padding: '20px', 
                  textAlign: 'center', 
                  color: '#666',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px',
                  border: '2px dashed #ccc'
                }}>
                  📷 No hay imagen disponible
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServicioAdminDetalleModal;

