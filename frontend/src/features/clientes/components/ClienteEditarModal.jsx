// INICIO DE MODIFICACIÓN
import React, { useState, useEffect } from 'react';
import ClienteForm from './ClienteForm';
import '../css/Clientes.css';

const ClienteEditarModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && initialData) {
      const dataToEdit = { ...initialData };
      delete dataToEdit.contrasena;
      delete dataToEdit.confirmPassword;

      setFormData({
        ...dataToEdit,
        estado: initialData.estado !== undefined ? initialData.estado : true,
      });
      setErrors({});
      setLoading(false);
    } else if (isOpen && !initialData) {
      onClose();
    }
  }, [isOpen, initialData, onClose]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const backendErrors = error.response.data.errors.reduce((acc, err) => {
          acc[err.param] = err.msg;
          return acc;
        }, {});
        setErrors(backendErrors);
      } else {
        setErrors({ general: error.message || "Ocurrió un error inesperado al actualizar el cliente." });
      }
    } finally {
      setLoading(false);
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
        <form className="formularioModalClientes" onSubmit={handleSubmit}>
          <ClienteForm
            formData={formData}
            handleChange={handleChange}
            isEditing={true}
            errors={errors}
          />
          {errors.general && <p className="error-message general-error">{errors.general}</p>}
          <div className="clientes-form-actions">
            <button type="submit" className="botonguardarClienteModal" disabled={loading}>
              {loading ? 'Actualizando...' : 'Actualizar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
// FIN DE MODIFICACIÓN

export default ClienteEditarModal;