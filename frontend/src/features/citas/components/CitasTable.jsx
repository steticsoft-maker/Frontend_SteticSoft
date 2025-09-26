import React from "react";
import moment from "moment";
import { FaRegEye, FaEdit, FaTrashAlt } from "react-icons/fa";
import '../../../shared/styles/table-common.css';

const CitasTable = ({ citas, onViewDetails, onEdit, onDelete, onStatusChange, estadosCita = [] }) => {
  if (!citas || citas.length === 0) {
    return (
      <tr>
        <td colSpan="6" className="text-center">
          No hay citas para mostrar.
        </td>
      </tr>
    );
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
              <td data-label="Cliente">
                <div className="cliente-info">
                  <div className="cliente-nombre">{cita.clienteNombre || "N/A"}</div>
                  {cita.clienteDocumento && (
                    <div className="cliente-documento">Doc: {cita.clienteDocumento}</div>
                  )}
                </div>
              </td>
              <td data-label="Encargado(a)">{cita.empleadoNombre || "N/A"}</td>
              <td data-label="Fecha y Hora">{moment(cita.start).format("DD/MM/YYYY hh:mm A")}</td>
              
              <td data-label="Estado">
                {isActionable(cita.estadoCita) ? (
                  <select
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
                  <span className={`status-badge ${getEstadoClass(cita.estadoCita)}`}>
                    {cita.estadoCita}
                  </span>
                )}
              </td>

              <td data-label="Acciones">
                <div className="table-iconos">
                  <button onClick={() => onViewDetails(cita)} className="table-button btn-view" title="Ver Detalles">
                    <FaRegEye />
                  </button>
                  {isActionable(cita.estadoCita) && (
                    <button onClick={() => onEdit(cita)} className="table-button btn-edit" title="Editar Cita">
                      <FaEdit />
                    </button>
                  )}
                  <button onClick={() => onDelete(cita)} className="table-button btn-delete" title="Eliminar Cita">
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