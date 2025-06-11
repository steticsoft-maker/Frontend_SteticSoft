// src/features/usuarios/components/UsuariosTable.jsx
import React from "react";
import { FaEye, FaTrash, FaEdit } from "react-icons/fa";

const UsuariosTable = ({
  usuarios,
  onView,
  onEdit,
  onDeleteConfirm,
  onToggleAnular,
}) => {
  return (
    <table className="usuarios-table">
      <thead>
        <tr>
          <th>Nombres</th>
          <th>Apellidos</th>
          <th>Correo Electrónico</th> {/* Este es el correo de la cuenta de usuario */}
          <th>Rol</th>
          <th>Teléfono</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {usuarios.map((usuario) => {
          // 'perfil' contendrá los datos específicos del cliente o empleado
          const perfil = usuario.clienteInfo || usuario.empleadoInfo || {};

          const nombreRol = usuario.rol?.nombre || "No asignado";
          const estaActivo = typeof usuario.estado === 'boolean' ? usuario.estado : false;

          return (
            <tr key={usuario.idUsuario}>
              {/* Ahora usamos la variable 'perfil' para acceder a los datos */}
              <td data-label="Nombres:">{perfil.nombre || 'N/A'}</td>
              <td data-label="Apellidos:">{perfil.apellido || 'N/A'}</td> {/* Muestra el apellido */}
              {/* Aquí se muestra el correo de la cuenta de usuario, que debería ser el mismo que el del perfil */}
              <td data-label="Correo:">{usuario.correo || 'N/A'}</td> 
              <td data-label="Rol:">{nombreRol}</td>
              <td data-label="Teléfono:">{perfil.telefono || 'N/A'}</td> {/* Muestra el teléfono */}
              <td data-label="Estado:">
                {nombreRol !== "Administrador" ? (
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={estaActivo}
                      onChange={() => onToggleAnular(usuario)}
                      title={estaActivo ? "Desactivar usuario" : "Activar usuario"}
                    />
                    <span className="slider"></span>
                  </label>
                ) : (
                  <span>Activo</span>
                )}
              </td>
              <td data-label="Acciones:">
                <div className="usuarios-table-iconos">
                  <button
                    className="usuarios-table-button"
                    onClick={() => onView(usuario)}
                    title="Ver Detalles"
                  >
                    <FaEye />
                  </button>
                  {nombreRol !== "Administrador" && (
                    <>
                      <button
                        className="usuarios-table-button"
                        onClick={() => onEdit(usuario)}
                        title="Editar Usuario"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="usuarios-table-button usuarios-table-button-delete"
                        onClick={() => onDeleteConfirm(usuario)}
                        title="Desactivar Usuario"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default UsuariosTable;