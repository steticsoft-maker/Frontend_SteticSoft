import React from 'react';

const ServicioAdminDetalleModal = ({ isOpen, onClose, servicio }) => {
  if (!isOpen || !servicio) return null;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="modalServicio">
      <div className="modal-content-Servicio detalle">
        <h3>Detalles del Servicio</h3>
        <div className="servicio-details-list">
          <p><strong>ID:</strong> {servicio.idServicio}</p>
          <p><strong>Nombre:</strong> {servicio.nombre}</p>
          <p><strong>Descripción:</strong> {servicio.descripcion || 'Sin descripción'}</p>
          <p><strong>Precio:</strong> {formatCurrency(servicio.precio)}</p>
          <p><strong>Duración:</strong> {servicio.duracionEstimadaMin} minutos</p>
          <p><strong>Categoría:</strong> {servicio.categoria?.nombre || 'N/A'}</p>
          {servicio.imagenURL && (
            <div className="detalle-imagen-container">
              <p><strong>Imagen:</strong></p>
              <img src={servicio.imagenURL} alt={servicio.nombre} className="servicio-imagen-detalle" />
            </div>
          )}
          <p><strong>Especialidad:</strong> {servicio.especialidad?.nombre || 'No requiere'}</p>
          <p><strong>Estado:</strong> {servicio.estado ? 'Activo' : 'Inactivo'}</p>
        </div>
        <button className="servicios-modalButton-cerrar" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ServicioAdminDetalleModal;