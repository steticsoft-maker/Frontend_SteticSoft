import React from 'react';
import { FaRegEye, FaEdit, FaTrashAlt } from 'react-icons/fa';
import '../../../shared/styles/table-common.css';

const CategoriasServicioTable = ({ categorias, onEditar, onEliminar, onCambiarEstado, onVerDetalles, loadingId }) => {
  return (
    <>
      <div className="table-container">
        <table className="table-main">
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
              <td data-label="Acciones">
                <div className="table-iconos">
                  <button
                    onClick={() => onVerDetalles(cat)}
                    className="table-button btn-view"
                    disabled={loadingId === cat.idCategoriaServicio}
                    title="Ver Detalles"
                  >
                    <FaRegEye /> 
                  </button>
                  <button
                    onClick={() => onEditar(cat)}
                    className="table-button btn-edit"
                    disabled={loadingId === cat.idCategoriaServicio}
                    title="Editar Categoría"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onEliminar(cat)}
                    className="table-button btn-delete"
                    disabled={loadingId === cat.idCategoriaServicio}
                    title="Eliminar Categoría"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
      </div>
    </>
  );
};

export default CategoriasServicioTable;