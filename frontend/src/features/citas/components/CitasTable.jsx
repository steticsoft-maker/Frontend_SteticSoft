import React from "react";
import moment from "moment";
import { FaEye, FaEdit, FaTrashAlt, FaTimesCircle } from "react-icons/fa";

const CitasTable = ({ citas, onViewDetails, onEdit, onCancel, onDelete }) => {
  if (!citas || citas.length === 0) {
    return <p>No hay citas para mostrar.</p>;
  }

  // Helper para normalizar el nombre del estado para la clase CSS
  const getEstadoClass = (estado) => {
    return (estado || "desconocido").toLowerCase().replace(/\s+/g, "-");
  };

  return (
    <div className="citas-table-container">
      <table className="citas-table-content">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Empleado</th>
            <th>Servicios</th>
            <th>Fecha y Hora</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {citas.map((cita) => (
            <tr key={cita.id}>
              <td>{cita.clienteNombre}</td>
              <td>{cita.empleadoNombre}</td>
              <td>{cita.serviciosNombres}</td>
              <td>{moment(cita.start).format("DD/MM/YYYY hh:mm A")}</td>
              <td>${(cita.precioTotal || 0).toLocaleString("es-CO")}</td>
              <td>
                <span className={`cita-estado-badge estado-${getEstadoClass(cita.estadoCita)}`}>
                  {cita.estadoCita}
                </span>
              </td>
              <td>
                <div className="citas-table-actions">
                  <button onClick={() => onViewDetails(cita)} className="citas-action-button" title="Ver Detalles">
                    <FaEye />
                  </button>
                  {/* Los botones de editar/cancelar solo aparecen si la cita está activa */}
                  {cita.estadoCita !== 'Cancelada' && cita.estadoCita !== 'Completada' && (
                    <>
                      <button onClick={() => onEdit(cita)} className="citas-action-button" title="Editar Cita">
                        <FaEdit />
                      </button>
                      <button onClick={() => onCancel(cita.id)} className="citas-action-button" title="Cancelar Cita">
                        <FaTimesCircle />
                      </button>
                    </>
                  )}
                  <button onClick={() => onDelete(cita.id)} className="citas-action-button" title="Eliminar Cita">
                    <FaTrashAlt />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CitasTable;
