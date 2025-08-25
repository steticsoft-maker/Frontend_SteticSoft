// src/features/clientes/components/ClienteEditarModal.jsx
import React, { useState, useEffect } from 'react';
import ClienteForm from './ClienteForm';
import { clientesService } from '../services/clientesService';
import '../css/Clientes.css';

const ClienteEditarModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    if (isOpen && initialData) {
      const dataToEdit = { ...initialData };
      delete dataToEdit.contrasena;
      delete dataToEdit.confirmPassword;
      setFormData({
        ...dataToEdit,
        estado: initialData.estado !== undefined ? initialData.estado : true,
      });
      setOriginalData(dataToEdit);
      setErrors({});
      setGeneralError('');
    }
  }, [isOpen, initialData]);

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
            else if (value !== originalData.numeroDocumento) {
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
            else if (value !== originalData.correo) {
                const response = await clientesService.verificarDatosUnicos({ correo: value });
                if (response.errors?.correo) error = response.errors.correo;
            }
            break;
        case "fechaNacimiento":
            if (!value) error = "La fecha de nacimiento es obligatoria.";
            else if (new Date(value) > new Date()) error = "La fecha de nacimiento no puede ser futura.";
            break;
        default:
            break;
    }
    return error;
  };

  const validateForm = async (data) => {
    const newErrors = {};
    for (const key in data) {
      if (key !== 'estado' && key !== 'idCliente' && key !== 'idUsuario') {
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
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error al actualizar cliente en ClienteEditarModal:", error);
      let apiErrorMessage = "Ocurrió un error inesperado al actualizar el cliente.";
      if (error.response?.data?.message) {
        apiErrorMessage = error.response.data.message;
      }
      setGeneralError(apiErrorMessage);
    }
  };

  if (!isOpen || !initialData) return null;

  return (
    <div className="modal-clientes">
      <div className="modal-content-clientes formulario">
        <div className="modal-header-clientes">
          <h2>Editar Cliente</h2>
          <button type="button" className="modal-close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <form className="formularioModalClientes" onSubmit={handleSubmitForm}>
          <ClienteForm
            formData={formData}
            onFormChange={handleFormChange}
            onBlur={handleBlur}
            isEditing={true}
            errors={errors}
          />
          {generalError && <p className="error-message general-error">{generalError}</p>}
          <div className="clientes-form-actions">
            <button type="submit" className="botonguardarClienteModal">
              Actualizar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClienteEditarModal;