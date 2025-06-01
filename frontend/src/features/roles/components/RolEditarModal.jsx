// src/features/roles/components/RolEditarModal.jsx
import React, { useState, useEffect } from 'react';
import RolForm from './RolForm';
import { getModulosPermisos } from '../services/rolesService';

const RolEditarModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const modulosDisponibles = getModulosPermisos();

  const [formData, setFormData] = useState({ nombre: '', descripcion: '', permisos: [], anulado: false });
  const [modulosSeleccionadosIds, setModulosSeleccionadosIds] = useState([]);
  const [mostrarPermisos, setMostrarPermisos] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Determinar si el rol que se está editando es el "Administrador" protegido
  const isRoleAdminProtected = initialData?.nombre === "Administrador";

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        id: initialData.id,
        nombre: initialData.nombre || '',
        descripcion: initialData.descripcion || '',
        permisos: initialData.permisos || [], // Nombres de permisos
        anulado: initialData.anulado || false,
      });

      const selectedIds = modulosDisponibles
        .filter(m => (initialData.permisos || []).includes(m.nombre))
        .map(m => m.id);
      setModulosSeleccionadosIds(selectedIds);
      
      // Mostrar permisos si es Admin (para verlos) o si ya tiene permisos asignados
      setMostrarPermisos(isRoleAdminProtected || selectedIds.length > 0);
      setFormErrors({});
    } else if (isOpen && !initialData) {
      console.error("Modal de edición de rol abierto sin initialData. Cerrando.");
      onClose();
    }
  }, [isOpen, initialData, isRoleAdminProtected, modulosDisponibles, onClose]);

  const handleFormChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
     if (formErrors[name]) {
      setFormErrors(prevErr => ({ ...prevErr, [name]: '' }));
    }
  };

  const handleToggleModulo = (moduloId) => {
    if (isRoleAdminProtected) return; // No permitir cambiar permisos del rol Admin
    setModulosSeleccionadosIds(prev =>
      prev.includes(moduloId) ? prev.filter(id => id !== moduloId) : [...prev, moduloId]
    );
  };

  const handleToggleMostrarPermisos = () => {
    if (isRoleAdminProtected) return; // No permitir ocultar si es Admin (siempre se muestran)
    setMostrarPermisos(prev => !prev);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre del rol es obligatorio.";
    }
    if (!isRoleAdminProtected && modulosSeleccionadosIds.length === 0) {
        errors.permisos = "Debe seleccionar al menos un módulo/permiso.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (isRoleAdminProtected) { // Si es el rol Admin, solo permitir cerrar.
        onClose();
        return;
    }
    if (!validateForm()) return;

    const permisosNombres = modulosSeleccionadosIds
      .map(id => modulosDisponibles.find(m => m.id === id)?.nombre)
      .filter(Boolean);
      
    onSubmit({ ...formData, permisos: permisosNombres });
  };

  if (!isOpen || !initialData) return null;

  return (
    <div className="rol-modalOverlay"> {/* Clases de Rol.css */}
      <div className="rol-modalContent rol-modalContent-form">
        <h2>Editar Rol</h2>
        {isRoleAdminProtected && (
          <p className="rol-admin-message"> {/* Necesitarás estilo para esta clase */}
            El rol 'Administrador' tiene permisos fijos y no puede ser modificado. Su estado tampoco puede ser anulado.
          </p>
        )}
        <form onSubmit={handleSubmitForm}>
          <RolForm
            formData={formData}
            onFormChange={handleFormChange}
            modulosPermisos={modulosDisponibles}
            modulosSeleccionadosIds={modulosSeleccionadosIds}
            onToggleModulo={handleToggleModulo}
            isEditing={true} // Siempre true para edición
            isRoleAdmin={isRoleAdminProtected} // Pasar si es el admin protegido
            mostrarPermisos={mostrarPermisos}
            onToggleMostrarPermisos={handleToggleMostrarPermisos}
            formErrors={formErrors}
          />
          {formErrors?.permisos && <p className="rol-error-permisos">{formErrors.permisos}</p>}
          
          {/* Botones condicionales */}
          {!isRoleAdminProtected ? (
            <div className="rol-form-actions">
              <button type="submit" className="rol-form-buttonGuardar">
                Actualizar Rol
              </button>
              <button type="button" className="rol-form-buttonCancelar" onClick={onClose}>
                Cancelar
              </button>
            </div>
          ) : (
            <div className="rol-form-actions">
              <button type="button" className="rol-modalButton-cerrar" onClick={onClose}>
                Cerrar
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default RolEditarModal;