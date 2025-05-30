// src/features/productosAdmin/components/CategoriaProductoDetalleModal.jsx
import React from 'react';

const CategoriaProductoDetalleModal = ({ isOpen, onClose, categoria }) => {
  if (!isOpen || !categoria) return null;

  return (
    <div className="categorias-container-modal-overlay"> {/* O una clase de modal genérica */}
      <div className="modal-content-categoria-detalles"> {/* Clase del CSS original */}
        <h2 className="modal-title">Detalles de la Categoría</h2>
        <div className="details-section"> {/* Clase del CSS original */}
          <p><strong>Nombre:</strong> {categoria.nombre}</p>
          <p><strong>Descripción:</strong> {categoria.descripcion}</p>
          <p><strong>Vida Útil:</strong> {categoria.vidaUtil} días</p>
          <p><strong>Tipo de Uso:</strong> {categoria.tipoUso}</p>
          <p><strong>Estado:</strong> {categoria.estado ? "Activa" : "Inactiva"}</p>
          <p><strong>Productos Asociados:</strong> {categoria.productos && categoria.productos.length > 0 ? categoria.productos.join(", ") : "N/A"}</p>
        </div>
        <button onClick={onClose} className="close-button-categoria-detalles">Cerrar</button> {/* Clase del CSS original */}
      </div>
    </div>
  );
};

export default CategoriaProductoDetalleModal;