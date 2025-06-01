// src/features/novedades/components/HorariosTable.jsx
import React from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const HorariosTable = ({
  horarios,
  empleados,
  onView,
  onEdit,
  onDeleteConfirm,
  onToggleEstado,
}) => {
  const getEmpleadoNombre = (empleadoId) => {
    // console.log(`Buscando empleado con ID: ${empleadoId} (tipo: ${typeof empleadoId})`);
    // console.log("Lista de empleados en tabla:", JSON.stringify(empleados, null, 2));
    if (empleadoId === null || empleadoId === undefined)
      return "ID Encargado N/A";

    const empleadoIdNumero = parseInt(empleadoId); // Asegurar que la comparación sea numérica
    if (isNaN(empleadoIdNumero)) return "ID Inválido";

    const emp = empleados.find((e) => e.id === empleadoIdNumero);
    // console.log("Empleado encontrado para ID " + empleadoIdNumero + ":", emp ? emp.nombre : "No encontrado");

    return emp && emp.nombre ? emp.nombre : "Desconocido";
  };

  return (
    <div className="novedades-table-container">
      <table className="novedades-table-horarios">
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
          {horarios && horarios.length > 0 ? (
            horarios.map((horario) => (
              <tr key={horario.id}>
                <td data-label="Encargado:">
                  {getEmpleadoNombre(horario.empleadoId)}
                </td>
                <td data-label="Periodo:">
                  {horario.fechaInicio || "Fecha N/A"} a{" "}
                  {horario.fechaFin || "Fecha N/A"}
                </td>
                <td data-label="Días y Horarios:">
                  {horario.dias && horario.dias.length > 0
                    ? horario.dias.map((dia, idx) => (
                        <div key={idx} className="novedades-dia-horario-item">
                          <strong>{dia.dia || "Día N/A"}:</strong>
                          {dia.horaInicio || "--:--"} - {dia.horaFin || "--:--"}
                        </div>
                      ))
                    : "No hay días definidos"}
                </td>
                <td data-label="Estado:">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={!!horario.estado} // Asegurar que sea booleano
                      onChange={() => onToggleEstado(horario.id)}
                    />
                    <span className="slider round"></span>
                  </label>
                </td>
                <td data-label="Acciones:" className="novedades-actions">
                  <button
                    className="novedades-table-button"
                    onClick={() => onView(horario)}
                    title="Ver Detalles"
                  >
                    <FaEye />
                  </button>
                  <button
                    className="novedades-table-button"
                    onClick={() => onEdit(horario)}
                    title="Editar Horario"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="novedades-table-button novedades-table-button-delete"
                    onClick={() => onDeleteConfirm(horario)}
                    title="Eliminar Horario"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
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