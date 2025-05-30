// src/features/productosAdmin/components/CategoriaProductoForm.jsx
import React from 'react';

const CategoriaProductoForm = ({ formData, onFormChange, isEditing }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onFormChange(name, type === 'checkbox' ? checked : value);
  };

  return (
    <>
      <div className="form-group-categoria">
        <label htmlFor="nombre" className="form-label-categoria">Nombre: <span className="required-asterisk">*</span></label>
        <input
          type="text" id="nombre" name="nombre" placeholder="Nombre de la categoría"
          value={formData.nombre || ''} onChange={handleChange} className="form-input-categoria" required
        />
      </div>
      <div className="form-group-categoria">
        <label htmlFor="descripcion" className="form-label-categoria">Descripción: <span className="required-asterisk">*</span></label>
        <textarea
          id="descripcion" name="descripcion" placeholder="Descripción de la categoría"
          value={formData.descripcion || ''} onChange={handleChange} className="form-textarea-categoria" required
        ></textarea>
      </div>
      <div className="form-group-categoria">
        <label htmlFor="vidaUtil" className="form-label-categoria">Vida Útil (días): <span className="required-asterisk">*</span></label>
        <input
          type="number" id="vidaUtil" name="vidaUtil" placeholder="Ej: 365"
          value={formData.vidaUtil || ''} onChange={handleChange} className="form-input-categoria" required min="1"
        />
      </div>
      <div className="form-group-categoria">
        <label htmlFor="tipoUso" className="form-label-categoria">Tipo de Uso: <span className="required-asterisk">*</span></label>
        <select
          id="tipoUso" name="tipoUso" value={formData.tipoUso || ''} onChange={handleChange}
          className="form-select-categoria" required
        >
          <option value="" disabled>Seleccione el tipo de uso</option>
          <option value="Interno">Interno (Uso)</option> {/* Ajustado para coincidir con script BD */}
          <option value="Externo">Externo (Venta)</option> {/* Ajustado */}
        </select>
      </div>
      {isEditing && ( // Solo mostrar el toggle de estado al editar
        <div className="form-group-categoria" style={{ flexDirection: 'row', alignItems: 'center' }}>
          <label htmlFor="estadoCat" className="form-label-categoria" style={{ marginBottom: 0, marginRight: '10px' }}>Estado:</label>
          <label className="switch">
            <input type="checkbox" id="estadoCat" name="estado" checked={formData.estado} onChange={handleChange} />
            <span className="slider round"></span>
          </label>
        </div>
      )}
    </>
  );
};
export default CategoriaProductoForm;