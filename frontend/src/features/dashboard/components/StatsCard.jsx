import React, { useState, useEffect } from "react";

const StatsCard = ({
  title,
  value,
  percentage,
  trend,
  icon,
  color = "primary",
  isLoading = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isVisible && !isLoading) {
      const duration = 2000;
      const startTime = Date.now();
      const startValue = 0;
      const endValue = percentage || 0;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue =
          startValue + (endValue - startValue) * easeOutQuart;

        setAnimatedValue(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isVisible, isLoading, percentage]);

  const getColorClasses = (colorType) => {
    const colors = {
      primary: {
        bg: "bg-gradient-to-r from-indigo-500 to-purple-600",
        text: "text-indigo-600",
        border: "border-indigo-200",
        progress: "bg-indigo-500",
      },
      success: {
        bg: "bg-gradient-to-r from-emerald-500 to-green-600",
        text: "text-emerald-600",
        border: "border-emerald-200",
        progress: "bg-emerald-500",
      },
      warning: {
        bg: "bg-gradient-to-r from-amber-500 to-orange-600",
        text: "text-amber-600",
        border: "border-amber-200",
        progress: "bg-amber-500",
      },
      danger: {
        bg: "bg-gradient-to-r from-red-500 to-pink-600",
        text: "text-red-600",
        border: "border-red-200",
        progress: "bg-red-500",
      },
    };
    return colors[colorType] || colors.primary;
  };

  const colorClasses = getColorClasses(color);

  if (isLoading) {
    return (
      <div className="stats-card stats-card-loading">
        <div className="stats-card-header">
          <div className="stats-card-icon">
            <div className="loading-skeleton-icon"></div>
          </div>
          <div className="stats-card-title">
            <div className="loading-skeleton-text"></div>
          </div>
        </div>
        <div className="stats-card-content">
          <div className="loading-skeleton-value"></div>
          <div className="loading-skeleton-percentage"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`stats-card ${isVisible ? "stats-card-visible" : ""}`}>
      <div className="stats-card-header">
        <div className={`stats-card-icon ${colorClasses.bg}`}>{icon}</div>
        <div className="stats-card-title">
          <h3>{title}</h3>
        </div>
      </div>

      <div className="stats-card-content">
        <div className="stats-card-value">
          <span className="value-number">{value}</span>
          {trend && (
            <span
              className={`trend-indicator ${
                trend > 0 ? "trend-up" : "trend-down"
              }`}
            >
              {trend > 0 ? "↗" : "↘"} {Math.abs(trend)}%
            </span>
          )}
        </div>

        {percentage !== undefined && (
          <div className="stats-card-progress">
            <div className="progress-bar">
              <div
                className={`progress-fill ${colorClasses.progress}`}
                style={{ width: `${animatedValue}%` }}
              ></div>
            </div>
            <div className="progress-text">{animatedValue.toFixed(1)}%</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
