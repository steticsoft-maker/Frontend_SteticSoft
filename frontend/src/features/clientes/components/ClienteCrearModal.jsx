// src/features/clientes/components/ClienteCrearModal.jsx
import React, { useState, useEffect } from 'react';
import ClienteForm from './ClienteForm';
import { verificarDatosClienteAPI } from '../services/clientesService';
import { verificarCorreoUsuarioAPI } from '../../usuarios/services/usuariosService'; // Asumiendo ruta

const ClienteCrearModal = ({ isOpen, onClose, onSubmit }) => {
  const getInitialFormState = () => ({
    nombre: '',
    apellido: '',
    correo: '', // Cambiado de 'email' a 'correo' para coincidir con el backend
    telefono: '',
    tipoDocumento: 'Cédula de Ciudadanía', // Ajustado a un valor exacto de tu backend. Asegúrate de que ClienteForm también lo use.
    numeroDocumento: '',
    fechaNacimiento: '',
    contrasena: '', // Cambiado de 'password' a 'contrasena' para coincidir con el backend
    estado: true, // Nuevos clientes activos por defecto (para el perfil de cliente)
  });

  const [formData, setFormData] = useState(getInitialFormState());
  const [formErrors, setFormErrors] = useState({}); // Para validaciones futuras

  // Resetear formulario cuando el modal se abre
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

  const handleFieldBlur = async (name, value) => {
    let newErrors = { ...formErrors };
    let validationPerformed = false;

    if (name === 'correo') {
      validationPerformed = true;
      if (!value?.trim()) {
        newErrors.correo = "El correo es obligatorio.";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        newErrors.correo = "El formato del correo no es válido.";
      } else {
        try {
          // 1. Verificar en tabla Usuarios (más general)
          await verificarCorreoUsuarioAPI(value, null); // null para idUsuarioActual en creación
          // 2. Verificar en tabla Clientes (específico del perfil)
          await verificarDatosClienteAPI({ correo: value }, null); // null para idClienteActual en creación
          newErrors.correo = ""; // Limpiar error si ambas verificaciones pasan
        } catch (error) {
          newErrors.correo = error.message || "Error al verificar el correo.";
        }
      }
    } else if (name === 'numeroDocumento') {
      validationPerformed = true;
      if (!value?.trim()) {
        newErrors.numeroDocumento = "El número de documento es obligatorio.";
      } else {
        try {
          await verificarDatosClienteAPI({ numero_documento: value }, null);
          newErrors.numeroDocumento = "";
        } catch (error) {
          newErrors.numeroDocumento = error.errors?.numero_documento || error.message || "Error al verificar el documento.";
        }
      }
    }
    if (validationPerformed) {
      setFormErrors(newErrors);
    }
  };

  const isFormCompletelyValid = () => {
    return Object.values(formErrors).every(errorMsg => !errorMsg);
  };

  const validateForm = () => { // Para validaciones onSubmit que no son onBlur
    const errors = { ...formErrors };
    if (!formData.nombre.trim()) errors.nombre = "El nombre es obligatorio.";
    if (!formData.apellido.trim()) errors.apellido = "El apellido es obligatorio.";
    if (!formData.telefono.trim()) errors.telefono = "El teléfono es obligatorio.";
    if (!formData.tipoDocumento) errors.tipoDocumento = "El tipo de documento es obligatorio.";
    if (!formData.fechaNacimiento) errors.fechaNacimiento = "La fecha de nacimiento es obligatoria.";
    if (!formData.contrasena.trim()) errors.contrasena = "La contraseña es obligatoria para nuevos clientes.";

    // Re-validar correo y numeroDocumento si no tienen ya un error de onBlur
    if (!errors.correo) {
        if (!formData.correo.trim()) errors.correo = "El correo es obligatorio.";
        else if (!/\S+@\S+\.\S+/.test(formData.correo)) errors.correo = "El correo electrónico no es válido.";
    }
    if (!errors.numeroDocumento) {
        if (!formData.numeroDocumento.trim()) errors.numeroDocumento = "El número de documento es obligatorio.";
    }

    setFormErrors(errors);
    return Object.values(errors).every(errorMsg => !errorMsg);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!validateForm() || !isFormCompletelyValid()) return; // Comprobar ambas validaciones
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-clientes">
      <div className="modal-content-clientes formulario">
        <h2>Agregar Cliente</h2>
        <form className="formularioModalClientes" onSubmit={handleSubmitForm}>
          <ClienteForm
            formData={formData}
            onFormChange={handleFormChange}
            isEditing={false}
            formErrors={formErrors}
            onFieldBlur={handleFieldBlur} // Pasar la nueva prop
          />
          <div className="clientes-form-actions">
            <button type="submit" className="botonguardarClienteModal" disabled={!isFormCompletelyValid()}>
              Guardar Cliente
            </button>
            <button type="button" className="botonModalCancelar-Cerrar" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClienteCrearModal;