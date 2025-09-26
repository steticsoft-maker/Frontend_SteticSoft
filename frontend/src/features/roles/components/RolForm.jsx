// src/features/roles/components/RolForm.jsx

import React, { useState } from "react";
import PermisosSelector from "./PermisosSelector";

const RolForm = ({
  formData,
  onFormChange,
  permisosDisponibles,
  permisosAgrupados,
  onToggleModulo,
  onSelectAll,
  onDeselectAll,
  isEditing,
  isRoleAdmin,
  formErrors,
}) => {
  const [mostrarPermisos, setMostrarPermisos] = useState(isEditing || false);

  // Función para obtener el icono del módulo
  const getModuloIcon = (nombreModulo) => {
    const iconMap = {
      USUARIOS: "👥",
      ROLES: "🛡️",
      CLIENTES: "👤",
      PRODUCTOS: "📦",
      VENTAS: "🛒",
      CITAS: "📅",
      CATEGORIAS: "📂",
      SERVICIOS: "🔧",
      PROVEEDORES: "🚚",
      COMPRAS: "🛍️",
      ABASTECIMIENTO: "📋",
      NOVEDADES: "📰",
      DASHBOARD: "📊",
      ESTADOS: "📊",
      EMPLEADOS: "👨‍💼",
      ESPECIALIDADES: "⭐",
      PERMISOS: "🔐",
    };
    return iconMap[nombreModulo] || "📁";
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    onFormChange(name, type === "checkbox" ? checked : value);
  };

  const handleToggleMostrarPermisos = () => {
    if (!isRoleAdmin) {
      setMostrarPermisos((prev) => !prev);
    }
  };

  const modulosSeleccionadosNombres = (formData.idPermisos || [])
    .map((id) => permisosDisponibles.find((p) => p.idPermiso === id)?.nombre)
    .filter(Boolean);

  return (
    <>
      <div className="admin-form-section">
        <h3 className="admin-form-section-title">Información del Rol</h3>
        <div className="admin-form-row-2">
          <div className="admin-form-group">
            <label htmlFor="nombreRolInput" className="admin-form-label">
              Nombre del Rol: <span className="required-asterisk">*</span>
            </label>
            <input
              id="nombreRolInput"
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className={`admin-form-input ${formErrors.nombre ? "error" : ""}`}
              disabled={isRoleAdmin}
              required
            />
            {formErrors.nombre && (
              <span className="admin-form-error">{formErrors.nombre}</span>
            )}
          </div>

          <div className="admin-form-group">
            <label htmlFor="tipoPerfilInput" className="admin-form-label">
              Tipo de Perfil: <span className="required-asterisk">*</span>
            </label>
            <select
              id="tipoPerfilInput"
              name="tipoPerfil"
              value={formData.tipoPerfil || "EMPLEADO"}
              onChange={handleInputChange}
              className={`admin-form-select ${
                formErrors.tipoPerfil ? "error" : ""
              }`}
              disabled={isRoleAdmin}
              required
            >
              <option value="EMPLEADO">Empleado</option>
              <option value="CLIENTE">Cliente</option>
              <option value="NINGUNO">Ninguno (Solo Acceso al Sistema)</option>
            </select>
            {formErrors.tipoPerfil && (
              <span className="admin-form-error">{formErrors.tipoPerfil}</span>
            )}
          </div>
        </div>

        <div className="admin-form-group">
          <label htmlFor="descripcionRolInput" className="admin-form-label">
            Descripción del Rol: <span className="required-asterisk">*</span>
          </label>
          <textarea
            id="descripcionRolInput"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
            className={`admin-form-textarea ${
              formErrors.descripcion ? "error" : ""
            }`}
            disabled={isRoleAdmin}
            required
            rows={3}
          />
          {formErrors.descripcion && (
            <span className="admin-form-error">{formErrors.descripcion}</span>
          )}
        </div>

        {isEditing && !isRoleAdmin && (
          <div className="admin-form-group">
            <label className="admin-form-label">Estado:</label>
            <label className="switch">
              <input
                type="checkbox"
                name="estado"
                checked={formData.estado}
                onChange={handleInputChange}
              />
              <span className="slider"></span>
            </label>
          </div>
        )}
      </div>

      <div className="admin-form-section">
        <div className="admin-form-section-title">
          Módulos Disponibles
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button
              type="button"
              className="admin-form-button secondary"
              onClick={onSelectAll}
            >
              Marcar Todos
            </button>
            <button
              type="button"
              className="admin-form-button secondary"
              onClick={onDeselectAll}
            >
              Desmarcar Todos
            </button>
          </div>
        </div>

        {formErrors.permisos && (
          <div
            className="admin-form-error"
            style={{
              marginBottom: "15px",
              padding: "10px",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              border: "1px solid rgba(231, 76, 60, 0.3)",
              borderRadius: "5px",
            }}
          >
            {formErrors.permisos}
          </div>
        )}

        <PermisosSelector
          permisosAgrupados={permisosAgrupados}
          permisosSeleccionadosIds={formData.idPermisos || []}
          onTogglePermiso={onToggleModulo}
          onSelectAll={onSelectAll}
          onDeselectAll={onDeselectAll}
          isRoleAdmin={isRoleAdmin}
          mostrar={true}
          isEditing={isEditing}
        />
      </div>

      <div className="admin-form-section">
        <div className="rol-selected-modules-header">
          <h3 className="admin-form-section-title">
            <span className="section-icon">✅</span>
            Módulos Seleccionados
            <span className="selected-count-badge">
              ({modulosSeleccionadosNombres.length})
            </span>
          </h3>
          {modulosSeleccionadosNombres.length > 0 && (
            <div className="rol-selected-actions">
              <button
                type="button"
                className="rol-clear-all-button"
                onClick={onDeselectAll}
                title="Deseleccionar todos los permisos"
              >
                <span className="button-icon">🗑️</span>
                Limpiar Todo
              </button>
            </div>
          )}
        </div>

        {modulosSeleccionadosNombres.length > 0 ? (
          <div className="rol-selected-modules-container">
            <div className="rol-selected-modules-grid">
              {(() => {
                // Agrupar permisos por módulo para mostrar mejor
                const permisosPorModulo = {};
                const permisosSeleccionados = (formData.idPermisos || [])
                  .map((id) =>
                    permisosDisponibles.find((p) => p.idPermiso === id)
                  )
                  .filter(Boolean);

                permisosSeleccionados.forEach((permiso) => {
                  const parts = permiso.nombre.split("_");
                  if (parts.length > 2 && parts[0] === "MODULO") {
                    const moduloName = parts[1];
                    const accionName = parts.slice(2).join("_");

                    if (!permisosPorModulo[moduloName]) {
                      permisosPorModulo[moduloName] = [];
                    }
                    permisosPorModulo[moduloName].push(accionName);
                  }
                });

                return Object.entries(permisosPorModulo).map(
                  ([moduloName, acciones]) => {
                    const moduloIcon = getModuloIcon(moduloName);
                    const displayModuloName = moduloName
                      .split("_")
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase()
                      )
                      .join(" ");

                    return (
                      <div
                        key={moduloName}
                        className="rol-selected-module-card"
                      >
                        <div className="rol-selected-module-header">
                          <span className="rol-selected-module-icon">
                            {moduloIcon}
                          </span>
                          <h4 className="rol-selected-module-name">
                            {displayModuloName}
                          </h4>
                          <span className="rol-selected-module-count">
                            {acciones.length}
                          </span>
                        </div>
                        <div className="rol-selected-module-permissions">
                          {acciones.slice(0, 3).map((accion, index) => {
                            const displayAccion = accion
                              .split("_")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() +
                                  word.slice(1).toLowerCase()
                              )
                              .join(" ");
                            return (
                              <span
                                key={index}
                                className="rol-selected-permission-tag"
                              >
                                {displayAccion}
                              </span>
                            );
                          })}
                          {acciones.length > 3 && (
                            <span className="rol-selected-permission-more">
                              +{acciones.length - 3} más
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  }
                );
              })()}
            </div>
          </div>
        ) : (
          <div className="rol-no-selected-modules">
            <span className="rol-no-selected-icon">📝</span>
            <p>No hay permisos seleccionados</p>
            <small>
              Selecciona permisos de los módulos arriba para verlos aquí
            </small>
          </div>
        )}
      </div>
    </>
  );
};

export default RolForm;
