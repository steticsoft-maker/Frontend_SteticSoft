import React from 'react';
import moment from 'moment';
import 'moment/locale/es';

const CitaDetalleModal = ({ isOpen, onClose, cita }) => {
  if (!isOpen || !cita) return null;
  moment.locale('es');
  
  const totalServicios = (cita.serviciosProgramados || []).reduce(
    (total, s) => total + parseFloat(s.precio || 0), 0
  );

  // Formateador de moneda colombiana
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(parseFloat(value) || 0);
  };

  return (
    <div className="details-modal-overlay" onClick={onClose}>
      <div className="details-modal-content" onClick={(e) => e.stopPropagation()}>
        
        <button className="details-modal-close-button" onClick={onClose} aria-label="Cerrar modal">
          &times;
        </button>

        <h3>Detalles de la Cita #{cita.id || cita.idCita}</h3>

        <div className="details-list">
          <p><strong>Cliente:</strong> {cita.clienteNombre || 'N/A'}</p>
          {cita.clienteDocumento && (
            <p><strong>Documento Cliente:</strong> {cita.clienteDocumento}</p>
          )}
          <p><strong>Encargado(a):</strong> {cita.empleadoNombre || 'N/A'}</p>
          {cita.empleadoDocumento && (
            <p><strong>Documento Empleado:</strong> {cita.empleadoDocumento}</p>
          )}
          <p><strong>Fecha y Hora:</strong> {moment(cita.start).format("dddd, D [de] MMMM, YYYY hh:mm A")}</p>
        </div>

        <div className="details-list">
          <p><strong>Servicios Contratados:</strong></p>
          {(cita.serviciosProgramados && cita.serviciosProgramados.length > 0) ? (
            <div style={{ marginLeft: '20px', marginTop: '10px' }}>
              {cita.serviciosProgramados.map(servicio => (
                <p key={servicio.idServicio} style={{ margin: '5px 0', padding: '5px 0' }}>
                  • {servicio.nombre} - {formatCurrency(servicio.precio)}
                </p>
              ))}
            </div>
          ) : (
            <p style={{ marginLeft: '20px', color: 'var(--color-text-muted)' }}>No hay servicios detallados.</p>
          )}
          <p style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px solid var(--color-form-border)' }}>
            <strong>Total Estimado:</strong> {formatCurrency(totalServicios)}
          </p>
        </div>

      </div>
    </div>
  );
};

export default CitaDetalleModal;