import React from "react";
import { FaRegEye, FaEdit, FaTrashAlt } from "react-icons/fa";
import { Badge, Tooltip, OverlayTrigger } from "react-bootstrap";
import "../css/ConfigHorarios.css";

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

  const renderTooltip = (props, text) => (
    <Tooltip {...props}>{text}</Tooltip>
  );

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
              const fullEmployeeList = empleados
                .map((e) =>
                  e.empleadoInfo
                    ? `${e.empleadoInfo.nombre} ${e.empleadoInfo.apellido}`
                    : e.correo
                )
                .join(", ");

              return (
                <tr key={novedad.idNovedad}>
                  <td>{index + 1}</td>
                  <td>
                    {empleados.length > 0 ? (
                      <>
                        {empleados.slice(0, 2).map((user) => (
                          <div key={user.idUsuario} className="novedades-table__employee-name">
                            {user.empleadoInfo
                              ? `${user.empleadoInfo.nombre} ${user.empleadoInfo.apellido}`
                              : user.correo}
                          </div>
                        ))}
                        {empleados.length > 2 && (
                           <OverlayTrigger
                             placement="top"
                             overlay={renderTooltip({id: `tooltip-empleados-${novedad.idNovedad}`}, fullEmployeeList)}
                           >
                            <Badge pill bg="info" text="dark" className="more-indicator">
                              +{empleados.length - 2} más
                            </Badge>
                          </OverlayTrigger>
                        )}
                      </>
                    ) : (
                      <span className="text-muted">Sin asignar</span>
                    )}
                  </td>
                  <td>
                    <div className="dias-pills-container">
                      {(novedad.dias || []).map((dia) => (
                        <Badge pill bg="secondary" key={dia} className="dia-pill">
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
                    <Badge
                      pill
                      bg={novedad.estado ? "success" : "secondary"}
                      className="status-badge"
                      onClick={() => onToggleEstado(novedad.idNovedad, !novedad.estado)}
                      style={{ cursor: 'pointer' }}
                    >
                      {novedad.estado ? "Activo" : "Inactivo"}
                    </Badge>
                  </td>
                  <td className="novedades-table__actions">
                    <OverlayTrigger placement="top" overlay={renderTooltip({id: `tooltip-view-${novedad.idNovedad}`}, "Ver Detalles")}>
                      <button onClick={() => onView(novedad)} className="action-button">
                        <FaRegEye />
                      </button>
                    </OverlayTrigger>
                    <OverlayTrigger placement="top" overlay={renderTooltip({id: `tooltip-edit-${novedad.idNovedad}`}, "Editar")}>
                       <button onClick={() => onEdit(novedad)} className="action-button">
                        <FaEdit />
                      </button>
                    </OverlayTrigger>
                    <OverlayTrigger placement="top" overlay={renderTooltip({id: `tooltip-delete-${novedad.idNovedad}`}, "Eliminar")}>
                      <button onClick={() => onDeleteConfirm(novedad)} className="action-button">
                        <FaTrashAlt />
                      </button>
                    </OverlayTrigger>
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
