// src/features/home/components/HeroSection.jsx
import React from "react";
import { FaCut } from "react-icons/fa";

const HeroSection = () => (
  <header className="home-hero">
    <div className="hero-overlay">
      <h1 className="hero-title">
        Bienvenido a <span className="text-primary">SteticSoft</span>
      </h1>
      <p className="hero-subtitle">
        Transformamos tu estilo, cuidamos tu imagen
      </p>
      <button className="hero-button">
  <FaCut className="mr-2" /> Agendar Cita
</button>

    </div>
  </header>
);

export default HeroSection;
