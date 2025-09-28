import React from 'react';

const ServicioAdminDetalleModal = ({ isOpen, onClose, servicio }) => {
    // Función para construir URL de imagen
    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        
        // Si ya es una URL completa (http o https)
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        
        // Para rutas relativas, concatenar con API_URL
        const API_URL = import.meta.env.VITE_API_URL;
        return `${API_URL}${imagePath}`;
    };

    if (!isOpen || !servicio) return null;

    // Formateador de moneda colombiana
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(parseFloat(value) || 0);
    };

    return (
        <div className="details-modal-overlay" onClick={onClose}>
            <div className="details-modal-content servicios-details-modal" onClick={(e) => e.stopPropagation()}>
                <div className="servicios-modal-header">
                    <h3 className="servicios-modal-title">
                        <span className="servicios-modal-icon">🛍️</span>
                        Detalles del Servicio
                    </h3>
                    <button
                        type="button"
                        className="servicios-modal-close-button"
                        onClick={onClose}
                        title="Cerrar"
                    >
                        &times;
                    </button>
                </div>

                <div className="servicios-modal-body">
                    <div className="servicios-details-container">
                        <div className="servicios-details-section">
                            <h4 className="servicios-details-section-title">
                                <span className="section-icon">📋</span>
                                Información Básica
                            </h4>
                            <div className="servicios-details-grid">
                                <div className="servicios-detail-item servicios-detail-item-full">
                                    <label className="servicios-detail-label">Nombre</label>
                                    <span className="servicios-detail-value servicios-name-text">
                                        {servicio.nombre || 'N/A'}
                                    </span>
                                </div>
                                <div className="servicios-detail-item servicios-detail-item-full">
                                    <label className="servicios-detail-label">Categoría</label>
                                    <span className="servicios-detail-value servicios-category-text">
                                        {servicio.categoria?.nombre || 'Sin categoría'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="servicios-details-section">
                            <h4 className="servicios-details-section-title">
                                <span className="section-icon">💰</span>
                                Información Comercial
                            </h4>
                            <div className="servicios-details-grid">
                                <div className="servicios-detail-item servicios-detail-item-full">
                                    <label className="servicios-detail-label">Precio</label>
                                    <span className="servicios-detail-value servicios-price-text">
                                        {formatCurrency(servicio.precio)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="servicios-details-section">
                            <h4 className="servicios-details-section-title">
                                <span className="section-icon">📝</span>
                                Descripción
                            </h4>
                            <div className="servicios-details-grid">
                                <div className="servicios-detail-item servicios-detail-item-full">
                                    <span className="servicios-detail-value servicios-description-text">
                                        {servicio.descripcion || 'Sin descripción'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {servicio.imagen && (
                            <div className="servicios-details-section servicios-image-section">
                                <h4 className="servicios-details-section-title">
                                    <span className="section-icon">🖼️</span>
                                    Imagen del Servicio
                                </h4>
                                <div className="servicios-image-container">
                                    <img
                                        src={getImageUrl(servicio.imagen)}
                                        alt={`Imagen de ${servicio.nombre}`}
                                        className="servicios-detail-image"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                    <div className="servicios-image-placeholder" style={{ display: servicio.imagen ? 'none' : 'flex' }}>
                                        📷 No hay imagen disponible
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ServicioAdminDetalleModal;