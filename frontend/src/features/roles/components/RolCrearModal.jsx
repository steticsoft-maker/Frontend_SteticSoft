// src/features/roles/components/RolCrearModal.jsx
import React, { useState, useEffect } from 'react';
import RolForm from './RolForm';

// INICIO DE MODIFICACIÓN: Aceptar 'errors' como prop.
const RolCrearModal = ({ isOpen, onClose, onSubmit, permisosDisponibles, permisosAgrupados, errors }) => {
  // FIN DE MODIFICACIÓN

  const getInitialFormState = () => ({
    nombre: '',
    descripcion: '',
    idPermisos: [],
    estado: true,
    tipoPerfil: 'EMPLEADO'
  });

  const [formData, setFormData] = useState(getInitialFormState());

  // INICIO DE MODIFICACIÓN: Se elimina el estado de errores interno y la validación del lado del cliente.
  // const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormState());
      // setFormErrors({}); // Ya no es necesario
    }
  }, [isOpen]);

  const handleFormChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // La lógica para limpiar errores al escribir ya no es necesaria aquí,
    // se podría manejar en el hook si se quisiera, pero es más simple que los errores
    // se limpien en el siguiente envío.
  };
  // FIN DE MODIFICACIÓN

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

  // INICIO DE MODIFICACIÓN: Se elimina la función de validación del cliente.
  /*
  const validateForm = () => { ... };
  */
  // FIN DE MODIFICACIÓN

  const handleSubmitForm = (e) => {
    e.preventDefault();
    // INICIO DE MODIFICACIÓN: Se elimina la llamada a la validación del cliente.
    // if (!validateForm()) return;
    onSubmit(formData);
    // FIN DE MODIFICACIÓN
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
          {/* INICIO DE MODIFICACIÓN: Pasar 'errors' en lugar de 'formErrors' */}
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
            errors={errors} // Se pasa el nuevo prop de errores
          />
          {/* FIN DE MODIFICACIÓN */}

          {/* El error de 'permisos' se mostrará ahora dentro de PermisosSelector si es necesario, o aquí si se prefiere. */}
          {/* Por consistencia, lo manejaremos dentro de RolForm si es posible. */}
          {/* INICIO DE MODIFICACIÓN: Usar el objeto de errores del backend. */}
          {errors.idPermisos && <p className="rol-error-permisos">{errors.idPermisos}</p>}
          {/* FIN DE MODIFICACIÓN */}
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