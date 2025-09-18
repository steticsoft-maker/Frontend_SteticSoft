// src/features/roles/components/RolCrearModal.jsx
import React, { useState, useEffect } from 'react';
import RolForm from './RolForm';

// NUEVO: Definimos la regex aquí para reutilizarla
const descriptionRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,:;_-]+$/;
const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s_]+$/; // Solo letras, espacios y guiones bajos

const RolCrearModal = ({ isOpen, onClose, onSubmit, permisosDisponibles, permisosAgrupados }) => {
  const getInitialFormState = () => ({
    nombre: "",
    descripcion: "",
    idPermisos: [],
    estado: true,
    tipoPerfil: "EMPLEADO",
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
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prevErr) => ({ ...prevErr, [name]: "" }));
    }
  };

  const handleToggleModulo = (permisoId) => {
    setFormData((prev) => {
      const idPermisosActuales = prev.idPermisos || [];
      const idPermisosNuevos = idPermisosActuales.includes(permisoId)
        ? idPermisosActuales.filter((id) => id !== permisoId)
        : [...idPermisosActuales, permisoId];
      return { ...prev, idPermisos: idPermisosNuevos };
    });
  };

  const handleSelectAll = () => {
    const allIds = permisosDisponibles.map((p) => p.idPermiso);
    setFormData((prev) => ({ ...prev, idPermisos: allIds }));
  };

  const handleDeselectAll = () => {
    setFormData((prev) => ({ ...prev, idPermisos: [] }));
  };

  // INICIO DE MODIFICACIÓN: Lógica de validación completada
  const validateForm = () => {
    const errors = {};
    const { nombre, descripcion, tipoPerfil, idPermisos } = formData;

    // Validación para Nombre (completa)
    if (!nombre || !nombre.trim()) {
      errors.nombre = "El nombre del rol es obligatorio.";
    } else if (nombre.trim().length < 3) {
      errors.nombre = "El nombre debe tener al menos 3 caracteres.";
    } else if (nombre.trim().length > 50) {
      // <-- AÑADIDO
      errors.nombre = "El nombre no debe exceder los 50 caracteres.";
    } else if (!nameRegex.test(nombre)) {
      // <-- AÑADIDO
      errors.nombre =
        "El nombre solo puede contener letras, espacios y guiones bajos.";
    }

    // Validación para Descripción (completa)
    if (!descripcion || !descripcion.trim()) {
      errors.descripcion = "La descripción es obligatoria.";
    } else if (descripcion.trim().length < 3) {
      errors.descripcion = "La descripción debe tener al menos 3 caracteres.";
    } else if (descripcion.trim().length > 250) {
      // <-- AÑADIDO
      errors.descripcion = "La descripción no debe exceder los 250 caracteres.";
    } else if (!descriptionRegex.test(descripcion)) {
      errors.descripcion = "La descripción contiene caracteres no válidos.";
    }

    // Validación para Tipo de Perfil
    if (!tipoPerfil) {
      errors.tipoPerfil = "Debe seleccionar un tipo de perfil.";
    }

    // Validación para Permisos
    if (!idPermisos || idPermisos.length === 0) {
      errors.permisos = "Debe seleccionar al menos un módulo.";
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
    <div className="admin-modal-overlay">
      <div className="admin-modal-content large">
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">Crear Rol</h2>
          <button
            type="button"
            className="admin-modal-close"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="admin-modal-body">
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
          {formErrors.permisos && (
            <p className="admin-form-error">{formErrors.permisos}</p>
          )}
        </form>
        </div>
        <div className="admin-modal-footer">
          <button type="submit" className="admin-form-button" form="rol-form">
            Crear Rol
          </button>
          <button
            type="button"
            className="admin-form-button secondary"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default RolCrearModal;