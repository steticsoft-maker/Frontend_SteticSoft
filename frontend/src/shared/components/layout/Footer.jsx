import React from 'react';
import '../../styles/Footer.css';

const Footer = () => (
    <footer className="footer">
        <div className="footer-content">
            <div className="footer-section about">
                <h3>SteticSoft</h3>
                <p>Tu aliado en belleza y cuidado personal. Visítanos y vive una experiencia única.</p>
            </div>
            <div className="footer-section links">
                <h3>Enlaces Rápidos</h3>
                <ul>
                    <li><a href="/">Inicio</a></li>
                    <li><a href="/productos">Productos</a></li>
                    <li><a href="/servicios">Servicios</a></li>
                    <li><a href="/novedades-publicas">Novedades</a></li>
                </ul>
            </div>
            <div className="footer-section social">
                <h3>Síguenos</h3>
                <a href="#">Facebook</a> | <a href="#">Instagram</a> | <a href="#">Twitter</a>
            </div>
        </div>
        <div className="footer-bottom">
            &copy; {new Date().getFullYear()} SteticSoft | Todos los derechos reservados
        </div>
    </footer>
);

export default Footer;
