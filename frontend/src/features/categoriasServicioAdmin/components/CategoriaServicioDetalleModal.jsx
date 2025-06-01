// src/features/categoriasServicioAdmin/components/CategoriaServicioDetalleModal.jsx
import React from 'react';

const CategoriaServicioDetalleModal = ({ isOpen, onClose, categoria }) => {
  if (!isOpen || !categoria) return null;

return (
  <div className="modal-Categoria"> {/* Overlay */}
    <div className="modal-content-Categoria detalle"> {/* Contenido del modal + clase específica */}
      <h3>Detalles de la Categoría de Servicio</h3>
      <p><strong>Nombre:</strong> {categoria.nombre}</p>
      <p><strong>Descripción:</strong> {categoria.descripcion || '—'}</p>
      <p><strong>Estado:</strong> {categoria.estado}</p>
      <button className="btn-danger" onClick={onClose}>Cerrar</button>
    </div>
  </div>
);
// ...
};
export default CategoriaServicioDetalleModal;