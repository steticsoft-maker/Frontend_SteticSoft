// src/features/productosAdmin/components/CategoriaProductoForm.jsx
import React from 'react';

const CategoriaProductoForm = ({ formData, onFormChange, isEditing, formErrors }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Pasa el valor directamente al padre para la validación en tiempo real
    onFormChange(name, type === 'checkbox' ? checked : value);
  };

  return (
    <>
      <div className="form-group-categoria">
        <label htmlFor="nombre" className="form-label-categoria">Nombre: <span className="required-asterisk">*</span></label>
        <input
          type="text" id="nombre" name="nombre" placeholder="Nombre de la categoría"
          value={formData.nombre ?? ''} onChange={handleChange} className="form-input-categoria"
        />
        {formErrors.nombre && <p className="error-message">{formErrors.nombre}</p>}
      </div>
      <div className="form-group-categoria">
        <label htmlFor="descripcion" className="form-label-categoria">Descripción: <span className="required-asterisk">*</span></label>
        <textarea
          id="descripcion" name="descripcion" placeholder="Descripción de la categoría"
          value={formData.descripcion ?? ''} onChange={handleChange} className="form-textarea-categoria"
        ></textarea>
        {formErrors.descripcion && <p className="error-message">{formErrors.descripcion}</p>}
      </div>
      {isEditing && (
        <div className="form-group-categoria" style={{ flexDirection: 'row', alignItems: 'center' }}>
          <label htmlFor="estadoCat" className="form-label-categoria" style={{ marginBottom: 0, marginRight: '10px' }}>Estado:</label>
          <label className="switch">
            <input
              type="checkbox" id="estadoCat" name="estado"
              checked={formData.estado ?? true} onChange={handleChange}
            />
            <span className="slider round"></span>
          </label>
        </div>
      )}
    </>
  );
};

export default CategoriaProductoForm;