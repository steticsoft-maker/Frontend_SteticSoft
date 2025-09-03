// src/features/home/pages/HomePage.jsx
import React from "react";
import Navbar from "../../../shared/components/layout/Navbar";
import HeroSection from "../components/HeroSection";
import InfoCard from "../components/InfoCard";
import ServiceCard from "../components/ServiceCard"; // Para servicios destacados
import "../css/Home.css";
import Footer from "../../../shared/components/layout/Footer";

function HomePage() {
  return (
    <div>
      <Navbar />
      <div className="home-page-container">
        {/* Hero principal */}
        <HeroSection />

        {/* Beneficios */}
        <section className="home-features-content">
          <InfoCard title="Estilo Profesional">
            Disfruta de cortes, tintes, peinados y más con atención
            personalizada.
          </InfoCard>
          <InfoCard title="Calidad en Cada Servicio">
            Nos enfocamos en resaltar tu imagen con técnicas modernas y
            productos de alta calidad.
          </InfoCard>
          <InfoCard title="Agendamiento Rápido">
            Reserva tu cita en línea de forma fácil desde cualquier dispositivo.
          </InfoCard>
        </section>

        {/* Servicios destacados */}
        <section className="home-services">
          <h2>Servicios Destacados</h2>
          <div className="services-grid">
            <ServiceCard
              service={{
                id: 1,
                nombre: "Corte de Cabello",
                price: 25000,
                imagenURL:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVCCAkoYWSBkkkIdy9W1HojjtbkXPjHvcqYg&s",
                description: "Corte moderno y a tu estilo",
                className: "public-servicios-image",
              }}
              onAddToCart={() => {}}
            />
            <ServiceCard
              service={{
                id: 2,
                nombre: "Manicure",
                price: 18000,
                imagenURL:
                  "https://i.pinimg.com/736x/79/87/91/79879102fd5991a55410821624644d81.jpg",
                description: "Manicure profesional para lucir impecable",
                className: "public-servicios-image",
              }}
              onAddToCart={() => {}}
            />
            <ServiceCard
              service={{
                id: 3,
                nombre: "Tintura",
                price: 40000,
                imagenURL:
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9YJi1YIYWz2t7TPLunKIAiChTPXjfSjWr1A&s",
                description: "Colores vibrantes y duraderos",
                className: "public-servicios-image",
              }}
              onAddToCart={() => {}}
            />
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
