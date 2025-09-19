// src/features/usuarios/components/UsuariosTable.jsx
import React from "react";
import { FaEye, FaTrash, FaEdit } from "react-icons/fa";
import "../../../shared/styles/table-common.css";

const UsuariosTable = ({
  usuarios,
  onView,
  onEdit,
  onDeleteConfirm,
  onToggleAnular,
  currentPage = 1, // Valor por defecto para currentPage
  rowsPerPage = 10, // Valor por defecto para rowsPerPage, ajustar si es necesario
}) => {
  return (
    <table className="usuarios-table">
      <thead>
        <tr>
          <th>#</th> {/* Nueva columna para numeración */}
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
          const nombreRol = usuario.rol?.nombre || "No asignado";
          const estaActivo =
            typeof usuario.estado === "boolean" ? usuario.estado : false;

          return (
            <tr key={usuario.idUsuario}>
              <td data-label="#">{numeroFila}</td>
              <td data-label="Nombres:">{usuario.nombre || "N/A"}</td>
              <td data-label="Apellidos:">{usuario.apellido || "N/A"}</td>
              <td data-label="Correo:">{usuario.correo || "N/A"}</td>
              <td data-label="Rol:">{nombreRol}</td>
              <td data-label="Teléfono:">{usuario.telefono || "N/A"}</td>
              <td data-label="Estado:">
                {nombreRol !== "Administrador" ? (
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={estaActivo}
                      onChange={() => onToggleAnular(usuario)}
                      title={
                        estaActivo ? "Desactivar usuario" : "Activar usuario"
                      }
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
                    className="usuarios-table-button btn-view"
                    onClick={() => onView(usuario)}
                    title="Ver Detalles"
                  >
                    <FaEye />
                  </button>
                  {nombreRol !== "Administrador" && (
                    <>
                      <button
                        className="usuarios-table-button btn-edit"
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
          );
        })}
      </tbody>
    </table>
  );
};

export default UsuariosTable;
