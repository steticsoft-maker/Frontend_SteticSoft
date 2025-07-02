// src/features/roles/components/RolEditarModal.jsx
import React, { useState, useEffect, useCallback } from 'react';
import RolForm from './RolForm';
import { getRoleDetailsAPI } from '../services/rolesService';

const RolEditarModal = ({ isOpen, onClose, onSubmit, roleId, permisosDisponibles, permisosAgrupados }) => {
  const [formData, setFormData] = useState({ id: null, nombre: '', descripcion: '', idPermisos: [], estado: true });
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const isRoleAdminProtected = formData.nombre === "Administrador";

  const cargarDetallesRol = useCallback(async () => {
    if (!roleId) return;
    setIsLoading(true);
    setFormErrors({});
    try {
        const roleDetails = await getRoleDetailsAPI(roleId);
        setFormData({
            id: roleDetails.idRol,
            nombre: roleDetails.nombre,
            descripcion: roleDetails.descripcion || '',
            estado: roleDetails.estado,
            idPermisos: roleDetails.permisos?.map(p => p.idPermiso) || []
        });
    } catch (err) {
        setFormErrors({ _general: err.message || "Error al cargar los detalles del rol." });
    } finally {
        setIsLoading(false);
    }
  }, [roleId]);

  useEffect(() => {
    if (isOpen) {
      cargarDetallesRol();
    }
  }, [isOpen, cargarDetallesRol]);

  const handleFormChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prevErr => ({ ...prevErr, [name]: '' }));
    }
  };

  const handleToggleModulo = (permisoId) => {
    if (isRoleAdminProtected) return;
    setFormData(prev => {
        const idPermisosActuales = prev.idPermisos || [];
        const idPermisosNuevos = idPermisosActuales.includes(permisoId)
            ? idPermisosActuales.filter(id => id !== permisoId)
            : [...idPermisosActuales, permisoId];
        return { ...prev, idPermisos: idPermisosNuevos };
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre del rol es obligatorio.";
    }
    // Para el rol Admin no se valida la cantidad de permisos
    if (!isRoleAdminProtected && (!formData.idPermisos || formData.idPermisos.length === 0)) {
        errors.permisos = "Debe seleccionar al menos un permiso.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (isRoleAdminProtected) {
      onClose();
      return;
    }
    if (!validateForm()) return;
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="rol-modalOverlay">
      <div className="rol-modalContent rol-modalContent-form">
        <button type="button" className="modal-close-button-x" onClick={onClose}>
          &times;
        </button>
        <h2>Editar Rol</h2>
        {isLoading ? (
            <p>Cargando...</p>
        ) : formErrors._general ? (
            <p className="error-message">{formErrors._general}</p>
        ) : (
          <>
            {isRoleAdminProtected && (
              <p className="rol-admin-message">
                El rol 'Administrador' tiene permisos fijos y no puede ser modificado.
              </p>
            )}
            <form onSubmit={handleSubmitForm}>
              <RolForm
                formData={formData}
                onFormChange={handleFormChange}
                permisosDisponibles={permisosDisponibles} // Para el resumen
                permisosAgrupados={permisosAgrupados}   // Para el selector
                onToggleModulo={handleToggleModulo}
                isEditing={true}
                isRoleAdmin={isRoleAdminProtected}
                formErrors={formErrors}
                // --- INICIO DE MODIFICACIÓN: Pasar SelectAll/DeselectAll ---
                onSelectAll={() => {
                  if (isRoleAdminProtected) return;
                  const allIds = permisosDisponibles.map(p => p.idPermiso);
                  setFormData(prev => ({ ...prev, idPermisos: allIds }));
                }}
                onDeselectAll={() => {
                  if (isRoleAdminProtected) return;
                  setFormData(prev => ({ ...prev, idPermisos: [] }));
                }}
                // --- FIN DE MODIFICACIÓN ---
              />
              {formErrors.permisos && <p className="rol-error-permisos">{formErrors.permisos}</p>}
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
          </>
        )}
      </div>
    </div>
  );
};

export default RolEditarModal;