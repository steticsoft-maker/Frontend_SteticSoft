// src/features/abastecimiento/components/AbastecimientoForm.jsx
import React from 'react';

const AbastecimientoForm = ({
  formData,
  onInputChange,
  onSelectCategory,
  onSelectProduct,
  onSelectEmployee,
  isEditing // Para deshabilitar campos si es necesario
}) => {
  return (
    <>
      <div className="form-group-abastecimiento">
        <label className="form-label-abastecimiento">Categoría: <span className="required-asterisk">*</span></label>
        <button type="button" className="form-button-select-abastecimiento" onClick={onSelectCategory}>
          Seleccionar Categoría
        </button>
        <p><strong>Categoría Seleccionada:</strong> {formData.category || "Ninguna"}</p>
      </div>

      <div className="form-group-abastecimiento">
        <label className="form-label-abastecimiento">Producto: <span className="required-asterisk">*</span></label>
        <button
          type="button"
          className="form-button-select-abastecimiento"
          onClick={onSelectProduct}
          disabled={!formData.category && !isEditing} // Deshabilitar si no hay categoría en modo creación
        >
          Seleccionar Producto
        </button>
        <p><strong>Producto Seleccionado:</strong> {formData.nombre || "Ninguno"}</p>
      </div>

      <div className="form-group-abastecimiento">
        <label className="form-label-abastecimiento">Empleado: <span className="required-asterisk">*</span></label>
        <button type="button" className="form-button-select-abastecimiento" onClick={onSelectEmployee}>
          Seleccionar Empleado
        </button>
        <p><strong>Empleado Seleccionado:</strong> {formData.empleado || "Ninguno"}</p>
      </div>

      <div className="form-group-abastecimiento">
        <label htmlFor="cantidad" className="form-label-abastecimiento">Cantidad: <span className="required-asterisk">*</span></label>
        <input
          id="cantidad"
          className="form-input-abastecimiento"
          type="number"
          name="cantidad"
          placeholder="Cantidad"
          value={formData.cantidad || ''}
          onChange={onInputChange}
          required
          min="1"
        />
      </div>
    </>
  );
};
export default AbastecimientoForm;