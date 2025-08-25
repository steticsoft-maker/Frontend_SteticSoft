// src/features/roles/components/RolCrearModal.jsx
import React, { useState, useEffect } from 'react';
import RolForm from './RolForm';
import { rolesService } from '../services/rolesService';

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

  const validateForm = async () => {
    const newErrors = {};
    const fieldsToValidate = ['nombre', 'tipoPerfil', 'idPermisos'];

    for (const field of fieldsToValidate) {
        const errorMessage = await validateField(field, formData[field]);
        if (errorMessage) {
            newErrors[field] = errorMessage;
        }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (isOpen) {
      const initialFormData = getInitialFormState();
      setFormData(initialFormData);
      setErrors({});
    }
  }, [isOpen]);

  const validateField = async (name, value) => {
    let error = "";
    switch (name) {
      case "nombre":
        if (!value) {
          error = "El nombre del rol es obligatorio.";
        } else if (value.length < 3) {
          error = "El nombre del rol debe tener al menos 3 caracteres.";
        } else if (value.length > 50) {
          error = "El nombre del rol no debe exceder los 50 caracteres.";
        } else {
            try {
                const uniquenessErrors = await rolesService.verificarDatosUnicos({ nombre: value });
                if (uniquenessErrors.nombre) {
                    error = uniquenessErrors.nombre;
                }
            } catch (err) {
                error = "No se pudo verificar el nombre del rol.";
            }
        }
        break;
      case "descripcion":
        if (value.length > 255) {
          error = "La descripción no debe exceder los 255 caracteres.";
        }
        break;
      case "tipoPerfil":
        if (!value) {
          error = "El tipo de perfil es obligatorio.";
        }
        break;
      case "idPermisos":
        if (!value || value.length === 0) {
            error = "Debe seleccionar al menos un permiso.";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleFormChange = async (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    const errorMessage = await validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: errorMessage }));
  };

  const handleBlur = async (e) => {
    const { name, value } = e.target;
    const errorMessage = await validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: errorMessage }));
  };

  const handleToggleModulo = (permisoId) => {
    const idPermisosActuales = formData.idPermisos || [];
    const idPermisosNuevos = idPermisosActuales.includes(permisoId)
        ? idPermisosActuales.filter(id => id !== permisoId)
        : [...idPermisosActuales, permisoId];
    handleFormChange('idPermisos', idPermisosNuevos);
  };

  const handleSelectAll = () => {
    const allIds = permisosDisponibles.map(p => p.idPermiso);
    handleFormChange('idPermisos', allIds);
  };

  const handleDeselectAll = () => {
    handleFormChange('idPermisos', []);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const isValid = await validateForm();
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
        <form onSubmit={handleSubmitForm}>
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
          {errors.idPermisos && <p className="rol-error-permisos">{errors.idPermisos}</p>}
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