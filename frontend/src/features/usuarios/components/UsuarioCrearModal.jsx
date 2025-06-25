import React, { useState, useEffect } from 'react';
import UsuarioForm from './UsuarioForm';
import { verificarCorreoUsuarioAPI } from '../services/usuariosService'; // Importar servicio

// 1. Aceptamos 'availableRoles' y 'isLoading' desde las props
const UsuarioCrearModal = ({ isOpen, onClose, onSubmit, availableRoles, isLoading }) => {
  const getInitialFormState = () => ({
    nombre: '',
    apellido: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: '',
    telefono: '',
    tipoDocumento: 'Cédula de Ciudadanía',
    numeroDocumento: '',
    idRol: '',
    estado: true,
    fechaNacimiento: '',
  });

  const [formData, setFormData] = useState(getInitialFormState());
  const [formErrors, setFormErrors] = useState({});

  // 2. Eliminamos el useEffect que llamaba a getRolesAPI. Ya no es necesario.
  useEffect(() => {
    // Reseteamos el formulario cada vez que el modal se abre.
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
    if (name === 'correo') {
      if (!value?.trim()) {
        setFormErrors(prev => ({ ...prev, correo: "El correo es obligatorio." }));
        return;
      }
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(value)) {
        setFormErrors(prev => ({ ...prev, correo: "El formato del correo no es válido." }));
        return;
      }
      try {
        // Para creación, no se pasa idUsuarioActual
        await verificarCorreoUsuarioAPI(value, null);
        // Si la API devuelve éxito (200), el correo está disponible
        setFormErrors(prev => ({ ...prev, correo: "" }));
      } catch (error) {
        // Si la API devuelve error (ej. 409), el correo ya existe
        if (error && error.field === "correo") {
          setFormErrors(prev => ({ ...prev, correo: error.message }));
        } else {
          // Otro tipo de error
          setFormErrors(prev => ({ ...prev, correo: "Error al verificar correo." }));
        }
      }
    }
    // Aquí se podrían añadir validaciones onBlur para otros campos si es necesario
  };

  const isFormValid = () => {
    // Verifica que no haya mensajes de error activos en formErrors
    return Object.values(formErrors).every(errorMsg => errorMsg === "");
  };

  const validateForm = () => {
    const errors = {...formErrors}; // Copiar errores existentes (de onBlur)
    const emailRegex = /\S+@\S+\.\S+/; // Re-declarar por si acaso, aunque onBlur ya lo usa

    if (!formData.idRol) errors.idRol = "Debe seleccionar un rol.";

    // Validar correo solo si no fue ya validado (o falló) por onBlur
    if (!errors.correo) {
      if (!formData.correo?.trim()) {
        errors.correo = "El correo es obligatorio.";
      } else if (!emailRegex.test(formData.correo)) {
        errors.correo = "El formato del correo no es válido.";
      }
    }

    if (!formData.contrasena) {
      errors.contrasena = "La contraseña es obligatoria.";
    } else if (formData.contrasena.length < 8) {
      errors.contrasena = "La contraseña debe tener al menos 8 caracteres.";
    }
    if (formData.contrasena !== formData.confirmarContrasena) {
      errors.confirmarContrasena = "Las contraseñas no coinciden.";
    }
    
    // Validar campos de perfil si el rol lo requiere
    const selectedRole = availableRoles.find(rol => rol.idRol === parseInt(formData.idRol));
    if (selectedRole && (selectedRole.nombre === 'Cliente' || selectedRole.nombre === 'Empleado')) {
        if (!formData.nombre?.trim()) errors.nombre = "El nombre es obligatorio.";
        if (!formData.apellido?.trim()) errors.apellido = "El apellido es obligatorio.";
        if (!formData.tipoDocumento) errors.tipoDocumento = "El tipo de documento es obligatorio.";
        if (!formData.numeroDocumento?.trim()) errors.numeroDocumento = "El número de documento es obligatorio.";
        if (!formData.telefono?.trim()) errors.telefono = "El teléfono es obligatorio.";
        if (!formData.fechaNacimiento) errors.fechaNacimiento = "La fecha de nacimiento es obligatoria.";
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
    <div className="usuarios-modalOverlay">
      <div className="usuarios-modalContent usuarios-modalContent-form">
        <h2>Crear Nuevo Usuario</h2>
        <form onSubmit={handleSubmitForm}>
          <UsuarioForm
            formData={formData}
            onFormChange={handleFormChange}
            availableRoles={availableRoles} // 3. Usamos la prop que viene de la página.
            isEditing={false}
            isUserAdmin={false}
            formErrors={formErrors}
            onFieldBlur={handleFieldBlur} // Pasar la función de onBlur
          />
          {formErrors._general && <p className="auth-form-error" style={{textAlign: 'center'}}>{formErrors._general}</p>}
          <div className="usuarios-form-actions">
            <button
              type="submit"
              className="usuarios-form-buttonGuardar"
              disabled={isLoading || !isFormValid()} // Deshabilitar si está cargando o el form no es válido
            >
              {isLoading ? 'Creando...' : 'Crear Usuario'}
            </button>
            <button
              type="button"
              className="usuarios-form-buttonCancelar"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsuarioCrearModal;