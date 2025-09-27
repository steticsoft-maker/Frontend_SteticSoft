import React, { useState, useEffect } from 'react';
import { getServiciosByCategoria } from '../services/categoriasServicioService';
import '../css/CategoriasServicio.css';

const CategoriaServicioDetalleModal = ({ open, onClose, categoria }) => {
  const [servicios, setServicios] = useState([]);
  const [loadingServicios, setLoadingServicios] = useState(false);
  const [errorServicios, setErrorServicios] = useState('');

  useEffect(() => {
    if (open && categoria?.idCategoriaServicio) {
      loadServicios();
    }
  }, [open, categoria]);

  const loadServicios = async () => {
    setLoadingServicios(true);
    setErrorServicios('');
    try {
      const serviciosData = await getServiciosByCategoria(categoria.idCategoriaServicio);
      setServicios(Array.isArray(serviciosData) ? serviciosData : []);
    } catch (error) {
      console.error('Error al cargar servicios:', error);
      setErrorServicios('Error al cargar los servicios asociados');
      setServicios([]);
    } finally {
      setLoadingServicios(false);
    }
  };

  if (!open || !categoria) return null;

  return (
    <div className="categorias-servicio-modal-overlay" onClick={onClose}>
      <div className="categorias-servicio-modal-content categorias-servicio-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="categorias-servicio-modal-header">
          <h2 className="categorias-servicio-modal-title">
            <span className="categorias-servicio-modal-icon">📂</span>
            Detalles de la Categoría
          </h2>
          <button 
            type="button" 
            className="categorias-servicio-modal-close-button" 
            onClick={onClose} 
            title="Cerrar"
          >
            &times;
          </button>
        </div>

        <div className="categorias-servicio-modal-body">
          <div className="categorias-servicio-details-container">
            <div className="categorias-servicio-details-section">
              <h3 className="categorias-servicio-details-section-title">
                <span className="section-icon">📋</span>
                Información Básica
              </h3>
              <div className="categorias-servicio-details-grid">
                <div className="categorias-servicio-detail-item">
                  <label className="categorias-servicio-detail-label">Nombre</label>
                  <span className="categorias-servicio-detail-value categorias-servicio-name-badge">
                    {categoria.nombre || 'N/A'}
                  </span>
                </div>
                <div className="categorias-servicio-detail-item">
                  <label className="categorias-servicio-detail-label">Estado</label>
                  <span className={`categorias-servicio-status-badge ${categoria.estado ? 'active' : 'inactive'}`}>
                    {categoria.estado ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div className="categorias-servicio-detail-item categorias-servicio-detail-item-full">
                  <label className="categorias-servicio-detail-label">Descripción</label>
                  <span className="categorias-servicio-detail-value categorias-servicio-description-text">
                    {categoria.descripcion || 'Sin descripción'}
                  </span>
                </div>
              </div>
            </div>

            <div className="categorias-servicio-details-section">
              <h3 className="categorias-servicio-details-section-title">
                <span className="section-icon">ℹ️</span>
                Información Adicional
              </h3>
              <div className="categorias-servicio-details-grid">
                <div className="categorias-servicio-detail-item">
                  <label className="categorias-servicio-detail-label">ID de Categoría</label>
                  <span className="categorias-servicio-detail-value categorias-servicio-id-badge">
                    #{categoria.idCategoriaServicio || 'N/A'}
                  </span>
                </div>
                <div className="categorias-servicio-detail-item">
                  <label className="categorias-servicio-detail-label">Tipo</label>
                  <span className="categorias-servicio-detail-value">
                    Categoría de Servicio
                  </span>
                </div>
              </div>
            </div>

            <div className="categorias-servicio-details-section">
              <h3 className="categorias-servicio-details-section-title">
                <span className="section-icon">🔧</span>
                Servicios Asociados ({servicios.length})
              </h3>
              <div className="categorias-servicio-servicios-container">
                {loadingServicios ? (
                  <div className="categorias-servicio-loading">
                    <span className="loading-spinner"></span>
                    Cargando servicios...
                  </div>
                ) : errorServicios ? (
                  <div className="categorias-servicio-error">
                    <span className="error-icon">⚠️</span>
                    {errorServicios}
                  </div>
                ) : servicios.length > 0 ? (
                  <div className="categorias-servicio-servicios-list">
                    {servicios.map((servicio, index) => (
                      <div key={servicio.idServicio || index} className="categorias-servicio-servicio-item">
                        <div className="categorias-servicio-servicio-info">
                          <span className="categorias-servicio-servicio-nombre">{servicio.nombre}</span>
                          <span className="categorias-servicio-servicio-precio">
                            ${servicio.precio ? servicio.precio.toLocaleString() : 'N/A'}
                          </span>
                        </div>
                        <div className="categorias-servicio-servicio-details">
                          <span className={`categorias-servicio-servicio-estado ${servicio.estado ? 'active' : 'inactive'}`}>
                            {servicio.estado ? 'Activo' : 'Inactivo'}
                          </span>
                          <span className="categorias-servicio-servicio-duracion">
                            Duración: {servicio.duracionMinutos ? `${servicio.duracionMinutos} min` : 'N/A'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="categorias-servicio-no-servicios">
                    <span className="no-servicios-icon">🔧</span>
                    <p>No hay servicios asociados a esta categoría</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="categorias-servicio-modal-footer">
          <button 
            className="categorias-servicio-modal-button-cerrar" 
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoriaServicioDetalleModal;