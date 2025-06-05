// src/features/roles/components/RolesTable.jsx
import React from 'react';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

// Ajustamos los nombres de las props para que coincidan con lo que pasamos desde ListaRolesPage.jsx
const RolesTable = ({ roles, onView, onEdit, onDeleteConfirm, onToggleAnular }) => {
  return (
    <table className="rol-table">
      <thead>
        <tr>
          <th>Nombre del Rol</th>
          <th>Descripción</th>
          <th>Módulos Asignados</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {/* Verificamos que 'roles' sea un array antes de mapear */}
        {Array.isArray(roles) && roles.map((rol) => (
          // CORRECCIÓN 1: La key única debe ser 'rol.idRol' según tu base de datos.
          <tr key={rol.idRol}>
            <td>{rol.nombre}</td>
            <td>{rol.descripcion}</td>
            <td>
              {/* CORRECCIÓN 2: 'rol.permisos' es un array de objetos. Mapeamos para obtener el 'nombre'. */}
              {(() => {
                const permisos = rol.permisos || [];
                const nombresPermisos = permisos.map(p => p.nombre);
                if (nombresPermisos.length > 3) {
                  return `${nombresPermisos.slice(0, 3).join(', ')}...`;
                }
                return nombresPermisos.join(', ') || 'Ninguno';
              })()}
            </td>
            <td>
              {rol.nombre !== "Administrador" ? (
                <label className="switch">
                  <input
                    type="checkbox"
                    // CORRECIÓN 3: Usamos 'rol.estado' y lo invertimos para el visual del switch si es necesario (ej. si 'anulado' es opuesto a 'activo')
                    // Asumiendo que 'estado: true' es Activo y 'estado: false' es Inactivo/Anulado.
                    checked={rol.estado}
                    // CORRECIÓN 4: La función espera el objeto 'rol' completo.
                    onChange={() => onToggleAnular(rol)}
                  />
                  <span className="slider"></span>
                </label>
              ) : (
                <span>No Aplicable</span>
              )}
            </td>
            <td>
              <div className="rol-table-iconos">
                <button className="rol-table-button" onClick={() => onView(rol)} title="Ver Detalles">
                  <FaEye />
                </button>
                {/* La lógica para deshabilitar botones en el rol "Administrador" se mantiene */}
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