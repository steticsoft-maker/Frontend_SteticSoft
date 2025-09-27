// src/shared/components/layout/Footer.jsx
import React from "react";
import "./Footer.css";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner-wrapper">
        {" "}
        {/* Este es el "cuadrito" */}
        <div className="footer-container">
          {/* Logo / Nombre */}
          <div className="footer-brand">
            <h2>La Fuente del Peluquero</h2>
            <p>Transformamos tu estilo, cuidamos tu imagen</p>
          </div>
          {/* Enlaces rápidos */}
          <div className="footer-links">
            <h3>Enlaces</h3>
            <ul>
              <li>
                <a href="/">Inicio</a>
              </li>
              <li>
                <a href="/servicios">Servicios</a>
              </li>
              <li>
                <a href="/productos">Productos</a>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="footer-contact">
            <h3>Contacto</h3>
            <p>
              <FaMapMarkerAlt /> Cr 32 #106a-62, La Esperanza, Medellín,
              Popular, Medellín, Antioquia
            </p>
            <p>
              <FaPhoneAlt /> 3022840206
            </p>
            <p>
              <FaEnvelope /> lafuentedelpeluquero@gmail.com
            </p>
          </div>

          {/* Redes Sociales */}
          <div className="footer-social">
            <h3>Síguenos</h3>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noreferrer">
                <FaFacebookF />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                <FaInstagram />
              </a>
              <a
                href="https://wa.me/573012460508"
                target="_blank"
                rel="noreferrer"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>
          <div className="footer-bottom-text">
            <h4>
              © {new Date().getFullYear()} La Fuente del Peluquero. Todos los
              derechos reservados.
            </h4>
          </div>
        </div>
      </div>
      <div className="footer-bottom"></div>
    </footer>
  );
}

export default Footer;
