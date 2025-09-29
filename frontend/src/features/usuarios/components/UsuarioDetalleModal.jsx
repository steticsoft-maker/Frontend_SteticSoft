// src/features/usuarios/components/UsuarioDetalleModal.jsx
import React from "react";
import "../css/Usuarios.css";
import "../../../shared/styles/detail-modals.css";

const UsuarioDetalleModal = ({ isOpen, onClose, usuario }) => {
  if (!isOpen || !usuario) return null;

  // Extraer la información del perfil (cliente o empleado) si existe.
  // Ambos, Cliente y Empleado, ahora tienen 'nombre', 'apellido', 'correo', 'telefono', 'tipoDocumento', 'numeroDocumento', 'fechaNacimiento'.
  const perfil = usuario.clienteInfo || usuario.empleado || {};

  const nombreCompleto = `${perfil.nombre || ""} ${
    perfil.apellido || ""
  }`.trim();

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    // Ajuste para asegurar que la fecha se muestre correctamente sin problemas de zona horaria UTC vs Local para fechas sin hora
    // Este ajuste es común para fechas que vienen de la DB sin información de hora y que se quieren mostrar como "día local"
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + userTimezoneOffset).toLocaleDateString();
  };

  return (
    <div className="usuarios-modalOverlay">
      <div className="usuarios-modalContent usuarios-modalContent-details">
        <div className="usuarios-modal-header">
          <h2>Detalles del Usuario</h2>
          <button
            type="button"
            className="usuarios-modal-close-button"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <div className="usuarios-modal-body">
          <div className="usuario-details-container">
            {/* Sección de Información Personal */}
            <div className="usuario-details-section">
              <h3 className="usuario-details-section-title">
                <span className="section-icon">👤</span>
                Información Personal
              </h3>
              <div className="usuario-details-grid">
                {perfil.nombre && (
                  <div className="usuario-detail-item">
                    <label>Nombre</label>
                    <span>{perfil.nombre}</span>
                  </div>
                )}
                {perfil.apellido && (
                  <div className="usuario-detail-item">
                    <label>Apellido</label>
                    <span>{perfil.apellido}</span>
                  </div>
                )}
                {perfil.fechaNacimiento && (
                  <div className="usuario-detail-item">
                    <label>Fecha de Nacimiento</label>
                    <span>{formatDate(perfil.fechaNacimiento)}</span>
                  </div>
                )}
                {perfil.tipoDocumento && (
                  <div className="usuario-detail-item">
                    <label>Tipo de Documento</label>
                    <span>{perfil.tipoDocumento}</span>
                  </div>
                )}
                {perfil.numeroDocumento && (
                  <div className="usuario-detail-item">
                    <label>Número de Documento</label>
                    <span>{perfil.numeroDocumento}</span>
                  </div>
                )}
                {perfil.telefono && (
                  <div className="usuario-detail-item">
                    <label>Teléfono</label>
                    <span>{perfil.telefono}</span>
                  </div>
                )}
                {perfil.direccion && (
                  <div className="usuario-detail-item usuario-detail-item-full">
                    <label>Dirección</label>
                    <span>{perfil.direccion}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Sección de Información de Contacto */}
            <div className="usuario-details-section">
              <h3 className="usuario-details-section-title">
                <span className="section-icon">📧</span>
                Información de Contacto
              </h3>
              <div className="usuario-details-grid">
                {perfil.correo && (
                  <div className="usuario-detail-item">
                    <label>Correo Personal/Profesional</label>
                    <span>{perfil.correo}</span>
                  </div>
                )}
                {usuario.correo && (
                  <div className="usuario-detail-item">
                    <label>Correo de Acceso al Sistema</label>
                    <span>{usuario.correo}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Sección de Información de Cuenta */}
            <div className="usuario-details-section">
              <h3 className="usuario-details-section-title">
                <span className="section-icon">⚙️</span>
                Información de Cuenta
              </h3>
              <div className="usuario-details-grid">
                {usuario.rol && (
                  <div className="usuario-detail-item">
                    <label>Rol</label>
                    <span className="usuario-role-badge">
                      {usuario.rol.nombre || "No asignado"}
                    </span>
                  </div>
                )}
                <div className="usuario-detail-item">
                  <label>Estado de Cuenta</label>
                  <span
                    className={`usuario-status-badge ${
                      usuario.estado ? "active" : "inactive"
                    }`}
                  >
                    {typeof usuario.estado === "boolean"
                      ? usuario.estado
                        ? "Activo"
                        : "Inactivo"
                      : "No definido"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="usuarios-modal-footer">
          <button className="usuarios-modalButton-cerrar" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsuarioDetalleModal;
