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
          <th>Tipo Doc.</th>
          <th># Documento</th>
          <th>Nombre</th>
          <th>Email</th>
          <th>Teléfono</th>
          <th>Estado (Anulado)</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {usuarios.map((usuario) => (
          <tr key={usuario.id}>
            <td>{usuario.tipoDocumento}</td>
            <td>{usuario.documento}</td>
            <td>{usuario.nombre}</td>
            <td>{usuario.email}</td>
            <td>{usuario.telefono}</td>
            <td>
              {usuario.rol !== "Administrador" ? (
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={usuario.anulado}
                    onChange={() => onToggleAnular(usuario.id)}
                  />
                  <span className="slider"></span>
                </label>
              ) : (
                <span>Activo</span> // Admin siempre activo y no anulable
              )}
            </td>
            <td>
              <div className="usuarios-table-iconos">
                <button
                  className="usuarios-table-button"
                  onClick={() => onView(usuario)}
                  title="Ver Detalles"
                >
                  <FaEye />
                </button>
                {usuario.rol !== "Administrador" && (
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
                      title="Eliminar Usuario"
                    >
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

export default UsuariosTable;
