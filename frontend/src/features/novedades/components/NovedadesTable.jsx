import React from 'react';
import { FaRegEye, FaEdit, FaTrashAlt } from 'react-icons/fa';
import '../css/ConfigHorarios.css'; // CSS específico para la tabla

const NovedadesTable = ({ novedades, onView, onEdit, onDeleteConfirm, onToggleEstado }) => {

  const formatTime = (timeString) => timeString ? timeString.slice(0, 5) : 'N/A';
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    return adjustedDate.toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  return (
    <div className="table-responsive">
      <table className="table">
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
                    novedad.empleados.map(user => (
                      <div key={user.idUsuario} className="employee-name">
                        {user.empleadoInfo ? `${user.empleadoInfo.nombre} ${user.empleadoInfo.apellido}` : user.correo}
                      </div>
                    ))
                  ) : (
                    <span className="text-muted">Sin asignar</span>
                  )}
                </td>
                <td>{`${formatDate(novedad.fechaInicio)} al ${formatDate(novedad.fechaFin)}`}</td>
                <td>{`${formatTime(novedad.horaInicio)} - ${formatTime(novedad.horaFin)}`}</td>
                <td>
                  <label className="switch">
                    <input type="checkbox" checked={novedad.estado} onChange={() => onToggleEstado(novedad)} />
                    <span className="slider round"></span>
                  </label>
                </td>
                <td className="actions-cell">
                  <button onClick={() => onView(novedad)} className="action-button view" title="Ver Detalles">
                    <FaRegEye />
                  </button>
                  <button onClick={() => onEdit(novedad)} className="action-button edit" title="Editar">
                    <FaEdit />
                  </button>
                  <button onClick={() => onDeleteConfirm(novedad)} className="action-button delete" title="Eliminar">
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">No hay novedades para mostrar.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default NovedadesTable;