// src/features/home/pages/HomePage.jsx
import React, { useState, useEffect } from "react";
import ImageCarousel from "../../../shared/components/common/ImageCarousel"; // Importa el nuevo componente
import InfoCard from "../components/InfoCard";
import ServiceCard from "../components/ServiceCard";
import { getServicios } from "../../serviciosAdmin/services/serviciosAdminService";
import "../css/Home.css";
import "../css/PublicServicios.css";
import Footer from "../../../shared/components/layout/Footer";

function HomePage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Obtener servicios activos usando el servicio existente
        const response = await getServicios({ activo: true });
        
        if (response.data && Array.isArray(response.data.data)) {
          // Filtrar servicios válidos y activos, limitar a 4 servicios para la página de inicio
          const validServices = response.data.data.filter(
            (service) => service && service.idServicio && service.estado === true
          );
          const limitedServices = validServices.slice(0, 4);
          setServices(limitedServices);
        } else {
          const responseSinFiltro = await getServicios({});
          if (responseSinFiltro.data && Array.isArray(responseSinFiltro.data.data)) {
            const validServices = responseSinFiltro.data.data.filter(
              (service) => service && service.idServicio && service.estado === true
            );
            const serviciosSinFiltro = validServices.slice(0, 4);
            setServices(serviciosSinFiltro);
          } else {
            setServices([]);
          }
        }
      } catch (err) {
        console.error('Error al cargar servicios:', err);
        setError('No se pudieron cargar los servicios');
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  return (
    <div>
      <div className="home-page-container">
        <ImageCarousel />
        <section className="home-features-wrapper">
          <div className="home-features-content">
            <InfoCard title="Estilo Profesional">
              Disfruta de cortes, tintes, peinados y más con atención
              personalizada.
            </InfoCard>
            <InfoCard title="Calidad en Cada Servicio">
              Nos enfocamos en resaltar tu imagen con técnicas modernas y
              productos de alta calidad.
            </InfoCard>
            <InfoCard title="Agendamiento Rápido">
              Reserva tu cita en línea de forma fácil desde cualquier
              dispositivo.
            </InfoCard>
          </div>
        </section>
        <section className="home-services-section">
          <div className="container">
            <h2 className="section-title">Nuestros Servicios</h2>
            <p className="section-subtitle">
              Descubre nuestros servicios de belleza y agenda tu cita
            </p>
            
            {loading ? (
              <div className="services-loading">
                <p>Cargando servicios...</p>
              </div>
            ) : error ? (
              <div className="services-error">
                <p>{error}</p>
              </div>
            ) : services.length === 0 ? (
              <div className="services-empty">
                <p>Próximamente tendremos servicios disponibles</p>
              </div>
            ) : (
              <div className="public-servicios-grid">
                {services.map((service) => (
                  <ServiceCard
                    key={service.idServicio}
                    service={service}
                    showAppointmentButton={true}
                  />
                ))}
              </div>
            )}

            <div className="services-cta">
              <p className="cta-text">
                ¿Te interesa alguno de nuestros servicios?
              </p>
              <div className="cta-buttons">
                <button 
                  className="cta-button cta-button-primary"
                  onClick={() => window.location.href = '/admin/citas/agendar'}
                >
                  Agendar Cita
                </button>
                <button 
                  className="cta-button cta-button-secondary"
                  onClick={() => window.location.href = '/servicios'}
                >
                  Ver Todos los Servicios
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      
      <Footer />
    </div>
  );
}

export default HomePage;
