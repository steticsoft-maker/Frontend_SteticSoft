import React from 'react';
import { FaRegEye, FaEdit, FaTrashAlt } from 'react-icons/fa';

// Este componente de helper ya no es necesario, la lógica se simplifica inline.

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

  const getFullImageUrl = (relativePath) => {
    if (!relativePath) return null;
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
    return `${backendUrl}/${relativePath}`;
  };

  // Fallback para imágenes rotas
  const handleImageError = (e) => {
    e.target.onerror = null; 
    e.target.src = "https://via.placeholder.com/150?text=Error"; // Muestra una imagen de error si la URL existe pero está rota
  };

  if (!servicios || servicios.length === 0) {
    return <p style={{ textAlign: 'center', marginTop: '20px' }}>No hay servicios que coincidan con tu búsqueda.</p>;
  }

  return (
    <table className="servicios-admin-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Imagen</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {servicios.map((servicio, index) => (
          <tr key={servicio.idServicio}>
            <td data-label="#">{index + 1}</td>
            <td data-label="Nombre:">{servicio.nombre}</td>
            <td data-label="Precio:">{formatCurrency(servicio.precio)}</td>
            
            {/* CAMBIO CLAVE: Lógica condicional para la celda de la imagen */}
            <td data-label="Imagen:">
              {servicio.imagen ? (
                <img
                  src={getFullImageUrl(servicio.imagen)}
                  alt={servicio.nombre}
                  className="table-img"
                  onError={handleImageError}
                />
              ) : (
                <span style={{ color: '#aaa' }}>N/A</span>
              )}
            </td>

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
        ))}
      </tbody>
    </table>
  );
};

export default ServiciosAdminTable;