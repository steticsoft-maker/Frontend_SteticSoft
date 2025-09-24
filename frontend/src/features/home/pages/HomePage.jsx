// src/features/home/pages/HomePage.jsx
import React from "react";
import ImageCarousel from "../../../shared/components/common/ImageCarousel"; // Importa el nuevo componente
import InfoCard from "../components/InfoCard";
import ServiceCard from "../components/ServiceCard";
import "../css/Home.css";
import Footer from "../../../shared/components/layout/Footer";

function HomePage() {
  return (
    <div>
      <div className="home-page-container">
        {/* Carrusel principal */}
        <ImageCarousel />

        {/* Beneficios */}
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
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
