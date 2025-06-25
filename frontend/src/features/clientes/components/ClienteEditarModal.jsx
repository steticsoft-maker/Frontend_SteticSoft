// src/features/clientes/components/ClienteEditarModal.jsx
import React, { useState, useEffect } from 'react';
import ClienteForm from './ClienteForm';
import { verificarDatosClienteAPI } from '../services/clientesService';
import { verificarCorreoUsuarioAPI } from '../../usuarios/services/usuariosService';

const ClienteEditarModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isOpen && initialData) {
      // Al editar, no incluimos la contraseña (contrasena) para que no se muestre ni se envíe directamente
      // Se manejaría por separado si se quiere permitir cambio de contraseña.
      // initialData ya debería venir con 'correo' y el estado booleano.
      const dataToEdit = { ...initialData };
      delete dataToEdit.contrasena; // Aseguramos que la contraseña no esté en el form para editar

      setFormData({
        ...dataToEdit,
        correo: initialData.correo,
        estado: initialData.estado !== undefined ? initialData.estado : true, // Asegurar que estado se cargue
      });
      setFormErrors({});
    } else if (isOpen && !initialData) {
      console.error("Modal de edición de cliente abierto sin initialData. Cerrando.");
      onClose(); // Cerrar si no hay datos para editar
    }
  }, [isOpen, initialData, onClose]);

  const handleFormChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prevErr => ({ ...prevErr, [name]: '' }));
    }
  };

  const handleFieldBlur = async (name, value) => {
    let newErrors = { ...formErrors };
    let validationPerformed = false;
    const idClienteActual = initialData?.idCliente;
    const idUsuarioAsociado = initialData?.usuarioCuenta?.idUsuario;

    if (name === 'correo') {
      validationPerformed = true;
      if (!value?.trim()) {
        newErrors.correo = "El correo es obligatorio.";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        newErrors.correo = "El formato del correo no es válido.";
      } else if (value === initialData?.correo) { // No validar si no cambió
        newErrors.correo = "";
      } else {
        try {
          // 1. Verificar en tabla Usuarios
          await verificarCorreoUsuarioAPI(value, idUsuarioAsociado);
          // 2. Verificar en tabla Clientes
          await verificarDatosClienteAPI({ correo: value }, idClienteActual);
          newErrors.correo = "";
        } catch (error) {
          newErrors.correo = error.message || "Error al verificar el correo.";
        }
      }
    } else if (name === 'numeroDocumento') { // En el form es numeroDocumento (camelCase)
      validationPerformed = true;
      if (!value?.trim()) {
        newErrors.numeroDocumento = "El número de documento es obligatorio.";
      } else if (value === initialData?.numeroDocumento) { // No validar si no cambió
        newErrors.numeroDocumento = "";
      } else {
        try {
          // El servicio espera numero_documento (snake_case)
          await verificarDatosClienteAPI({ numero_documento: value }, idClienteActual);
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
    if (!formData.nombre?.trim() && !errors.nombre) errors.nombre = "El nombre es obligatorio.";
    if (!formData.apellido?.trim() && !errors.apellido) errors.apellido = "El apellido es obligatorio.";
    if (!formData.telefono?.trim() && !errors.telefono) errors.telefono = "El teléfono es obligatorio.";
    if (!formData.tipoDocumento && !errors.tipoDocumento) errors.tipoDocumento = "El tipo de documento es obligatorio.";
    if (!formData.fechaNacimiento && !errors.fechaNacimiento) errors.fechaNacimiento = "La fecha de nacimiento es obligatoria.";

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
    if (!validateForm() || !isFormCompletelyValid()) return;
    onSubmit(formData);
  };

  if (!isOpen || !initialData) return null;

  return (
    <div className="modal-clientes">
      <div className="modal-content-clientes formulario">
        <h2>Editar Cliente</h2>
        <form className="formularioModalClientes" onSubmit={handleSubmitForm}>
          <ClienteForm
            formData={formData}
            onFormChange={handleFormChange}
            isEditing={true}
            formErrors={formErrors}
            onFieldBlur={handleFieldBlur} // Pasar la nueva prop
          />
          <div className="clientes-form-actions">
            <button type="submit" className="botonguardarClienteModal" disabled={!isFormCompletelyValid()}>
              Actualizar Cliente
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

export default ClienteEditarModal;