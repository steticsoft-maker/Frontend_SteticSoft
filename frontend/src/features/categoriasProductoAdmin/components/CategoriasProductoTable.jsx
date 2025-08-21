import React from 'react';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const CategoriasProductoTable = ({ categorias, onView, onEdit, onDeleteConfirm, onToggleEstado, startIndex }) => {

  return (
    <table className="tablaCategoriaProductos">
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
            <td>{startIndex + index + 1}</td>
            <td>{categoria.nombre}</td>
            <td>{categoria.descripcion}</td>
            <td>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={categoria.estado}
                  onChange={() => onToggleEstado(categoria.idCategoriaProducto)}
                />
                <span className="slider round"></span>
              </label>
            </td>
            <td>
              <button className="table-action-button-categoria" onClick={() => onView(categoria)} title="Ver Detalles">
                <FaEye />
              </button>
              <button className="table-action-button-categoria" onClick={() => onEdit(categoria)} title="Editar Categoría">
                <FaEdit />
              </button>
              <button className="table-action-button-categoria" onClick={() => onDeleteConfirm(categoria)} title="Eliminar Categoría">
                <FaTrash />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CategoriasProductoTable;