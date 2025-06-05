import React from "react";

const CategoriasServicioTable = ({
  categorias,
  onView,
  onEdit,
  onDeleteConfirm,
  onToggleEstado,
}) => {
  return (
    <table className="tablaCategoria">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {categorias.map((cat) => (
          <tr key={cat.id}>
            <td data-label="Nombre">{cat.nombre}</td>
            <td data-label="Descripción">{cat.descripcion}</td>
            <td data-label="Estado" style={{ textAlign: "center" }}>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={cat.activo}
                  onChange={() => onToggleEstado(cat)}
                />
                <span className="slider"></span>
              </label>
            </td>
            <td
              data-label="Acciones"
              className="categorias-servicio-actions"
            >
              <button
                className="botonVerDetallesCategoria"
                onClick={() => onView(cat)}
                title="Ver detalles"
              >
                Detalles
              </button>
              <button
                className="botonEditarCategoria"
                onClick={() => onEdit(cat)}
                title="Editar"
              >
                Editar
              </button>
              <button
                className="botonEliminarCategoria"
                onClick={() => onDeleteConfirm(cat)}
                title="Eliminar"
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
        {categorias.length === 0 && (
          <tr>
            <td colSpan={5} style={{ textAlign: "center" }}>
              No hay categorías para mostrar.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default CategoriasServicioTable;