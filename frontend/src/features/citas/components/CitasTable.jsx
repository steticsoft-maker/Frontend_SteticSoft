import React from "react";
import moment from "moment";
import { FaEye, FaEdit, FaTrashAlt } from "react-icons/fa";

const CitasTable = ({ citas, onViewDetails, onEdit, onDelete, onStatusChange, estadosCita = [] }) => {
  if (!citas || citas.length === 0) {
    return <p className="empty-table-message">No hay citas para mostrar.</p>;
  }

  const citasOrdenadas = [...citas].sort(
    (a, b) => moment(b.start).valueOf() - moment(a.start).valueOf()
  );

  const getEstadoClass = (estado) => {
    return (estado || "desconocido").toLowerCase().replace(/\s+/g, "-");
  };
  
  const isActionable = (estado) => {
    const lowerCaseEstado = (estado || "").toLowerCase();
    return lowerCaseEstado !== 'finalizado' && lowerCaseEstado !== 'cancelado' && lowerCaseEstado !== 'completado';
  };

  return (
    <div className="table-container">
      <table className="table-main">
        <thead>
          <tr>
            <th>#</th>
            <th>Cliente</th>
            <th>Encargado(a)</th>
            <th>Fecha y Hora</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
      <tbody>
        {citasOrdenadas.map((cita, index) => (
          <tr key={cita.id}>
            <td data-label="#">{index + 1}</td>
            <td data-label="Cliente">{cita.clienteNombre || "N/A"}</td>
            <td data-label="Encargado(a)">{cita.empleadoNombre || "N/A"}</td>
            <td data-label="Fecha y Hora">{moment(cita.start).format("DD/MM/YYYY hh:mm A")}</td>
            
            <td data-label="Estado">
              {isActionable(cita.estadoCita) ? (
                <select
                  // Se aplica una clase dinámica para el color
                  className={`citas-status-select status-select-${getEstadoClass(cita.estadoCita)}`}
                  value={cita.idEstado}
                  onChange={(e) => onStatusChange(cita.id, e.target.value)}
                  aria-label={`Cambiar estado de ${cita.clienteNombre}`}
                >
                  {(estadosCita || []).map(estado => (
                    <option key={estado.idEstado} value={estado.idEstado}>
                      {estado.nombreEstado}
                    </option>
                  ))}
                </select>
              ) : (
                // Si no es accionable, muestra el badge estático
                <span className={`status-badge ${getEstadoClass(cita.estadoCita)}`}>
                  {cita.estadoCita}
                </span>
              )}
            </td>

            <td data-label="Acciones">
              <div className="actions-cell">
                <button onClick={() => onViewDetails(cita)} className="btn" title="Ver Detalles">
                  <FaEye />
                </button>
                {isActionable(cita.estadoCita) && (
                   <button onClick={() => onEdit(cita)} className="btn" title="Editar Cita">
                      <FaEdit />
                   </button>
                )}
                <button onClick={() => onDelete(cita)} className="btn" title="Eliminar Cita">
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