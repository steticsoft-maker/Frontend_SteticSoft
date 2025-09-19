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
    <div className="modalProductosAdministrador"> 
      <div className="modal-content-ProductosAdministrador detalle-modal"> 
        <h2>Detalles del Producto</h2>
        
        <div className="producto-admin-details-list"> 
          <p><strong>Nombre:</strong> {producto.nombre}</p>
          <p><strong>Categoría:</strong> {producto.categoria ? producto.categoria.nombre : 'N/A'}</p> 
          <p><strong>Tipo de Uso:</strong> {producto.tipoUso || 'No especificado'}</p>
          <p><strong>Vida Útil:</strong> {producto.vidaUtilDias ? `${producto.vidaUtilDias} días` : 'No especificado'}</p>
          <p><strong>Precio:</strong> ${producto.precio ? producto.precio.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : '0.00'}</p>
          <p><strong>Existencia (Stock):</strong> {producto.existencia}</p>
          <p><strong>Stock Mínimo:</strong> {producto.stockMinimo ?? 'No definido'}</p>
          <p><strong>Stock Máximo:</strong> {producto.stockMaximo ?? 'No definido'}</p>
          <p><strong>Descripción:</strong> {producto.descripcion || 'N/A'}</p>
          <p><strong>Estado:</strong> {producto.estado ? "Activo" : "Inactivo"}</p>
          
          {/* ✅ Imagen con URL completa */}
          {imageUrl ? ( 
            <div className="detalle-imagen-container"> 
              <p><strong>Imagen:</strong></p>
              <img 
                src={imageUrl} 
                alt={producto.nombre} 
                className="producto-admin-detalle-imagen" 
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

          {/* Información de debug para desarrolladores */}
        </div>
        
        <button 
          className="productos-admin-modal-button-cerrar" 
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ProductoAdminDetalleModal;