// novedades/components/NovedadesTable.jsx

import React from "react";
import { FaRegEye, FaEdit, FaTrashAlt } from "react-icons/fa";
import { Badge } from "react-bootstrap";
import "../css/ConfigHorarios.css";

const NovedadesTable = ({
  novedades,
  onView,
  onEdit,
  onDeleteConfirm,
  onToggleEstado,
}) => {
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
            <th>Días Aplicables</th>
            <th>Rango de Fechas</th>
            <th>Horario</th>
            <th>Estado</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {novedades && novedades.length > 0 ? (
            novedades.map((novedad, index) => {
              const empleados = novedad.empleados || [];
              return (
                <tr key={novedad.idNovedad}>
                  <td>{index + 1}</td>
                  <td>
                    {/* MODIFICADO: Se elimina el div para evitar la línea extra */}
                    {empleados.length > 0 ? (
                      empleados.map((user, idx) => (
                        <React.Fragment key={user.idUsuario}>
                          {user.empleadoInfo
                            ? `${user.empleadoInfo.nombre} ${user.empleadoInfo.apellido}`
                            : user.correo}
                          {/* Agrega un salto de línea si no es el último empleado */}
                          {idx < empleados.length - 1 && <br />}
                        </React.Fragment>
                      ))
                    ) : (
                      <span className="text-muted">Sin asignar</span>
                    )}
                  </td>
                  <td>
                    <div className="dias-pills-container">
                      {(novedad.dias || []).map((dia) => (
                        <Badge
                          pill
                          bg="secondary"
                          key={dia}
                          className="dia-pill"
                        >
                          {dia.substring(0, 3)}
                        </Badge>
                      ))}
                    </div>
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
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={novedad.estado}
                        onChange={() => onToggleEstado(novedad)}
                      />
                      <span className="slider"></span>
                    </label>
                  </td>
                  <td className="novedades-table__actions">
                    {/* MODIFICADO: Se quitan los OverlayTrigger */}
                    <button
                      onClick={() => onView(novedad)}
                      className="action-button"
                    >
                      <FaRegEye />
                    </button>
                    <button
                      onClick={() => onEdit(novedad)}
                      className="action-button"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => onDeleteConfirm(novedad)}
                      className="action-button"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
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