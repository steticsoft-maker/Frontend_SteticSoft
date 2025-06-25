import React from 'react';

const CategoriaServicioDetalleModal = ({ open, onClose, categoria }) => {
  if (!open || !categoria) return null;

  return (
    <div className="modal-Categoria" onClick={onClose}>
      {}
      <div className="modal-content-Categoria detalle detalle-servicio-modal" onClick={(e) => e.stopPropagation()}>
        
        {}
        <button type="button" className="modal-close-button" onClick={onClose} title="Cerrar">
          &times;
        </button>

        <h3>Detalles de la Categoría</h3>
        
        <div className="detalle-item">
          <strong>Nombre:</strong>
          <p>{categoria.nombre}</p>
        </div>

        <div className="detalle-item">
          <strong>Descripción:</strong>
          <p>{categoria.descripcion || 'Sin descripción.'}</p>
        </div>
      </div>
    </div>
  );
};

export default CategoriaServicioDetalleModal;