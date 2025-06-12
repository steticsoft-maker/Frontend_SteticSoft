// src/features/productosAdmin/components/CategoriaProductoDetalleModal.jsx
import React from 'react';

const CategoriaProductoDetalleModal = ({ isOpen, onClose, categoria }) => {
  if (!isOpen || !categoria) return null;

  return (
    <div className="categorias-container-modal-overlay">
      <div className="modal-content-categoria-detalles">
        <h2 className="modal-title">Detalles de la Categoría</h2>
        <div className="details-section">
          <p><strong>Nombre:</strong> {categoria.nombre}</p>
          <p><strong>Descripción:</strong> {categoria.descripcion}</p>
          {/* CAMBIO: Usar categoria.vidaUtilDias */}
          <p><strong>Vida Útil:</strong> {categoria.vidaUtilDias} días</p>
          <p><strong>Tipo de Uso:</strong> {categoria.tipoUso}</p>
          <p><strong>Estado:</strong> {categoria.estado ? "Activa" : "Inactiva"}</p>
          <p>
            <strong>Productos Asociados:</strong>{" "}
            {/* CAMBIO: Acceder a los nombres de los productos si existen */}
            {categoria.productos && categoria.productos.length > 0 ? (
              categoria.productos.map(producto => producto.nombre).join(", ")
            ) : (
              "N/A"
            )}
          </p>
        </div>
        <button onClick={onClose} className="close-button-categoria-detalles">Cerrar</button>
      </div>
    </div>
  );
};

export default CategoriaProductoDetalleModal;