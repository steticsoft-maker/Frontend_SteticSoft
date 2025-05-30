// src/features/serviciosAdmin/components/ServicioAdminForm.jsx
import React from 'react';

const MAX_FILE_SIZE_MB = 2; // Definido también en el servicio o como constante global

const ServicioAdminForm = ({ formData, onFormChange, onFileChange, categoriasDisponibles, isEditing, formErrors }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onFormChange(name, type === 'checkbox' ? checked : value);
  };

  return (
    <>
      {/* Clases adaptadas del CSS original de ServiciosAdministrador */}
      <div className="CamposAgregarServicio">
        <label className="asteriscoCamposServicio" htmlFor="nombre">
          Nombre <span className="requiredServicio">*</span>
        </label>
        <input
          id="nombre"
          className="input"
          type="text"
          name="nombre"
          value={formData.nombre || ''}
          onChange={handleChange}
          placeholder="Nombre del servicio"
          required
        />
        {formErrors?.nombre && <span className="error">{formErrors.nombre}</span>}
      </div>

      <div className="CamposAgregarServicio">
        <label className="asteriscoCamposServicio" htmlFor="precio"> {/* Asumiendo que 'asterisco' es para el label, no el campo */}
          Precio <span className="requiredServicio">*</span>
        </label>
        <input
          id="precio"
          className="input"
          type="number"
          name="precio"
          value={formData.precio || ''}
          onChange={handleChange}
          placeholder="Precio del servicio"
          min="0"
          step="0.01"
          required
        />
        {formErrors?.precio && <span className="error">{formErrors.precio}</span>}
      </div>

      <div className="CamposAgregarServicio">
        <label htmlFor="categoria">Categoría</label>
        <select
          id="categoria"
          className="input"
          name="categoria"
          value={formData.categoria || ''}
          onChange={handleChange}
        >
          <option value="" className="opcion">Seleccione una categoría</option>
          {categoriasDisponibles.map((catNombre, index) => (
            <option key={index} value={catNombre}>{catNombre}</option>
          ))}
        </select>
        {/* {formErrors?.categoria && <span className="error">{formErrors.categoria}</span>} opcional si es requerido */}
      </div>
      
      <div className="CamposAgregarServicio">
        <label htmlFor="descripcion">Descripción</label>
        <textarea
            id="descripcion"
            className="input" // Asumir que .input también aplica a textarea o crear .textarea
            name="descripcion"
            value={formData.descripcion || ''}
            onChange={handleChange}
            placeholder="Descripción del servicio (opcional)"
            rows="3"
        />
      </div>

      <div className="CamposAgregarServicio">
        <label htmlFor="imagen">Imagen</label>
        <input
          id="imagen"
          className="input"
          type="file"
          name="imagenFile" // Diferente de 'imagenURL' para el archivo en sí
          accept="image/*"
          onChange={onFileChange} // Este es el e.target.files[0]
        />
        {formErrors?.imagen && <span className="error">{formErrors.imagen}</span>}
        {formData.imagenURL && ( // Muestra la imagen actual o la previsualización
          <img
            src={formData.imagenURL}
            alt="Vista previa"
            style={{ maxWidth: '100px', maxHeight: '100px', marginTop: '10px', objectFit: 'cover' }}
          />
        )}
      </div>

      {isEditing && (
        <div className="CamposAgregarServicio">
          <label>Estado:</label>
          <label className="switch">
            <input
              type="checkbox"
              name="estado"
              checked={formData.estado === "Activo"}
              onChange={(e) => onFormChange('estado', e.target.checked ? "Activo" : "Inactivo")}
            />
            <span className="slider round"></span>
          </label>
        </div>
      )}
    </>
  );
};

export default ServicioAdminForm;