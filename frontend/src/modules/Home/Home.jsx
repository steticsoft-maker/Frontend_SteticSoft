import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./Home.css";

function Home() {
  return (
    <div>
      <Navbar />
      <div className="home-container">
        <header className="home-header">
          <h1>Bienvenido a SteticSoft</h1>
          <p>Transformamos tu estilo, cuidamos tu imagen</p>
        </header>
        <section className="home-content">
  <div className="home-card">
    <h2>Estilo Profesional</h2>
    <p>Disfruta de cortes, tintes, peinados y más con atención personalizada.</p>
  </div>
  <div className="home-card">
    <h2>Calidad en Cada Servicio</h2>
    <p>Nos enfocamos en resaltar tu imagen con técnicas modernas y productos de alta calidad.</p>
  </div>
  <div className="home-card">
    <h2>Agendamiento Rápido</h2>
    <p>Reserva tu cita en línea de forma fácil desde cualquier dispositivo.</p>
  </div>
</section>


      </div>
    </div>
  );
}

export default Home;
