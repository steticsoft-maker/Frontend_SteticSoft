// src/features/home/components/ServiceCard.jsx
import React from 'react';

function ServiceCard({ service, onAddToCart }) {
  if (!service) {
    console.warn("ServiceCard recibió un servicio inválido:", service);
    return null;
  }

  const { name, description, price, image } = service;

  return (
    <div className="public-servicios-card">
      {/* Imagen del servicio */}
      {image && (
        <div className="public-servicios-image-wrapper">
          <img
            src={image}
            alt={name}
            className="public-servicios-image"
          />
        </div>
      )}

      <h3>{name}</h3>
      <p>{description || "Sin descripción"}</p>
      <p className="public-servicios-price">
        {typeof price === "number"
          ? `$${price.toLocaleString()}`
          : "Precio no disponible"}
      </p>

      <button
        onClick={() => onAddToCart(service)}
        className="public-add-button-servicio"
      >
        Agregar
      </button>
    </div>
  );
}

export default ServiceCard;
