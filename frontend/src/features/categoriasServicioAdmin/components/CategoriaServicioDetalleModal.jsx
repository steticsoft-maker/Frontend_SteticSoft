import React from "react";

const CategoriaDetalleModal = ({ open, onClose, categoria }) => {
  if (!open || !categoria) return null;

  return (
    <div className="modal-Categoria">
      <div className="modal-content-Categoria">
        <h3>Detalle de Categoría</h3>
        <p>
          <strong>ID:</strong> {categoria.id}
        </p>
        <p>
          <strong>Nombre:</strong> {categoria.nombre}
        </p>
        <p>
          <strong>Descripción:</strong> {categoria.descripcion}
        </p>
        <p>
          <strong>Estado:</strong>{" "}
          {categoria.activo ? "Activo" : "Inactivo"}
        </p>
        <button className="btn-danger" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default CategoriaDetalleModal;