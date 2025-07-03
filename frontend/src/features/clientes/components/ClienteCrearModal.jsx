// src/features/clientes/components/ClienteCrearModal.jsx
import React, { useState, useEffect } from 'react';
import ClienteForm from './ClienteForm';
import '../css/Clientes.css'; // Asegúrate de que la importación de CSS esté aquí

const ClienteCrearModal = ({ isOpen, onClose, onSubmit }) => {
  const getInitialFormState = () => ({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    tipoDocumento: 'Cédula de Ciudadanía',
    numeroDocumento: '',
    fechaNacimiento: '',
    contrasena: '',
    confirmPassword: '', // Nuevo campo para confirmar contraseña
    estado: true,
  });

  const [formData, setFormData] = useState(getInitialFormState());
  const [formErrors, setFormErrors] = useState({});
  const [generalError, setGeneralError] = useState(''); // Para errores no asociados a un campo específico

  // Resetear formulario y errores cuando el modal se abre
  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormState());
      setFormErrors({});
      setGeneralError(''); // Limpiar errores generales también
    }
  }, [isOpen]);

  const handleFormChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar el error del campo específico y el error general cuando el usuario empieza a escribir
    if (formErrors?.[name]) { // Uso de optional chaining para seguridad
      setFormErrors(prevErr => ({ ...prevErr, [name]: '' }));
    }
    if (generalError) {
      setGeneralError('');
    }
    
    // Validar en tiempo real: Solo si el campo NO está vacío,
    // o si el campo es la confirmación de contraseña (que depende de otro campo).
    if (value?.trim() !== '' || name === 'confirmPassword' || name === 'contrasena') {
        validateField(name, value);
        // Si se modifica contrasena o confirmPassword, revalidar ambos
        if (name === 'contrasena' || name === 'confirmPassword') {
            validateField('contrasena', formData.contrasena); // Pasa el valor actual de contrasena
            validateField('confirmPassword', formData.confirmPassword); // Pasa el valor actual de confirmPassword
        }
    } else {
        // Si el campo está vacío, asegúrate de que no tenga un mensaje de error activo.
        // Pero no añadas un mensaje de "obligatorio" aquí.
        setFormErrors(prevErr => ({ ...prevErr, [name]: '' }));
    }
  };

  // Función para validar un campo específico y actualizar los errores
  const validateField = (name, value) => {
    let error = '';
    // Uso de optional chaining para seguridad, si value es null/undefined
    const trimmedValue = value?.trim(); 

    switch (name) {
      case 'nombre':
        if (trimmedValue?.length > 0 && (trimmedValue.length < 2 || trimmedValue.length > 100)) error = "El nombre debe tener entre 2 y 100 caracteres.";
        break;
      case 'apellido':
        if (trimmedValue?.length > 0 && (trimmedValue.length < 2 || trimmedValue.length > 100)) error = "El apellido debe tener entre 2 y 100 caracteres.";
        break;
      case 'correo':
        if (trimmedValue?.length > 0 && !/\S+@\S+\.\S+/.test(trimmedValue)) error = "El correo electrónico no es válido.";
        break;
      case 'telefono':
        // Solo valida si ya hay algo, no si está vacío (el campo requerido ya se encarga)
        if (trimmedValue?.length > 0 && !/^\d{7,15}$/.test(trimmedValue)) error = "El teléfono debe contener solo números y tener entre 7 y 15 dígitos."; // Ejemplo de validación de teléfono
        break;
      case 'tipoDocumento':
        // No necesita validación adicional aquí si el select solo ofrece opciones válidas y tiene un "required"
        break;
      case 'numeroDocumento':
        if (trimmedValue?.length > 0 && !/^[a-zA-Z0-9]{5,45}$/.test(trimmedValue)) error = "El número de documento debe tener entre 5 y 45 caracteres alfanuméricos.";
        break;
      case 'fechaNacimiento':
        if (value) { // Solo valida si se ha seleccionado una fecha
          const birthDate = new Date(value);
          const today = new Date();
          if (birthDate > today) error = "La fecha de nacimiento no puede ser futura.";
        }
        break;
      case 'contrasena':
        if (trimmedValue?.length > 0 && trimmedValue.length < 8) error = "La contraseña debe tener al menos 8 caracteres.";
        break;
      case 'confirmPassword':
        // Esta validación debe ocurrir siempre que cambie confirmPassword o contrasena
        if (trimmedValue?.length > 0 && trimmedValue !== formData.contrasena) error = "Las contraseñas no coinciden.";
        break;
      default:
        break;
    }
    setFormErrors(prevErr => ({ ...prevErr, [name]: error }));
    return !error; // Retorna true si no hay error
  };


  const validateAllFormFields = () => {
    const errors = {};
    let isValid = true;

    // Campos que son obligatorios (además de otras validaciones de formato/longitud)
    const requiredFields = [
      'nombre', 'apellido', 'correo', 'telefono', 'tipoDocumento',
      'numeroDocumento', 'fechaNacimiento', 'contrasena', 'confirmPassword'
    ];

    requiredFields.forEach(field => {
      const value = formData?.[field]; // Uso de optional chaining
      const trimmedValue = (typeof value === 'string' || value instanceof String) ? value?.trim() : value; // Solo trim si es string, con optional chaining

      // Validación de campo obligatorio: SOLO aquí se añade el error si está vacío.
      if (!trimmedValue && trimmedValue !== 0 && trimmedValue !== false) { // Check for empty string, null, undefined, 0, false
        if (field === 'confirmPassword') {
            errors[field] = "Debe confirmar la contraseña."; // <--- CAMBIO AQUÍ
        } else if (field === 'contrasena') {
            errors[field] = "La contraseña es obligatoria."; // <--- CAMBIO AQUÍ
        } else {
            errors[field] = `El campo ${field} es obligatorio.`; // <--- CAMBIO AQUÍ
        }
        isValid = false;
      }
      
      // Aplicar validaciones de formato/longitud que ya están en validateField
      // Importante: Si formData[field] está vacío, validateField no agregará un error de formato/longitud
      // por cómo la modificamos arriba. El error de "obligatorio" se manejará aquí.
      validateField(field, value); // Asegura que se capturen también los errores de formato/longitud
    });

    // Validación específica para que contrasena y confirmPassword coincidan (si no están vacías)
    if (formData.contrasena && formData.confirmPassword && formData.contrasena !== formData.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden.";
      isValid = false;
    }

    setFormErrors(prevErrors => ({ ...prevErrors, ...errors })); // Asegura que todos los errores estén en el estado
    return isValid;
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setGeneralError(''); // Limpiar errores generales antes de intentar enviar

    // Validar todos los campos del formulario antes de enviar
    const isFormValid = validateAllFormFields();
    if (!isFormValid) {
        setGeneralError("Por favor, corrige los errores en el formulario.");
        return;
    }

    try {
      // Excluir confirmPassword antes de enviar al backend
      const dataToSubmit = { ...formData };
      delete dataToSubmit.confirmPassword;

      await onSubmit(dataToSubmit); // Enviar datos al padre (ListaClientesPage)
      onClose(); // Cerrar el modal al guardar exitosamente
      // El mensaje de éxito se maneja en ListaClientesPage.jsx
    } catch (error) {
      console.error("Error al guardar cliente en ClienteCrearModal:", error);
      let apiErrorMessage = "Ocurrió un error inesperado al guardar el cliente.";
      let fieldErrors = {};

      // Aquí intentamos parsear el error del backend para mostrarlo
      // en el campo correspondiente o como un error general.
      if (error.response?.data) { // Uso de optional chaining
        if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
          // Si el backend envía un array de errores (como express-validator)
          error.response.data.errors.forEach(err => {
            if (err.path) { // Asegúrate que la propiedad del campo exista
              fieldErrors[err.path] = err.msg; // <--- CAMBIO AQUÍ: Eliminar el optional chaining en la asignación
            } else {
              apiErrorMessage += ` | ${err.msg}`; // Acumular mensajes si no tienen campo asociado
            }
          });
          if (Object.keys(fieldErrors).length > 0) {
            setFormErrors(prev => ({ ...prev, ...fieldErrors }));
          }
          if (apiErrorMessage === "Ocurrió un error inesperado al guardar el cliente." && Object.keys(fieldErrors).length > 0) {
              apiErrorMessage = "Por favor, revisa los errores específicos en los campos.";
          }
        } else if (error.response.data.message) {
          // Si el backend envía un mensaje general de error
          apiErrorMessage = error.response.data.message;

          // Intentar parsear mensajes comunes a campos específicos
          if (apiErrorMessage.includes("correo electrónico") && apiErrorMessage.includes("ya está registrado")) {
            fieldErrors.correo = apiErrorMessage;
          } else if (apiErrorMessage.includes("número de documento") && apiErrorMessage.includes("ya está registrado")) {
            fieldErrors.numeroDocumento = apiErrorMessage;
          }
          if (Object.keys(fieldErrors).length > 0) {
              setFormErrors(prev => ({ ...prev, ...fieldErrors }));
              apiErrorMessage = "Por favor, revisa los errores específicos en los campos."; // Ajusta el mensaje general
          }
        }
      }
      setGeneralError(apiErrorMessage); // Mostrar el mensaje general de error
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-clientes"> {/* Usa las clases de Clientes.css */}
      <div className="modal-content-clientes formulario">
        {/* Nuevo div para el encabezado del modal con título y botón de cierre */}
        <div className="modal-header-clientes">
          <h2>Agregar Cliente</h2>
          <button type="button" className="modal-close-button" onClick={onClose}>
            &times; {/* Entidad HTML para el carácter 'X' */}
          </button>
        </div>
        <form className="formularioModalClientes" onSubmit={handleSubmitForm}>
          <ClienteForm
            formData={formData}
            onFormChange={handleFormChange}
            isEditing={false} // Siempre false para el modal de creación
            formErrors={formErrors}
          />
          {generalError && <p className="error-message general-error">{generalError}</p>} {/* Mensaje de error general */}
          <div className="clientes-form-actions">
            <button type="submit" className="botonguardarClienteModal">
              Guardar Cliente
            </button>
            {/* El botón Cancelar ha sido eliminado */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClienteCrearModal;