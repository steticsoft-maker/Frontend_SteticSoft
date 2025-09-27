// src/features/citas/components/CitaForm.jsx
import React, { useState } from 'react';
import '../css/Citas.css'; // Estilos específicos para este formulario

const CitaForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
  });
  const [errors, setErrors] = useState({});
  const [warnings, setWarnings] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre) newErrors.nombre = 'El nombre es obligatorio.';
    if (!formData.email) {
      newErrors.email = 'El correo electrónico es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El formato del correo no es válido.';
    }
    if (!formData.telefono) newErrors.telefono = 'El teléfono es obligatorio.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateField = (fieldName, value) => {
    const newErrors = { ...errors };
    const newWarnings = { ...warnings };
    
    // Validar espacios al inicio y final
    if (value && typeof value === 'string' && (value !== value.trim())) {
      newWarnings[fieldName] = 'No se permiten espacios al inicio o final';
    } else {
      delete newWarnings[fieldName];
    }
    
    // Validar caracteres especiales para nombres
    if (fieldName === 'nombre' && value && typeof value === 'string') {
      const caracteresEspeciales = /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/;
      if (caracteresEspeciales.test(value)) {
        newErrors[fieldName] = 'No se permiten caracteres especiales, solo letras y espacios';
      } else {
        delete newErrors[fieldName];
      }
    }
    
    setErrors(newErrors);
    setWarnings(newWarnings);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    // Limpiar espacios al perder el foco
    const trimmedValue = typeof value === 'string' ? value.trim() : value;
    setFormData(prev => ({ ...prev, [name]: trimmedValue }));
    
    // Limpiar warnings después de limpiar espacios
    const newWarnings = { ...warnings };
    delete newWarnings[name];
    setWarnings(newWarnings);
    
    // Validar en el evento onBlur para feedback en tiempo real
    validate();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form className="booking-form" onSubmit={handleSubmit} noValidate>
      <h4>Ingresa tus Datos</h4>
      <div className="form-field">
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
        <label htmlFor="nombre" className={formData.nombre ? 'filled' : ''}>Nombre Completo</label>
        {warnings.nombre && <span className="field-warning">{warnings.nombre}</span>}
        {errors.nombre && <span className="error-message">{errors.nombre}</span>}
      </div>
      <div className="form-field">
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
        <label htmlFor="email" className={formData.email ? 'filled' : ''}>Correo Electrónico</label>
        {warnings.email && <span className="field-warning">{warnings.email}</span>}
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>
      <div className="form-field">
        <input
          type="tel"
          id="telefono"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
        <label htmlFor="telefono" className={formData.telefono ? 'filled' : ''}>Teléfono</label>
        {warnings.telefono && <span className="field-warning">{warnings.telefono}</span>}
        {errors.telefono && <span className="error-message">{errors.telefono}</span>}
      </div>
      <button type="submit" className="submit-button">Confirmar Cita</button>
    </form>
  );
};

export default CitaForm;
