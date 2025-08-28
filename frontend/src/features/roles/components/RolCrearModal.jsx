// src/features/roles/components/RolCrearModal.jsx
import React, { useState, useEffect } from 'react';
import RolForm from './RolForm';

// NUEVO: Definimos la regex aquí para reutilizarla
const descriptionRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,:;_-]+$/;

const RolCrearModal = ({ isOpen, onClose, onSubmit, permisosDisponibles, permisosAgrupados }) => {

  const getInitialFormState = () => ({
    nombre: '',
    descripcion: '',
    idPermisos: [],
    estado: true,
    tipoPerfil: 'EMPLEADO'
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

  // INICIO DE MODIFICACIÓN
    const validateForm = () => {
      const errors = {};
      if (!formData.nombre.trim()) {
        errors.nombre = "El nombre del rol es obligatorio.";
      } else if (formData.nombre.trim().length < 3) {
        errors.nombre = "El nombre debe tener al menos 3 caracteres.";
      }

      // Validación para descripción
      if (!formData.descripcion.trim()) {
        errors.descripcion = "La descripción es obligatoria.";
      } else if (formData.descripcion.trim().length < 3) {
        errors.descripcion = "La descripción debe tener al menos 3 caracteres.";
      } else if (!descriptionRegex.test(formData.descripcion)) {
        // Aplicamos la nueva regex
        errors.descripcion = "La descripción contiene caracteres no válidos.";
      }

      if (!formData.tipoPerfil) {
        errors.tipoPerfil = "Debe seleccionar un tipo de perfil.";
      }
      if (!formData.idPermisos || formData.idPermisos.length === 0) {
        errors.permisos = "Debe seleccionar al menos un permiso.";
      }
      setFormErrors(errors);
      return Object.keys(errors).length === 0;
    };
  // FIN DE MODIFICACIÓN

  const handleSubmitForm = (e) => {
    e.preventDefault();
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
        <h2>Crear Rol</h2>
        <form onSubmit={handleSubmitForm}>
          <RolForm
            formData={formData}
            onFormChange={handleFormChange}
            permisosDisponibles={permisosDisponibles}
            permisosAgrupados={permisosAgrupados}
            onToggleModulo={handleToggleModulo}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
            isEditing={false}
            isRoleAdmin={false}
            formErrors={formErrors}
          />
          {formErrors.permisos && <p className="rol-error-permisos">{formErrors.permisos}</p>}
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