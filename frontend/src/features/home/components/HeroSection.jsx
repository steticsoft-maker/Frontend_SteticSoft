// src/features/home/components/HeroSection.jsx
import React from "react";
import { FaCut } from "react-icons/fa";

const HeroSection = () => (
  <header className="home-hero">
    <div className="hero-overlay">
      <h1 className="hero-title">
        Bienvenido a <span className="text-primary">La Fuente del Peluquero</span>
      </h1>
      <p className="hero-subtitle">
        Transformamos tu estilo, cuidamos tu imagen
      </p>
    </div>
  </header>
);

export default HeroSection;
