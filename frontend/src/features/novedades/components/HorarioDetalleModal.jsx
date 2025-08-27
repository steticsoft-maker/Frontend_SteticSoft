import React from 'react';
import '../css/ConfigHorarios.css';

const HorarioDetalleModal = ({ novedad, onClose }) => {
  if (!novedad) return null;

  const formatTime = (timeString) => timeString ? timeString.slice(0, 5) : 'N/A';
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    return adjustedDate.toLocaleDateString('es-CO', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Detalles de la Novedad</h2>
          <button onClick={onClose} className="modal-close-button">&times;</button>
        </div>
        <div className="modal-body">
          <div className="detail-section">
            <div className="detail-item">
              <strong>Rango de Fechas:</strong>
              <span>{`${formatDate(novedad.fechaInicio)} - ${formatDate(novedad.fechaFin)}`}</span>
            </div>
            <div className="detail-item">
              <strong>Horario:</strong>
              <span>{`${formatTime(novedad.horaInicio)} - ${formatTime(novedad.horaFin)}`}</span>
            </div>
            <div className="detail-item">
              <strong>Estado:</strong>
              <span className={novedad.estado ? 'status-active' : 'status-inactive'}>
                {novedad.estado ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>

          <div className="detail-section">
            <h3>Empleados Asignados</h3>
            {novedad.empleados && novedad.empleados.length > 0 ? (
              <ul className="employee-list">
                {novedad.empleados.map(user => (
                  <li key={user.idUsuario}>
                    <div className="employee-name-detail">
                      {user.empleadoInfo ? `${user.empleadoInfo.nombre} ${user.empleadoInfo.apellido}` : 'Nombre no disponible'}
                    </div>
                    {/* ✅ Se muestra el Correo y Número de Documento */}
                    <div className="employee-contact-info">
                      Correo: {user.correo}
                    </div>
                    <div className="employee-contact-info">
                      Documento: {user.empleadoInfo?.numeroDocumento || 'No disponible'}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay empleados asignados a esta novedad.</p>
            )}
          </div>
          
          <div className="modal-actions">
            <button onClick={onClose} className="button-secondary">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorarioDetalleModal;