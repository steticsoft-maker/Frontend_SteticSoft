// src/features/abastecimiento/components/AbastecimientoForm.jsx
import React from 'react';

const AbastecimientoForm = ({
  formData,
  onInputChange,
  onSelectProduct,
  onSelectEmployee,
  isEditing,
  formErrors,
  categorias, // <-- Recibe la lista de categorías
  onCategoryChange, // <-- Recibe la función para manejar el cambio de categoría
}) => {
  return (
    <>
      {/* Campo para seleccionar la Categoría */}
      <div className="form-group-abastecimiento">
        <label htmlFor="categoriaProducto" className="form-label-abastecimiento">Categoría: <span className="required-asterisk">*</span></label>
        <select
          id="categoriaProducto"
          name="categoriaId"
          className="form-input-abastecimiento"
          value={formData.categoriaId || ''}
          onChange={onCategoryChange} // Usamos el nuevo manejador
          disabled={isEditing}
          required
        >
          <option value="" disabled>Seleccione una categoría</option>
          {categorias.map(cat => (
            <option key={cat.idCategoria} value={cat.idCategoria}>{cat.nombre}</option>
          ))}
        </select>
        {formErrors?.categoriaId && <p className="error-abastecimiento">{formErrors.categoriaId}</p>}
      </div>

      <div className="form-group-abastecimiento">
        <label className="form-label-abastecimiento">Producto: <span className="required-asterisk">*</span></label>
        <button
          type="button"
          className="form-button-select-abastecimiento"
          onClick={onSelectProduct}
          disabled={isEditing || !formData.categoriaId} // Deshabilitado si no hay categoría
          title={!formData.categoriaId ? "Seleccione una categoría primero" : "Seleccionar Producto"}
        >
          {formData.productoNombre || "Seleccionar Producto"}
        </button>
        {formErrors?.productoId && <p className="error-abastecimiento">{formErrors.productoId}</p>}
      </div>

      <div className="form-group-abastecimiento">
        <label className="form-label-abastecimiento">Empleado: <span className="required-asterisk">*</span></label>
        <button
          type="button"
          className="form-button-select-abastecimiento"
          onClick={onSelectEmployee}
          disabled={isEditing}
        >
          {formData.empleadoNombre || "Seleccionar Empleado"}
        </button>
        {formErrors?.empleadoId && <p className="error-abastecimiento">{formErrors.empleadoId}</p>}
      </div>

      <div className="form-group-abastecimiento">
        <label htmlFor="cantidadAbastecimiento" className="form-label-abastecimiento">Cantidad: <span className="required-asterisk">*</span></label>
        <input
          id="cantidadAbastecimiento"
          className="form-input-abastecimiento"
          type="number"
          name="cantidad"
          placeholder="Cantidad de unidades"
          value={formData.cantidad || ''}
          onChange={onInputChange}
          required
          min="1"
        />
        {formErrors?.cantidad && <p className="error-abastecimiento">{formErrors.cantidad}</p>}
      </div>
    </>
  );
};

export default AbastecimientoForm;