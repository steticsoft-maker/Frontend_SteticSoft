// src/components/CategoriasTabla.jsx
import React from 'react';

const CategoriasTabla = ({
  categorias,
  onEditar,
  onEliminar,
  onCambiarEstado,
  onVerDetalles,
  loadingId,
}) => {
  if (!categorias || categorias.length === 0) {
    return <p>No hay categorías de servicio para mostrar.</p>;
  }

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
          <tr key={cat.idCategoriaServicio}>
            <td data-label="Nombre">{cat.nombre}</td>
            <td data-label="Descripción">{cat.descripcion || '-'}</td>
            <td data-label="Estado">
              <label className="switch" title={cat.estado ? 'Desactivar' : 'Activar'}>
                <input
                  type="checkbox"
                  checked={cat.estado}
                  onChange={() => onCambiarEstado(cat)}
                  disabled={loadingId === cat.idCategoriaServicio}
                />
                <span className="slider"></span>
              </label>
            </td>
            <td data-label="Acciones">
              <div className="categorias-servicio-actions">
                <button
                  className="botonVerDetallesCategoria"
                  onClick={() => onVerDetalles(cat)}
                  disabled={loadingId === cat.idCategoriaServicio}
                  title="Ver Detalles"
                >
                  Ver
                </button>
                <button
                  className="botonEditarCategoria"
                  onClick={() => onEditar(cat)}
                  disabled={loadingId === cat.idCategoriaServicio}
                  title="Editar"
                >
                  Editar
                </button>
                <button
                  className="botonEliminarCategoria"
                  onClick={() => onEliminar(cat)}
                  disabled={loadingId === cat.idCategoriaServicio}
                  title="Eliminar"
                >
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CategoriasTabla;