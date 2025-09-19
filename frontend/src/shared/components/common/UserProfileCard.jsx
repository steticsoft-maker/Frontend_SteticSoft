import React, { useState } from "react";
import {
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaCalendarAlt,
  FaCrown,
  FaUser,
  FaUserTie,
  FaShoppingBag,
  FaSignOutAlt,
  FaCog,
} from "react-icons/fa";
// El logo se referencia directamente desde la carpeta public
const SteticLogo = "/logo.png";
import "./UserProfileCard.css";

const UserProfileCard = ({ user, onLogout, onSettings }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Validación de props críticas
  if (!user) {
    console.warn("UserProfileCard: user prop is undefined");
    return null;
  }

  if (!onLogout) {
    console.warn("UserProfileCard: onLogout prop is undefined");
    return null;
  }

  // Función para obtener el ícono del rol
  const getRoleIcon = (roleName) => {
    switch (roleName?.toLowerCase()) {
      case "administrador":
        return <FaCrown className="role-icon admin" />;
      case "empleado":
        return <FaUserTie className="role-icon employee" />;
      case "cliente":
        return <FaShoppingBag className="role-icon client" />;
      default:
        return <FaUser className="role-icon default" />;
    }
  };

  // Función para obtener el color del rol
  const getRoleColor = (roleName) => {
    switch (roleName?.toLowerCase()) {
      case "administrador":
        return "var(--color-accent-pink)";
      case "empleado":
        return "var(--color-accent-lavender)";
      case "cliente":
        return "var(--color-accent-rose)";
      default:
        return "var(--color-primary)";
    }
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    try {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Fecha inválida";
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
    }
  };

  // Información del perfil (cliente o empleado)
  const profileInfo = user?.clienteInfo || user?.empleado || {};
  const fullName =
    `${profileInfo.nombre || ""} ${profileInfo.apellido || ""}`.trim() ||
    user?.nombre ||
    "Usuario";
  const email = profileInfo.correo || user?.correo || "Sin correo";
  const phone = profileInfo.telefono || "Sin teléfono";
  const document = profileInfo.numeroDocumento
    ? `${profileInfo.tipoDocumento || "Doc"}: ${profileInfo.numeroDocumento}`
    : "Sin documento";
  const birthDate = formatDate(profileInfo.fechaNacimiento);

  // Verificar si hay información completa disponible
  const hasCompleteInfo =
    profileInfo.nombre && profileInfo.apellido && profileInfo.correo;

  return (
    <div className="user-profile-card">
      {/* Header principal */}
      <div
        className="user-profile-header"
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Logo de SteticSoft */}
        <div className="logo-container">
          <img src={SteticLogo} alt="SteticSoft Logo" className="stetic-logo" />
        </div>

        {/* Información principal del usuario */}
        <div className="user-main-info">
          <div className="user-name">{fullName}</div>
          <div className="user-role-container">
            {getRoleIcon(user?.rol?.nombre)}
            <span
              className="user-role"
              style={{ color: getRoleColor(user?.rol?.nombre) }}
            >
              {user?.rol?.nombre || "Usuario"}
            </span>
          </div>
        </div>

        {/* Indicador de expansión */}
        <div className={`expand-indicator ${isExpanded ? "expanded" : ""}`}>
          <FaCog className="expand-icon" />
        </div>
      </div>

      {/* Información expandida */}
      {isExpanded && (
        <div className="user-profile-details">
          <div className="user-details-section">
            <h4 className="details-title">Información Personal</h4>
            <div className="detail-item">
              <FaEnvelope className="detail-icon" />
              <span className="detail-text">{email}</span>
            </div>
            <div className="detail-item">
              <FaPhone className="detail-icon" />
              <span className="detail-text">{phone}</span>
            </div>
            <div className="detail-item">
              <FaIdCard className="detail-icon" />
              <span className="detail-text">{document}</span>
            </div>
            <div className="detail-item">
              <FaCalendarAlt className="detail-icon" />
              <span className="detail-text">{birthDate}</span>
            </div>
          </div>

          {/* Acciones del usuario */}
          <div className="user-actions">
            {onSettings && (
              <button
                className="action-button settings-button"
                onClick={onSettings}
              >
                <FaCog className="action-icon" />
                <span>Configuración</span>
              </button>
            )}
            {!hasCompleteInfo && (
              <div className="incomplete-profile-notice">
                <p>Completa tu perfil para una mejor experiencia</p>
              </div>
            )}
            <button className="action-button logout-button" onClick={onLogout}>
              <FaSignOutAlt className="action-icon" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}

      {/* Tooltip informativo */}
      {showTooltip && !isExpanded && (
        <div className="user-tooltip">
          <div className="tooltip-content">
            <div className="tooltip-name">{fullName}</div>
            <div className="tooltip-role">{user?.rol?.nombre || "Usuario"}</div>
            <div className="tooltip-hint">Haz clic para ver más detalles</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileCard;
