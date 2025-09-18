import React from "react";
import moment from "moment";
import { FaEye, FaEdit, FaTrashAlt } from "react-icons/fa";
import "../../../shared/styles/crud-common.css";

const CitasTable = ({ citas, onViewDetails, onEdit, onDelete, onStatusChange, estadosCita }) => {
  if (!citas || citas.length === 0) {
    return <p>No hay citas para mostrar.</p>;
  }

  const getEstadoClass = (estado) => {
    return (estado || "desconocido").toLowerCase().replace(/\s+/g, "-");
  };

  // ✅ Lógica mejorada para determinar si una cita es editable o su estado se puede cambiar.
  // Se considera "no accionable" si está finalizada o cancelada.
  const isActionable = (estado) => {
    const lowerCaseEstado = (estado || "").toLowerCase();
    return lowerCaseEstado !== 'finalizada' && lowerCaseEstado !== 'cancelada';
  };

  return (
    <div className="citas-table-container">
      <table className="crud-table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Empleado</th>
            <th>Servicios</th>
            <th>Fecha y Hora</th>
            <th>Total</th>
            <th>Estado Actual</th>
            <th>Cambiar Estado</th>
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
                {/* El select para cambiar estado solo se muestra si la cita es accionable */}
                {isActionable(cita.estadoCita) ? (
                  <select
                    value={cita.estadoCitaId}
                    onChange={(e) => onStatusChange(cita.id, e.target.value)}
                    className="citas-status-select"
                    aria-label={`Cambiar estado de la cita para ${cita.clienteNombre}`}
                  >
                    {/* Filtra los estados para no mostrar el estado "pendiente" si la cita ya está confirmada */}
                    {(estadosCita || []).map(estado => (
                      <option key={estado.idEstadoCita} value={estado.idEstadoCita}>
                        {estado.nombreEstado}
                      </option>
                    ))}
                  </select>
                ) : (
                  // Si no es accionable, muestra el estado como texto plano.
                  <span className="cita-estado-final">{cita.estadoCita}</span>
                )}
              </td>
              <td>
                <div className="crud-table-iconos">
                  <button onClick={() => onViewDetails(cita)} className="crud-table-button btn-view" title="Ver Detalles">
                    <FaEye />
                  </button>
                  {/* El botón de editar solo aparece si la cita es accionable */}
                  {isActionable(cita.estadoCita) && (
                    <button onClick={() => onEdit(cita)} className="crud-table-button btn-edit" title="Editar Cita">
                      <FaEdit />
                    </button>
                  )}
                  {/* El botón de eliminar se muestra siempre, asumiendo que es una acción administrativa */}
                  <button onClick={() => onDelete(cita.id)} className="crud-table-button btn-delete" title="Eliminar Cita">
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
