// src/features/ventas/components/VentaDetalleModal.jsx
import React from "react";
import "../../../shared/styles/detail-modals.css";

const VentaDetalleModal = ({ isOpen, onClose, venta }) => {
  if (!isOpen || !venta) return null;

  const formatCurrency = (value) => {
    const number = parseFloat(value);
    if (isNaN(number)) {
      return "$0";
    }
    return `$${number.toLocaleString("es-CO", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-CO");
  };

  const cliente = venta.cliente || {};
  const productos = venta.productos || [];
  const servicios = venta.servicios || [];

  // Cálculo seguro del subtotal
  const subtotal =
    (parseFloat(venta.total) || 0) - (parseFloat(venta.iva) || 0);

  return (
    <div className="ventas-modalOverlay">
      <div className="ventas-modalContent ventas-modalContent-details">
        <div className="ventas-modal-header">
          <h2>Detalles de la Venta</h2>
          <button
            type="button"
            className="ventas-modal-close-button"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <div className="ventas-modal-body">
          <div className="ventas-details-container">
            {/* Sección de Información de la Venta */}
            <div className="ventas-details-section">
              <h3 className="ventas-details-section-title">
                <span className="section-icon">📋</span>
                Información de la Venta
              </h3>
              <div className="ventas-details-grid">
                <div className="ventas-detail-item">
                  <label className="ventas-detail-label">ID Venta</label>
                  <span className="ventas-detail-value ventas-id-badge">
                    #{venta.idVenta || "N/A"}
                  </span>
                </div>
                <div className="ventas-detail-item">
                  <label className="ventas-detail-label">Fecha</label>
                  <span className="ventas-detail-value">
                    {formatDate(venta.fecha)}
                  </span>
                </div>
                <div className="ventas-detail-item">
                  <label className="ventas-detail-label">Estado</label>
                  <span className="ventas-detail-value">
                    <span
                      className={`ventas-status-badge ${
                        venta.estadoDetalle?.nombreEstado
                          ?.toLowerCase()
                          .replace(/\s+/g, "-") || "unknown"
                      }`}
                    >
                      {venta.estadoDetalle?.nombreEstado || "N/A"}
                    </span>
                  </span>
                </div>
                <div className="ventas-detail-item">
                  <label className="ventas-detail-label">Total</label>
                  <span className="ventas-detail-value ventas-total-badge">
                    {formatCurrency(venta.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Sección de Información del Cliente */}
            <div className="ventas-details-section">
              <h3 className="ventas-details-section-title">
                <span className="section-icon">👤</span>
                Información del Cliente
              </h3>
              <div className="ventas-details-grid">
                <div className="ventas-detail-item">
                  <label className="ventas-detail-label">Nombre Completo</label>
                  <span className="ventas-detail-value">
                    {`${cliente.nombre || ""} ${
                      cliente.apellido || ""
                    }`.trim() || "N/A"}
                  </span>
                </div>
                <div className="ventas-detail-item">
                  <label className="ventas-detail-label">Documento</label>
                  <span className="ventas-detail-value">
                    {cliente.numeroDocumento || "N/A"}
                  </span>
                </div>
                <div className="ventas-detail-item">
                  <label className="ventas-detail-label">Teléfono</label>
                  <span className="ventas-detail-value">
                    {cliente.telefono || "N/A"}
                  </span>
                </div>
                <div className="ventas-detail-item ventas-detail-item-full">
                  <label className="ventas-detail-label">Dirección</label>
                  <span className="ventas-detail-value">
                    {cliente.direccion || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Sección de Productos y Servicios */}
            <div className="ventas-details-section">
              <h3 className="ventas-details-section-title">
                <span className="section-icon">🛍️</span>
                Productos y Servicios ({productos.length + servicios.length})
              </h3>
              <div className="ventas-items-container">
                {productos.length + servicios.length > 0 ? (
                  <div className="ventas-items-table-wrapper">
                    <table className="ventas-items-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Ítem</th>
                          <th className="text-center">Cantidad</th>
                          <th className="text-right">Valor Unitario</th>
                          <th className="text-right">Total Ítem</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productos.map((item, index) => {
                          const detalle = item.detalleProductoVenta || {};
                          const cantidad = detalle.cantidad || 0;
                          const valorUnitario = detalle.valorUnitario || 0;
                          return (
                            <tr key={`prod-${item.idProducto || index}`}>
                              <td className="ventas-item-number">
                                {index + 1}
                              </td>
                              <td className="ventas-item-name">
                                {item.nombre || "N/A"}
                              </td>
                              <td className="text-center ventas-item-quantity">
                                {cantidad}
                              </td>
                              <td className="text-right ventas-item-price">
                                {formatCurrency(valorUnitario)}
                              </td>
                              <td className="text-right ventas-item-total">
                                {formatCurrency(cantidad * valorUnitario)}
                              </td>
                            </tr>
                          );
                        })}
                        {servicios.map((item, index) => {
                          const detalle = item.detalleServicioVenta || {};
                          const valorServicio = detalle.valorServicio || 0;
                          return (
                            <tr key={`serv-${item.idServicio || index}`}>
                              <td className="ventas-item-number">
                                {productos.length + index + 1}
                              </td>
                              <td className="ventas-item-name">
                                {item.nombre || "N/A"}
                              </td>
                              <td className="text-center ventas-item-quantity">
                                1
                              </td>
                              <td className="text-right ventas-item-price">
                                {formatCurrency(valorServicio)}
                              </td>
                              <td className="text-right ventas-item-total">
                                {formatCurrency(valorServicio)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="ventas-no-items">
                    <span className="no-items-icon">🛍️</span>
                    <p>No hay productos o servicios en esta venta</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sección de Resumen de Totales */}
            <div className="ventas-details-section ventas-totals-section">
              <h3 className="ventas-details-section-title">
                <span className="section-icon">💰</span>
                Resumen de Totales
              </h3>
              <div className="ventas-totals-container">
                <div className="ventas-total-row">
                  <span className="ventas-total-label">Subtotal:</span>
                  <span className="ventas-total-value ventas-subtotal">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="ventas-total-row">
                  <span className="ventas-total-label">IVA (19%):</span>
                  <span className="ventas-total-value ventas-iva">
                    {formatCurrency(venta.iva)}
                  </span>
                </div>
                <div className="ventas-total-row ventas-total-final">
                  <span className="ventas-total-label">Total Venta:</span>
                  <span className="ventas-total-value ventas-total">
                    {formatCurrency(venta.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="ventas-modal-footer">
          <button className="ventas-modalButton-cerrar" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default VentaDetalleModal;
