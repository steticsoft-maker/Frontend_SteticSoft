// src/features/home/pages/PublicServiciosPage.jsx
import React, { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaHeart,
  FaGem,
  FaMagic,
  FaStar,
  FaCrown,
} from "react-icons/fa";
import ServiceCard from "../components/ServiceCard";
import { getPublicServicios } from "../../../shared/services/publicServices";
import Footer from "../../../shared/components/layout/Footer";
import FooterSpacer from "../../../shared/components/layout/FooterSpacer";
import "../css/PublicServicios.css";

function PublicServiciosPage() {
  const [services, setServices] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [loading, setLoading] = useState(true);
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);

        const response = await getPublicServicios({ activo: true });

        if (response.data && Array.isArray(response.data.data)) {
          const validServices = response.data.data.filter(
            (service) =>
              service && service.idServicio && service.estado === true
          );
          setServices(validServices);
        } else {
          const responseSinFiltro = await getPublicServicios({});

          if (
            responseSinFiltro.data &&
            Array.isArray(responseSinFiltro.data.data)
          ) {
            const serviciosSinFiltro = responseSinFiltro.data.data.filter(
              (service) =>
                service && service.idServicio && service.estado === true
            );
            setServices(serviciosSinFiltro);
          } else {
            setServices([]);
          }
        }
      } catch (err) {
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  useEffect(() => {
    const savedSchedule = localStorage.getItem("selectedSchedule") || "";
    setSelectedSchedule(savedSchedule);
  }, []);

  return (
    <div className="public-servicios-page">
      {/* Floating Elements */}
      <div className="floating-elements">
        <FaCrown className="floating-element" />
        <FaGem className="floating-element" />
        <FaMagic className="floating-element" />
        <FaStar className="floating-element" />
        <FaHeart className="floating-element" />
      </div>

      {/* Header Section */}
      <section className="servicios-hero">
        <div className="container">
          <h1 className="servicios-title">
            <FaCrown style={{ marginRight: "15px" }} />
            Nuestros Servicios
            <FaCrown style={{ marginLeft: "15px" }} />
          </h1>
          <p className="servicios-subtitle">
            <FaMagic style={{ marginRight: "10px" }} />
            Descubre nuestros servicios profesionales de belleza y cuidado
            personal
            <FaMagic style={{ marginLeft: "10px" }} />
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="servicios-section">
        <div className="servicios-grid-container">
          {loading ? (
            <div className="loading-state">
              <FaMagic className="loading-icon" />
              <p>Cargando servicios increíbles...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="empty-state">
              <FaCrown className="empty-icon" />
              <p>Pronto tendremos servicios increíbles para ti</p>
            </div>
          ) : (
            <div className="servicios-grid">
              {services.map((service, index) => (
                <div
                  key={service.idServicio}
                  className="service-card-container"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animation: "fadeInUp 0.6s ease-out both",
                  }}
                >
                  <ServiceCard service={service} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Floating Appointment Button */}
      <button
        className={`floating-appointment-btn ${showPulse ? "pulse" : ""}`}
        onClick={() => (window.location.href = "/admin/citas/agendar")}
      >
        <FaCalendarAlt className="btn-icon" />
        Agendar Cita
      </button>

      <FooterSpacer />
      <Footer />
    </div>
  );
}

export default PublicServiciosPage;
