// src/features/home/components/ServiceCard.jsx
import React from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/contexts/authHooks';

function ServiceCard({ service, onAddToCart, showAppointmentButton = false }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  if (!service) {
    console.warn("ServiceCard recibió un servicio inválido:", service);
    return null;
  }

  // Manejar tanto campos en inglés como en español
  const name = service.name || service.nombre;
  const description = service.description || service.descripcion;
  const price = service.price || service.precio;
  const image = service.image || service.imagen;
  const id = service.id || service.idServicio;

  // Convertir precio a número si viene como string
  const priceNumber = typeof price === 'string' ? parseFloat(price) : price;

  const handleAgendarCita = () => {
    if (!isAuthenticated) {
      // Si no está autenticado, redirigir al login
      navigate('/login', { 
        state: { 
          redirectTo: '/admin/citas/agendar',
          redirectState: { servicioPreseleccionado: service }
        } 
      });
    } else {
      // Si está autenticado, ir directamente a agendar cita
      navigate('/admin/citas/agendar', { 
        state: { 
          servicioPreseleccionado: service 
        } 
      });
    }
  };

  return (
    <div className="public-servicios-card">
      {/* Imagen del servicio o placeholder si no tiene imagen */}
      <div className="public-servicios-image-wrapper">
        {image ? (
          <img
            src={image}
            alt={name}
            className="public-servicios-image"
          />
        ) : (
          <div className="public-servicios-image-placeholder">
            <span className="placeholder-icon">✂️</span>
            <span className="placeholder-text">Sin imagen</span>
          </div>
        )}
      </div>

      <h3>{name}</h3>
      <p>{description || "Sin descripción"}</p>
      <p className="public-servicios-price">
        {!isNaN(priceNumber) && priceNumber > 0
          ? `$${priceNumber.toLocaleString()}`
          : "Precio no disponible"}
      </p>

      {showAppointmentButton ? (
        <button
          onClick={handleAgendarCita}
          className="public-appointment-button"
        >
          <FaCalendarAlt className="btn-icon" />
          Agendar Cita
        </button>
      ) : (
        <button
          onClick={() => onAddToCart(service)}
          className="public-add-button-servicio"
        >
          Agregar
        </button>
      )}
    </div>
  );
}

export default ServiceCard;
