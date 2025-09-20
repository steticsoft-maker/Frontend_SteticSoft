import React from 'react';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import '../../../shared/styles/table-common.css';

const CategoriasProductoTable = ({ categorias, onView, onEdit, onDeleteConfirm, onToggleEstado, startIndex }) => {

  return (
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
        {categorias.map((categoria, index) => (
          <tr key={categoria.idCategoriaProducto}>
            <td data-label="#">{startIndex + index + 1}</td>
            <td data-label="Nombre:">{categoria.nombre}</td>
            <td data-label="Descripción:">{categoria.descripcion}</td>
            <td data-label="Estado:">
              <label className="table-switch">
                <input
                  type="checkbox"
                  checked={categoria.estado}
                  onChange={() => onToggleEstado(categoria)}
                />
                <span className="table-slider"></span>
              </label>
            </td>
            <td data-label="Acciones:">
              <div className="table-iconos">
                <button className="table-button btn-view" onClick={() => onView(categoria)} title="Ver Detalles">
                  <FaEye />
                </button>
                <button className="table-button btn-edit" onClick={() => onEdit(categoria)} title="Editar Categoría">
                  <FaEdit />
                </button>
                <button className="table-button btn-delete" onClick={() => onDeleteConfirm(categoria)} title="Eliminar Categoría">
                  <FaTrash />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CategoriasProductoTable;