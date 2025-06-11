// src/features/abastecimiento/components/AbastecimientoDetailsModal.jsx
import React from 'react';
// La importación ahora funcionará correctamente.
import { calculateRemainingLifetime } from '../services/abastecimientoService'; 

const AbastecimientoDetailsModal = ({ isOpen, onClose, item }) => {
  if (!isOpen || !item) {
    return null;
  }

  return (
    <div className="modal-abastecimiento-overlay">
      <div className="modal-abastecimiento-content details-modal-abastecimiento">
        <h2 className="abastecimiento-modal-title">Detalles del Registro de Abastecimiento</h2>
        <div className="details-grid-abastecimiento">
          <p><strong>Producto:</strong> {item.productoAbastecido?.nombre || 'N/A'}</p>
          <p><strong>Categoría:</strong> {item.productoAbastecido?.categoriaProducto?.nombre || 'N/A'}</p>
          <p><strong>Cantidad Inicial:</strong> {item.cantidad}</p>
          <p><strong>Empleado Asignado:</strong> {item.empleadoResponsable?.nombre || 'No asignado'}</p>
          <p><strong>Fecha de Ingreso:</strong> {new Date(item.fechaIngreso).toLocaleDateString()}</p>
          <p><strong>Vida Útil Restante:</strong> {calculateRemainingLifetime(item)}</p>
          <p><strong>Estado:</strong> {item.estaAgotado ? `Agotado` : 'Disponible'}</p>
          {item.estaAgotado && (
            <>
              <p><strong>Razón de Agotamiento:</strong> {item.razonAgotamiento || 'No especificada'}</p>
              <p><strong>Fecha de Agotamiento:</strong> {item.fechaAgotamiento ? new Date(item.fechaAgotamiento).toLocaleDateString() : 'N/A'}</p>
            </>
          )}
        </div>
        <div className="form-actions-abastecimiento">
          <button type="button" className="form-button-cancelar-abastecimiento" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AbastecimientoDetailsModal;