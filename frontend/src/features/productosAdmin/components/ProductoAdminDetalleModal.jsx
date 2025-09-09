// src/features/productosAdmin/components/ProductoAdminDetalleModal.jsx
import React from 'react';

// ⚡ Importamos la URL del backend desde variables de entorno
const API_URL = import.meta.env.VITE_API_URL;
// 🚨 Quitamos el "/api" para acceder a los estáticos (uploads)
const API_BASE = API_URL.replace('/api', '');

const ProductoAdminDetalleModal = ({ isOpen, onClose, producto }) => {
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
          
          {/* ✅ CAMBIO CLAVE: Construir la URL completa de la imagen */}
          {producto.imagen && ( 
            <div className="detalle-imagen-container"> 
              <p><strong>Imagen:</strong></p>
              <img 
                src={`${API_BASE}${producto.imagen}`} 
                alt={producto.nombre} 
                className="producto-admin-detalle-imagen" 
              />
            </div>
          )}
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
