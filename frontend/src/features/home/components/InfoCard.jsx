import React from 'react';

const InfoCard = ({ icon, title, children }) => (
  <div className="info-card">
    <div className="info-card-icon">{icon}</div>
    <div className="info-card-content">
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  </div>
);

export default InfoCard;
