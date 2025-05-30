// src/features/productosAdmin/components/ProductoAdminDetalleModal.jsx
import React from 'react';

const ProductoAdminDetalleModal = ({ isOpen, onClose, producto }) => {
  if (!isOpen || !producto) return null;

  return (
    <div className="modalProductosAdministrador">
      <div className="modal-content-ProductosAdministrador">
        <h2>Detalles del Producto</h2>
        <p><strong>Nombre:</strong> {producto.nombre}</p>
        <p><strong>Categoría:</strong> {producto.categoria}</p>
        <p><strong>Precio:</strong> ${producto.precio ? producto.precio.toLocaleString() : '0.00'}</p>
        <p><strong>Stock:</strong> {producto.stock}</p>
        <p><strong>Descripción:</strong> {producto.descripcion || 'N/A'}</p>
        <p><strong>Estado:</strong> {producto.estado ? "Activo" : "Inactivo"}</p>
        {producto.foto && (
          <div>
            <strong>Foto:</strong>
            <img src={producto.foto} alt={producto.nombre} style={{ maxWidth: '200px', display: 'block', margin: '10px auto' }} />
          </div>
        )}
        <button className="cerrarModalVerDetallesProductoAdministrador" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};
export default ProductoAdminDetalleModal;