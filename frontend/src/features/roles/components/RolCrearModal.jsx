// src/features/roles/components/RolCrearModal.jsx
import React, { useState, useEffect } from 'react';
import RolForm from './RolForm';
import { verificarNombreUnico } from '../services/rolesService.js';

const RolCrearModal = ({ isOpen, onClose, onSubmit, permisosDisponibles, permisosAgrupados }) => {

  const getInitialFormState = () => ({
    nombre: '',
    descripcion: '',
    idPermisos: [],
    estado: true,
    tipoPerfil: 'EMPLEADO'
  });

  const [formData, setFormData] = useState(getInitialFormState());
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormState());
      setErrors({});
    }
  }, [isOpen]);

  const handleFormChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prevErr => ({ ...prevErr, [name]: null }));
    }
  };

  const handleToggleModulo = (permisoId) => {
    setFormData(prev => {
        const idPermisosActuales = prev.idPermisos || [];
        const idPermisosNuevos = idPermisosActuales.includes(permisoId)
            ? idPermisosActuales.filter(id => id !== permisoId)
            : [...idPermisosActuales, permisoId];
        return { ...prev, idPermisos: idPermisosNuevos };
    });
  };

  const handleSelectAll = () => {
    const allIds = permisosDisponibles.map(p => p.idPermiso);
    setFormData(prev => ({ ...prev, idPermisos: allIds }));
  };

  const handleDeselectAll = () => {
    setFormData(prev => ({ ...prev, idPermisos: [] }));
  };

  const validateField = async (name, value) => {
    let errorMessage = null;
    switch (name) {
      case 'nombre':
        if (!value.trim()) {
          errorMessage = "El nombre del rol es obligatorio.";
        } else if (value.length > 50) {
          errorMessage = "El nombre no puede exceder los 50 caracteres.";
        } else {
            try {
                const uniquenessErrors = await verificarNombreUnico({ nombre: value });
                if (uniquenessErrors.nombre) {
                    errorMessage = uniquenessErrors.nombre;
                }
            } catch (error) {
                console.error(`API error during nombre validation:`, error);
                errorMessage = "No se pudo conectar con el servidor para validar.";
            }
        }
        break;
      case 'tipoPerfil':
        if (!value) {
            errorMessage = "Debe seleccionar un tipo de perfil."
        }
        break;
      default:
        break;
    }
    return errorMessage;
  };

  const handleBlur = async (e) => {
    const { name, value } = e.target;
    const errorMessage = await validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: errorMessage }));
  };

  const validateFormOnSubmit = async () => {
    const newErrors = {};
    const fieldsToValidate = ['nombre', 'tipoPerfil'];

    for (const field of fieldsToValidate) {
      const errorMessage = await validateField(field, formData[field]);
      if (errorMessage) {
        newErrors[field] = errorMessage;
      }
    }

    if (!formData.idPermisos || formData.idPermisos.length === 0) {
      newErrors.permisos = "Debe seleccionar al menos un permiso.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const isValid = await validateFormOnSubmit();
    if (isValid) {
      onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="rol-modalOverlay">
      <div className="rol-modalContent rol-modalContent-form">
        <button type="button" className="modal-close-button-x" onClick={onClose}>
          &times;
        </button>
        <h2>Crear Rol</h2>
        <form onSubmit={handleSubmitForm} noValidate>
          <RolForm
            formData={formData}
            onFormChange={handleFormChange}
            onBlur={handleBlur}
            permisosDisponibles={permisosDisponibles}
            permisosAgrupados={permisosAgrupados}
            onToggleModulo={handleToggleModulo}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
            isEditing={false}
            isRoleAdmin={false}
            errors={errors}
          />
          {errors.permisos && <p className="rol-error-permisos">{errors.permisos}</p>}
          <div className="rol-form-actions">
            <button type="submit" className="rol-form-buttonGuardar">
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