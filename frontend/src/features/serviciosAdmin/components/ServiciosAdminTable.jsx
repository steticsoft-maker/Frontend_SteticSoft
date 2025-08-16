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

  return (
    <table className="servicios-admin-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Precio</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {servicios.map((servicio, index) => (
          // Corregido: se usa id_servicio como la clave
          <tr key={servicio.id_servicio}>
            <td data-label="#">{index + 1}</td>
            <td data-label="Nombre:">{servicio.nombre}</td>
            <td data-label="Descripción:">{servicio.descripcion || 'Sin descripción'}</td>
            <td data-label="Precio:">{formatCurrency(servicio.precio)}</td>
            <td data-label="Estado:">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={servicio.estado}
                  // Corregido: se usa id_servicio en el manejador de eventos
                  onChange={() => onToggleEstado(servicio)}
                  // Corregido: se usa id_servicio para deshabilitar el botón
                  disabled={loadingId === servicio.id_servicio}
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
