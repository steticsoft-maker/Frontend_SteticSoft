// src/features/abastecimiento/components/AbastecimientoTable.jsx
import React from 'react';
import { FaEye, FaTrash, FaEdit } from 'react-icons/fa';
import { calculateRemainingLifetime } from '../services/abastecimientoService'; // Importar la función

const AbastecimientoTable = ({ entries, onView, onEdit, onDelete, onDeplete }) => {
  return (
    <table className="tabla-abastecimiento">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Categoría</th>
          <th>Cantidad</th>
          <th>Empleado Asignado</th>
          <th>Fecha de Ingreso</th>
          <th>Tiempo de Vida Restante</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((producto) => (
          <tr key={producto.id} className={producto.isDepleted ? "depleted-row" : ""}>
            <td data-label="Nombre:">{producto.nombre}</td>
            <td data-label="Categoría:">{producto.category || "N/A"}</td>
            <td data-label="Cantidad:">{producto.cantidad}</td>
            <td data-label="Empleado Asignado:">{producto.empleado}</td>
            <td data-label="Fecha de Ingreso:">{producto.fechaIngreso}</td>
            <td data-label="Vida Restante:">{calculateRemainingLifetime(producto)}</td>
            <td data-label="Estado:">
              {producto.isDepleted
                ? `Agotado: ${producto.depletionReason || "Sin especificar"}`
                : "Disponible"}
            </td>
            <td data-label="Acciones:">
              <div className="icon-actions-abastecimiento">
                <button className="table-icons-abastecimiento" onClick={() => onView(producto)} title="Ver Detalles">
                  <FaEye />
                </button>
                <button
                  className="table-icons-abastecimiento"
                  onClick={() => onEdit(producto)}
                  title="Editar Producto"
                  disabled={producto.isDepleted}
                >
                  <FaEdit />
                </button>
                {!producto.isDepleted && (
                  <button
                    className="table-icons-abastecimiento deplete-button-abastecimiento"
                    onClick={() => onDeplete(producto)}
                    title="Marcar como Agotado"
                  >
                    Agotar
                  </button>
                )}
                <button
                  className="table-icons-abastecimiento delete-button-abastecimiento"
                  onClick={() => onDelete(producto)}
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

export default AbastecimientoTable;