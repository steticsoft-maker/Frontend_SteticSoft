// src/features/productosAdmin/components/CategoriaProductoForm.jsx
import React from 'react';
import '../../../shared/styles/admin-layout.css';

const CategoriaProductoForm = ({ formData, onFormChange, isEditing, formErrors }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Pasa el valor directamente al padre para la validación en tiempo real
    onFormChange(name, type === 'checkbox' ? checked : value);
  };

  return (
    <>
      <div className="admin-form-section">
        <h3 className="admin-form-section-title">Información de la Categoría</h3>
        <div className="admin-form-group">
          <label htmlFor="nombre" className="admin-form-label">
            Nombre: <span className="required-asterisk">*</span>
          </label>
          <input
            type="text" 
            id="nombre" 
            name="nombre" 
            placeholder="Nombre de la categoría"
            value={formData.nombre ?? ''} 
            onChange={handleChange} 
            className={`admin-form-input ${formErrors.nombre ? 'error' : ''}`}
            required
          />
          {formErrors.nombre && (
            <span className="admin-form-error">{formErrors.nombre}</span>
          )}
        </div>

        <div className="admin-form-group">
          <label htmlFor="descripcion" className="admin-form-label">
            Descripción: <span className="required-asterisk">*</span>
          </label>
          <textarea
            id="descripcion" 
            name="descripcion" 
            placeholder="Descripción de la categoría"
            value={formData.descripcion ?? ''} 
            onChange={handleChange} 
            className={`admin-form-textarea ${formErrors.descripcion ? 'error' : ''}`}
            rows="4"
            required
          />
          {formErrors.descripcion && (
            <span className="admin-form-error">{formErrors.descripcion}</span>
          )}
        </div>

        {isEditing && (
          <div className="admin-form-group">
            <label className="admin-form-label">Estado:</label>
            <label className="switch">
              <input
                type="checkbox" 
                id="estadoCat" 
                name="estado"
                checked={formData.estado ?? true} 
                onChange={handleChange}
              />
              <span className="slider"></span>
            </label>
          </div>
        )}
      </div>
    </>
  );
};

export default CategoriaProductoForm;