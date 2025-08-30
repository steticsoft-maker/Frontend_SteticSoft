// src/features/citas/components/CitasTable.jsx
import React from "react";
import moment from "moment";
import {
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaEdit,
  FaTrashAlt,
} from "react-icons/fa";

const CitasTable = ({
  citas,
  onViewDetails,
  onMarkAsCompleted,
  onCancel,
  onEdit,
  onDelete,
}) => {
  // Ordenar citas por fecha (más recientes primero)
  const citasOrdenadas = [...(citas || [])].sort(
    (a, b) => moment(b.start).valueOf() - moment(a.start).valueOf()
  );

  return (
    <div className="citas-table-container">
      <table className="citas-table-content">
        <thead>
          <tr>
            <th>#</th>
            <th>Cliente</th>
            <th>Empleado</th>
            <th>Servicios</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {citasOrdenadas.length > 0 ? (
            citasOrdenadas.map((cita, index) => (
              <tr key={cita.id || index}>
                <td>{index + 1}</td>
                {/* ✅ Mostrar nombre normalizado del cliente */}
                <td>{cita.clienteNombre || "Sin cliente"}</td>
                {/* ✅ Mostrar nombre normalizado del empleado */}
                <td>{cita.empleadoNombre || "Sin empleado"}</td>
                {/* ✅ Mostrar lista corta de servicios */}
                <td>
                  {cita.serviciosNombres
                    ? cita.serviciosNombres.substring(0, 30)
                    : "N/A"}
                  {cita.serviciosNombres &&
                    cita.serviciosNombres.length > 30 &&
                    "..."}
                </td>
                <td>
                  {cita.start
                    ? moment(cita.start).format("DD/MM/YYYY HH:mm")
                    : "Sin fecha"}
                </td>
                <td className="text-right">
                  $
                  {(cita.precioTotal || 0).toLocaleString("es-CO", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </td>
                <td className="text-center">
                  <span
                    className={`cita-estado-badge estado-${(
                      cita.estadoCita || "pendiente"
                    )
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {cita.estadoCita || "Pendiente"}
                  </span>
                </td>
                <td className="citas-table-actions">
                  <button
                    onClick={() => onViewDetails(cita)}
                    className="citas-action-button citas-button-view"
                    title="Ver Detalles"
                  >
                    <FaEye />
                  </button>

                  {cita.estadoCita !== "Completada" &&
                    cita.estadoCita !== "Cancelada" && (
                      <>
                        <button
                          onClick={() => onEdit(cita)}
                          className="citas-action-button citas-button-edit"
                          title="Editar/Reagendar"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => onMarkAsCompleted(cita.id)}
                          className="citas-action-button citas-button-complete"
                          title="Marcar como Completada"
                        >
                          <FaCheckCircle />
                        </button>
                        <button
                          onClick={() => onCancel(cita.id)}
                          className="citas-action-button citas-button-cancel"
                          title="Cancelar Cita"
                        >
                          <FaTimesCircle />
                        </button>
                      </>
                    )}

                  <button
                    onClick={() => onDelete(cita.id)}
                    className="citas-action-button citas-button-delete"
                    title="Eliminar Cita"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="citas-table-empty-message">
                No hay citas registradas para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CitasTable;
