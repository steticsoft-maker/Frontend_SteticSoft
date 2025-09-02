// src/features/abastecimiento/components/AbastecimientoTable.jsx
import React from "react";
import { FaEye, FaTrash, FaEdit } from "react-icons/fa";
import { calculateRemainingLifetime } from "../services/abastecimientoService";

const AbastecimientoTable = ({
  entries,
  onView,
  onEdit,
  onDelete,
  onDeplete,
  currentPage = 1,
  rowsPerPage = 10,
}) => {
  // Verificación de seguridad para asegurar que `entries` sea un array
  if (!Array.isArray(entries)) {
    return (
      <p>
        No hay datos disponibles para mostrar.
      </p>
    );
  }

  return (
    <table className="tabla-abastecimiento">
      <thead>
        <tr>
          <th>#</th>
          <th>Producto</th>
          <th>Categoría</th>
          <th>Asignado a</th>
          <th>Cantidad</th>
          <th>Fecha de Ingreso</th>
          <th>Vida Restante</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry, index) => {
          const numeroFila = (currentPage - 1) * rowsPerPage + index + 1;
          return (
            <tr
              key={entry.idAbastecimiento}
              className={entry.estaAgotado ? "depleted-row" : ""}
            >
              <td data-label="#">{numeroFila}</td>
              <td data-label="Producto:">{entry.producto?.nombre || "N/A"}</td>
              <td data-label="Categoría:">
                {entry.producto?.categoria?.nombre || "N/A"}
              </td>
              <td data-label="Asignado a:">
                {entry.empleadoAsignado || "N/A"}
              </td>
              <td data-label="Cantidad:">{entry.cantidad}</td>
              <td data-label="Fecha Ingreso:">
                {new Date(entry.fechaIngreso).toLocaleDateString()}
              </td>
              <td data-label="Vida Restante:">
                {calculateRemainingLifetime(entry)}
              </td>
              <td data-label="Estado:">
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
              <td data-label="Acciones:">
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
          );
        })}
      </tbody>
    </table>
  );
};

export default AbastecimientoTable;