// src/features/home/pages/NovedadesPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaGem,
  FaMagic,
  FaStar,
  FaCrown,
  FaClock,
} from "react-icons/fa";
import Navbar from "../../../shared/components/layout/Navbar";
import Footer from "../../../shared/components/layout/Footer";
import FooterSpacer from "../../../shared/components/layout/FooterSpacer";
import "../css/Novedades.css";

function NovedadesPage() {
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState("");
  const [confirmation, setConfirmation] = useState("");

  const handleSchedule = (e) => {
    e.preventDefault();
    if (!schedule) {
      alert("💕 Por favor, selecciona un horario.");
      return;
    }
    localStorage.setItem("selectedSchedule", schedule);
    setConfirmation(`✨ Tu horario seleccionado es: ${schedule}`);
  };

  return (
    <div className="novedades-page-container">
      <Navbar />

      {/* Hero Section */}
      <section className="novedades-hero">
        <div className="container">
          <h1 className="novedades-title">
            <FaClock style={{ marginRight: "15px" }} />
            Selecciona tu Horario Perfecto
            <FaClock style={{ marginLeft: "15px" }} />
          </h1>
          <p className="novedades-subtitle">
            <FaMagic style={{ marginRight: "10px" }} />
            Elige el momento ideal para tu servicio de belleza
            <FaMagic style={{ marginLeft: "10px" }} />
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="novedades-content">
        <div className="container">
          <div className="novedades-content-box">
            <form className="novedades-form" onSubmit={handleSchedule}>
              <div className="form-group">
                <label htmlFor="schedule-select">
                  <FaGem style={{ marginRight: "8px", color: "#e91e63" }} />
                  Elige tu horario perfecto:
                </label>
                <select
                  id="schedule-select"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  className="novedades-select"
                >
                  <option value="">-- Selecciona tu horario --</option>
                  <option value="9:00 AM">🌅 9:00 AM - Mañana Fresca</option>
                  <option value="11:00 AM">☀️ 11:00 AM - Media Mañana</option>
                  <option value="2:00 PM">🌞 2:00 PM - Tarde Perfecta</option>
                  <option value="4:00 PM">🌆 4:00 PM - Tarde Dorada</option>
                </select>
              </div>
              <button type="submit" className="novedades-primary-button">
                <FaHeart style={{ marginRight: "8px" }} />
                Confirmar Horario
              </button>
            </form>

            {confirmation && (
              <div className="novedades-confirmation-section">
                <div className="confirmation-icon">
                  <FaStar style={{ fontSize: "3rem", color: "#e91e63" }} />
                </div>
                <p className="novedades-confirmation-message">{confirmation}</p>
                <button
                  onClick={() => navigate("/servicios")}
                  className="novedades-secondary-button"
                >
                  <FaGem style={{ marginRight: "8px" }} />
                  Regresar a Servicios
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <FooterSpacer />
      <Footer />
    </div>
  );
}

export default NovedadesPage;
