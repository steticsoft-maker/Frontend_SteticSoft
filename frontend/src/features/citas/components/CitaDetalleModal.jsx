import React from 'react';

const CitaDetalleModal = ({ isOpen, onClose, cita }) => {
  if (!isOpen || !cita) return null;
  
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

  // Función para formatear fecha en español
  const formatDateInSpanish = (dateString) => {
    const date = new Date(dateString);
    
    const diasSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                   'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    
    const diaSemana = diasSemana[date.getDay()];
    const dia = date.getDate();
    const mes = meses[date.getMonth()];
    const año = date.getFullYear();
    const horas = date.getHours().toString().padStart(2, '0');
    const minutos = date.getMinutes().toString().padStart(2, '0');
    
    return `${diaSemana}, ${dia} de ${mes} de ${año}, ${horas}:${minutos}`;
  };

  const getEstadoBadge = () => {
    const estado = cita.estadoCita || cita.estado;
    let estadoClass = 'badge-pendiente';
    let estadoText = 'Pendiente';
    
    if (estado) {
      // Normalizar el estado para crear la clase CSS
      const estadoNormalizado = estado.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[áä]/g, 'a')
        .replace(/[éë]/g, 'e')
        .replace(/[íï]/g, 'i')
        .replace(/[óö]/g, 'o')
        .replace(/[úü]/g, 'u')
        .replace(/ñ/g, 'n')
        .replace(/[^a-z0-9-]/g, '');
      
      // Mapear estados específicos a sus clases correspondientes
      const estadoMap = {
        'pendiente': 'badge-pendiente',
        'confirmada': 'badge-confirmada',
        'confirmado': 'badge-confirmada',
        'completada': 'badge-completada',
        'completado': 'badge-completada',
        'cancelada': 'badge-cancelada',
        'cancelado': 'badge-cancelada',
        'finalizada': 'badge-finalizada',
        'finalizado': 'badge-finalizada',
        'en-proceso': 'badge-en-proceso',
        'reprogramada': 'badge-reprogramada',
        'reprogramado': 'badge-reprogramada',
        'aceptada': 'badge-aceptada',
        'aceptado': 'badge-aceptada',
        'procesada': 'badge-procesada',
        'procesado': 'badge-procesada',
        'activa': 'badge-activa',
        'activo': 'badge-activa',
        'inactiva': 'badge-inactiva',
        'inactivo': 'badge-inactiva'
      };
      
      estadoClass = estadoMap[estadoNormalizado] || `badge-${estadoNormalizado}`;
      estadoText = estado;
      
      // Debug: mostrar en consola qué clases se están aplicando
      console.log('Estado original:', estado);
      console.log('Estado normalizado:', estadoNormalizado);
      console.log('Clase CSS:', estadoClass);
    }
    
    return <span className={`badge ${estadoClass}`} title={`Estado: ${estadoText}`}>{estadoText}</span>;
  };

  return (
    <div className="details-modal-overlay" onClick={onClose}>
      <div className="details-modal-content citas-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="citas-modal-header">
          <h3 className="citas-modal-title">
            <span className="citas-modal-icon">📅</span>
            Detalles de la Cita
          </h3>
          <button
            type="button"
            className="citas-modal-close-button"
            onClick={onClose}
            title="Cerrar"
          >
            &times;
          </button>
        </div>

        <div className="citas-modal-body">
          <div className="citas-details-container">
            <div className="citas-details-section">
              <h4 className="citas-details-section-title">
                <span className="section-icon">📋</span>
                Información Básica
              </h4>
              <div className="citas-details-grid">
                <div className="citas-detail-item">
                  <label className="citas-detail-label">Estado</label>
                  <span className="citas-detail-value">
                    {getEstadoBadge()}
                  </span>
                </div>
                <div className="citas-detail-item">
                  <label className="citas-detail-label">Fecha y Hora</label>
                  <span className="citas-detail-value citas-datetime-text">
                    {formatDateInSpanish(cita.start)}
                  </span>
                </div>
              </div>
            </div>

            <div className="citas-details-section">
              <h4 className="citas-details-section-title">
                <span className="section-icon">👤</span>
                Información del Cliente
              </h4>
              <div className="citas-details-grid">
                <div className="citas-detail-item">
                  <label className="citas-detail-label">Cliente</label>
                  <span className="citas-detail-value citas-client-text">
                    {cita.clienteNombre || 'N/A'}
                  </span>
                </div>
                {cita.clienteDocumento && (
                  <div className="citas-detail-item">
                    <label className="citas-detail-label">Documento Cliente</label>
                    <span className="citas-detail-value">
                      {cita.clienteDocumento}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="citas-details-section">
              <h4 className="citas-details-section-title">
                <span className="section-icon">👨‍💼</span>
                Información del Empleado
              </h4>
              <div className="citas-details-grid">
                <div className="citas-detail-item">
                  <label className="citas-detail-label">Encargado(a)</label>
                  <span className="citas-detail-value citas-employee-text">
                    {cita.empleadoNombre || 'N/A'}
                  </span>
                </div>
                {cita.empleadoDocumento && (
                  <div className="citas-detail-item">
                    <label className="citas-detail-label">Documento Empleado</label>
                    <span className="citas-detail-value">
                      {cita.empleadoDocumento}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="citas-details-section">
              <h4 className="citas-details-section-title">
                <span className="section-icon">🛍️</span>
                Servicios Contratados
              </h4>
              <div className="citas-details-grid">
                <div className="citas-detail-item citas-detail-item-full">
                  {cita.serviciosProgramados && cita.serviciosProgramados.length > 0 ? (
                    <div className="citas-servicios-container">
                      {cita.serviciosProgramados.map((servicio, index) => (
                        <div key={servicio.idServicio || index} className="citas-servicio-item">
                          <div className="citas-servicio-header">
                            <span className="citas-servicio-nombre">
                              {servicio.nombre || 'Servicio sin nombre'}
                            </span>
                            <span className="citas-servicio-precio">
                              {formatCurrency(servicio.precio)}
                            </span>
                          </div>
                        </div>
                      ))}
                      <div className="citas-total-container">
                        <div className="citas-total-line"></div>
                        <div className="citas-total-item">
                          <span className="citas-total-label">Total Estimado:</span>
                          <span className="citas-total-value">{formatCurrency(totalServicios)}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="citas-no-servicios">
                      <span className="citas-no-servicios-icon">🛍️</span>
                      <span>No hay servicios detallados para esta cita</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CitaDetalleModal;