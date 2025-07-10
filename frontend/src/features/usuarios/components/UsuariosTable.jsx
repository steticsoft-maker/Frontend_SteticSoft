// src/features/usuarios/components/UsuariosTable.jsx
import React from "react";
// Import FaUserLock and FaBomb if using react-icons, or ensure Font Awesome is linked for <i> tags
// For this example, we'll assume Font Awesome is globally available for <i> tags
// import { FaEye, FaEdit, FaUserLock, FaBomb } from "react-icons/fa";
import { FaEye, FaEdit } from "react-icons/fa"; // FaTrash removed as per new buttons
import { useAuth } from "../../../shared/contexts/AuthContext"; // Import useAuth
import Tooltip from "../../../shared/components/Tooltip"; // Assuming Tooltip component exists

const UsuariosTable = ({
  usuarios,
  onView, // Mantener onView si existe y se usa
  onEditar, // Renombrado de onEdit para consistencia con el prompt
  onToggleEstado, // Nuevo prop para el switch
  onDesactivar, // Nuevo prop para Soft Delete
  onEliminarFisico, // Nuevo prop para Hard Delete
  currentPage = 1,
  rowsPerPage = 10,
}) => {
  const { authState } = useAuth(); // Obtener el estado de autenticación

  return (
    <table className="usuarios-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Nombres</th>
          <th>Apellidos</th>
          <th>Correo Electrónico</th>
          <th>Rol</th>
          <th>Teléfono</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {usuarios.map((usuario, index) => {
          const numeroFila = (currentPage - 1) * rowsPerPage + index + 1;
          const perfil = usuario.clienteInfo || usuario.empleadoInfo || {};
          const nombreRol = usuario.rol?.nombre || "No asignado";
          const estaActivo = typeof usuario.estado === 'boolean' ? usuario.estado : false;

          // No se pueden realizar acciones de cambio de estado, desactivación o eliminación sobre el rol Administrador.
          const isUsuarioAdmin = nombreRol === "Administrador";

          return (
            <tr key={usuario.idUsuario}>
              <td data-label="#">{numeroFila}</td>
              <td data-label="Nombres:">{perfil.nombre || 'N/A'}</td>
              <td data-label="Apellidos:">{perfil.apellido || 'N/A'}</td>
              <td data-label="Correo:">{usuario.correo || 'N/A'}</td> 
              <td data-label="Rol:">{nombreRol}</td>
              <td data-label="Teléfono:">{perfil.telefono || 'N/A'}</td>
              <td data-label="Estado:">
                {/* El switch para cambiar estado (Activo <-> Inactivo) */}
                {!isUsuarioAdmin ? (
                  <Tooltip text={estaActivo ? 'Desactivar' : 'Activar'}>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={estaActivo}
                        onChange={() => onToggleEstado(usuario)}
                        // title ya no es necesario aquí si Tooltip funciona bien
                      />
                      <span className="slider round"></span>
                    </label>
                  </Tooltip>
                ) : (
                  // Los administradores siempre se muestran como activos y no se pueden desactivar desde aquí
                  <Tooltip text="El estado del Administrador no se puede cambiar desde aquí.">
                    <span>Activo</span>
                  </Tooltip>
                )}
              </td>
              <td data-label="Acciones:" className="actions-cell"> {/* Added actions-cell class if needed for styling */}
                <div className="usuarios-table-iconos">
                  {/* Botón Ver Detalles (si se mantiene) */}
                  <Tooltip text="Ver Detalles">
                    <button
                      className="usuarios-table-button icon-button" // Added icon-button for consistency
                      onClick={() => onView(usuario)}
                    >
                      <FaEye />
                    </button>
                  </Tooltip>

                  {/* Botón de Editar */}
                  {!isUsuarioAdmin && (
                    <Tooltip text="Editar">
                      <button
                        className="usuarios-table-button icon-button"
                        onClick={() => onEditar(usuario)}
                      >
                        <FaEdit />
                      </button>
                    </Tooltip>
                  )}

                  {/* Botón de Borrado Lógico (Soft Delete) - No para Admin */}
                  {!isUsuarioAdmin && (
                    <Tooltip text="Desactivar y Bloquear Acceso">
                      <button
                        className="icon-button soft-delete-button"
                        onClick={() => onDesactivar(usuario)}
                      >
                        <i className="fas fa-user-lock"></i>
                      </button>
                    </Tooltip>
                  )}

                  {/* Botón de Borrado Físico (Hard Delete) - SOLO para el rol 'Administrador' del sistema,
                      y no para el propio usuario Administrador listado */}
                  {authState.rol === 'Administrador' && !isUsuarioAdmin && (
                    <Tooltip text="Eliminar Permanentemente (IRREVERSIBLE)">
                      <button
                        className="icon-button hard-delete-button"
                        onClick={() => onEliminarFisico(usuario)}
                      >
                        <i className="fas fa-bomb"></i>
                      </button>
                    </Tooltip>
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
