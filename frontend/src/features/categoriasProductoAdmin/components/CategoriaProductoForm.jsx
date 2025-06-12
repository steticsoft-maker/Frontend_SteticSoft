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
          value={formData.descripcion || ''} onChange={handleChange} className="form-textarea-categoria" 
          // CAMBIO: Quitar 'required' si la descripción es opcional en el backend
          // Si el backend la hace opcional, el frontend debería ser consistente o manejar la validación de otra manera.
          // Por defecto, la dejaré sin 'required' para reflejar la opcionalidad del backend.
          // Si necesitas que sea obligatoria para el usuario, debes ajustarlo en tu modelo de BD también.
        ></textarea> 
      </div>
      <div className="form-group-categoria">
        {/* CAMBIO: Consistentemente 'vidaUtilDias' con el backend */}
        <label htmlFor="vidaUtilDias" className="form-label-categoria">Vida Útil (días): <span className="required-asterisk">*</span></label>
        <input
          type="number" id="vidaUtilDias" name="vidaUtilDias" placeholder="Ej: 365" // CAMBIO: name y id
          value={formData.vidaUtilDias || ''} onChange={handleChange} className="form-input-categoria" required min="1"
        />
      </div>
      <div className="form-group-categoria">
        <label htmlFor="tipoUso" className="form-label-categoria">Tipo de Uso: <span className="required-asterisk">*</span></label>
        <select
          id="tipoUso" name="tipoUso" value={formData.tipoUso || ''} onChange={handleChange}
          className="form-select-categoria" required
        >
          <option value="" disabled>Seleccione el tipo de uso</option>
          <option value="Interno">Interno (Uso)</option>
          <option value="Externo">Externo (Venta)</option>
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