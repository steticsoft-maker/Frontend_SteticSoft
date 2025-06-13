// src/features/productosAdmin/components/ProductosAdminTable.jsx
import React from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa"; // Asegúrate que FontAwesome esté instalado y configurado

const ProductosAdminTable = ({
  productos,
  onView,
  onEdit,
  onDeleteConfirm,
  onToggleEstado,
}) => {
  return (
    <table className="tablaProductosAdministrador">
      <thead>
        <tr>
          <th>#</th>
          <th>Nombre</th>
          <th>Categoría</th>
          <th>Precio</th>
          {/* CAMBIO: Renombrado de 'Stock' a 'Existencia' */}
          <th>Existencia</th> 
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {productos.map((producto, index) => (
          // CAMBIO CLAVE: Usar producto.idProducto como key
          <tr key={producto.idProducto}> 
            <td data-label="#">{index + 1}</td>
            <td data-label="Nombre:">{producto.nombre}</td>
            {/* CAMBIO CLAVE: Acceder a 'nombre' de 'producto.categoria' */}
            <td data-label="Categoría:">
              {producto.categoria ? producto.categoria.nombre : 'N/A'}
            </td>
            <td data-label="Precio:">
              $
              {producto.precio
                ? producto.precio.toLocaleString("es-CO", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })
                : "0.00"}
            </td>
            {/* CAMBIO: Mostrar 'producto.existencia' en lugar de 'producto.stock' */}
            <td data-label="Existencia:">{producto.existencia}</td> 
            <td data-label="Estado:">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={producto.estado} // Asume que producto.estado es booleano (true/false)
                  // CAMBIO CLAVE: Pasar producto.idProducto a onToggleEstado
                  onChange={() => onToggleEstado(producto.idProducto)} 
                />
                <span className="slider round"></span>
              </label>
            </td>
            <td
              data-label="Acciones:"
              className="productos-admin-table-actions"
            >
              <div className="productos-admin-table-actions-buttons-container">
                <button
                  className="iconBotonProductoAdministrador"
                  // CAMBIO CLAVE: Pasar el producto completo (que incluye idProducto)
                  onClick={() => onView(producto)} 
                  title="Ver Detalles"
                >
                  <FaEye />
                </button>
                <button
                  className="iconBotonProductoAdministrador"
                  // CAMBIO CLAVE: Pasar el producto completo (que incluye idProducto)
                  onClick={() => onEdit(producto)} 
                  title="Editar Producto"
                >
                  <FaEdit />
                </button>
                <button
                  className="iconBotonProductoAdministrador EliminarProductoAdministradorIcon"
                  // CAMBIO CLAVE: Pasar el producto completo (que incluye idProducto)
                  onClick={() => onDeleteConfirm(producto)} 
                  title="Eliminar Producto"
                >
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