// src/features/novedades/components/HorariosTable.jsx
import React from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const Horariosable = ({
  horarios,
  empleados,
  onView,
  onEdit,
  onDeleteConfirm,
  onToggleEstado,
}) => {
  const getEmpleadoNombre = (empleadoId) => {
    const emp = empleados.find((e) => e.id === parseInt(empleadoId));
    return emp ? emp.nombre : "Desconocido";
  };

  return (
    <table className="tablaHorario">
      {" "}
      {/* Clase del CSS original */}
      <thead>
        <tr>
          <th>Encargado</th>
          <th>Periodo</th>
          <th>Días y Horarios</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {horarios.map((horario) => (
          <tr key={horario.id}>
            <td>{getEmpleadoNombre(horario.empleadoId)}</td>
            <td>
              {horario.fechaInicio} a {horario.fechaFin}
            </td>
            <td>
              {(horario.dias || []).map((dia, idx) => (
                <div key={idx} className="dia-horario">
                  {" "}
                  {/* Clase del CSS original */}
                  <strong>{dia.dia}:</strong> {dia.horaInicio} - {dia.horaFin}
                </div>
              ))}
            </td>
            <td>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={horario.estado}
                  onChange={() => onToggleEstado(horario.id)}
                />
                <span className="slider round"></span>
              </label>
            </td>
            <td className="novedades-actions">
              {" "}
              {/* Nueva clase para centrar */}
              <button
                className="botonAgregar"
                onClick={() => onView(horario)}
                title="Ver Detalles"
              >
                {" "}
                {/* Clase del CSS original */}
                <FaEye />
              </button>
              <button
                className="botonAgregar"
                onClick={() => onEdit(horario)}
                title="Editar Horario"
              >
                {" "}
                {/* Clase del CSS original */}
                <FaEdit />
              </button>
              <button
                className="botonCerrar"
                onClick={() => onDeleteConfirm(horario)}
                title="Eliminar Horario"
              >
                {" "}
                {/* Clase del CSS original */}
                <FaTrash />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
export default Horariosable;
