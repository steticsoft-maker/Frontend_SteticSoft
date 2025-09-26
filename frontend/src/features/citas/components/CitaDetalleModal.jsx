import React from 'react';
import moment from 'moment';
import 'moment/locale/es';

const CitaDetalleModal = ({ isOpen, onClose, cita }) => {
  if (!isOpen || !cita) return null;
  moment.locale('es');
  const totalServicios = (cita.serviciosProgramados || []).reduce(
    (total, s) => total + parseFloat(s.precio || 0), 0
  );

  const getEstadoClass = (estado) => {
    return (estado || "desconocido").toLowerCase().replace(/\s+/g, "-");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Detalles de la Cita #{cita.id || cita.idCita}</h2>
          <button className="modal-close-button" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-body">
          <div className="detalle-grid">
            <div className="detalle-columna">
              <div className="detalle-item">
                <span className="detalle-label">Cliente</span>
                <div className="detalle-valor">
                  <div className="persona-nombre">{cita.clienteNombre || "N/A"}</div>
                  {cita.clienteDocumento && (
                    <div className="persona-documento">Doc: {cita.clienteDocumento}</div>
                  )}
                </div>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Encargado(a)</span>
                <div className="detalle-valor">
                  <div className="persona-nombre">{cita.empleadoNombre || "N/A"}</div>
                  {cita.empleadoDocumento && (
                    <div className="persona-documento">Doc: {cita.empleadoDocumento}</div>
                  )}
                </div>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Fecha y Hora</span>
                <span className="detalle-valor">{moment(cita.start).format("dddd, D [de] MMMM, YYYY hh:mm A")}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">Estado</span>
                <span className={`status-badge ${getEstadoClass(cita.estadoCita)}`}>
                  {cita.estadoCita || "Pendiente"}
                </span>
              </div>
            </div>

            <div className="detalle-columna">
              <div className="detalle-item">
                <span className="detalle-label">Servicios Contratados</span>
                <div className="servicios-lista">
                  {(cita.serviciosProgramados && cita.serviciosProgramados.length > 0) ? (
                    cita.serviciosProgramados.map(servicio => (
                      <div className="servicio-item" key={servicio.idServicio}>
                        <span>{servicio.nombre}</span>
                        <span>${(parseFloat(servicio.precio) || 0).toLocaleString("es-CO")}</span>
                      </div>
                    ))
                  ) : (
                    <p>No hay servicios detallados.</p>
                  )}
                </div>
              </div>
              <div className="detalle-total">
                <span className="detalle-label-total">Total Estimado</span>
                <span className="detalle-valor-total">
                  ${totalServicios.toLocaleString("es-CO")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitaDetalleModal;