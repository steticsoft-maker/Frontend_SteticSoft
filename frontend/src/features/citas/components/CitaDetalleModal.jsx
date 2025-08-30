// src/features/citas/components/CitaDetalleModal.jsx
import React from 'react';
import moment from 'moment';
import 'moment/locale/es'; // Importar locale español para moment

moment.locale('es'); // Establecer moment en español globalmente

const CitaDetalleModal = ({ isOpen, onClose, cita, onEdit, onDeleteConfirm }) => {
  if (!isOpen || !cita) return null;

  const handleEditClick = () => {
    if (onEdit) {
      onEdit(cita); // Pasar la cita completa al editor
    }
  };

  const handleDeleteConfirmClick = () => {
    if (onDeleteConfirm) {
      onDeleteConfirm(cita); // Pasar la cita para confirmar eliminación
    }
  };

  return (
    <div className="modal-citas">
      <div className="modal-content-citas">
        <h3>Detalles de la Cita</h3>
        <button className="cerrar-modal" onClick={onClose}>&times;</button>

        <div className="cita-detalle-content">
          <p><strong>ID Cita:</strong> {cita.id}</p>
          {/* ✅ Usar campos normalizados */}
          <p><strong>Cliente:</strong> {cita.clienteNombre || "Sin cliente"}</p>
          <p><strong>Empleado:</strong> {cita.empleadoNombre || "Sin empleado"}</p>
          <p>
            <strong>Servicio(s):</strong>{" "}
            {cita.servicios?.length > 0
              ? cita.servicios
                  .map(
                    (s) =>
                      `${s.nombre} ($${(s.precio || 0).toLocaleString("es-CO")})`
                  )
                  .join(", ")
              : "N/A"}
          </p>
          <p>
            <strong>Inicio:</strong>{" "}
            {cita.start
              ? moment(cita.start).format(
                  "dddd, D [de] MMMM [de] YYYY, h:mm a"
                )
              : "No definido"}
          </p>
          <p>
            <strong>Fin:</strong>{" "}
            {cita.end
              ? moment(cita.end).format(
                  "dddd, D [de] MMMM [de] YYYY, h:mm a"
                )
              : "No definido"}
          </p>
          <p>
            <strong>Precio Total:</strong> $
            {(cita.precioTotal || 0).toLocaleString("es-CO", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </p>
          <p>
            <strong>Estado:</strong>{" "}
            <span
              className={`cita-estado-badge estado-${(cita.estadoCita || "pendiente")
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
            >
              {cita.estadoCita || "Pendiente"}
            </span>
          </p>
          {cita.notasCancelacion && cita.estadoCita === "Cancelada" && (
            <p>
              <strong>Motivo Cancelación:</strong> {cita.notasCancelacion}
            </p>
          )}
        </div>

        <div className="botonesModalCitas">
          {cita.estadoCita !== "Completada" &&
            cita.estadoCita !== "Cancelada" && (
              <button className="boton-editar-cita" onClick={handleEditClick}>
                Editar/Reagendar
              </button>
            )}
          <button
            className="boton-eliminar-cita"
            onClick={handleDeleteConfirmClick}
          >
            Eliminar Cita
          </button>
        </div>
      </div>
    </div>
  );
};

export default CitaDetalleModal;
