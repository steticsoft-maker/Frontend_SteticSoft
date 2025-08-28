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
    <div className="rol-modalOverlay">
      <div className="rol-modalContent rol-modalContent-form">
        <button
          type="button"
          className="modal-close-button-x"
          onClick={onClose}
        >
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
          {formErrors.permisos && (
            <p className="rol-error-permisos">{formErrors.permisos}</p>
          )}
          <div className="rol-form-actions">
            <button type="submit" className="rol-form-buttonGuardar">
              Crear Rol
            </button>
            <button
              type="button"
              className="rol-form-buttonCancelar"
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RolCrearModal;