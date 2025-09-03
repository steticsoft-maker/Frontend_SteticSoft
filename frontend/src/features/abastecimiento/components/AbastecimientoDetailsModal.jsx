// src/features/abastecimiento/components/AbastecimientoDetailsModal.jsx
import React from "react";
// Cambiamos la importación para traer la función individualmente
import { calculateRemainingLifetime } from "../services/abastecimientoService";

const AbastecimientoDetailsModal = ({ isOpen, onClose, item }) => {
  if (!isOpen || !item) {
    return null;
  }

  return (
    <div className="modal-abastecimiento-overlay">
      <div className="modal-abastecimiento-content detalle-modal">
        <button type="button" className="modal-close-button-x" onClick={onClose}>
          &times;
        </button>
        <h2 className="abastecimiento-modal-title">
          Detalles del Registro de Abastecimiento
        </h2>
        <div className="abastecimiento-details-text">
          <p>
            <strong>Producto:</strong> {item.producto?.nombre || "N/A"}
          </p>
          <p>
            <strong>Categoría:</strong> {item.producto?.categoria?.nombre || "N/A"}
          </p>
          <p>
            <strong>Cantidad Inicial:</strong> {item.cantidad}
          </p>
          <p>
            <strong>Empleado Asignado:</strong>{" "}
            {item.empleadoAsignado || "No asignado"}
          </p>
          <p>
            <strong>Fecha de Ingreso:</strong>{" "}
            {new Date(item.fechaIngreso).toLocaleDateString()}
          </p>
          <p>
            <strong>Vida Útil Restante:</strong> {calculateRemainingLifetime(item)}
          </p>
          <p>
            <strong>Estado:</strong>{" "}
            <span className={item.estaAgotado ? "depleted-text" : ""}>
              {item.estaAgotado ? `Agotado` : "Disponible"}
            </span>
          </p>
          {item.estaAgotado && (
            <>
              <p>
                <strong>Razón de Agotamiento:</strong>{" "}
                {item.razonAgotamiento || "No especificada"}
              </p>
              <p>
                <strong>Fecha de Agotamiento:</strong>{" "}
                {item.fechaAgotamiento
                  ? new Date(item.fechaAgotamiento).toLocaleDateString()
                  : "N/A"}
              </p>
            </>
          )}
        </div>
        <div className="form-actions-abastecimiento">
          <button
            type="button"
            className="modal-abastecimiento-button-cerrar"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AbastecimientoDetailsModal;