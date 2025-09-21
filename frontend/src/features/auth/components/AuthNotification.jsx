// src/features/auth/components/AuthNotification.jsx
import React, { useEffect, useState } from "react";
import "../css/Auth.css";

/**
 * Componente de notificación mejorado para autenticación
 * Maneja diferentes tipos de notificaciones con animaciones
 */
const AuthNotification = ({
  type = "info",
  title,
  message,
  duration = 5000,
  onClose,
  show = true,
  persistent = false,
}) => {
  const [isVisible, setIsVisible] = useState(show);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (show && !persistent && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, persistent]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose && onClose();
    }, 300); // Tiempo para la animación de salida
  };

  if (!isVisible) return null;

  const getNotificationStyles = () => {
    const baseStyles = "auth-notification";
    const typeStyles = {
      success: "auth-notification-success",
      error: "auth-notification-error",
      warning: "auth-notification-warning",
      info: "auth-notification-info",
    };

    const animationStyles = isClosing
      ? "auth-notification-closing"
      : "auth-notification-visible";

    return `${baseStyles} ${typeStyles[type]} ${animationStyles}`;
  };

  const getIcon = () => {
    const icons = {
      success: "✓",
      error: "✗",
      warning: "⚠",
      info: "ℹ",
    };
    return icons[type] || icons.info;
  };

  return (
    <div className={getNotificationStyles()}>
      <div className="auth-notification-content">
        <div className="auth-notification-icon">{getIcon()}</div>
        <div className="auth-notification-text">
          {title && <div className="auth-notification-title">{title}</div>}
          {message && (
            <div className="auth-notification-message">{message}</div>
          )}
        </div>
        <button
          className="auth-notification-close"
          onClick={handleClose}
          aria-label="Cerrar notificación"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default AuthNotification;
