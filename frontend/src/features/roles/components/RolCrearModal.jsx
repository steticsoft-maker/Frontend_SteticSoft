// src/features/roles/components/RolCrearModal.jsx
import React, { useState, useEffect } from 'react';
import RolForm from './RolForm';
import { getModulosPermisos } from '../services/rolesService';

const RolCrearModal = ({ isOpen, onClose, onSubmit }) => {
  const modulosDisponibles = getModulosPermisos();

  // Define el estado inicial del formulario para un nuevo rol
  const getInitialFormState = () => ({
    nombre: '',
    descripcion: '',
    permisos: [], // Nombres de permisos, se llenará desde modulosSeleccionadosIds
    anulado: false, // Nuevos roles activos por defecto
  });

  const [formData, setFormData] = useState(getInitialFormState());
  const [modulosSeleccionadosIds, setModulosSeleccionadosIds] = useState([]);
  const [mostrarPermisos, setMostrarPermisos] = useState(false); // Inicia oculto en creación
  const [formErrors, setFormErrors] = useState({}); // Para validaciones

  // Resetear formulario y estados de permisos cuando el modal se abre
  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormState());
      setModulosSeleccionadosIds([]);
      setMostrarPermisos(false); // Importante para que al crear siempre inicie con permisos ocultos
      setFormErrors({});
    }
  }, [isOpen]);

  const handleFormChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prevErr => ({ ...prevErr, [name]: '' }));
    }
  };

  const handleToggleModulo = (moduloId) => {
    // El rol Administrador no se crea desde aquí, por lo que no hay chequeo isRoleAdmin
    setModulosSeleccionadosIds(prev =>
      prev.includes(moduloId) ? prev.filter(id => id !== moduloId) : [...prev, moduloId]
    );
  };

  const handleToggleMostrarPermisos = () => {
    setMostrarPermisos(prev => !prev);
  };
  
  const validateForm = () => {
    const errors = {};
    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre del rol es obligatorio.";
    }
    if (modulosSeleccionadosIds.length === 0) {
        errors.permisos = "Debe seleccionar al menos un módulo/permiso.";
    }
    // Añadir más validaciones si es necesario
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const permisosNombres = modulosSeleccionadosIds
      .map(id => modulosDisponibles.find(m => m.id === id)?.nombre)
      .filter(Boolean); // Filtrar por si alguno es undefined (no debería pasar)
    
    onSubmit({ ...formData, permisos: permisosNombres });
  };

  if (!isOpen) return null;

  return (
    <div className="rol-modalOverlay"> {/* Clases de Rol.css */}
      <div className="rol-modalContent rol-modalContent-form">
        <h2>Crear Rol</h2>
        <form onSubmit={handleSubmitForm}>
          <RolForm
            formData={formData}
            onFormChange={handleFormChange}
            modulosPermisos={modulosDisponibles}
            modulosSeleccionadosIds={modulosSeleccionadosIds}
            onToggleModulo={handleToggleModulo}
            isEditing={false} // Siempre false para creación
            isRoleAdmin={false} // No se puede crear el rol 'Administrador' desde aquí
            mostrarPermisos={mostrarPermisos}
            onToggleMostrarPermisos={handleToggleMostrarPermisos}
            formErrors={formErrors} // Pasar errores
          />
           {formErrors?.permisos && <p className="rol-error-permisos">{formErrors.permisos}</p>} {/* Estilo para error de permisos */}
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