import React from "react";
import "../css/Abastecimiento.css";
import "../../../shared/styles/detail-modals.css";

const AbastecimientoDetalleModal = ({ isOpen, onClose, abastecimiento }) => {
  if (!isOpen || !abastecimiento) {
    return null;
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric" };
    // Para fechas DATEONLY, crear la fecha directamente sin ajustes de zona horaria
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("es-CO", options);
  };

  return (
    <div className="abastecimiento-modalOverlay">
      <div className="abastecimiento-modalContent abastecimiento-modalContent-details">
        <div className="abastecimiento-modal-header">
          <h2>Detalles del Abastecimiento</h2>
          <button
            type="button"
            className="abastecimiento-modal-close-button"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <div className="abastecimiento-modal-body">
          <div className="abastecimiento-details-container">
            <div className="abastecimiento-details-section">
              <h3 className="abastecimiento-details-section-title">
                <span className="section-icon">📋</span>
                Información Básica
              </h3>
              <div className="abastecimiento-details-grid">
                <div className="abastecimiento-detail-item">
                  <label className="abastecimiento-detail-label">
                    ID Registro
                  </label>
                  <span className="abastecimiento-detail-value abastecimiento-id-badge">
                    #{abastecimiento.idAbastecimiento || "N/A"}
                  </span>
                </div>
                <div className="abastecimiento-detail-item">
                  <label className="abastecimiento-detail-label">
                    Cantidad Asignada
                  </label>
                  <span className="abastecimiento-detail-value abastecimiento-quantity-badge">
                    {abastecimiento.cantidad || "N/A"}
                  </span>
                </div>
                <div className="abastecimiento-detail-item abastecimiento-detail-item-full">
                  <label className="abastecimiento-detail-label">
                    Producto
                  </label>
                  <span className="abastecimiento-detail-value abastecimiento-product-name">
                    {abastecimiento.producto?.nombre || "No disponible"}
                  </span>
                </div>
              </div>
            </div>

            <div className="abastecimiento-details-section">
              <h3 className="abastecimiento-details-section-title">
                <span className="section-icon">👤</span>
                Información del Empleado
              </h3>
              <div className="abastecimiento-details-grid">
                <div className="abastecimiento-detail-item abastecimiento-detail-item-full">
                  <label className="abastecimiento-detail-label">
                    Empleado
                  </label>
                  <span className="abastecimiento-detail-value abastecimiento-employee-info">
                    {`${abastecimiento.empleado?.empleado?.nombre || ""} ${
                      abastecimiento.empleado?.empleado?.apellido || ""
                    }`.trim() || "Empleado"}
                  </span>
                </div>
                <div className="abastecimiento-detail-item abastecimiento-detail-item-full">
                  <label className="abastecimiento-detail-label">Correo</label>
                  <span className="abastecimiento-detail-value abastecimiento-email-text">
                    {abastecimiento.empleado?.correo || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="abastecimiento-details-section">
              <h3 className="abastecimiento-details-section-title">
                <span className="section-icon">📅</span>
                Fechas y Estado
              </h3>
              <div className="abastecimiento-details-grid">
                <div className="abastecimiento-detail-item">
                  <label className="abastecimiento-detail-label">
                    Fecha de Asignación
                  </label>
                  <span className="abastecimiento-detail-value abastecimiento-date-text">
                    {formatDate(abastecimiento.fechaIngreso)}
                  </span>
                </div>
                <div className="abastecimiento-detail-item">
                  <label className="abastecimiento-detail-label">
                    Estado del Registro
                  </label>
                  <span
                    className={`abastecimiento-status-badge ${
                      abastecimiento.estado ? "active" : "inactive"
                    }`}
                  >
                    {abastecimiento.estado ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>
            </div>

            {abastecimiento.estaAgotado && (
              <div className="abastecimiento-details-section abastecimiento-depleted-section">
                <h3 className="abastecimiento-details-section-title">
                  <span className="section-icon">⚠️</span>
                  Estado de Agotamiento
                </h3>
                <div className="abastecimiento-details-grid">
                  <div className="abastecimiento-detail-item">
                    <label className="abastecimiento-detail-label">
                      Estado del Insumo
                    </label>
                    <span className="abastecimiento-depleted-badge">
                      Agotado
                    </span>
                  </div>
                  <div className="abastecimiento-detail-item">
                    <label className="abastecimiento-detail-label">
                      Fecha de Agotamiento
                    </label>
                    <span className="abastecimiento-detail-value abastecimiento-date-text">
                      {formatDate(abastecimiento.fechaAgotamiento)}
                    </span>
                  </div>
                  <div className="abastecimiento-detail-item abastecimiento-detail-item-full">
                    <label className="abastecimiento-detail-label">
                      Razón de Agotamiento
                    </label>
                    <span className="abastecimiento-detail-value abastecimiento-reason-text">
                      {abastecimiento.razonAgotamiento || "No especificada"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="abastecimiento-modal-footer">
          <button
            className="abastecimiento-modalButton-cerrar"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AbastecimientoDetalleModal;
