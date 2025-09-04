import React from "react";
import { FaRegEye, FaEdit, FaTrashAlt } from "react-icons/fa";
import "../CSS/ConfigHorarios.css"; // Mejor renombrar el CSS a algo específico del componente

const NovedadesTable = ({ novedades, onView, onEdit, onDeleteConfirm, onToggleEstado }) => {
  const formatTime = (timeString) =>
    timeString ? timeString.slice(0, 5) : "N/A";

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Intl.DateTimeFormat("es-CO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "America/Bogota",
    }).format(new Date(dateString));
  };

  return (
    <div className="novedades-table__container table-responsive">
      <table className="novedades-table table">
        <thead>
          <tr>
            <th>#</th>
            <th>Encargado(s)</th>
            <th>Rango de Fechas</th>
            <th>Horario</th>
            <th>Estado</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {novedades && novedades.length > 0 ? (
            novedades.map((novedad, index) => (
              <tr key={novedad.idNovedad}>
                <td>{index + 1}</td>
                <td>
                  {novedad.empleados && novedad.empleados.length > 0 ? (
                    novedad.empleados.map((user) => (
                      <div
                        key={user.idUsuario}
                        className="novedades-table__employee-name"
                      >
                        {user.empleadoInfo
                          ? `${user.empleadoInfo.nombre} ${user.empleadoInfo.apellido}`
                          : user.correo}
                      </div>
                    ))
                  ) : (
                    <span className="text-muted">Sin asignar</span>
                  )}
                </td>
                <td>
                  {`${formatDate(novedad.fechaInicio)} al ${formatDate(
                    novedad.fechaFin
                  )}`}
                </td>
                <td>
                  {`${formatTime(novedad.horaInicio)} - ${formatTime(
                    novedad.horaFin
                  )}`}
                </td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={novedad.estado}
                      onChange={(e) =>
                        onToggleEstado(novedad.idNovedad, e.target.checked)
                      }
                    />
                    <span className="slider round"></span>
                  </label>
                </td>
                <td className="novedades-table__actions">
                  <button
                    onClick={() => onView(novedad)}
                    className="action-button"
                    aria-label="Ver Detalles"
                  >
                    <FaRegEye />
                  </button>
                  <button
                    onClick={() => onEdit(novedad)}
                    className="action-button"
                    aria-label="Editar"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDeleteConfirm(novedad)}
                    className="action-button"
                    aria-label="Eliminar"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No hay novedades para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default NovedadesTable;
