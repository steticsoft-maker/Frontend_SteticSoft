import React, { useState, useEffect } from "react";

const ChartCard = ({
  title,
  timePeriodComponent,
  children,
  isLoading = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`chart ${isVisible ? "chart-visible" : ""}`}>
      <div className="chart-header">
        <h2 className="chart-title">{title}</h2>
        {timePeriodComponent && (
          <div className="time-period-container">{timePeriodComponent}</div>
        )}
      </div>

      <div className="chart-content">
        {isLoading ? (
          <div className="chart-loading">
            <div className="loading-spinner"></div>
            <p>Cargando datos...</p>
          </div>
        ) : (
          <div className="chart-wrapper">{children}</div>
        )}
      </div>

      <div className="chart-footer">
        <div className="chart-stats">
          <span className="stats-indicator"></span>
          <span className="stats-text">Datos actualizados</span>
        </div>
      </div>
    </div>
  );
};

export default ChartCard;
