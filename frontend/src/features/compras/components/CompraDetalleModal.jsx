import React from "react";
import "../css/Compras.css";
import "../../../shared/styles/detail-modals.css";

// ✅ FUNCIÓN AUXILIAR: Añadida para formatear la fecha de forma segura.
const formatFechaSinTimezone = (fechaString) => {
  if (!fechaString) return "N/A";
  // Extrae solo la parte de la fecha (ej: "2025-07-01") del string que viene de la BD.
  const fechaPart = fechaString.split("T")[0];
  const [year, month, day] = fechaPart.split("-");
  // Reordena al formato DÍA/MES/AÑO.
  return `${day}/${month}/${year}`;
};

const CompraDetalleModal = ({ compra, onClose }) => {
  if (!compra) {
    return null;
  }

  const { idCompra, fecha, proveedor, usuario, total, iva, estado } = compra;
  const productosDeLaCompra = compra.productos || [];
  const subtotal = total - iva;

  return (
    <div className="compras-modalOverlay">
      <div className="compras-modalContent compras-modalContent-details">
        <div className="compras-modal-header">
          <h2>Detalles de la Compra</h2>
          <button
            type="button"
            className="compras-modal-close-button"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <div className="compras-modal-body">
          <div className="compras-details-container">
            <div className="compras-details-section">
              <h4 className="compras-details-section-title">
                <span className="section-icon">📋</span>
                Información Básica
              </h4>
              <div className="compras-details-grid">
                <div className="compras-detail-item">
                  <label className="compras-detail-label">ID Compra</label>
                  <span className="compras-detail-value compras-id-badge">
                    #{idCompra || "N/A"}
                  </span>
                </div>
                <div className="compras-detail-item">
                  <label className="compras-detail-label">Fecha</label>
                  <span className="compras-detail-value compras-date-text">
                    {formatFechaSinTimezone(fecha)}
                  </span>
                </div>
                <div className="compras-detail-item">
                  <label className="compras-detail-label">Estado</label>
                  <span
                    className={`compras-status-badge ${
                      estado ? "completed" : "cancelled"
                    }`}
                  >
                    {estado ? "Completado" : "Anulada"}
                  </span>
                </div>
                <div className="compras-detail-item compras-detail-item-full">
                  <label className="compras-detail-label">Registrado por</label>
                  <span className="compras-detail-value compras-user-text">
                    {usuario?.nombre || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="compras-details-section">
              <h4 className="compras-details-section-title">
                <span className="section-icon">🏢</span>
                Información del Proveedor
              </h4>
              <div className="compras-details-grid">
                <div className="compras-detail-item compras-detail-item-full">
                  <label className="compras-detail-label">Proveedor</label>
                  <span className="compras-detail-value compras-supplier-name">
                    {proveedor?.nombre || "N/A"}
                  </span>
                </div>
                <div className="compras-detail-item compras-detail-item-full">
                  <label className="compras-detail-label">
                    {proveedor?.tipo === "Natural"
                      ? "Documento:"
                      : proveedor?.tipo === "Juridico"
                      ? "NIT"
                      : "Documento"}
                  </label>
                  <span className="compras-detail-value compras-document-text">
                    {proveedor?.estado
                      ? proveedor?.tipo === "Natural"
                        ? `${proveedor?.tipoDocumento || ""} ${
                            proveedor?.numeroDocumento || "N/A"
                          }`
                        : proveedor?.tipo === "Juridico"
                        ? proveedor?.nitEmpresa || "N/A"
                        : "N/A"
                      : "Proveedor inactivo"}
                  </span>
                </div>
              </div>
            </div>

            <div className="compras-details-section">
              <h4 className="compras-details-section-title">
                <span className="section-icon">📦</span>
                Productos de la Compra ({productosDeLaCompra.length})
              </h4>
              <div className="compras-products-container">
                {productosDeLaCompra.length > 0 ? (
                  <div className="compras-products-table-wrapper">
                    <table className="compras-products-table">
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th className="text-center">Cant.</th>
                          <th className="text-right">V. Unitario</th>
                          <th className="text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productosDeLaCompra.map((detalle, index) => {
                          const pivot =
                            detalle.detalleCompra ||
                            detalle.CompraXProducto ||
                            {};
                          const cantidad = pivot.cantidad || 0;
                          const valorUnitario = pivot.valorUnitario || 0;
                          const subtotalItem = cantidad * valorUnitario;
                          return (
                            <tr key={detalle.idProducto || index}>
                              <td className="compras-product-name">
                                {detalle.nombre || "N/A"}
                              </td>
                              <td className="text-center compras-quantity-badge">
                                {cantidad}
                              </td>
                              <td className="text-right compras-unit-price">
                                $
                                {Math.round(valorUnitario).toLocaleString(
                                  "es-CO"
                                )}
                              </td>
                              <td className="text-right compras-item-total">
                                $
                                {Math.round(subtotalItem).toLocaleString(
                                  "es-CO"
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="compras-no-products">
                    <span className="no-products-icon">📭</span>
                    <p>No hay productos en esta compra</p>
                  </div>
                )}
              </div>
            </div>

            <div className="compras-details-section compras-totals-section">
              <h4 className="compras-details-section-title">
                <span className="section-icon">💰</span>
                Resumen de Totales
              </h4>
              <div className="compras-totals-container">
                <div className="compras-total-row">
                  <span className="compras-total-label">Subtotal:</span>
                  <span className="compras-total-value compras-subtotal">
                    ${Math.round(subtotal).toLocaleString("es-CO")}
                  </span>
                </div>
                <div className="compras-total-row">
                  <span className="compras-total-label">IVA (19%):</span>
                  <span className="compras-total-value compras-iva">
                    ${Math.round(iva).toLocaleString("es-CO")}
                  </span>
                </div>
                <div className="compras-total-row compras-total-final">
                  <span className="compras-total-label">Total:</span>
                  <span className="compras-total-value compras-total">
                    ${Math.round(total).toLocaleString("es-CO")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="compras-modal-footer">
          <button className="compras-modalButton-cerrar" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompraDetalleModal;
