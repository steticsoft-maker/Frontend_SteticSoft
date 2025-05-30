// src/features/ventas/components/VentaDetalleModal.jsx
import React from "react";
import VentaDetalleDisplay from "./VentaDetalleDisplay";

const VentaDetalleModal = ({ isOpen, onClose, venta }) => {
  if (!isOpen || !venta) return null;

  return (
    <div className="modal-ventas">
      <div className="modal-content-ventas modal-content-ventas-detalle">
        <VentaDetalleDisplay venta={venta} />
        <div
          className="modal-ventas-buttons"
          style={{ marginTop: "20px", justifyContent: "center" }}
        >
          <button className="botonCerrarDetallesVenta" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default VentaDetalleModal;
