// src/features/ventas/components/VentaDetalleModal.jsx
import React from 'react';
import VentaDetalleDisplay from './VentaDetalleDisplay'; // El componente que ya tenías planeado
// Asumimos que tienes un modal genérico o estilos de modal en Ventas.css

const VentaDetalleModal = ({ isOpen, onClose, venta }) => {
  if (!isOpen || !venta) return null;

  return (
    <div className="modal-ventas-overlay"> {/* O tu clase de overlay genérica */}
      <div className="modal-ventas-content modal-content-ventas-detalle"> {/* Clases para el estilo del modal */}
        {/* El título podría estar en VentaDetalleDisplay o aquí */}
        {/* <h2>Detalle de Venta #{venta.id}</h2> */}
        <VentaDetalleDisplay venta={venta} />
        <div className="modal-ventas-buttons" style={{ marginTop: '20px', justifyContent: 'center' }}>
          <button
            className="botonCerrarDetallesVenta" // Reutiliza tu clase o una genérica
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default VentaDetalleModal;