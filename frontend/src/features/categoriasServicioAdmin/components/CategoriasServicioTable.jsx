// src/features/categoriasServicioAdmin/components/CategoriasServicioTable.jsx
import React from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const CategoriasServicioTable = ({
  categorias,
  onView,
  onEdit,
  onDeleteConfirm,
  onToggleEstado,
}) => {
  return (
    // En tu CSS, .tablaCategoria se aplica directamente a la etiqueta <table>
    // No hay un <div> contenedor con esa clase en el JSX que me pasaste.
    // Si lo hubiera, el problema de whitespace sería DENTRO del <table>.
    // Asumiendo que es directamente <table className="tablaCategoria">
    <table className="tablaCategoria">
      {/*SIN ESPACIOS/SALTOS ANTES DE THEAD*/}
      <thead>
        {/*SIN ESPACIOS/SALTOS ANTES DE TR*/}
        <tr>
          {/*SIN ESPACIOS/SALTOS ANTES DEL PRIMER TH*/}
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {/*SIN ESPACIOS/SALTOS ANTES DEL MAP*/}
        {categorias.map((cat, index) => (
          <tr key={cat.id || index}>
            {/*SIN ESPACIOS/SALTOS ANTES DEL PRIMER TD*/}
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
            <td className="categorias-servicio-actions">
              <button
                className="botonVerDetallesCategoria"
                onClick={() => onView(cat)}
                title="Ver Detalles"
              >
                <FaEye />
              </button>
              <button
                className="botonEditarCategoria"
                onClick={() => onEdit(cat)}
                title="Editar Categoría"
              >
                <FaEdit />
              </button>
              <button
                className="botonEliminarCategoria"
                onClick={() => onDeleteConfirm(cat)}
                title="Eliminar Categoría"
              >
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
