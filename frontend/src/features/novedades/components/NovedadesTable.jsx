// src/features/horarios/components/HorariosTable.jsx
import React from 'react';
import { FaRegEye, FaEdit, FaTrashAlt } from 'react-icons/fa'; // O los íconos que prefieras

// --- MODIFICADO: Se recibe la prop como 'novedades' para mayor claridad ---
const HorariosTable = ({ novedades, onView, onEdit, onDeleteConfirm, onToggleEstado }) => {

  // Función para formatear las horas (ej: de "09:00:00" a "09:00")
  const formatTime = (timeString) => timeString ? timeString.slice(0, 5) : 'N/A';

  return (
    <div className="table-container"> {/* Usa un nombre de clase más genérico si lo prefieres */}
      <table className="custom-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Encargado(s)</th>
            <th>Rango de Fechas</th>
            <th>Horario</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {novedades && novedades.length > 0 ? (
            novedades.map((novedad, index) => (
              // Usamos idNovedad como key, que es más robusto
              <tr key={novedad.idNovedad}>
                <td>{index + 1}</td>
                
                {/* Muestra todos los empleados asignados a esta novedad */}
                <td>
                  {novedad.empleados && novedad.empleados.length > 0 ? (
                    novedad.empleados.map(emp => (
                      <div key={emp.idUsuario}>{emp.correo || 'Empleado sin correo'}</div>
                    ))
                  ) : (
                    'Sin asignar'
                  )}
                </td>

                {/* Muestra el rango de fechas */}
                <td>
                  {novedad.fechaInicio} al {novedad.fechaFin}
                </td>

                {/* Muestra el rango de horas */}
                <td>
                  {formatTime(novedad.horaInicio)} - {formatTime(novedad.horaFin)}
                </td>
                
                {/* Muestra el estado con un interruptor (toggle) */}
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
                
                {/* Muestra los botones de acciones */}
                <td className="actions-cell">
                  <button onClick={() => onView(novedad)} className="action-button" title="Ver Detalles">
                    <FaRegEye />
                  </button>
                  <button onClick={() => onEdit(novedad)} className="action-button" title="Editar">
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
              <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                No hay novedades de horario para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HorariosTable;