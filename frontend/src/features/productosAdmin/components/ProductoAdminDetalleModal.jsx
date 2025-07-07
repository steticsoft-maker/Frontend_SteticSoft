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
          {/* CAMBIO CLAVE: Acceder a 'nombre' de 'producto.categoria' */}
          <p><strong>Categoría:</strong> {producto.categoria ? producto.categoria.nombre : 'N/A'}</p> 
          {/* ✅ --- AÑADE ESTAS DOS LÍNEAS AQUÍ --- */}
          <p><strong>Tipo de Uso:</strong> {producto.tipoUso || 'No especificado'}</p>
          <p><strong>Vida Útil:</strong> {producto.vidaUtilDias ? `${producto.vidaUtilDias} días` : 'No especificado'}</p>
          <p><strong>Precio:</strong> ${producto.precio ? producto.precio.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : '0.00'}</p>
          {/* CAMBIO: Mostrar 'producto.existencia' en lugar de 'producto.stock' */}
          <p><strong>Existencia (Stock):</strong> {producto.existencia}</p>
          <p><strong>Descripción:</strong> {producto.descripcion || 'N/A'}</p>
          <p><strong>Estado:</strong> {producto.estado ? "Activo" : "Inactivo"}</p>
          
          {/* CAMBIO: Usar 'producto.imagen' en lugar de 'producto.foto' */}
          {producto.imagen && ( 
            <div className="detalle-imagen-container"> 
              <p> 
                <strong>Imagen:</strong>
              </p>
              <img 
                src={producto.imagen} 
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