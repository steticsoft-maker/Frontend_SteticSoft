// src/features/home/pages/HomePage.jsx
import React from "react";
import Navbar from "../../../shared/components/layout/Navbar"; // Ruta actualizada
import "../css/Home.css"; // Nueva ruta CSS

// Podríamos crear un componente HeroSection si esta parte se vuelve más compleja
const HomeHeader = () => (
  <header className="home-header">
    <h1>Bienvenido a SteticSoft</h1>
    <p>Transformamos tu estilo, cuidamos tu imagen</p>
  </header>
);

// Podríamos crear un componente InfoCard si se reutiliza
const InfoCard = ({ title, children }) => (
  <div className="home-card">
    <h2>{title}</h2>
    <p>{children}</p>
  </div>
);

function HomePage() {
  return (
    <div>
      <Navbar />
      <div className="home-page-container">
        {" "}
        {/* Renombrado para claridad */}
        <HomeHeader />
        <section className="home-features-content">
          {" "}
          {/* Renombrado */}
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
      </div>
    </div>
  );
}

export default HomePage;
