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
    // No es necesario un div wrapper si la clase de la tabla se aplica directamente
    <table className="tablaProductosAdministrador">
      {/*SIN ESPACIOS/SALTOS ANTES DE THEAD*/}
      <thead>
        {/*SIN ESPACIOS/SALTOS ANTES DE TR*/}
        <tr>
          {/*SIN ESPACIOS/SALTOS ANTES DEL PRIMER TH*/}
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
        {/*SIN ESPACIOS/SALTOS ANTES DEL MAP*/}
        {productos.map((producto, index) => (
          <tr key={producto.id}>
            <td data-label="#">{index + 1}</td>
            <td data-label="Nombre:">{producto.nombre}</td>
            <td data-label="Categoría:">{producto.categoria}</td>
            <td data-label="Precio:">
              $
              {producto.precio
                ? producto.precio.toLocaleString("es-CO", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })
                : "0.00"}
            </td>
            <td data-label="Stock:">{producto.stock}</td>
            <td data-label="Estado:">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={producto.estado} // Asume que producto.estado es booleano (true/false)
                  onChange={() => onToggleEstado(producto.id)}
                />
                <span className="slider round"></span>
              </label>
            </td>
            <td
              data-label="Acciones:"
              className="productos-admin-table-actions"
            >
              {" "}
              {/* Clase aplicada al TD */}
              <div className="productos-admin-table-actions-buttons-container">
                {" "}
                {/* Nuevo div interno si necesitas más control sobre el flex de los botones */}
                <button
                  className="iconBotonProductoAdministrador"
                  onClick={() => onView(producto)}
                  title="Ver Detalles"
                >
                  <FaEye />
                </button>
                <button
                  className="iconBotonProductoAdministrador"
                  onClick={() => onEdit(producto)}
                  title="Editar Producto"
                >
                  <FaEdit />
                </button>
                <button
                  className="iconBotonProductoAdministrador EliminarProductoAdministradorIcon"
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
