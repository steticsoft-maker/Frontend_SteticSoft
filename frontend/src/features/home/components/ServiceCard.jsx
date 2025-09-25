// src/features/home/components/ServiceCard.jsx
import React from "react";
import { FaCrown, FaCalendarAlt } from "react-icons/fa";
import { formatPrice } from "../../../shared/utils/priceUtils";

const ServiceCard = ({ service }) => {
  const handleScheduleService = () => {
    // Redirigir a la página de agendar citas
    window.location.href = "/admin/citas/agendar";
  };

  return (
    <div className="service-card-container">
      {/* Image Container */}
      <div
        className="service-image-container"
        style={{
          position: "relative",
          width: "100%",
          height: "200px",
          overflow: "hidden",
          borderRadius: "18px 18px 0 0",
          background: "linear-gradient(135deg, #f8bbd9 0%, #e91e63 20%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {service.imagen ? (
          <img
            src={service.imagen}
            alt={service.nombre}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              transition: "transform 0.3s ease",
              borderRadius: "0",
            }}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
            onLoad={(e) => {
              e.target.style.display = "block";
              e.target.nextSibling.style.display = "none";
            }}
          />
        ) : null}
        <div
          className="service-image-placeholder"
          style={{
            display: service.imagen ? "none" : "flex",
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #f8bbd9 0%, #e91e63 100%)",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "3rem",
            opacity: "0.8",
          }}
        >
          <FaCrown />
        </div>
      </div>

      {/* Content */}
      <div className="service-content">
        <div>
          <h3 className="service-title">{service.nombre}</h3>
          <p className="service-description">{service.descripcion}</p>
        </div>

        <div>
          <div className="service-price">${formatPrice(service.precio)}</div>
          <button className="service-button" onClick={handleScheduleService}>
            <FaCalendarAlt style={{ marginRight: "8px" }} />
            Agendar Servicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
