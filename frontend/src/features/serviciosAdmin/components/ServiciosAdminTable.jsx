// src/features/serviciosAdmin/components/ServiciosAdminTable.jsx
import React from 'react';
import { FaRegEye, FaEdit, FaTrashAlt, FaImage } from 'react-icons/fa';
import '../css/ServiciosAdmin.css';

const API_URL = import.meta.env.VITE_API_URL;

const ServiciosAdminTable = ({
  servicios,
  onView,
  onEdit,
  onDeleteConfirm,
  onToggleEstado,
  loadingId,
}) => {
  const getFullImageUrl = (relativeUrl) => {
    if (!relativeUrl) return '';
    return `${API_URL}${relativeUrl}`;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(parseFloat(value) || 0);
  };

  if (!servicios || servicios.length === 0) {
    return (
      <p className="no-servicios-msg">
        No hay servicios que coincidan con tu búsqueda.
      </p>
    );
  }

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
        {servicios.map((servicio, index) => (
          <tr key={servicio.idServicio}>
            <td data-label="#">{index + 1}</td>
            <td data-label="Imagen:">
              <div className="service-image-container">
                {servicio.imagenUrl ? (
                  <img 
                    src={getFullImageUrl(servicio.imagenUrl)} 
                    alt={servicio.nombre} 
                    className="service-thumbnail"
                  />
                ) : (
                  <div className="image-placeholder">
                    <FaImage />
                  </div>
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
                <button
                  className="btn-ver"
                  onClick={() => onView(servicio)}
                  title="Ver Detalles"
                >
                  <FaRegEye />
                </button>
                <button
                  className="btn-editar"
                  onClick={() => onEdit(servicio)}
                  title="Editar Servicio"
                >
                  <FaEdit />
                </button>
                <button
                  className="btn-eliminar"
                  onClick={() => onDeleteConfirm(servicio)}
                  title="Eliminar Servicio"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ServiciosAdminTable;
