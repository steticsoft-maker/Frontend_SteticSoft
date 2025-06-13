import React from 'react';

const ServiciosAdminTable = ({
  servicios,
  onView,
  onEdit,
  onDeleteConfirm,
  onToggleEstado,
}) => {
  if (!servicios || servicios.length === 0) {
    return <p>No hay servicios para mostrar.</p>;
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <table className="tablaServicio">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Duración (min)</th>
          <th>Categoría</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {servicios.map((servicio) => (
          <tr key={servicio.idServicio}>
            <td data-label="Nombre:">{servicio.nombre}</td>
            <td data-label="Precio:">{formatCurrency(servicio.precio)}</td>
            <td data-label="Duración:">{servicio.duracionEstimadaMin} min</td>
            <td data-label="Categoría:">{servicio.categoria?.nombre || 'N/A'}</td>
            <td data-label="Estado:">
              <label className="switch" title={servicio.estado ? 'Desactivar' : 'Activar'}>
                <input
                  type="checkbox"
                  checked={servicio.estado}
                  onChange={() => onToggleEstado(servicio)}
                />
                <span className="slider"></span>
              </label>
            </td>
            <td data-label="Acciones:">
              <div className="servicios-admin-actions">
                <button className="botonVerDetallesServicios" onClick={() => onView(servicio)}>Ver</button>
                <button className="botonEditarServicios" onClick={() => onEdit(servicio)}>Editar</button>
                <button className="botonEliminarServicios" onClick={() => onDeleteConfirm(servicio)}>Eliminar</button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ServiciosAdminTable;