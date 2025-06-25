// src/features/abastecimiento/components/AbastecimientoTable.jsx
import React from "react";
import { FaEye, FaTrash, FaEdit } from "react-icons/fa";
import { calculateRemainingLifetime } from "../services/abastecimientoService";

const AbastecimientoTable = ({ entries, onView, onEdit, onDelete, onDeplete }) => {
  return (
    <table className="tabla-abastecimiento">
      <thead>
        <tr>
          <th>Producto</th>
          <th>Categoría</th>
          <th>Cantidad</th>
          <th>Empleado Asignado</th>
          <th>Fecha de Ingreso</th>
          <th>Vida Restante</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry) => (
          <tr
            key={entry.idAbastecimiento}
            className={entry.estaAgotado ? "depleted-row" : ""}
          >
            <td data-label="Producto">{entry.producto?.nombre || "N/A"}</td>
            <td data-label="Categoría">
              {entry.producto?.categoria?.nombre || "N/A"}
            </td>
            <td data-label="Cantidad">{entry.cantidad}</td>
            <td data-label="Empleado">{entry.empleado?.nombre || "No asignado"}</td>
            <td data-label="Fecha Ingreso">
              {new Date(entry.fechaIngreso).toLocaleDateString()}
            </td>
            <td data-label="Vida Restante">{calculateRemainingLifetime(entry)}</td>
            <td data-label="Estado">
              {entry.estaAgotado ? (
                <>
                  Agotado
                  <span className="depleted-reason-text">
                    {entry.razonAgotamiento || "Sin especificar"}
                  </span>
                </>
              ) : (
                "Disponible"
              )}
            </td>
            <td data-label="Acciones">
              <div className="icon-actions-abastecimiento">
                <button
                  className="table-icons-abastecimiento view-button"
                  onClick={() => onView(entry)}
                  title="Ver Detalles"
                >
                  <FaEye />
                </button>
                <button
                  className="table-icons-abastecimiento edit-button"
                  onClick={() => onEdit(entry)}
                  title="Editar Cantidad"
                  disabled={entry.estaAgotado}
                >
                  <FaEdit />
                </button>
                {!entry.estaAgotado && (
                  <button
                    className="table-icons-abastecimiento deplete-button-abastecimiento"
                    onClick={() => onDeplete(entry)}
                    title="Marcar como Agotado"
                  >
                    Agotar
                  </button>
                )}
                <button
                  className="table-icons-abastecimiento delete-button-abastecimiento"
                  onClick={() => onDelete(entry)}
                  title="Eliminar Registro"
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