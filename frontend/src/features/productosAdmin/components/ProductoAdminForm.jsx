// src/features/productosAdmin/components/ProductoAdminForm.jsx
import React from "react";

const ProductoAdminForm = ({
  formData,
  onFormChange,
  onFileChange,
  categoriasDisponibles,
  isEditing,
  formErrors = {},
}) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // 👉 mantenemos string en inputs, solo números en submit
    const parsedValue = type === "checkbox" ? checked : value;
    onFormChange(name, parsedValue);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png"];

    if (file && !allowedTypes.includes(file.type)) {
      onFormChange("imagen", null);
      e.target.value = null;
      onFormChange("imagenPreview", null);
      return;
    }

    onFileChange(e);
  };

  return (
    <div className="producto-admin-form-grid">
      {/* Nombre */}
      <div className="producto-admin-form-group">
        <label htmlFor="nombre">
          Nombre: <span className="required-asterisk">*</span>
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre || ""}
          onChange={handleChange}
          required
        />
        {formErrors.nombre && (
          <p className="error-message">{formErrors.nombre}</p>
        )}
      </div>

      {/* Categoría */}
      <div className="producto-admin-form-group">
        <label htmlFor="idCategoriaProducto">
          Categoría: <span className="required-asterisk">*</span>
        </label>
        <select
          id="idCategoriaProducto"
          name="idCategoriaProducto"
          value={formData.idCategoriaProducto || ""}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Seleccionar categoría
          </option>
          {categoriasDisponibles.map((cat) => (
            <option key={cat.idCategoriaProducto} value={cat.idCategoriaProducto}>
              {cat.nombre}
            </option>
          ))}
        </select>
        {formErrors.idCategoriaProducto && (
          <p className="error-message">{formErrors.idCategoriaProducto}</p>
        )}
      </div>

      {/* Tipo de uso */}
      <div className="producto-admin-form-group">
        <label htmlFor="tipoUso">
          Tipo de Uso: <span className="required-asterisk">*</span>
        </label>
        <select
          id="tipoUso"
          name="tipoUso"
          value={formData.tipoUso || ""}
          onChange={handleChange}
          required
        >
          <option value="">Selecciona tipo de uso</option>
          <option value="Interno">Interno</option>
          <option value="Externo">Externo</option>
        </select>
        {formErrors.tipoUso && (
          <p className="error-message">{formErrors.tipoUso}</p>
        )}
      </div>

      {/* Vida útil */}
      <div className="producto-admin-form-group">
        <label htmlFor="vidaUtilDias">
          Vida Útil (días): <span className="required-asterisk">*</span>
        </label>
        <input
          type="number"
          id="vidaUtilDias"
          name="vidaUtilDias"
          value={formData.vidaUtilDias || ""}
          onChange={handleChange}
          min="0"
        />
        {formErrors.vidaUtilDias && (
          <p className="error-message">{formErrors.vidaUtilDias}</p>
        )}
      </div>

      {/* Precio */}
      <div className="producto-admin-form-group">
        <label htmlFor="precio">
          Precio: <span className="required-asterisk">*</span>
        </label>
        <input
          type="number"
          id="precio"
          name="precio"
          value={formData.precio || ""}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
        />
        {formErrors.precio && (
          <p className="error-message">{formErrors.precio}</p>
        )}
      </div>

      {/* Existencia */}
      <div className="producto-admin-form-group">
        <label htmlFor="existencia">
          Existencia: <span className="required-asterisk">*</span>
        </label>
        <input
          type="number"
          id="existencia"
          name="existencia"
          value={formData.existencia || ""}
          onChange={handleChange}
          required
          min="0"
        />
        {formErrors.existencia && (
          <p className="error-message">{formErrors.existencia}</p>
        )}
      </div>

      {/* Stock mínimo */}
      <div className="producto-admin-form-group">
        <label htmlFor="stockMinimo">
          Stock Mínimo: <span className="required-asterisk">*</span>
        </label>
        <input
          type="number"
          id="stockMinimo"
          name="stockMinimo"
          value={formData.stockMinimo || ""}
          onChange={handleChange}
          min="0"
        />
        {formErrors.stockMinimo && (
          <p className="error-message">{formErrors.stockMinimo}</p>
        )}
      </div>

      {/* Stock máximo */}
      <div className="producto-admin-form-group">
        <label htmlFor="stockMaximo">
          Stock Máximo: <span className="required-asterisk">*</span>
        </label>
        <input
          type="number"
          id="stockMaximo"
          name="stockMaximo"
          value={formData.stockMaximo || ""}
          onChange={handleChange}
          min="0"
        />
        {formErrors.stockMaximo && (
          <p className="error-message">{formErrors.stockMaximo}</p>
        )}
      </div>

      {/* Descripción */}
      <div className="producto-admin-form-group full-width">
        <label htmlFor="descripcion">Descripción:</label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion || ""}
          onChange={handleChange}
        />
        {formErrors.descripcion && (
          <p className="error-message">{formErrors.descripcion}</p>
        )}
      </div>

      {/* Imagen */}
      <div className="producto-admin-form-group full-width">
        <label htmlFor="imagen">Imagen del Producto:</label>
        <input
          type="file"
          id="imagen"
          name="imagen"
          accept=".jpg,.jpeg,.png"
          onChange={handleFileChange}
        />

        {(formData.imagenPreview ||
          (isEditing && typeof formData.imagen === "string")) && (
          <img
            src={formData.imagenPreview || formData.imagen}
            alt="Vista previa"
            style={{ maxWidth: "100px", marginTop: "10px" }}
          />
        )}
        {formErrors.imagen && (
          <p className="error-message">{formErrors.imagen}</p>
        )}
      </div>

      {/* Estado solo en edición */}
      {isEditing && (
        <div className="producto-admin-form-group">
          <label>Estado (Activo):</label>
          <label className="switch">
            <input
              type="checkbox"
              name="estado"
              checked={formData.estado}
              onChange={handleChange}
            />
            <span className="slider round"></span>
          </label>
        </div>
      )}
    </div>
  );
};

export default ProductoAdminForm;
