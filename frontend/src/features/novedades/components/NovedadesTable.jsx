import React from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
// ✅ Importamos el nuevo CSS específico para la tabla
import '../css/ConfigHorarios.css'; 

const NovedadesTable = ({ novedades, onEdit, onDeleteConfirm, onToggleEstado }) => {

  const formatTime = (timeString) => timeString ? timeString.slice(0, 5) : 'N/A';

  return (
    // ✅ Se usa la misma estructura contenedora que la tabla de servicios
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
                    novedad.empleados.map(emp => (
                      <div key={emp.idUsuario} className="employee-email">
                        {emp.correo || 'Empleado sin correo'}
                      </div>
                    ))
                  ) : (
                    <span className="text-muted">Sin asignar</span>
                  )}
                </td>
                <td>{`${novedad.fechaInicio} al ${novedad.fechaFin}`}</td>
                <td>{`${formatTime(novedad.horaInicio)} - ${formatTime(novedad.horaFin)}`}</td>
                <td>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={novedad.estado} 
                      onChange={() => onToggleEstado(novedad)} 
                    />
                    <span className="slider round"></span>
                  </label>
                </td>
                <td className="actions-cell">
                  {/* ✅ Se usan las mismas clases para los botones de acción */}
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
              <td colSpan="6" className="text-center">
                No hay novedades de horario para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default NovedadesTable;