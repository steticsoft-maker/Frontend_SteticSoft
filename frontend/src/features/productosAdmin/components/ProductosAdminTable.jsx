// src/features/productosAdmin/components/ProductosAdminTable.jsx
import React from 'react';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const ProductosAdminTable = ({ productos, onView, onEdit, onDeleteConfirm, onToggleEstado }) => {
  return (
    <table className="tablaProductosAdministrador">
      <thead>
        <tr>
          <th>#</th>
          <th>Nombre</th>
          <th>Categoría</th>
          <th>Precio</th>
          <th>Stock</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {productos.map((producto, index) => (
          <tr key={producto.id}>
            <td>{index + 1}</td>
            <td>{producto.nombre}</td>
            <td>{producto.categoria}</td>
            <td>${producto.precio ? producto.precio.toLocaleString() : '0.00'}</td>
            <td>{producto.stock}</td>
            <td>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={producto.estado}
                  onChange={() => onToggleEstado(producto.id)}
                />
                <span className="slider round"></span>
              </label>
            </td>
            <td>
              <div className="productos-admin-table-actions"> {/* Nueva clase para mejor targeting */}
                <button className="iconBotonProductoAdministrador" onClick={() => onView(producto)} title="Ver Detalles">
                  <FaEye />
                </button>
                <button className="iconBotonProductoAdministrador" onClick={() => onEdit(producto)} title="Editar Producto">
                  <FaEdit />
                </button>
                <button className="iconBotonProductoAdministrador EliminarProductoAdministradorIcon" onClick={() => onDeleteConfirm(producto)} title="Eliminar Producto">
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

export default ProductosAdminTable;