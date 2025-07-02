// src/features/roles/components/RolCrearModal.jsx
import React, { useState, useEffect } from 'react';
import RolForm from './RolForm';

const RolCrearModal = ({ isOpen, onClose, onSubmit, permisosDisponibles, permisosAgrupados }) => {

  const getInitialFormState = () => ({
    nombre: '',
    descripcion: '',
    idPermisos: [],
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

  const handleToggleModulo = (permisoId) => {
    setFormData(prev => {
        const idPermisosActuales = prev.idPermisos || [];
        const idPermisosNuevos = idPermisosActuales.includes(permisoId)
            ? idPermisosActuales.filter(id => id !== permisoId)
            : [...idPermisosActuales, permisoId];
        return { ...prev, idPermisos: idPermisosNuevos };
    });
  };

  // --- INICIO DE NUEVO CÓDIGO ---
  /**
   * Selecciona todos los permisos disponibles.
   * Obtiene todos los IDs de 'permisosDisponibles' y los establece en el estado.
   */
  const handleSelectAll = () => {
    const allIds = permisosDisponibles.map(p => p.idPermiso);
    setFormData(prev => ({ ...prev, idPermisos: allIds }));
  };

  /**
   * Deselecciona todos los permisos.
   * Simplemente establece el array 'idPermisos' a un array vacío.
   */
  const handleDeselectAll = () => {
    setFormData(prev => ({ ...prev, idPermisos: [] }));
  };
  // --- FIN DE NUEVO CÓDIGO ---

  const validateForm = () => {
    const errors = {};
    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre del rol es obligatorio.";
    }
    if (!formData.idPermisos || formData.idPermisos.length === 0) {
      errors.permisos = "Debe seleccionar al menos un permiso.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

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
            // --- INICIO DE MODIFICACIÓN ---
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
            // --- FIN DE MODIFICACIÓN ---
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