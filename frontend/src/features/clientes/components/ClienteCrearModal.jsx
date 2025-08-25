// src/features/clientes/components/ClienteCrearModal.jsx
import React, { useState, useEffect } from 'react';
import ClienteForm from './ClienteForm';
import { clientesService } from '../services/clientesService';
import '../css/Clientes.css';

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
    confirmPassword: '',
    estado: true,
  });

  const [formData, setFormData] = useState(getInitialFormState());
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  useEffect(() => {
    if (isOpen) {
      const initialData = getInitialFormState();
      setFormData(initialData);
      validateForm(initialData, true);
    }
  }, [isOpen]);

  const validateField = async (name, value, currentData) => {
    let error = "";
    switch (name) {
      case "nombre":
        if (!value) error = "El nombre es obligatorio.";
        else if (value.length < 2 || value.length > 100) error = "El nombre debe tener entre 2 y 100 caracteres.";
        break;
      case "apellido":
        if (!value) error = "El apellido es obligatorio.";
        else if (value.length < 2 || value.length > 100) error = "El apellido debe tener entre 2 y 100 caracteres.";
        break;
      case "telefono":
        if (!value) error = "El teléfono es obligatorio.";
        else if (!/^\d{7,45}$/.test(value)) error = "El teléfono debe tener entre 7 y 45 dígitos.";
        break;
      case "numeroDocumento":
        if (!value) error = "El número de documento es obligatorio.";
        else if (!/^\d{5,45}$/.test(value)) error = "El documento debe tener entre 5 y 45 dígitos.";
        else {
          const response = await clientesService.verificarDatosUnicos({ numeroDocumento: value });
          if (response.errors?.numeroDocumento) error = response.errors.numeroDocumento;
        }
        break;
      case "direccion":
        if (!value) error = "La dirección es obligatoria.";
        else if (value.length > 255) error = "La dirección no puede tener más de 255 caracteres.";
        break;
      case "correo":
        if (!value) error = "El correo es obligatorio.";
        else if (!/\S+@\S+\.\S+/.test(value)) error = "El formato del correo no es válido.";
        else {
            const response = await clientesService.verificarDatosUnicos({ correo: value });
            if (response.errors?.correo) error = response.errors.correo;
        }
        break;
      case "fechaNacimiento":
        if (!value) error = "La fecha de nacimiento es obligatoria.";
        else if (new Date(value) > new Date()) error = "La fecha de nacimiento no puede ser futura.";
        break;
      case "contrasena":
        if (!value) error = "La contraseña es obligatoria.";
        else if (value.length < 8) error = "La contraseña debe tener al menos 8 caracteres.";
        else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(value)) error = "Debe incluir mayúscula, minúscula, número y símbolo.";
        break;
      case "confirmPassword":
        if (value !== currentData.contrasena) error = "Las contraseñas no coinciden.";
        break;
      default:
        break;
    }
    return error;
  };

  const validateForm = async (data, isInitial = false) => {
    const newErrors = {};
    for (const key in data) {
      // On initial validation, only check for required fields that are empty
      if (isInitial) {
        if (data[key] === '' && key !== 'confirmPassword' && key !== 'estado') {
            newErrors[key] = `El campo es obligatorio.`;
        }
      } else {
        const error = await validateField(key, data[key], data);
        if (error) {
          newErrors[key] = error;
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormChange = async (name, value) => {
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    const error = await validateField(name, value, newFormData);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleBlur = async (e) => {
    const { name, value } = e.target;
    const error = await validateField(name, value, formData);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setGeneralError('');
    const isValid = await validateForm(formData);
    if (!isValid) {
      setGeneralError("Por favor, corrige los errores en el formulario.");
      return;
    }

    try {
      const dataToSubmit = { ...formData };
      delete dataToSubmit.confirmPassword;
      await onSubmit(dataToSubmit);
      onClose();
    } catch (error) {
        console.error("Error al guardar cliente en ClienteCrearModal:", error);
        let apiErrorMessage = "Ocurrió un error inesperado al guardar el cliente.";
        if (error.response?.data?.message) {
            apiErrorMessage = error.response.data.message;
        }
        setGeneralError(apiErrorMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-clientes">
      <div className="modal-content-clientes formulario">
        <div className="modal-header-clientes">
          <h2>Agregar Cliente</h2>
          <button type="button" className="modal-close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <form className="formularioModalClientes" onSubmit={handleSubmitForm}>
          <ClienteForm
            formData={formData}
            onFormChange={handleFormChange}
            onBlur={handleBlur}
            isEditing={false}
            errors={errors}
          />
          {generalError && <p className="error-message general-error">{generalError}</p>}
          <div className="clientes-form-actions">
            <button type="submit" className="botonguardarClienteModal">
              Guardar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClienteCrearModal;