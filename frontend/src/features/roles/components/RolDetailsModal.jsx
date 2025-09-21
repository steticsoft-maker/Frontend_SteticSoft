// src/features/roles/components/RolDetailsModal.jsx
import React from "react";
import "../css/Rol.css";

const RolDetailsModal = ({ isOpen, onClose, role }) => {
  // Guarda de entrada: Si no está abierto o no hay datos del rol, no renderizar nada.
  if (!isOpen || !role) {
    return null;
  }

  // Función para formatear el nombre del permiso de manera más legible
  const formatPermisoName = (permisoName) => {
    return permisoName
      .replace(/MODULO_/g, "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Función para obtener el icono y nombre del módulo
  const getModuloInfo = (permisoName) => {
    const moduloMatch = permisoName.match(/MODULO_([^_]+)/);
    if (moduloMatch) {
      const moduloKey = moduloMatch[1];
      const moduloNames = {
        USUARIOS: { icon: "👥", name: "Usuarios" },
        ROLES: { icon: "🛡️", name: "Roles" },
        CLIENTES: { icon: "👤", name: "Clientes" },
        PRODUCTOS: { icon: "📦", name: "Productos" },
        VENTAS: { icon: "🛒", name: "Ventas" },
        CITAS: { icon: "📅", name: "Citas" },
        CATEGORIAS: { icon: "📂", name: "Categorías" },
        SERVICIOS: { icon: "🔧", name: "Servicios" },
        PROVEEDORES: { icon: "🚚", name: "Proveedores" },
        COMPRAS: { icon: "🛍️", name: "Compras" },
        ABASTECIMIENTO: { icon: "📋", name: "Abastecimiento" },
        NOVEDADES: { icon: "📰", name: "Novedades" },
        DASHBOARD: { icon: "📊", name: "Dashboard" },
      };
      return moduloNames[moduloKey] || { icon: "❓", name: moduloKey };
    }
    return { icon: "❓", name: "Desconocido" };
  };

  // Agrupar permisos por módulo
  const permisosAgrupados = {};
  if (role.permisos && role.permisos.length > 0) {
    role.permisos.forEach((permiso) => {
      const moduloInfo = getModuloInfo(permiso.nombre);
      const moduloName = moduloInfo.name;

      if (!permisosAgrupados[moduloName]) {
        permisosAgrupados[moduloName] = {
          icon: moduloInfo.icon,
          permisos: [],
        };
      }
      permisosAgrupados[moduloName].permisos.push(
        formatPermisoName(permiso.nombre)
      );
    });
  }

  return (
    <div className="rol-modalOverlay">
      <div className="rol-modalContent rol-modalContent-details">
        <div className="rol-modal-header">
          <h2>Detalles del Rol</h2>
          <button
            type="button"
            className="rol-modal-close-button"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <div className="rol-modal-body">
          <div className="rol-details-container">
            {/* Sección de Información Básica */}
            <div className="rol-details-section">
              <h3 className="rol-details-section-title">
                <span className="section-icon">📋</span>
                Información Básica
              </h3>
              <div className="rol-details-grid">
                <div className="rol-detail-item">
                  <label>Nombre del Rol</label>
                  <span className="rol-name-badge">{role.nombre || "N/A"}</span>
                </div>
                <div className="rol-detail-item">
                  <label>Estado</label>
                  <span
                    className={`rol-status-badge ${
                      role.estado ? "active" : "inactive"
                    }`}
                  >
                    {role.estado ? "Activo" : "Inactivo"}
                  </span>
                </div>
                <div className="rol-detail-item rol-detail-item-full">
                  <label>Descripción</label>
                  <span>{role.descripcion || "Sin descripción"}</span>
                </div>
              </div>
            </div>

            {/* Sección de Permisos por Módulo */}
            <div className="rol-details-section">
              <h3 className="rol-details-section-title">
                <span className="section-icon">🔐</span>
                Permisos por Módulo
              </h3>
              <div className="rol-permisos-grid">
                {Object.keys(permisosAgrupados).length > 0 ? (
                  Object.entries(permisosAgrupados).map(
                    ([moduloName, moduloData]) => (
                      <div key={moduloName} className="rol-modulo-card">
                        <div className="rol-modulo-header">
                          <span className="rol-modulo-icon">
                            {moduloData.icon}
                          </span>
                          <h4 className="rol-modulo-name">{moduloName}</h4>
                        </div>
                        <div className="rol-permisos-list">
                          {moduloData.permisos.map((permiso, index) => (
                            <div key={index} className="rol-permiso-item">
                              <span className="rol-permiso-dot">•</span>
                              <span className="rol-permiso-name">
                                {permiso}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <div className="rol-no-permisos">
                    <span className="rol-no-permisos-icon">🔒</span>
                    <p>No hay permisos asignados</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="rol-modal-footer">
          <button className="rol-modalButton-cerrar" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default RolDetailsModal;
