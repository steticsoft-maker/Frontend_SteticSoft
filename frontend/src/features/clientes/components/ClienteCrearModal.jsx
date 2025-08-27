// INICIO DE MODIFICACIÓN
import React, { useState, useEffect } from 'react';
import ClienteForm from './ClienteForm';
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormState());
      setErrors({});
      setLoading(false);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    if (name === 'contrasena' && errors.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (formData.contrasena !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Las contraseñas no coinciden." });
      return;
    }

    setLoading(true);
    try {
      const dataToSubmit = { ...formData };
      delete dataToSubmit.confirmPassword;

      await onSubmit(dataToSubmit);
      onClose();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const backendErrors = error.response.data.errors.reduce((acc, err) => {
          acc[err.param] = err.msg;
          return acc;
        }, {});
        setErrors(backendErrors);
      } else {
        setErrors({ general: error.message || "Ocurrió un error inesperado al guardar el cliente." });
      }
    } finally {
      setLoading(false);
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
        <form className="formularioModalClientes" onSubmit={handleSubmit}>
          <ClienteForm
            formData={formData}
            handleChange={handleChange}
            isEditing={false}
            errors={errors}
          />
          {errors.general && <p className="error-message general-error">{errors.general}</p>}
          <div className="clientes-form-actions">
            <button type="submit" className="botonguardarClienteModal" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
// FIN DE MODIFICACIÓN

export default ClienteCrearModal;