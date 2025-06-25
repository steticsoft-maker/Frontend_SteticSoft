// src/features/roles/components/RolEditarModal.jsx
import React, { useState, useEffect, useCallback } from 'react';
import RolForm from './RolForm';
import { getRoleDetailsAPI, verificarNombreRolAPI } from '../services/rolesService'; // Importar

const RolEditarModal = ({ isOpen, onClose, onSubmit, roleId, permisosDisponibles, permisosAgrupados }) => {
  const [formData, setFormData] = useState({ id: null, nombre: '', descripcion: '', idPermisos: [], estado: true });
  const [formErrors, setFormErrors] = useState({});
  const [originalNombre, setOriginalNombre] = useState(''); // Para no validar si el nombre no cambió
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
        setOriginalNombre(roleDetails.nombre); // Guardar nombre original
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

  const handleFieldBlur = async (name, value) => {
    if (name === 'nombre' && !isRoleAdminProtected) {
      if (!value?.trim()) {
        setFormErrors(prev => ({ ...prev, nombre: "El nombre del rol es obligatorio." }));
        return;
      }
      if (value === originalNombre) { // No validar si el nombre no cambió
        setFormErrors(prev => ({ ...prev, nombre: "" }));
        return;
      }
      try {
        await verificarNombreRolAPI(value, formData.id);
        setFormErrors(prev => ({ ...prev, nombre: "" }));
      } catch (error) {
        if (error && error.field === "nombre") {
          setFormErrors(prev => ({ ...prev, nombre: error.message }));
        } else {
          setFormErrors(prev => ({ ...prev, nombre: "Error al verificar nombre." }));
        }
      }
    }
  };

  const isFormCompletelyValid = () => {
    return Object.values(formErrors).every(errorMsg => !errorMsg) &&
           (isRoleAdminProtected || (formData.idPermisos && formData.idPermisos.length > 0));
  };

  const handleToggleModulo = (permisoId) => {
    if (isRoleAdminProtected) return;
    setFormData(prev => {
        const idPermisosActuales = prev.idPermisos || [];
        const idPermisosNuevos = idPermisosActuales.includes(permisoId)
            ? idPermisosActuales.filter(id => id !== permisoId)
            : [...idPermisosActuales, permisoId];
        if (idPermisosNuevos.length > 0 && formErrors.permisos) {
            setFormErrors(prevErr => ({ ...prevErr, permisos: '' }));
        }
        return { ...prev, idPermisos: idPermisosNuevos };
    });
  };

  const validateForm = () => {
    const errors = { ...formErrors };
    if (!formData.nombre.trim() && !errors.nombre) {
      errors.nombre = "El nombre del rol es obligatorio.";
    }
    if (!isRoleAdminProtected && (!formData.idPermisos || formData.idPermisos.length === 0)) {
        errors.permisos = "Debe seleccionar al menos un permiso.";
    } else if (errors.permisos && formData.idPermisos && formData.idPermisos.length > 0) {
        errors.permisos = ""; // Limpiar si se seleccionaron permisos
    }
    setFormErrors(errors);
    return Object.values(errors).every(errorMsg => !errorMsg);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (isRoleAdminProtected) {
      onClose();
      return;
    }
    if (!validateForm() || !isFormCompletelyValid()) return;
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="rol-modalOverlay">
      <div className="rol-modalContent rol-modalContent-form">
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
                permisosDisponibles={permisosDisponibles}
                permisosAgrupados={permisosAgrupados}
                onToggleModulo={handleToggleModulo}
                isEditing={true}
                isRoleAdmin={isRoleAdminProtected}
                formErrors={formErrors}
                onFieldBlur={handleFieldBlur} // Pasar la nueva prop
              />
              {formErrors.permisos && <p className="rol-error-permisos">{formErrors.permisos}</p>}
              {!isRoleAdminProtected ? (
                <div className="rol-form-actions">
                  <button type="submit" className="rol-form-buttonGuardar" disabled={!isFormCompletelyValid()}>
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