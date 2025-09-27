// src/features/productosAdmin/components/ProductoAdminDetalleModal.jsx
import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

const ProductoAdminDetalleModal = ({ isOpen, onClose, producto }) => {
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (isOpen && producto) {
      setImageError(false);
      const url = getImageUrl(producto.imagen);
      setImageUrl(url);
      console.log("🌐 URL de imagen:", url);
    }
  }, [isOpen, producto]);

  // 🔑 Función simplificada para construir URL de imagen
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // Si ya es una URL completa (http o https)
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // 🚨 SOLUCIÓN OPCIÓN 5: Para rutas relativas, simplemente concatenar con API_URL
    return `${API_URL}${imagePath}`;
  };

  const handleImageError = (e) => {
    console.error("❌ Error cargando la imagen:", e.target.src);
    setImageError(true);
  };

  const handleImageLoad = (e) => {
    console.log("✅ Imagen cargada correctamente:", e.target.src);
    setImageError(false);
  };

  if (!isOpen || !producto) return null;

  return (
    <div className="modalProductosAdministrador" onClick={onClose}> 
      <div className="modal-content-ProductosAdministrador productos-details-modal" onClick={(e) => e.stopPropagation()}> 
        <div className="productos-modal-header">
          <h3 className="productos-modal-title">
            <span className="productos-modal-icon">📦</span>
            Detalles del Producto
          </h3>
          <button
            type="button"
            className="productos-modal-close-button"
            onClick={onClose}
            title="Cerrar"
          >
            &times;
          </button>
        </div>

        <div className="productos-modal-body">
          <div className="productos-details-container">
            <div className="productos-details-section">
              <h4 className="productos-details-section-title">
                <span className="section-icon">📋</span>
                Información Básica
              </h4>
              <div className="productos-details-grid">
                <div className="productos-detail-item">
                  <label className="productos-detail-label">Estado</label>
                  <span className={`productos-status-badge ${producto.estado ? 'active' : 'inactive'}`}>
                    {producto.estado ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div className="productos-detail-item">
                  <label className="productos-detail-label">Tipo de Uso</label>
                  <span className={`productos-type-badge ${producto.tipoUso?.toLowerCase()}`}>
                    {producto.tipoUso || 'No especificado'}
                  </span>
                </div>
                <div className="productos-detail-item productos-detail-item-full">
                  <label className="productos-detail-label">Nombre</label>
                  <span className="productos-detail-value productos-name-text">
                    {producto.nombre}
                  </span>
                </div>
                <div className="productos-detail-item productos-detail-item-full">
                  <label className="productos-detail-label">Categoría</label>
                  <span className="productos-detail-value productos-category-text">
                    {producto.categoria ? producto.categoria.nombre : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div className="productos-details-section">
              <h4 className="productos-details-section-title">
                <span className="section-icon">💰</span>
                Información Comercial
              </h4>
              <div className="productos-details-grid">
                <div className="productos-detail-item">
                  <label className="productos-detail-label">Precio</label>
                  <span className="productos-detail-value productos-price-text">
                    ${producto.precio ? producto.precio.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : '0.00'}
                  </span>
                </div>
                <div className="productos-detail-item">
                  <label className="productos-detail-label">Existencia</label>
                  <span className="productos-detail-value productos-stock-text">
                    {producto.existencia} unidades
                  </span>
                </div>
                <div className="productos-detail-item">
                  <label className="productos-detail-label">Stock Mínimo</label>
                  <span className="productos-detail-value productos-stock-min-text">
                    {producto.stockMinimo ?? 'No definido'}
                  </span>
                </div>
                <div className="productos-detail-item">
                  <label className="productos-detail-label">Stock Máximo</label>
                  <span className="productos-detail-value productos-stock-max-text">
                    {producto.stockMaximo ?? 'No definido'}
                  </span>
                </div>
              </div>
            </div>

            <div className="productos-details-section">
              <h4 className="productos-details-section-title">
                <span className="section-icon">⏰</span>
                Información Técnica
              </h4>
              <div className="productos-details-grid">
                <div className="productos-detail-item productos-detail-item-full">
                  <label className="productos-detail-label">Vida Útil</label>
                  <span className="productos-detail-value productos-lifespan-text">
                    {producto.vidaUtilDias ? `${producto.vidaUtilDias} días` : 'No especificado'}
                  </span>
                </div>
                <div className="productos-detail-item productos-detail-item-full">
                  <label className="productos-detail-label">Descripción</label>
                  <span className="productos-detail-value productos-description-text">
                    {producto.descripcion || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {imageUrl && (
              <div className="productos-details-section productos-image-section">
                <h4 className="productos-details-section-title">
                  <span className="section-icon">🖼️</span>
                  Imagen del Producto
                </h4>
                <div className="productos-image-container">
                  <img 
                    src={imageUrl} 
                    alt={producto.nombre} 
                    className="productos-detail-image" 
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                  />
                  {imageError && (
                    <div className="productos-image-error">
                      <p>❌ Error al cargar la imagen</p>
                      <p>URL intentada: {imageUrl}</p>
                      <button 
                        onClick={() => window.open(imageUrl, '_blank')}
                        className="productos-image-debug-button"
                      >
                        Abrir imagen en nueva pestaña
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="productos-modal-footer">
          <button 
            className="productos-detalle-modal-button-cerrar" 
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductoAdminDetalleModal;