// src/features/productosAdmin/components/CategoriasProductoTable.jsx
import React from 'react';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Para navegación

const CategoriasProductoTable = ({ categorias, onView, onEdit, onDeleteConfirm, onToggleEstado }) => {
  const navigate = useNavigate();

  return (
    <table className="tablaCategoriaProductos">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Vida Útil</th>
          <th>Tipo de Uso</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {categorias.map((categoria) => (
          <tr key={categoria.id}>
            <td>{categoria.nombre}</td>
            <td>{categoria.descripcion}</td>
            <td>{categoria.vidaUtil} días</td>
            <td>{categoria.tipoUso}</td>
            <td>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={categoria.estado}
                  onChange={() => onToggleEstado(categoria.id)}
                />
                <span className="slider round"></span> {/* Asumiendo que quieres el slider redondo */}
              </label>
            </td>
            <td>
              {/* Usar onView para el modal de detalles, y navigate para editar */}
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