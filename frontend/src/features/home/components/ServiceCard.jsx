// src/features/home/components/ServiceCard.jsx
import React from 'react';
// import '../css/ServiceCard.css'; // O estilos dentro de PublicServicios.css

function ServiceCard({ service, onAddToCart }) {
  return (
    <div className="public-servicios-card"> {/* Usar prefijo */}
      {service.imagenURL && (
        <img
          src={service.imagenURL}
          alt={service.nombre}
          className="public-servicios-image"
        />
      )}
      <h3>{service.nombre}</h3>
      <p>{service.description || service.categoria || ''}</p>
      <p className="public-servicios-price">${service.price.toFixed(2)}</p>
      <button onClick={() => onAddToCart(service)} className="public-add-button-servicio"> {/* Clase específica */}
        Agregar
      </button>
    </div>
  );
}
export default ServiceCard;