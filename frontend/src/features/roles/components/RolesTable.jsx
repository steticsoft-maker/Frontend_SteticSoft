// src/features/roles/components/RolesTable.jsx
import React from 'react';
import { FaEye, FaTrash, FaEdit } from 'react-icons/fa';

const RolesTable = ({ roles, onView, onEdit, onDeleteConfirm, onToggleAnular }) => {
  return (
    <table className="rol-table">
      <thead>
        <tr>
          <th>Nombre del Rol</th>
          <th>Descripción</th>
          <th>Módulos Asignados</th>
          <th>Estado (Anulado)</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {roles.map((rol) => (
          <tr key={rol.id}>
            <td>{rol.nombre}</td>
            <td>{rol.descripcion}</td>
            <td>
              {(rol.permisos || []).length > 3
                ? `${(rol.permisos || []).slice(0, 3).join(', ')}...`
                : (rol.permisos || []).join(', ') || 'Ninguno'}
            </td>
            <td>
              {rol.nombre !== "Administrador" ? (
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={rol.anulado}
                    onChange={() => onToggleAnular(rol.id)}
                  />
                  <span className="slider"></span>
                </label>
              ) : (
                <span>No Anulable</span>
              )}
            </td>
            <td>
              <div className="rol-table-iconos">
                <button className="rol-table-button" onClick={() => onView(rol)} title="Ver Detalles">
                  <FaEye />
                </button>
                {rol.nombre !== "Administrador" && (
                  <>
                    <button className="rol-table-button" onClick={() => onEdit(rol)} title="Editar Rol">
                      <FaEdit />
                    </button>
                    <button className="rol-table-button rol-table-button-delete" onClick={() => onDeleteConfirm(rol)} title="Eliminar Rol">
                      <FaTrash />
                    </button>
                  </>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RolesTable;