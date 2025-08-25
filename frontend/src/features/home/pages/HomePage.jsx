import React, { useState, useEffect } from "react";
import Navbar from "../../../shared/components/layout/Navbar";
import HeroSection from "../components/HeroSection";
import ServiceCard from "../components/ServiceCard";
import ProductCard from "../components/ProductCard";
import Footer from "../../../shared/components/layout/Footer";
import "../css/Home.css";

// Hardcoded data for now
const initialProducts = [
  { id: 1, name: "Shampoo Hidratante", image: "https://www.oboticario.com.co/cdn/shop/files/52076-3-MATCH-SHAMP-CIEN-CURV-300ml_1500x.jpg?v=1727714610", price: 25000, description: "Limpieza profunda y brillo natural" },
  { id: 2, name: "Acondicionador Reparador", image: "https://www.oboticario.com.co/cdn/shop/files/52076-3-MATCH-SHAMP-CIEN-CURV-300ml_1500x.jpg?v=1727714610", price: 27000, description: "Nutrición intensa para cabello dañado" },
  { id: 3, name: "Mascarilla Capilar", image: "https://www.oboticario.com.co/cdn/shop/files/52076-3-MATCH-SHAMP-CIEN-CURV-300ml_1500x.jpg?v=1727714610", price: 35000, description: "Tratamiento semanal para una suavidad extrema" },
];

const initialServices = [
    { id: 1, nombre: "Corte de Cabello", precio: 50000, estado: "Activo" },
    { id: 2, nombre: "Manicura", precio: 30000, estado: "Activo" },
    { id: 3, nombre: "Pedicura", precio: 35000, estado: "Activo" },
];

const WhyChooseUs = () => (
    <div className="why-choose-us">
        <h2>¿Por Qué Elegirnos?</h2>
        <div className="reasons-grid">
            <div className="reason">
                <h3>Expertos Apasionados</h3>
                <p>Nuestro equipo está formado por profesionales con años de experiencia y una pasión por la estética.</p>
            </div>
            <div className="reason">
                <h3>Calidad Garantizada</h3>
                <p>Utilizamos solo productos de las mejores marcas para asegurar resultados excepcionales.</p>
            </div>
            <div className="reason">
                <h3>Ambiente Relajante</h3>
                <p>Disfruta de un espacio diseñado para tu confort y bienestar mientras te cuidamos.</p>
            </div>
        </div>
    </div>
);



function HomePage() {
    const [products] = useState(initialProducts);
    const [services, setServices] = useState([]);

    useEffect(() => {
        const storedServices = JSON.parse(localStorage.getItem('servicios')) || initialServices;
        setServices(storedServices.filter(s => s.estado === "Activo").slice(0, 3)); // Show only 3 active services
    }, []);

    const addToCart = (item) => {
        // Dummy function for now
        console.log('Added to cart:', item);
    };

    return (
        <div className="home-page">
            <Navbar />
            <HeroSection />

            <section id="services" className="home-section">
                <h2>Nuestros Servicios Destacados</h2>
                <div className="public-servicios-grid">
                    {services.map((service) => (
                        <ServiceCard key={service.id} service={service} onAddToCart={addToCart} />
                    ))}
                </div>
            </section>

            <section id="products" className="home-section">
                <h2>Nuestros Productos Estrella</h2>
                <div className="public-productos-grid">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
                    ))}
                </div>
            </section>

            <WhyChooseUs />
            <Footer />
        </div>
    );
}

export default HomePage;
