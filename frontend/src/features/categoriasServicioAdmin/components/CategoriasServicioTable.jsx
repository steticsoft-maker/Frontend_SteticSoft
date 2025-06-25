import React from 'react';
import { FaRegEye, FaEdit, FaTrashAlt } from 'react-icons/fa';

const CategoriasServicioTable = ({ categorias, onEditar, onEliminar, onCambiarEstado, onVerDetalles, loadingId }) => {
  return (
    <table className="tablaCategoria">
      <thead>
        <tr>
          <th>#</th>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {}
        {!categorias || categorias.length === 0 ? (
          <tr>
            <td colSpan="5" className="no-data-cell">No se encontraron categorías.</td>
          </tr>
        ) : (
          categorias.map((cat, index) => (
            <tr key={cat.idCategoriaServicio}>
              <td data-label="#">{index + 1}</td>
              <td data-label="Nombre">{cat.nombre}</td>
              <td data-label="Descripción">{cat.descripcion}</td>
              <td data-label="Estado">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={cat.estado}
                    onChange={() => onCambiarEstado(cat)}
                    disabled={loadingId === cat.idCategoriaServicio}
                  />
                  <span className="slider"></span>
                </label>
              </td>
              {/* === SECCIÓN DE ACCIONES ACTUALIZADA === */}
              <td data-label="Acciones" className="categorias-servicio-actions">
                <button
                  onClick={() => onVerDetalles(cat)}
                  className="botonEditarCategoria"
                  disabled={loadingId === cat.idCategoriaServicio}
                >
                  <FaRegEye /> 
                </button>
                <button
                  onClick={() => onEditar(cat)}
                  className="botonEditarCategoria"
                  disabled={loadingId === cat.idCategoriaServicio}
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => onEliminar(cat)}
                  className="botonEliminarCategoria"
                  disabled={loadingId === cat.idCategoriaServicio}
                >
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default CategoriasServicioTable;