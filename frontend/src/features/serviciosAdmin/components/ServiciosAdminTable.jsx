// src/features/serviciosAdmin/components/ServiciosAdminTable.jsx
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
  if (!servicios || servicios.length === 0) {
    return <p>No hay servicios para mostrar.</p>;
  }

  const formatCurrency = (value) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) {
      return 'N/A';
    }
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(numericValue);
  };

  const getFullImageUrl = (relativePath) => {
    if (!relativePath) return null;
    return `http://localhost:3000/${relativePath}`;
  };

  return (
    <table className="tablaServicio">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Categoría</th>
          <th>Imagen</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {servicios.map((servicio) => (
          <tr key={servicio.idServicio}>
            <td data-label="Nombre:">{servicio.nombre}</td>
            <td data-label="Precio:">{formatCurrency(servicio.precio)}</td>
            <td data-label="Categoría:">
              {servicio.categoria?.nombre || 'N/A'}
            </td>
            <td data-label="Imagen:">
              {servicio.imagen ? (
                <img
                  src={getFullImageUrl(servicio.imagen)}
                  alt={servicio.nombre}
                  className="servicio-table-imagen"
                />
              ) : (
                'Sin Imagen'
              )}
            </td>
            <td data-label="Estado:">
              <label className="switch" title={servicio.estado ? 'Desactivar' : 'Activar'}>
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
              <div className="servicios-admin-actions">
                <button
                  className="botonVerDetallesServicios"
                  onClick={() => onView(servicio)}
                  title="Ver Detalles"
                  disabled={loadingId === servicio.idServicio}
                >
                  <FaRegEye />
                </button>
                <button
                  className="botonEditarServicios"
                  onClick={() => onEdit(servicio)}
                  title="Editar Servicio"
                  disabled={loadingId === servicio.idServicio}
                >
                  <FaEdit />
                </button>
                <button
                  className="botonEliminarServicios"
                  onClick={() => onDeleteConfirm(servicio)}
                  title="Eliminar Servicio"
                  disabled={loadingId === servicio.idServicio}
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