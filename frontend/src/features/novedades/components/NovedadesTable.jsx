import React from 'react';
import { FaRegEye, FaEdit, FaTrashAlt } from 'react-icons/fa';
import { Badge } from 'react-bootstrap';
import '../css/ConfigHorarios.css';

const NovedadesTable = ({
  novedades,
  onView,
  onEdit,
  onDeleteConfirm,
  onToggleEstado,
}) => {
  const formatTime = (timeString) =>
    timeString ? timeString.slice(0, 5) : 'N/A';

  const getDiaPillClass = (dia) => {
    const diaNormalizado = dia
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    return `dia-pill dia-pill-${diaNormalizado}`;
  };

  return (
    <div className="novedades-table__container table-responsive">
      <table className="novedades-table table">
        <thead>
          <tr>
            <th className="text-center">#</th>
            <th>Encargado(s)</th>
            <th>Días Aplicables</th>
            <th>Horario</th>
            <th className="text-center">Estado</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {novedades && novedades.length > 0 ? (
            novedades.map((novedad, index) => {
              const empleados = novedad.empleados || [];
              return (
                <tr key={novedad.idNovedad}>
                  <td className="text-center">{index + 1}</td>
                  <td>
                    {empleados.length > 0 ? (
                      empleados.map((user, idx) => (
                        <div key={user.idUsuario} className="novedades-table__employee-name">
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
                    <div className="dias-pills-container">
                      {(novedad.dias || []).map((dia) => (
                        <Badge
                          pill
                          key={dia}
                          className={getDiaPillClass(dia)}
                        >
                          {dia.substring(0, 3)}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td>
                    {`${formatTime(novedad.horaInicio)} - ${formatTime(
                      novedad.horaFin
                    )}`}
                  </td>
                  <td className="text-center">
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
                    <button
                      onClick={() => onView(novedad)}
                      className="action-button"
                      aria-label={`Ver detalles de ${novedad.idNovedad}`}
                    >
                      <FaRegEye />
                    </button>
                    <button
                      onClick={() => onEdit(novedad)}
                      className="action-button"
                      aria-label={`Editar ${novedad.idNovedad}`}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => onDeleteConfirm(novedad)}
                      className="action-button"
                      aria-label={`Eliminar ${novedad.idNovedad}`}
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              );
            })
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