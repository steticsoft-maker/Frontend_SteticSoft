// src/features/home/components/InfoCard.jsx
import React from "react";
import "../css/InfoCard.css";

const InfoCard = ({ icon, title, children }) => {
  return (
    <div className="info-card">
      <div className="info-card-icon">{icon}</div>
      <h3 className="info-card-title">{title}</h3>
      <p className="info-card-description">{children}</p>
    </div>
  );
};

export default InfoCard;