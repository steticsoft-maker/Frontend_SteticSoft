// src/features/clientes/components/ClienteEditarModal.jsx
import React, { useState, useEffect } from 'react';
import ClienteForm from './ClienteForm'; // Reutilizaremos el ClienteForm
import '../css/Clientes.css'; // Asegúrate de que la importación de CSS esté aquí

const ClienteEditarModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [generalError, setGeneralError] = useState(''); // Nuevo estado para errores generales

  useEffect(() => {
    if (isOpen && initialData) {
      const dataToEdit = { ...initialData };
      delete dataToEdit.contrasena; // Aseguramos que la contraseña no esté en el form para editar
      delete dataToEdit.confirmPassword; // También elimina confirmPassword si existiera del create

      setFormData({
        ...dataToEdit,
        correo: initialData.correo,
        // Asegurar que estado se cargue, usando un fallback seguro
        estado: initialData.estado !== undefined ? initialData.estado : true, 
      });
      setFormErrors({}); // Limpiar errores al abrir el modal
      setGeneralError(''); // Limpiar error general al abrir el modal
    } else if (isOpen && !initialData) {
      console.error("Modal de edición de cliente abierto sin initialData. Cerrando.");
      onClose(); // Cerrar si no hay datos para editar
    }
  }, [isOpen, initialData, onClose]); // `onClose` añadido a las dependencias por buenas prácticas

  const handleFormChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar el error del campo específico y el error general cuando el usuario empieza a escribir
    if (formErrors?.[name]) { 
      setFormErrors(prevErr => ({ ...prevErr, [name]: '' }));
    }
    if (generalError) {
      setGeneralError('');
    }
    
    // Validar en tiempo real: Solo si el campo NO está vacío.
    // La edición no tiene campos de contraseña para confirmar, así que no se necesita lógica especial.
    if (value?.trim() !== '') {
        validateField(name, value);
    } else {
        // Si el campo está vacío, asegúrate de que no tenga un mensaje de error activo.
        // Pero no añadas un mensaje de "obligatorio" aquí.
        setFormErrors(prevErr => ({ ...prevErr, [name]: '' }));
    }
  };

  // Función de validación de campos individuales para edición
  const validateField = (name, value) => {
    let error = '';
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
        if (trimmedValue?.length > 0 && !/^\d{7,15}$/.test(trimmedValue)) error = "El teléfono debe contener solo números y tener entre 7 y 15 dígitos.";
        break;
      case 'tipoDocumento':
        // No necesita validación adicional aquí si el select solo ofrece opciones válidas y tiene un "required"
        break;
      case 'numeroDocumento':
        if (trimmedValue?.length > 0 && !/^[a-zA-Z0-9]{5,45}$/.test(trimmedValue)) error = "El número de documento debe tener entre 5 y 45 caracteres alfanuméricos.";
        break;
      case 'fechaNacimiento':
        if (value) {
          const birthDate = new Date(value);
          const today = new Date();
          if (birthDate > today) error = "La fecha de nacimiento no puede ser futura.";
        }
        break;
      case 'estado':
          // Validación simple para el estado si es necesario
          // No es un campo de texto, solo booleano, así que la validación puede ser más simple o nula aquí.
          // if (typeof value !== 'boolean') error = "El estado debe ser un valor booleano.";
          break;
      default:
        break;
    }
    setFormErrors(prevErr => ({ ...prevErr, [name]: error }));
    return !error;
  };

  const validateAllFormFields = () => {
    const errors = {};
    let isValid = true;
    // Campos obligatorios para edición (la contraseña y confirmPassword no son obligatorios aquí)
    const requiredFields = [
      'nombre', 'apellido', 'correo', 'telefono', 'tipoDocumento',
      'numeroDocumento', 'fechaNacimiento'
    ];

    requiredFields.forEach(field => {
      const value = formData?.[field];
      const trimmedValue = (typeof value === 'string' || value instanceof String) ? value?.trim() : value;

      if (!trimmedValue && trimmedValue !== 0 && trimmedValue !== false) {
        errors[field] = `El campo ${field} es obligatorio.`; // Mensaje genérico de obligatorio
        isValid = false;
      }
      validateField(field, value); // Aplica también las validaciones de formato/longitud
    });

    setFormErrors(prevErrors => ({ ...prevErrors, ...errors }));
    return isValid;
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setGeneralError(''); // Limpiar errores generales antes de enviar

    const isFormValid = validateAllFormFields();
    if (!isFormValid) {
      setGeneralError("Por favor, corrige los errores en el formulario.");
      return;
    }

    try {
      // No necesitamos eliminar 'confirmPassword' o 'contrasena' aquí
      // ya que ClienteForm no los muestra en modo edición y no se incluyen en initialData
      await onSubmit(formData); // Enviar datos al padre (ListaClientesPage)
      onClose(); // Cerrar el modal al guardar exitosamente
      // El mensaje de éxito se maneja en ListaClientesPage.jsx
    } catch (error) {
      console.error("Error al actualizar cliente en ClienteEditarModal:", error);
      let apiErrorMessage = "Ocurrió un error inesperado al actualizar el cliente.";
      let fieldErrors = {};

      if (error.response?.data) {
        if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
          error.response.data.errors.forEach(err => {
            if (err.path) {
              fieldErrors[err.path] = err.msg;
            } else {
              apiErrorMessage += ` | ${err.msg}`;
            }
          });
          if (Object.keys(fieldErrors).length > 0) {
            setFormErrors(prev => ({ ...prev, ...fieldErrors }));
          }
          if (apiErrorMessage === "Ocurrió un error inesperado al actualizar el cliente." && Object.keys(fieldErrors).length > 0) {
            apiErrorMessage = "Por favor, revisa los errores específicos en los campos.";
          }
        } else if (error.response.data.message) {
          apiErrorMessage = error.response.data.message;
          if (apiErrorMessage.includes("correo electrónico") && apiErrorMessage.includes("ya está registrado")) {
            fieldErrors.correo = apiErrorMessage;
          } else if (apiErrorMessage.includes("número de documento") && apiErrorMessage.includes("ya está registrado")) {
            fieldErrors.numeroDocumento = apiErrorMessage;
          }
          if (Object.keys(fieldErrors).length > 0) {
            setFormErrors(prev => ({ ...prev, ...fieldErrors }));
            apiErrorMessage = "Por favor, revisa los errores específicos en los campos.";
          }
        }
      }
      setGeneralError(apiErrorMessage);
    }
  };

  if (!isOpen || !initialData) return null; // No renderizar si no está abierto o no hay datos

  return (
    <div className="modal-clientes">
      <div className="modal-content-clientes formulario">
        {/* Nuevo div para el encabezado del modal con título y botón de cierre */}
        <div className="modal-header-clientes">
          <h2>Editar Cliente</h2> {/* Título para el modal de edición */}
          <button type="button" className="modal-close-button" onClick={onClose}>
            &times; {/* Entidad HTML para el carácter 'X' */}
          </button>
        </div>
        <form className="formularioModalClientes" onSubmit={handleSubmitForm}>
          <ClienteForm
            formData={formData}
            onFormChange={handleFormChange}
            isEditing={true} 
            formErrors={formErrors}
          />
          {generalError && <p className="error-message general-error">{generalError}</p>}
          <div className="clientes-form-actions">
            <button type="submit" className="botonguardarClienteModal">
              Actualizar Cliente {/* Texto del botón para edición */}
            </button>
            {/* El botón Cancelar se ha eliminado */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClienteEditarModal;