// src/features/clientes/components/ClienteDetalleModal.jsx
import React from "react";
import "../css/Clientes.css";
import "../../../shared/styles/detail-modals.css";

const ClienteDetalleModal = ({ isOpen, onClose, cliente }) => {
  if (!isOpen || !cliente) return null;

  const nombreCompleto = `${cliente.nombre || ""} ${
    cliente.apellido || ""
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
    <div className="clientes-modalOverlay">
      <div className="clientes-modalContent clientes-modalContent-details">
        <div className="clientes-modal-header">
          <h2>Detalles del Cliente</h2>
          <button
            type="button"
            className="clientes-modal-close-button"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <div className="clientes-modal-body">
          <div className="cliente-details-container">
            {/* Sección de Información Personal */}
            <div className="cliente-details-section">
              <h3 className="cliente-details-section-title">
                <span className="section-icon">👤</span>
                Información Personal
              </h3>
              <div className="cliente-details-grid">
                {cliente.nombre && (
                  <div className="cliente-detail-item">
                    <label>Nombre</label>
                    <span>{cliente.nombre}</span>
                  </div>
                )}
                {cliente.apellido && (
                  <div className="cliente-detail-item">
                    <label>Apellido</label>
                    <span>{cliente.apellido}</span>
                  </div>
                )}
                {cliente.fechaNacimiento && (
                  <div className="cliente-detail-item">
                    <label>Fecha de Nacimiento</label>
                    <span>{formatDate(cliente.fechaNacimiento)}</span>
                  </div>
                )}
                {cliente.tipoDocumento && (
                  <div className="cliente-detail-item">
                    <label>Tipo de Documento</label>
                    <span>{cliente.tipoDocumento}</span>
                  </div>
                )}
                {cliente.numeroDocumento && (
                  <div className="cliente-detail-item">
                    <label>Número de Documento</label>
                    <span>{cliente.numeroDocumento}</span>
                  </div>
                )}
                {cliente.telefono && (
                  <div className="cliente-detail-item">
                    <label>Teléfono</label>
                    <span>{cliente.telefono}</span>
                  </div>
                )}
                {cliente.direccion && (
                  <div className="cliente-detail-item cliente-detail-item-full">
                    <label>Dirección</label>
                    <span>{cliente.direccion}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Sección de Información de Contacto */}
            <div className="cliente-details-section">
              <h3 className="cliente-details-section-title">
                <span className="section-icon">📧</span>
                Información de Contacto
              </h3>
              <div className="cliente-details-grid">
                {cliente.correo && (
                  <div className="cliente-detail-item">
                    <label>Correo Electrónico</label>
                    <span>{cliente.correo}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Sección de Información de Cuenta */}
            <div className="cliente-details-section">
              <h3 className="cliente-details-section-title">
                <span className="section-icon">⚙️</span>
                Información de Cuenta
              </h3>
              <div className="cliente-details-grid">
                {cliente.usuario && cliente.usuario.rol && (
                  <div className="cliente-detail-item">
                    <label>Rol</label>
                    <span className="cliente-role-badge">
                      {cliente.usuario.rol.nombre || "No asignado"}
                    </span>
                  </div>
                )}
                <div className="cliente-detail-item">
                  <label>Estado de Cuenta</label>
                  <span
                    className={`cliente-status-badge ${
                      cliente.usuario?.estado ? "active" : "inactive"
                    }`}
                  >
                    {typeof cliente.usuario?.estado === "boolean"
                      ? cliente.usuario.estado
                        ? "Activo"
                        : "Inactivo"
                      : "No definido"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="clientes-modal-footer">
          <button className="clientes-modalButton-cerrar" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClienteDetalleModal;
