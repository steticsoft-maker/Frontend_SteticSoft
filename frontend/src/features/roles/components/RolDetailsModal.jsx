// src/features/roles/components/RolDetailsModal.jsx
import React from 'react';
import { getModulosPermisos } from '../services/rolesService';

const RolDetailsModal = ({ isOpen, onClose, role }) => {
  const modulosDisponibles = getModulosPermisos(); // Para mapear nombres a descripciones si fuera necesario

  if (!isOpen || !role) return null;

  return (
    <div className="rol-modalOverlay">
      <div className="rol-modalContent rol-modalContent-details">
        <h2>Detalles del Rol</h2>
        <p><strong>Nombre:</strong> {role.nombre}</p>
        <p><strong>Descripción:</strong> {role.descripcion}</p>
        <div>
          <strong>Módulos Asignados:</strong>
          {(role.permisos && role.permisos.length > 0) ? (
            <ul className="rol-listaModulosDetalle">
              {role.permisos.map((permisoNombre, index) => (
                <li key={index}>{permisoNombre}</li>
              ))}
            </ul>
          ) : (
            <p>Ninguno</p>
          )}
        </div>
        <p><strong>Estado:</strong> {role.anulado ? "Inactivo (Anulado)" : "Activo"}</p>
        <button className="rol-modalButton-cerrar" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default RolDetailsModal;