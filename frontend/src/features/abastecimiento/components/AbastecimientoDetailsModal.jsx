// src/features/abastecimiento/components/AbastecimientoDetailsModal.jsx
import React from 'react';
import { calculateRemainingLifetime } from '../services/abastecimientoService';

const AbastecimientoDetailsModal = ({ isOpen, onClose, item }) => {
  if (!isOpen || !item) return null;

  return (
    <div className="modal-abastecimiento-overlay">
      <div className="modal-abastecimiento-content detalle-modal"> 
        <div className="abastecimiento-details-text">
          <h2>Detalles del Producto</h2>
          <p><strong>Nombre:</strong> {item.nombre}</p>
          <p><strong>Categoría:</strong> {item.category || "N/A"}</p>
          <p><strong>Cantidad:</strong> {item.cantidad}</p>
          <p><strong>Empleado:</strong> {item.empleado}</p>
          <p><strong>Fecha de Ingreso:</strong> {item.fechaIngreso}</p>
          <p><strong>Tiempo de Vida Restante:</strong> {calculateRemainingLifetime(item)}</p>
          {item.isDepleted && (
            <p className="depleted-text">
              <strong>Estado:</strong> Agotado
              {item.depletionReason && `: ${item.depletionReason}`}
              {item.depletionDate && ` (Fecha: ${item.depletionDate})`}
            </p>
          )}
          <button className="modal-abastecimiento-button-cerrar" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AbastecimientoDetailsModal;