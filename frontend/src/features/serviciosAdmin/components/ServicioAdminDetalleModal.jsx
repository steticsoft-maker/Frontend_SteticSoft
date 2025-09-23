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
            <div className="details-modal-content" onClick={(e) => e.stopPropagation()}>
                
                <button className="details-modal-close-button" onClick={onClose} aria-label="Cerrar modal">
                    &times;
                </button>

                <h3>Detalles del Servicio</h3>

                <div className="details-list">
                    <p><strong>Nombre:</strong> {servicio.nombre || 'N/A'}</p>
                    <p><strong>Descripción:</strong> {servicio.descripcion || 'Sin descripción'}</p>
                    <p><strong>Precio:</strong> {formatCurrency(servicio.precio)}</p>
                    <p><strong>Categoría:</strong> {servicio.categoria?.nombre || 'Sin categoría'}</p>
                </div>
                
                <div className="details-image-container">
                    <strong>Imagen:</strong>
                    {servicio.imagen ? (
                        <img
                            src={getImageUrl(servicio.imagen)}
                            alt={`Imagen de ${servicio.nombre}`}
                            className="details-image"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                    ) : null}
                    <div className="details-image-placeholder" style={{ display: servicio.imagen ? 'none' : 'flex' }}>
                        📷 No hay imagen disponible
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ServicioAdminDetalleModal;