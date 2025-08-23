import React from 'react';
import { FaRegEye, FaEdit, FaTrashAlt } from 'react-icons/fa';

const ServiciosAdminTable = ({
  servicios,
  onView,
  onEdit,
  onDeleteConfirm,
  onToggleEstado,
  loadingId,
}) => {
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(parseFloat(value) || 0);
  };

  if (!servicios || servicios.length === 0) {
    return <p style={{ textAlign: 'center', marginTop: '20px' }}>No hay servicios que coincidan con tu búsqueda.</p>;
  }

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

  return (
    <table className="servicios-admin-table">
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
          // Construye la URL completa solo si la imagen no es una URL absoluta
          const imageUrl = servicio.imagen?.startsWith('http')
            ? servicio.imagen
            : `${API_BASE_URL}${servicio.imagen}`;

          return (
            <tr key={servicio.idServicio}>
              <td data-label="#">{index + 1}</td>
              <td data-label="Imagen:">
                <div className="image-cell-container">
                  {servicio.imagen ? (
                    <img 
                      src={imageUrl} 
                      alt={`Imagen de ${servicio.nombre}`} 
                      className="servicio-imagen-thumbnail"
                    />
                  ) : (
                    <span className="image-placeholder">-</span>
                  )}
                </div>
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
                <div className="actions-cell">
                  <button onClick={() => onView(servicio)}> <FaRegEye /> </button>
                  <button onClick={() => onEdit(servicio)}> <FaEdit /> </button>
                  <button onClick={() => onDeleteConfirm(servicio)}> <FaTrashAlt /> </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ServiciosAdminTable;