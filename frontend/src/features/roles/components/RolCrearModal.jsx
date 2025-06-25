// src/features/roles/components/RolCrearModal.jsx
import React, { useState, useEffect } from 'react';
import RolForm from './RolForm';
import { verificarNombreRolAPI } from '../services/rolesService'; // Importar

const RolCrearModal = ({ isOpen, onClose, onSubmit, permisosDisponibles, permisosAgrupados }) => {

  const getInitialFormState = () => ({
    nombre: '',
    descripcion: '',
    idPermisos: [], // Manejaremos los IDs de los permisos
    estado: true,
  });

  const [formData, setFormData] = useState(getInitialFormState());
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormState());
      setFormErrors({});
    }
  }, [isOpen]);

  const handleFormChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prevErr => ({ ...prevErr, [name]: '' }));
    }
  };

  const handleFieldBlur = async (name, value) => {
    if (name === 'nombre') {
      if (!value?.trim()) {
        setFormErrors(prev => ({ ...prev, nombre: "El nombre del rol es obligatorio." }));
        return;
      }
      try {
        await verificarNombreRolAPI(value, null); // null para idRolActual en creación
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
           (formData.idPermisos && formData.idPermisos.length > 0); // Asegurar que haya permisos
  };

  const handleToggleModulo = (permisoId) => {
    setFormData(prev => {
        const idPermisosActuales = prev.idPermisos || [];
        const idPermisosNuevos = idPermisosActuales.includes(permisoId)
            ? idPermisosActuales.filter(id => id !== permisoId)
            : [...idPermisosActuales, permisoId];
        // Limpiar error de permisos si se selecciona alguno
        if (idPermisosNuevos.length > 0 && formErrors.permisos) {
            setFormErrors(prevErr => ({ ...prevErr, permisos: '' }));
        }
        return { ...prev, idPermisos: idPermisosNuevos };
    });
  };

  const validateForm = () => { // Solo para validaciones onSubmit que no son onBlur
    const errors = { ...formErrors };
    if (!formData.nombre.trim() && !errors.nombre) {
      errors.nombre = "El nombre del rol es obligatorio.";
    }
    if (!formData.idPermisos || formData.idPermisos.length === 0) {
      errors.permisos = "Debe seleccionar al menos un permiso.";
    } else {
      // Si hay permisos, pero había un error, lo limpiamos
      if(errors.permisos) errors.permisos = "";
    }
    setFormErrors(errors);
    return Object.values(errors).every(errorMsg => !errorMsg);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!validateForm() || !isFormCompletelyValid()) return;
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="rol-modalOverlay">
      <div className="rol-modalContent rol-modalContent-form">
        <h2>Crear Rol</h2>
        <form onSubmit={handleSubmitForm}>
          <RolForm
            formData={formData}
            onFormChange={handleFormChange}
            permisosDisponibles={permisosDisponibles}
            permisosAgrupados={permisosAgrupados}
            onToggleModulo={handleToggleModulo}
            isEditing={false}
            isRoleAdmin={false}
            formErrors={formErrors}
            onFieldBlur={handleFieldBlur} // Pasar la nueva prop
          />
          {formErrors.permisos && <p className="rol-error-permisos">{formErrors.permisos}</p>}
          <div className="rol-form-actions">
            <button type="submit" className="rol-form-buttonGuardar" disabled={!isFormCompletelyValid()}>
              Crear Rol
            </button>
            <button type="button" className="rol-form-buttonCancelar" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RolCrearModal;