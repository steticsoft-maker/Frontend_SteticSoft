// src/features/categoriasProductoAdmin/components/CategoriaProductoDetalleModal.jsx
import React, { useState, useEffect } from "react";
import { getProductosByCategoria } from "../services/categoriasProductoService";
import "../css/CategoriasProducto.css";
import "../../../shared/styles/detail-modals.css";

const CategoriaProductoDetalleModal = ({ isOpen, onClose, categoria }) => {
  const [productos, setProductos] = useState([]);
  const [loadingProductos, setLoadingProductos] = useState(false);
  const [errorProductos, setErrorProductos] = useState("");

  useEffect(() => {
    if (isOpen && categoria?.idCategoriaProducto) {
      loadProductos();
    }
  }, [isOpen, categoria]);

  const loadProductos = async () => {
    setLoadingProductos(true);
    setErrorProductos("");
    try {
      const productosData = await getProductosByCategoria(
        categoria.idCategoriaProducto
      );
      setProductos(Array.isArray(productosData) ? productosData : []);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      setErrorProductos("Error al cargar los productos asociados");
      setProductos([]);
    } finally {
      setLoadingProductos(false);
    }
  };

  if (!isOpen || !categoria) return null;

  return (
    <div className="categorias-producto-admin-modalOverlay">
      <div className="categorias-producto-admin-modalContent categorias-producto-admin-modalContent-details">
        <div className="categorias-producto-admin-modal-header">
          <h2>Detalles de la Categoría</h2>
          <button
            type="button"
            className="categorias-producto-admin-modal-close-button"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <div className="categorias-producto-admin-modal-body">
          <div className="categorias-producto-admin-details-container">
            <div className="categorias-producto-details-section">
              <h3 className="categorias-producto-details-section-title">
                <span className="section-icon">📋</span>
                Información Básica
              </h3>
              <div className="categorias-producto-details-grid">
                <div className="categorias-producto-detail-item">
                  <label className="categorias-producto-detail-label">
                    Nombre
                  </label>
                  <span className="categorias-producto-detail-value categorias-producto-name-badge">
                    {categoria.nombre || "N/A"}
                  </span>
                </div>
                <div className="categorias-producto-detail-item">
                  <label className="categorias-producto-detail-label">
                    Estado
                  </label>
                  <span
                    className={`categorias-producto-status-badge ${
                      categoria.estado ? "active" : "inactive"
                    }`}
                  >
                    {categoria.estado ? "Activa" : "Inactiva"}
                  </span>
                </div>
                <div className="categorias-producto-detail-item categorias-producto-detail-item-full">
                  <label className="categorias-producto-detail-label">
                    Descripción
                  </label>
                  <span className="categorias-producto-detail-value categorias-producto-description-text">
                    {categoria.descripcion || "Sin descripción"}
                  </span>
                </div>
              </div>
            </div>

            <div className="categorias-producto-details-section">
              <h3 className="categorias-producto-details-section-title">
                <span className="section-icon">ℹ️</span>
                Información Adicional
              </h3>
              <div className="categorias-producto-details-grid">
                <div className="categorias-producto-detail-item">
                  <label className="categorias-producto-detail-label">
                    ID de Categoría
                  </label>
                  <span className="categorias-producto-detail-value categorias-producto-id-badge">
                    #{categoria.idCategoriaProducto || "N/A"}
                  </span>
                </div>
                <div className="categorias-producto-detail-item">
                  <label className="categorias-producto-detail-label">
                    Tipo
                  </label>
                  <span className="categorias-producto-detail-value">
                    Categoría de Producto
                  </span>
                </div>
              </div>
            </div>

            <div className="categorias-producto-details-section">
              <h3 className="categorias-producto-details-section-title">
                <span className="section-icon">📦</span>
                Productos Asociados ({productos.length})
              </h3>
              <div className="categorias-producto-productos-container">
                {loadingProductos ? (
                  <div className="categorias-producto-loading">
                    <span className="loading-spinner"></span>
                    Cargando productos...
                  </div>
                ) : errorProductos ? (
                  <div className="categorias-producto-error">
                    <span className="error-icon">⚠️</span>
                    {errorProductos}
                  </div>
                ) : productos.length > 0 ? (
                  <div className="categorias-producto-productos-list">
                    {productos.map((producto, index) => (
                      <div
                        key={producto.idProducto || index}
                        className="categorias-producto-producto-item"
                      >
                        <div className="categorias-producto-producto-info">
                          <span className="categorias-producto-producto-nombre">
                            {producto.nombre}
                          </span>
                          <span className="categorias-producto-producto-precio">
                            $
                            {producto.precio
                              ? producto.precio.toLocaleString()
                              : "N/A"}
                          </span>
                        </div>
                        <div className="categorias-producto-producto-details">
                          <span
                            className={`categorias-producto-producto-estado ${
                              producto.estado ? "active" : "inactive"
                            }`}
                          >
                            {producto.estado ? "Activo" : "Inactivo"}
                          </span>
                          <span className="categorias-producto-producto-existencia">
                            Stock: {producto.existencia || 0}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="categorias-producto-no-productos">
                    <span className="no-productos-icon">📭</span>
                    <p>No hay productos asociados a esta categoría</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="categorias-producto-admin-modal-footer">
          <button
            className="categorias-producto-admin-modalButton-cerrar"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoriaProductoDetalleModal;
