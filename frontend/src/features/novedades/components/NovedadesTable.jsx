import React from 'react';
import { FaRegEye, FaEdit, FaTrashAlt } from 'react-icons/fa';
import { Badge } from 'react-bootstrap';
import '../../../shared/styles/table-common.css';
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
    <div className="table-container">
      <table className="table-main">
        <thead>
          <tr>
            <th>#</th>
            <th>Encargado(s)</th>
            <th>Días Aplicables</th>
            <th>Horario</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {novedades && novedades.length > 0 ? (
            novedades.map((novedad, index) => {
              const empleados = novedad.empleados || [];
              return (
                <tr key={novedad.idNovedad}>
                  <td data-label="#">{index + 1}</td>
                  <td data-label="Encargado(s)">
                    {empleados.length > 0 ? (
                      empleados.map((user) => (
                        <div key={user.idUsuario} className="novedades-table__employee-name">
                          {`${user.nombre} ${user.apellido}`}
                        </div>
                      ))
                    ) : (
                      <span className="text-muted">Sin asignar</span>
                    )}
                  </td>
                  <td data-label="Días Aplicables">
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
                  <td data-label="Horario">
                    {`${formatTime(novedad.horaInicio)} - ${formatTime(
                      novedad.horaFin
                    )}`}
                  </td>
                  <td data-label="Estado">
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={novedad.estado}
                        onChange={() => onToggleEstado(novedad)}
                      />
                      <span className="slider"></span>
                    </label>
                  </td>
                  <td data-label="Acciones">
                    <div className="table-iconos">
                      <button onClick={() => onView(novedad)} className="table-button btn-view" title="Ver Detalles">
                        <FaRegEye />
                      </button>
                      <button onClick={() => onEdit(novedad)} className="table-button btn-edit" title="Editar">
                        <FaEdit />
                      </button>
                      <button onClick={() => onDeleteConfirm(novedad)} className="table-button btn-delete" title="Eliminar">
                        <FaTrashAlt />
                      </button>
                    </div>
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