// src/features/abastecimiento/components/AbastecimientoForm.jsx
import React from 'react';

const AbastecimientoForm = ({
  formData,
  onInputChange,
  onSelectCategory,
  onSelectProduct,
  onSelectEmployee,
  isEditing,
  formErrors 
}) => {
  return (
    <>
      <div className="form-group-abastecimiento">
        <label className="form-label-abastecimiento">Categoría: <span className="required-asterisk">*</span></label>
        <button 
          type="button" 
          className="form-button-select-abastecimiento" 
          onClick={onSelectCategory}
          disabled={isEditing} // Deshabilitar si está en modo edición
        >
          {formData.category || "Seleccionar Categoría"}
        </button>
        {!isEditing && formErrors?.category && <p className="error-abastecimiento">{formErrors.category}</p>}
        {isEditing && <p><strong>Categoría:</strong> {formData.category || "N/A"}</p>}
      </div>

      <div className="form-group-abastecimiento">
        <label className="form-label-abastecimiento">Producto: <span className="required-asterisk">*</span></label>
        <button
          type="button"
          className="form-button-select-abastecimiento"
          onClick={onSelectProduct}
          disabled={(!formData.category && !isEditing) || isEditing} // Deshabilitar si no hay categoría (creación) O si es edición
        >
          {formData.nombre || "Seleccionar Producto"}
        </button>
        {!isEditing && formErrors?.nombre && <p className="error-abastecimiento">{formErrors.nombre}</p>}
        {isEditing && <p><strong>Producto:</strong> {formData.nombre || "N/A"}</p>}
      </div>

      <div className="form-group-abastecimiento">
        <label className="form-label-abastecimiento">Empleado: <span className="required-asterisk">*</span></label>
        <button 
          type="button" 
          className="form-button-select-abastecimiento" 
          onClick={onSelectEmployee}
          disabled={isEditing} // Deshabilitar si está en modo edición
        >
          {formData.empleado || "Seleccionar Empleado"}
        </button>
        {!isEditing && formErrors?.empleado && <p className="error-abastecimiento">{formErrors.empleado}</p>}
        {isEditing && <p><strong>Empleado:</strong> {formData.empleado || "N/A"}</p>}
      </div>

      <div className="form-group-abastecimiento">
        <label htmlFor="cantidadAbastecimiento" className="form-label-abastecimiento">Cantidad: <span className="required-asterisk">*</span></label>
        <input
          id="cantidadAbastecimiento"
          className="form-input-abastecimiento"
          type="number"
          name="cantidad"
          placeholder="Cantidad"
          value={formData.cantidad || ''}
          onChange={onInputChange} // onInputChange viene del modal padre
          required
          min="1"
        />
        {formErrors?.cantidad && <p className="error-abastecimiento">{formErrors.cantidad}</p>}
      </div>
    </>
  );
};
export default AbastecimientoForm;