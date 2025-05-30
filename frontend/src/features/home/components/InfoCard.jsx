// src/features/home/components/InfoCard.jsx
import React from "react";
// import '../css/InfoCard.css'; // Si necesita estilos propios

const InfoCard = ({ title, children }) => (
  <div className="home-card">
    {" "}
    {/* Usar clase de Home.css o una nueva */}
    <h2>{title}</h2>
    <p>{children}</p>
  </div>
);
export default InfoCard;
