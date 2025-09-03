// src/shared/components/layout/Footer.jsx
import React from "react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo / Nombre */}
        <div className="footer-brand">
          <h2>SteticSoft</h2>
          <p>Transformamos tu estilo, cuidamos tu imagen</p>
        </div>

        {/* Enlaces rápidos */}
        <div className="footer-links">
          <h3>Enlaces</h3>
          <ul>
            <li><a href="/">Inicio</a></li>
            <li><a href="/servicios">Servicios</a></li>
            <li><a href="/productos">Productos</a></li>
            <li><a href="/novedades">Novedades</a></li>
          </ul>
        </div>

        {/* Contacto */}
        <div className="footer-contact">
          <h3>Contacto</h3>
          <p>📍 Medellín, Colombia</p>
          <p>📞 301 246 0508</p>
          <p>📧 juangomezlon@gmail.com</p>
        </div>

        {/* Redes Sociales */}
        <div className="footer-social">
          <h3>Síguenos</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebookF /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
            <a href="https://wa.me/573012460508" target="_blank" rel="noreferrer"><FaWhatsapp /></a>
          </div>
        </div>
      </div>

      {/* Copy */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} SteticSoft. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
