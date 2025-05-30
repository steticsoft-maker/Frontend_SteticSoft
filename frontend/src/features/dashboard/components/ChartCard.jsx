// src/features/dashboard/components/ChartCard.jsx (Ejemplo)
import React from 'react';
// import '../css/ChartCard.css'; // Si necesita estilos propios

const ChartCard = ({ title, timePeriodComponent, children }) => {
  return (
    <div className="chart"> {/* Clase de Dashboard.css */}
      <h2>{title}</h2>
      {timePeriodComponent && <div className="time-period-buttons">{timePeriodComponent}</div>}
      <div className="chart-wrapper">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;