// src/features/productosAdmin/components/ProductoAdminDetalleModal.jsx
import React from 'react';
// Asegúrate de importar el CSS si los estilos del modal son específicos y no globales
// import '../css/ProductosAdmin.css'; 

const ProductoAdminDetalleModal = ({ isOpen, onClose, producto }) => {
  if (!isOpen || !producto) return null;

  return (
    <div className="modalProductosAdministrador"> {/* Overlay principal del modal */}
      {/* Contenido del modal, añadiendo 'detalle-modal' para estilos específicos si es necesario */}
      <div className="modal-content-ProductosAdministrador detalle-modal"> 
        <h2>Detalles del Producto</h2>
        
        {/* Contenedor para la lista de detalles para mejor control de estilos */}
        <div className="producto-admin-details-list"> 
          <p><strong>Nombre:</strong> {producto.nombre}</p>
          <p><strong>Categoría:</strong> {producto.categoria}</p>
          <p><strong>Precio:</strong> ${producto.precio ? producto.precio.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : '0.00'}</p>
          <p><strong>Stock:</strong> {producto.stock}</p>
          <p><strong>Descripción:</strong> {producto.descripcion || 'N/A'}</p>
          <p><strong>Estado:</strong> {producto.estado ? "Activo" : "Inactivo"}</p>
          
          {producto.foto && ( // Usar producto.foto (que sería la URL/base64)
            <div className="detalle-imagen-container"> {/* Clase para estilizar el contenedor de la imagen si es necesario */}
              <p> 
                <strong>Foto:</strong>
              </p>
              <img 
                src={producto.foto} 
                alt={producto.nombre} 
                className="producto-admin-detalle-imagen" // Clase específica para la imagen en el detalle
              />
            </div>
          )}
        </div>
        
        <button 
          className="productos-admin-modal-button-cerrar" // Clase consistente para botón cerrar
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ProductoAdminDetalleModal;