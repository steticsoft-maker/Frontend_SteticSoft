// src/features/categoriasServicioAdmin/components/CategoriasServicioTable.jsx
import React from 'react';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const CategoriasServicioTable = ({ categorias, onView, onEdit, onDeleteConfirm, onToggleEstado }) => {
  return (
    <table className="tablaCategoria"> {/* Usar clase del CSS original */}
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {categorias.map((cat, index) => ( // Usar index si no hay ID único garantizado en los datos iniciales
          <tr key={cat.id || index}>
            <td>{cat.nombre}</td>
            <td>{cat.descripcion || "—"}</td>
            <td>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={cat.estado === "Activo"}
                  onChange={() => onToggleEstado(cat.id || index)}
                />
                <span className="slider round"></span>
              </label>
            </td>
            <td className="categorias-servicio-actions"> {/* Clase para acciones */}
              <button className="botonVerDetallesCategoria" onClick={() => onView(cat)} title="Ver Detalles">
                <FaEye />
              </button>
              <button className="botonEditarCategoria" onClick={() => onEdit(cat)} title="Editar Categoría">
                <FaEdit />
              </button>
              <button className="botonEliminarCategoria" onClick={() => onDeleteConfirm(cat)} title="Eliminar Categoría">
                <FaTrash />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
export default CategoriasServicioTable;