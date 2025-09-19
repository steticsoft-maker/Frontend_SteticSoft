// ========================================================
// ============= EJEMPLO DE MIGRACIÓN COMPLETA =============
// ========================================================

// Este archivo muestra cómo migrar completamente un componente
// de un módulo específico para usar los estilos unificados

import React from "react";
import { FaEye, FaTrash, FaEdit } from "react-icons/fa";

// ========================================================
// ============= ANTES: COMPONENTE CON CLASES ESPECÍFICAS =============
// ========================================================

const UsuariosTableAntes = ({
  usuarios,
  onView,
  onEdit,
  onDeleteConfirm,
  onToggleAnular,
}) => {
  return (
    <div className="usuarios-container">
      <div className="usuarios-content">
        <h1>Gestión de Usuarios</h1>
        <div className="usuarios-accionesTop">
          <input
            type="text"
            placeholder="Buscar usuarios..."
            className="usuarios-barraBusqueda"
          />
          <div className="usuarios-filtro-estado">
            <span>Estado: </span>
            <select className="usuarios-filtro-estado select">
              <option value="todos">Todos</option>
              <option value="activos">Activos</option>
              <option value="inactivos">Inactivos</option>
            </select>
          </div>
          <button className="usuarios-botonAgregar">Crear Usuario</button>
        </div>

        <table className="usuarios-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombres</th>
              <th>Apellidos</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario, index) => (
              <tr key={usuario.id}>
                <td data-label="#">{index + 1}</td>
                <td data-label="Nombres:">{usuario.nombre}</td>
                <td data-label="Apellidos:">{usuario.apellido}</td>
                <td data-label="Correo:">{usuario.correo}</td>
                <td data-label="Rol:">{usuario.rol}</td>
                <td data-label="Estado:">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={usuario.activo}
                      onChange={() => onToggleAnular(usuario)}
                    />
                    <span className="slider"></span>
                  </label>
                </td>
                <td data-label="Acciones:">
                  <div className="usuarios-table-iconos">
                    <button
                      className="usuarios-table-button btn-view"
                      onClick={() => onView(usuario)}
                      title="Ver detalles"
                    >
                      <FaEye />
                    </button>
                    <button
                      className="usuarios-table-button btn-edit"
                      onClick={() => onEdit(usuario)}
                      title="Editar"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="usuarios-table-button usuarios-table-button-delete"
                      onClick={() => onDeleteConfirm(usuario)}
                      title="Eliminar"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ========================================================
// ============= DESPUÉS: COMPONENTE CON CLASES UNIFICADAS =============
// ========================================================

const UsuariosTableDespues = ({
  usuarios,
  onView,
  onEdit,
  onDeleteConfirm,
  onToggleAnular,
}) => {
  return (
    <div className="admin-crud-container">
      <div className="admin-crud-content">
        <h1>Gestión de Usuarios</h1>

        {/* Barra de acciones unificada */}
        <div className="admin-crud-actions-bar">
          <div className="admin-crud-filters">
            <div className="admin-crud-search-bar">
              <input
                type="text"
                placeholder="Buscar usuarios..."
                className="admin-crud-search-input"
              />
            </div>
            <div className="admin-crud-filter-group">
              <span className="admin-crud-filter-label">Estado:</span>
              <select className="admin-crud-filter-select">
                <option value="todos">Todos</option>
                <option value="activos">Activos</option>
                <option value="inactivos">Inactivos</option>
              </select>
            </div>
          </div>
          <button className="admin-crud-add-button">
            <span>Crear Usuario</span>
          </button>
        </div>

        {/* Tabla unificada */}
        <div className="admin-crud-table-container">
          <table className="admin-crud-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombres</th>
                <th>Apellidos</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario, index) => (
                <tr key={usuario.id}>
                  <td data-label="#">{index + 1}</td>
                  <td data-label="Nombres:">{usuario.nombre}</td>
                  <td data-label="Apellidos:">{usuario.apellido}</td>
                  <td data-label="Correo:">{usuario.correo}</td>
                  <td data-label="Rol:">{usuario.rol}</td>
                  <td data-label="Estado:">
                    <label className="admin-crud-switch">
                      <input
                        type="checkbox"
                        checked={usuario.activo}
                        onChange={() => onToggleAnular(usuario)}
                      />
                      <span className="admin-crud-slider"></span>
                    </label>
                  </td>
                  <td data-label="Acciones:">
                    <div className="admin-crud-table-actions">
                      <button
                        className="admin-crud-action-button btn-view"
                        onClick={() => onView(usuario)}
                        title="Ver detalles"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="admin-crud-action-button btn-edit"
                        onClick={() => onEdit(usuario)}
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="admin-crud-action-button btn-delete"
                        onClick={() => onDeleteConfirm(usuario)}
                        title="Eliminar"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ========================================================
// ============= MODAL DE FORMULARIO UNIFICADO =============
// ========================================================

const UsuarioFormModalDespues = ({ isOpen, onClose, onSubmit, usuario }) => {
  if (!isOpen) return null;

  return (
    <div className="admin-crud-modal-overlay">
      <div className="admin-crud-modal-content form-modal">
        <div className="admin-crud-modal-header">
          <h2 className="admin-crud-modal-title">
            {usuario ? "Editar Usuario" : "Crear Usuario"}
          </h2>
          <button
            className="admin-crud-modal-close-button"
            onClick={onClose}
            title="Cerrar"
          >
            ×
          </button>
        </div>

        <div className="admin-crud-modal-body">
          <div className="admin-crud-form-content">
            <form onSubmit={onSubmit}>
              <div className="admin-crud-form-grid">
                <div className="admin-crud-form-group">
                  <label className="admin-crud-form-label">
                    Nombres <span className="required-asterisk">*</span>
                  </label>
                  <input
                    type="text"
                    className="admin-crud-form-input"
                    placeholder="Ingrese los nombres"
                    required
                  />
                </div>

                <div className="admin-crud-form-group">
                  <label className="admin-crud-form-label">
                    Apellidos <span className="required-asterisk">*</span>
                  </label>
                  <input
                    type="text"
                    className="admin-crud-form-input"
                    placeholder="Ingrese los apellidos"
                    required
                  />
                </div>

                <div className="admin-crud-form-group full-width">
                  <label className="admin-crud-form-label">
                    Correo Electrónico{" "}
                    <span className="required-asterisk">*</span>
                  </label>
                  <input
                    type="email"
                    className="admin-crud-form-input"
                    placeholder="usuario@ejemplo.com"
                    required
                  />
                </div>

                <div className="admin-crud-form-group">
                  <label className="admin-crud-form-label">
                    Rol <span className="required-asterisk">*</span>
                  </label>
                  <select className="admin-crud-form-select" required>
                    <option value="">Seleccione un rol</option>
                    <option value="admin">Administrador</option>
                    <option value="user">Usuario</option>
                  </select>
                </div>

                <div className="admin-crud-form-group">
                  <label className="admin-crud-form-label">Teléfono</label>
                  <input
                    type="tel"
                    className="admin-crud-form-input"
                    placeholder="Número de teléfono"
                  />
                </div>
              </div>

              <div className="admin-crud-form-actions">
                <button
                  type="button"
                  className="admin-crud-form-button-cancel"
                  onClick={onClose}
                >
                  Cancelar
                </button>
                <button type="submit" className="admin-crud-form-button-save">
                  {usuario ? "Actualizar" : "Crear"} Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// ========================================================
// ============= MODAL DE DETALLES UNIFICADO =============
// ========================================================

const UsuarioDetailsModalDespues = ({ isOpen, onClose, usuario }) => {
  if (!isOpen || !usuario) return null;

  return (
    <div className="admin-crud-modal-overlay">
      <div className="admin-crud-modal-content details-modal">
        <div className="admin-crud-modal-header">
          <h2 className="admin-crud-modal-title">Detalles del Usuario</h2>
          <button
            className="admin-crud-modal-close-button"
            onClick={onClose}
            title="Cerrar"
          >
            ×
          </button>
        </div>

        <div className="admin-crud-modal-body">
          <div className="admin-crud-details-content">
            <p>
              <strong>ID:</strong> {usuario.id}
            </p>
            <p>
              <strong>Nombres:</strong> {usuario.nombre}
            </p>
            <p>
              <strong>Apellidos:</strong> {usuario.apellido}
            </p>
            <p>
              <strong>Correo:</strong> {usuario.correo}
            </p>
            <p>
              <strong>Rol:</strong> {usuario.rol}
            </p>
            <p>
              <strong>Teléfono:</strong> {usuario.telefono || "No especificado"}
            </p>
            <p>
              <strong>Estado:</strong> {usuario.activo ? "Activo" : "Inactivo"}
            </p>
            <p>
              <strong>Fecha de Creación:</strong> {usuario.fechaCreacion}
            </p>
          </div>

          <button className="admin-crud-modal-button-close" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export {
  UsuariosTableAntes,
  UsuariosTableDespues,
  UsuarioFormModalDespues,
  UsuarioDetailsModalDespues,
};

// ========================================================
// ============= RESUMEN DE CAMBIOS =============
// ========================================================

/*
CAMBIOS PRINCIPALES:

1. CONTENEDORES:
   - .usuarios-container → .admin-crud-container
   - .usuarios-content → .admin-crud-content

2. BARRA DE ACCIONES:
   - .usuarios-accionesTop → .admin-crud-actions-bar
   - .usuarios-barraBusqueda → .admin-crud-search-input
   - .usuarios-botonAgregar → .admin-crud-add-button

3. TABLA:
   - .usuarios-table → .admin-crud-table
   - .usuarios-table-iconos → .admin-crud-table-actions
   - .usuarios-table-button → .admin-crud-action-button

4. MODALES:
   - .usuarios-modalOverlay → .admin-crud-modal-overlay
   - .usuarios-modalContent → .admin-crud-modal-content

5. FORMULARIOS:
   - .usuarios-form-grid-container → .admin-crud-form-grid
   - .usuarios-form-group → .admin-crud-form-group
   - .usuarios-form-input → .admin-crud-form-input

BENEFICIOS:
- Diseño consistente en todos los módulos
- Fácil mantenimiento
- Mejor experiencia de usuario
- Código más limpio y organizado
*/
