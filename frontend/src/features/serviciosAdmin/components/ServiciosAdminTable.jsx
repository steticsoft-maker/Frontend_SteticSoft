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

  // 🔑 Función para construir URL de imagen
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // Si ya es una URL completa (http o https)
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Para rutas relativas, concatenar con API_URL
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
      
      {/* Modal de preview de imagen */}
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