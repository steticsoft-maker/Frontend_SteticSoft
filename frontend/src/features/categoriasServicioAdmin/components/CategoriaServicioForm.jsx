// src/features/categoriasServicioAdmin/components/CategoriaServicioForm.jsx
import React from 'react';

const CategoriaServicioForm = ({ formData, onFormChange, isEditing }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onFormChange(name, type === 'checkbox' ? checked : value);
  };

  return (
    <>
      <div className="camposAgregarCategoria"> {/* Clase del CSS original */}
        <label className="asteriscoCampoObligatorioCategoria">
          Nombre <span className="requiredCategoria">*</span> {/* Clases del CSS original */}
        </label>
        <input
          className="campoAgregarCategoria" /* Clase del CSS original */
          type="text"
          name="nombre"
          value={formData.nombre || ''}
          onChange={handleChange}
          placeholder="Nombre de la categoría"
          required
        />
      </div>
      <div className="camposAgregarCategoria">
        <label>Descripción</label>
        <input
          className="campoAgregarCategoria"
          type="text"
          name="descripcion"
          value={formData.descripcion || ''}
          onChange={handleChange}
          placeholder="Descripción (opcional)"
        />
      </div>
      {isEditing && (
         <div className="camposAgregarCategoria">
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
export default CategoriaServicioForm;