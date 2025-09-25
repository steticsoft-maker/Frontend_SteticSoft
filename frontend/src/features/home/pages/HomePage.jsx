// src/features/home/pages/HomePage.jsx
import React, { useState, useEffect } from "react";
import { FaHeart, FaStar, FaMagic, FaCrown, FaGem } from "react-icons/fa";
import ServiceCard from "../components/ServiceCard";
import { getPublicServicios } from "../../../shared/services/publicServices";
import { formatPrice } from "../../../shared/utils/priceUtils";
import { useAuth } from "../../../shared/contexts/authHooks";
import "../css/Home.css";
import Footer from "../../../shared/components/layout/Footer";
import FooterSpacer from "../../../shared/components/layout/FooterSpacer";

function HomePage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

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
          const limitedServices = validServices.slice(0, 4);
          setServices(limitedServices);
        } else {
          const responseSinFiltro = await getPublicServicios({});
          if (
            responseSinFiltro.data &&
            Array.isArray(responseSinFiltro.data.data)
          ) {
            const validServices = responseSinFiltro.data.data.filter(
              (service) =>
                service && service.idServicio && service.estado === true
            );
            const serviciosSinFiltro = validServices.slice(0, 4);
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

  return (
    <div className="home-page-container">
      {/* Hero Section */}
      <section className="home-hero">
        {/* Floating Hearts */}
        <div className="floating-hearts">
          <FaHeart className="floating-heart" />
          <FaHeart className="floating-heart" />
          <FaHeart className="floating-heart" />
          <FaHeart className="floating-heart" />
          <FaHeart className="floating-heart" />
        </div>

        <div className="hero-content">
          <h1 className="hero-title">
            <FaCrown style={{ marginRight: "15px", fontSize: "0.8em" }} />
            SteticSoft
            <FaCrown style={{ marginLeft: "15px", fontSize: "0.8em" }} />
          </h1>
          <p className="hero-subtitle">
            <FaMagic style={{ marginRight: "10px" }} />
            Transformamos tu estilo, cuidamos tu imagen
            <FaMagic style={{ marginLeft: "10px" }} />
          </p>
          <div className="hero-buttons">
            <button
              className="hero-btn primary"
              onClick={() => (window.location.href = "/admin/citas/agendar")}
            >
              <FaGem style={{ marginRight: "8px" }} />
              Agendar Cita
            </button>
            <button
              className="hero-btn"
              onClick={() => (window.location.href = "/servicios")}
            >
              <FaStar style={{ marginRight: "8px" }} />
              Ver Servicios
            </button>
            {isAuthenticated &&
              (user?.rol === "Administrador" || user?.rol === "Empleado") && (
                <button
                  className="hero-btn"
                  onClick={() => (window.location.href = "/admin/dashboard")}
                >
                  <FaCrown style={{ marginRight: "8px" }} />
                  Dashboard
                </button>
              )}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="services-container">
          <div className="section-title">
            <h2>
              <FaStar style={{ marginRight: "15px", color: "#e91e63" }} />
              Nuestros Servicios Estrella
              <FaStar style={{ marginLeft: "15px", color: "#e91e63" }} />
            </h2>
            <p>
              Descubre nuestros servicios de belleza diseñados especialmente
              para realzar tu belleza natural
            </p>
          </div>

          {loading ? (
            <div className="loading-state">
              <FaMagic className="loading-icon" />
              <p>Cargando servicios increíbles...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="empty-state">
              <FaHeart className="empty-icon" />
              <p>Pronto tendremos servicios increíbles para ti</p>
            </div>
          ) : (
            <div className="services-grid">
              {services.map((service, index) => (
                <div
                  key={service.idServicio}
                  className="service-card"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animation: "fadeInUp 0.6s ease-out both",
                  }}
                >
                  <div style={{ marginBottom: "20px" }}>
                    <FaGem
                      style={{
                        fontSize: "2rem",
                        color: "#e91e63",
                        marginBottom: "10px",
                      }}
                    />
                  </div>
                  <h3>{service.nombre}</h3>
                  <p>{service.descripcion}</p>
                  <div className="service-price">
                    ${formatPrice(service.precio)}
                  </div>
                  <button className="service-btn">
                    <FaHeart style={{ marginRight: "8px" }} />
                    Agendar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">
            <FaMagic style={{ marginRight: "15px" }} />
            ¿Lista para brillar?
            <FaMagic style={{ marginLeft: "15px" }} />
          </h2>
          <p className="cta-text">
            Únete a miles de mujeres que han transformado su estilo con nosotros
          </p>
          <div className="cta-buttons">
            <button
              className="cta-button primary"
              onClick={() => (window.location.href = "/admin/citas/agendar")}
            >
              <FaGem style={{ marginRight: "8px" }} />
              Reservar Cita
            </button>
            <button
              className="cta-button"
              onClick={() => (window.location.href = "/servicios")}
            >
              <FaStar style={{ marginRight: "8px" }} />
              Explorar Servicios
            </button>
          </div>
        </div>
      </section>

      <FooterSpacer />
      <Footer />
    </div>
  );
}

export default HomePage;
