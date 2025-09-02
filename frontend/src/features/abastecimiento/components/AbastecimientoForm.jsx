// src/features/abastecimiento/components/AbastecimientoForm.jsx
import React from "react";

const AbastecimientoForm = ({
  formData,
  onInputChange,
  onSelectProduct,
  formErrors,
}) => {
  return (
    <>
      <div className="form-group-abastecimiento">
        <label className="form-label-abastecimiento">
          Producto: <span className="required-asterisk">*</span>
        </label>
        <button
          type="button"
          className="form-button-select-abastecimiento"
          onClick={onSelectProduct}
          disabled={!onSelectProduct}
        >
          {formData.productoNombre || "Seleccionar Producto"}
        </button>
        {formErrors?.productoId && (
          <p className="error-abastecimiento">{formErrors.productoId}</p>
        )}
      </div>

      <div className="form-group-abastecimiento">
        <label
          htmlFor="empleadoAsignado"
          className="form-label-abastecimiento"
        >
          Empleado Asignado: <span className="required-asterisk">*</span>
        </label>
        <input
          id="empleadoAsignado"
          className="form-input-abastecimiento"
          type="text"
          name="empleadoAsignado"
          placeholder="Nombre del empleado"
          value={formData.empleadoAsignado || ""}
          onChange={onInputChange}
          required
        />
        {formErrors?.empleadoAsignado && (
          <p className="error-abastecimiento">{formErrors.empleadoAsignado}</p>
        )}
      </div>

      <div className="form-group-abastecimiento">
        <label
          htmlFor="cantidadAbastecimiento"
          className="form-label-abastecimiento"
        >
          Cantidad: <span className="required-asterisk">*</span>
        </label>
        <input
          id="cantidadAbastecimiento"
          className="form-input-abastecimiento"
          type="number"
          name="cantidad"
          placeholder="Cantidad de unidades"
          value={formData.cantidad || ""}
          onChange={onInputChange}
          required
          min="1"
        />
        {formErrors?.cantidad && (
          <p className="error-abastecimiento">{formErrors.cantidad}</p>
        )}
      </div>
    </>
  );
};

export default AbastecimientoForm;