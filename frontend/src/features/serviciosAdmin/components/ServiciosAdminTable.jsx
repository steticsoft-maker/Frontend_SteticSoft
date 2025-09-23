// src/features/serviciosAdmin/components/ServiciosAdminTable.jsx
import React, { useState } from 'react';
import { FaRegEye, FaEdit, FaTrashAlt } from 'react-icons/fa'; // Se quita FaImage porque ya no se usa
import '../css/ServiciosAdmin.css';
import "../../../shared/styles/table-common.css";

const API_URL = import.meta.env.VITE_API_URL;

const ServiciosAdminTable = ({
  servicios,
  onView,
  onEdit,
  onDeleteConfirm,
  onToggleEstado,
  loadingId,
}) => {
  const [imageErrors, setImageErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(parseFloat(value) || 0);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `${API_URL}${imagePath}`;
  };

  const handleImageError = (servicioId) => {
    setImageErrors(prev => ({ ...prev, [servicioId]: true }));
  };

  const handleImageClick = (imageUrl, servicioNombre) => {
    setPreviewImage({ url: imageUrl, nombre: servicioNombre });
  };

  const closePreview = () => {
    setPreviewImage(null);
  };

  if (!servicios || servicios.length === 0) {
    return (
      <p className="no-servicios-msg">
        No hay servicios que coincidan con tu búsqueda.
      </p>
    );
  }

  return (
    <>
      <div className="table-container">
        <table className="table-main">
        <thead>
          <tr>
            <th>#</th>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {servicios.map((servicio, index) => {
            const imageUrl = getImageUrl(servicio.imagen);
            const hasImageError = imageErrors[servicio.idServicio];
            
            return (
              <tr key={servicio.idServicio}>
                <td data-label="#">{index + 1}</td>
                <td data-label="Imagen:" className="servicio-imagen-cell">
                  {imageUrl && !hasImageError ? (
                    <img 
                      src={imageUrl} 
                      alt={servicio.nombre}
                      className="servicio-tabla-imagen"
                      onError={() => handleImageError(servicio.idServicio)}
                      onClick={() => handleImageClick(imageUrl, servicio.nombre)}
                      title="Click para ver imagen completa"
                    />
                  ) : (
                    <div className="servicio-sin-imagen">
                      {hasImageError ? '❌ Error' : '📷 Sin imagen'}
                    </div>
                  )}
                </td>
                <td data-label="Nombre:">{servicio.nombre}</td>
                <td data-label="Precio:">{formatCurrency(servicio.precio)}</td>
                <td data-label="Estado:">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={servicio.estado}
                      onChange={() => onToggleEstado(servicio)}
                      disabled={loadingId === servicio.idServicio}
                    />
                    <span className="slider"></span>
                  </label>
                </td>
            <td data-label="Acciones:">
              <div className="table-iconos">
                <button
                  className="table-button btn-view"
                  onClick={() => onView(servicio)}
                  title="Ver Detalles"
                >
                  <FaRegEye />
                </button>
                <button
                  className="table-button btn-edit"
                  onClick={() => onEdit(servicio)}
                  title="Editar Servicio"
                >
                  <FaEdit />
                </button>
                <button
                  className="table-button btn-delete"
                  onClick={() => onDeleteConfirm(servicio)}
                  title="Eliminar Servicio"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </td>
          </tr>
          );
        })}
        </tbody>
        </table>
      </div>
      
      <div className="mobile-cards">
        {servicios.map((servicio) => {
          const imageUrl = getImageUrl(servicio.imagen);
          const hasImageError = imageErrors[servicio.idServicio];
          
          return (
            <div key={servicio.idServicio} className="servicio-mobile-card">
              <div className="servicio-mobile-header">
                {imageUrl && !hasImageError ? (
                  <img 
                    src={imageUrl} 
                    alt={servicio.nombre}
                    className="servicio-mobile-image"
                    onError={() => handleImageError(servicio.idServicio)}
                  />
                ) : (
                  <div className="servicio-mobile-image-placeholder">
                    📷
                  </div>
                )}
                <div className="servicio-mobile-info">
                  <h3>{servicio.nombre}</h3>
                  <p>{servicio.categoria?.nombre || 'Sin categoría'}</p>
                </div>
              </div>
              
              <div className="servicio-mobile-details">
                <div className="servicio-mobile-detail">
                  <span className="servicio-mobile-detail-label">Precio:</span>
                  <span className="servicio-mobile-detail-value">{formatCurrency(servicio.precio)}</span>
                </div>
                <div className="servicio-mobile-detail">
                  <span className="servicio-mobile-detail-label">Estado:</span>
                  <span className="servicio-mobile-detail-value">
                    {servicio.estado ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
              
              <div className="servicio-mobile-actions">
                <button 
                  className="servicio-mobile-button btn-view"
                  onClick={() => onView(servicio)}
                  title="Ver detalles"
                >
                  👁️ Ver
                </button>
                <button 
                  className="servicio-mobile-button btn-edit"
                  onClick={() => onEdit(servicio)}
                  title="Editar servicio"
                >
                  ✏️ Editar
                </button>
                <button 
                  className="servicio-mobile-button btn-delete"
                  onClick={() => onDeleteConfirm(servicio)}
                  title="Eliminar servicio"
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    
      {previewImage && (
        <div className="image-preview-modal" onClick={closePreview}>
          <div className="image-preview-content" onClick={(e) => e.stopPropagation()}>
            <button className="image-preview-close" onClick={closePreview}>
              ×
            </button>
            <h3>{previewImage.nombre}</h3>
            <img 
              src={previewImage.url} 
              alt={previewImage.nombre}
              className="image-preview-img"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ServiciosAdminTable;