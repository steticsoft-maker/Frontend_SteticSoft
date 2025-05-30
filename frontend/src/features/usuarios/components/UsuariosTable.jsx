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
            <td data-label="Tipo Doc.:">{usuario.tipoDocumento}</td>
            <td data-label="# Documento:">{usuario.documento}</td>
            <td data-label="Nombre:">{usuario.nombre}</td>
            <td data-label="Email:">{usuario.email}</td>
            <td data-label="Teléfono:">{usuario.telefono}</td>
            <td data-label="Estado (Anulado):">
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
            <td data-label="Acciones:">
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