// src/features/roles/components/RolDetailsModal.jsx
import React from 'react';

const RolDetailsModal = ({ isOpen, onClose, role }) => {
  // Guarda de entrada: Si no está abierto o no hay datos del rol, no renderizar nada.
  if (!isOpen || !role) {
    return null;
  }

  // Estructura de datos esperada del API (ejemplo):
  // role = {
  //   idRol: 1,
  //   nombre: "Administrador",
  //   descripcion: "Acceso total",
  //   estado: true,
  //   permisos: [ { idPermiso: 1, nombre: "MODULO_ROLES_GESTIONAR" }, ... ]
  // }

  return (
    <div className="rol-modalOverlay">
      <div className="rol-modalContent rol-modalContent-details">
        <button type="button" className="modal-close-button-x" onClick={onClose}>
          &times;
        </button>
        <h2>Detalles del Rol</h2>
        <p><strong>Nombre:</strong> {role.nombre || 'N/A'}</p>
        <p><strong>Descripción:</strong> {role.descripcion || 'Sin descripción'}</p>
        <div>
          <strong>Módulos Asignados:</strong>
          {/* Hacemos una comprobación segura de que `role.permisos` es un array y tiene elementos */}
          {(role.permisos && role.permisos.length > 0) ? (
            <ul className="rol-listaModulosDetalle">
              {/* Mapeamos el array de permisos */}
              {role.permisos.map((permiso) => (
                // Usamos el idPermiso como key para un renderizado más eficiente y seguro
                <li key={permiso.idPermiso}>{permiso.nombre}</li>
              ))}
            </ul>
          ) : (
            <p style={{ marginLeft: '10px', fontStyle: 'italic' }}>Ninguno</p>
          )}
        </div>
        <p><strong>Estado:</strong> {role.estado ? "Activo" : "Inactivo"}</p>
        <button className="rol-modalButton-cerrar" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default RolDetailsModal;