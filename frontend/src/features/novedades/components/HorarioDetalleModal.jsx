import React from "react";
import { Badge } from "react-bootstrap";
import "../css/ConfigHorarios.css";
import "../../../shared/styles/detail-modals.css";

const HorarioDetalleModal = ({ isOpen, onClose, novedad }) => {
  if (!isOpen || !novedad) return null;

  const getDiaPillClass = (dia) => {
    const diaNormalizado = dia
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace("á", "a")
      .replace("é", "e")
      .replace("í", "i")
      .replace("ó", "o")
      .replace("ú", "u");
    return `dia-pill dia-pill-${diaNormalizado}`;
  };

  const formatTime = (timeString) =>
    timeString ? timeString.slice(0, 5) : "N/A";

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const adjustedDate = new Date(
      date.getTime() + date.getTimezoneOffset() * 60000
    );
    return adjustedDate.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  const getEstadoBadge = () => {
    const estado = novedad.estado;

    // Normalizar el estado para crear la clase CSS
    const estadoNormalizado = (estado ? "activa" : "inactiva")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[áä]/g, "a")
      .replace(/[éë]/g, "e")
      .replace(/[íï]/g, "i")
      .replace(/[óö]/g, "o")
      .replace(/[úü]/g, "u")
      .replace(/ñ/g, "n")
      .replace(/[^a-z0-9-]/g, "");

    // Mapear estados específicos a sus clases correspondientes
    const estadoMap = {
      activa: "badge-activa",
      activo: "badge-activo",
      inactiva: "badge-inactiva",
      inactivo: "badge-inactivo",
      habilitada: "badge-habilitada",
      habilitado: "badge-habilitado",
      deshabilitada: "badge-deshabilitada",
      deshabilitado: "badge-deshabilitado",
    };

    const estadoClass = estadoMap[estadoNormalizado] || "badge-inactiva";
    const estadoText = estado ? "Activa" : "Inactiva";

    // Debug: mostrar en consola qué clases se están aplicando
    console.log("Estado original en novedades:", estado);
    console.log("Estado normalizado en novedades:", estadoNormalizado);
    console.log("Clase CSS en novedades:", estadoClass);

    return (
      <span className={`badge ${estadoClass}`} title={`Estado: ${estadoText}`}>
        {estadoText}
      </span>
    );
  };

  return (
    <div className="novedades-modalOverlay">
      <div className="novedades-modalContent novedades-modalContent-details">
        <div className="novedades-modal-header">
          <h2>Detalles de la Novedad</h2>
          <button
            type="button"
            className="novedades-modal-close-button"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <div className="novedades-modal-body">
          <div className="novedades-details-container">
            <div className="novedades-details-section">
              <h4 className="novedades-details-section-title">
                <span className="section-icon">📅</span>
                Período de Vigencia
              </h4>
              <div className="novedades-details-grid">
                <div className="novedades-detail-item">
                  <label className="novedades-detail-label">Fecha Inicio</label>
                  <span className="novedades-detail-value">
                    {formatDate(novedad.fechaInicio)}
                  </span>
                </div>
                <div className="novedades-detail-item">
                  <label className="novedades-detail-label">Fecha Fin</label>
                  <span className="novedades-detail-value">
                    {formatDate(novedad.fechaFin)}
                  </span>
                </div>
                <div className="novedades-detail-item">
                  <label className="novedades-detail-label">Estado</label>
                  <span className="novedades-detail-value">
                    {getEstadoBadge()}
                  </span>
                </div>
              </div>
            </div>

            <div className="novedades-details-section">
              <h4 className="novedades-details-section-title">
                <span className="section-icon">⏰</span>
                Horario de Atención
              </h4>
              <div className="novedades-details-grid">
                <div className="novedades-detail-item">
                  <label className="novedades-detail-label">Hora Inicio</label>
                  <span className="novedades-detail-value novedades-time-text">
                    {formatTime(novedad.horaInicio)}
                  </span>
                </div>
                <div className="novedades-detail-item">
                  <label className="novedades-detail-label">Hora Fin</label>
                  <span className="novedades-detail-value novedades-time-text">
                    {formatTime(novedad.horaFin)}
                  </span>
                </div>
              </div>
            </div>

            <div className="novedades-details-section">
              <h4 className="novedades-details-section-title">
                <span className="section-icon">📆</span>
                Días de la Semana
              </h4>
              <div className="novedades-details-grid">
                <div className="novedades-detail-item novedades-detail-item-full">
                  <label className="novedades-detail-label">
                    Días Aplicables
                  </label>
                  <div className="novedades-dias-container">
                    {novedad.dias?.map((dia) => (
                      <Badge pill key={dia} className={getDiaPillClass(dia)}>
                        {dia.charAt(0).toUpperCase() + dia.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="novedades-details-section">
              <h4 className="novedades-details-section-title">
                <span className="section-icon">👥</span>
                Empleados Asignados
              </h4>
              <div className="novedades-details-grid">
                <div className="novedades-detail-item novedades-detail-item-full">
                  {novedad.empleados && novedad.empleados.length > 0 ? (
                    <div className="novedades-empleados-container">
                      {novedad.empleados.map((empleado) => (
                        <div
                          key={empleado.idUsuario}
                          className="novedades-empleado-item"
                        >
                          <div className="novedades-empleado-header">
                            <span className="novedades-empleado-nombre">
                              {empleado.nombre
                                ? `${empleado.nombre} ${
                                    empleado.apellido || ""
                                  }`.trim()
                                : "Nombre no disponible"}
                            </span>
                          </div>
                          <div className="novedades-empleado-details">
                            <div className="novedades-empleado-detail">
                              <strong>📧 Correo:</strong>{" "}
                              {empleado.correo || "No disponible"}
                            </div>
                            <div className="novedades-empleado-detail">
                              <strong>📞 Teléfono:</strong>{" "}
                              {empleado.telefono || "No disponible"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="novedades-no-empleados">
                      <span className="novedades-no-empleados-icon">👤</span>
                      <span>No hay empleados asignados a esta novedad</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="novedades-modal-footer">
          <button className="novedades-modalButton-cerrar" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default HorarioDetalleModal;
