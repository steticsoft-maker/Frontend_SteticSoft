// src/features/horarios/components/HorariosTable.jsx
import React from 'react';
// --- MODIFICADO: Se reciben todas las props necesarias desde el componente padre ---
const HorariosTable = ({ horarios, onView, onEdit, onDeleteConfirm, onToggleEstado }) => {
  return (
    <div className="novedades-table-container">
      <table className="novedades-table-horarios">
        <thead>
          <tr>
            <th>#</th>
            <th>Encargado</th>
            <th>Fechas de Vigencia</th>
            <th>Días y Horarios</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {horarios.length > 0 ? (
            horarios.map((horario, index) => (
              <tr key={horario.id}>
                <td>{index + 1}</td>
                <td>{horario.empleado?.nombre || 'N/A'}</td>
                <td>{horario.fecha_inicio} al {horario.fecha_fin}</td>
                <td>
                  {horario.dias.map(d => (
                    <div key={d.id || d.dia} className="novedades-dia-horario-item">
                      <strong>{d.dia}:</strong> {d.hora_inicio} - {d.hora_fin}
                    </div>
                  ))}
                </td>
                <td>
                  <div onClick={() => onToggleEstado(horario)} style={{ display: 'inline-block', cursor: 'pointer' }}>
                    <label className="switch">
                      <input type="checkbox" checked={horario.estado} readOnly />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </td>
                <td className="novedades-actions">
                  <button onClick={() => onView(horario)} className="novedades-table-button" title="Ver Detalles">
                    👁️
                  </button>

                  <button onClick={() => onEdit(horario)} className="novedades-table-button" title="Editar">
                    ✏️
                  </button>
                  
                  <button onClick={() => onDeleteConfirm(horario)} className="novedades-table-button novedades-table-button-delete" title="Eliminar">
                    🗑️
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                No hay horarios para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HorariosTable;