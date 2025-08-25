import React from 'react';

function ServiceCard({ service, onAddToCart }) {
  return (
    <div className="service-card">
      {service.imagenURL && (
        <div className="service-card-image-container">
          <img src={service.imagenURL} alt={service.nombre} className="service-card-image" />
        </div>
      )}
      <div className="service-card-content">
        <h3 className="service-card-title">{service.nombre}</h3>
        <p className="service-card-description">{service.description || service.categoria || ''}</p>
        <div className="service-card-footer">
          <p className="service-card-price">${service.precio.toFixed(2)}</p>
          <button onClick={() => onAddToCart(service)} className="service-card-button">
            Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  );
}

export default ServiceCard;
