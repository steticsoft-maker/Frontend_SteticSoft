// src/shared/components/common/ImageCarousel.jsx
import React, { useState, useEffect } from "react";
import "./ImageCarousel.css";
import image1 from "../../../assets/images/labiales.jpg";
import image2 from "../../../assets/images/rubor.jpg";
import image3 from "../../../assets/images/shampoo.jpg";

const slides = [
  {
    image: image1,
    title: "Bienvenido a La Fuente del Peluquero",
    text: "Transformamos tu estilo, cuidamos tu imagen.",
  },
  {
    image: image2,
    title: "Servicios de Peluquería",
    text: "Cortes modernos, tintes y tratamientos profesionales.",
  },
  {
    image: image3,
    title: "Belleza y Bienestar",
    text: "Manicura, pedicura y cuidado facial para un look completo.",
  },
];

const ImageCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, []);

  return (
    <div className="carousel-container">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`carousel-slide ${index === currentSlide ? "active" : ""}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="carousel-overlay">
            <h1 className="carousel-title">{slide.title}</h1>
            <p className="carousel-subtitle">{slide.text}</p>
          </div>
        </div>
      ))}
      <button className="carousel-btn prev-btn" onClick={prevSlide}>
        &#10094;
      </button>
      <button className="carousel-btn next-btn" onClick={nextSlide}>
        &#10095;
      </button>
    </div>
  );
};

export default ImageCarousel;
