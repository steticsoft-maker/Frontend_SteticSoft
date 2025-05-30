// src/features/categoriasServicioAdmin/components/CategoriaServicioDetalleModal.jsx
import React from 'react';

const CategoriaServicioDetalleModal = ({ isOpen, onClose, categoria }) => {
  if (!isOpen || !categoria) return null;

  return (
    <div className="modal-Categoria"> {/* Clase del CSS original */}
      <div className="modal-content-Categoria"> {/* Clase del CSS original */}
        <h3>Detalles de la Categoría de Servicio</h3>
        <p><strong>Nombre:</strong> {categoria.nombre}</p>
        <p><strong>Descripción:</strong> {categoria.descripcion || '—'}</p>
        <p><strong>Estado:</strong> {categoria.estado}</p>
        {/* Aquí podrías listar servicios asociados si fuera necesario */}
        <button className="btn-danger" /*Clase del CSS original, o una más genérica*/ onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};
export default CategoriaServicioDetalleModal;