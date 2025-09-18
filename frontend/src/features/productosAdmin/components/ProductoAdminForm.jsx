// src/features/productosAdmin/components/ProductoAdminForm.jsx
import React from "react";
import "../../../shared/styles/admin-layout.css";

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
    <>
      <div className="admin-form-section">
        <h3 className="admin-form-section-title">Información del Producto</h3>
        <div className="admin-form-row-2">
          <div className="admin-form-group">
            <label htmlFor="nombre" className="admin-form-label">
              Nombre: <span className="required-asterisk">*</span>
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre || ""}
              onChange={handleChange}
              className={`admin-form-input ${formErrors.nombre ? 'error' : ''}`}
              required
            />
            {formErrors.nombre && (
              <span className="admin-form-error">{formErrors.nombre}</span>
            )}
          </div>

          <div className="admin-form-group">
            <label htmlFor="idCategoriaProducto" className="admin-form-label">
              Categoría: <span className="required-asterisk">*</span>
            </label>
            <select
              id="idCategoriaProducto"
              name="idCategoriaProducto"
              value={formData.idCategoriaProducto || ""}
              onChange={handleChange}
              className={`admin-form-select ${formErrors.idCategoriaProducto ? 'error' : ''}`}
              required
            >
              <option value="">Seleccionar categoría</option>
              {categoriasDisponibles.map((categoria) => (
                <option key={categoria.idCategoriaProducto} value={categoria.idCategoriaProducto}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
            {formErrors.idCategoriaProducto && (
              <span className="admin-form-error">{formErrors.idCategoriaProducto}</span>
            )}
          </div>
        </div>

        <div className="admin-form-group">
          <label htmlFor="descripcion" className="admin-form-label">
            Descripción: <span className="required-asterisk">*</span>
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion || ""}
            onChange={handleChange}
            className={`admin-form-textarea ${formErrors.descripcion ? 'error' : ''}`}
            rows="4"
            required
          />
          {formErrors.descripcion && (
            <span className="admin-form-error">{formErrors.descripcion}</span>
          )}
        </div>
      </div>

      <div className="admin-form-section">
        <h3 className="admin-form-section-title">Precio y Stock</h3>
        <div className="admin-form-row-3">
          <div className="admin-form-group">
            <label htmlFor="precio" className="admin-form-label">
              Precio: <span className="required-asterisk">*</span>
            </label>
            <input
              type="number"
              id="precio"
              name="precio"
              value={formData.precio || ""}
              onChange={handleChange}
              className={`admin-form-input ${formErrors.precio ? 'error' : ''}`}
              min="0"
              step="0.01"
              required
            />
            {formErrors.precio && (
              <span className="admin-form-error">{formErrors.precio}</span>
            )}
          </div>

          <div className="admin-form-group">
            <label htmlFor="existencia" className="admin-form-label">
              Existencia: <span className="required-asterisk">*</span>
            </label>
            <input
              type="number"
              id="existencia"
              name="existencia"
              value={formData.existencia || ""}
              onChange={handleChange}
              className={`admin-form-input ${formErrors.existencia ? 'error' : ''}`}
              min="0"
              required
            />
            {formErrors.existencia && (
              <span className="admin-form-error">{formErrors.existencia}</span>
            )}
          </div>

          <div className="admin-form-group">
            <label htmlFor="tipoUso" className="admin-form-label">
              Tipo de Uso: <span className="required-asterisk">*</span>
            </label>
            <select
              id="tipoUso"
              name="tipoUso"
              value={formData.tipoUso || ""}
              onChange={handleChange}
              className={`admin-form-select ${formErrors.tipoUso ? 'error' : ''}`}
              required
            >
              <option value="">Seleccionar tipo de uso</option>
              <option value="Externo">Externo</option>
              <option value="Interno">Interno</option>
            </select>
            {formErrors.tipoUso && (
              <span className="admin-form-error">{formErrors.tipoUso}</span>
            )}
          </div>
        </div>

        <div className="admin-form-row-3">
          <div className="admin-form-group">
            <label htmlFor="stockMinimo" className="admin-form-label">Stock Mínimo:</label>
            <input
              type="number"
              id="stockMinimo"
              name="stockMinimo"
              value={formData.stockMinimo || ""}
              onChange={handleChange}
              className={`admin-form-input ${formErrors.stockMinimo ? 'error' : ''}`}
              min="0"
            />
            {formErrors.stockMinimo && (
              <span className="admin-form-error">{formErrors.stockMinimo}</span>
            )}
          </div>

          <div className="admin-form-group">
            <label htmlFor="stockMaximo" className="admin-form-label">Stock Máximo:</label>
            <input
              type="number"
              id="stockMaximo"
              name="stockMaximo"
              value={formData.stockMaximo || ""}
              onChange={handleChange}
              className={`admin-form-input ${formErrors.stockMaximo ? 'error' : ''}`}
              min="0"
            />
            {formErrors.stockMaximo && (
              <span className="admin-form-error">{formErrors.stockMaximo}</span>
            )}
          </div>

          <div className="admin-form-group">
            <label htmlFor="vidaUtilDias" className="admin-form-label">
              Vida Útil (días): <span className="required-asterisk">*</span>
            </label>
            <input
              type="number"
              id="vidaUtilDias"
              name="vidaUtilDias"
              value={formData.vidaUtilDias || ""}
              onChange={handleChange}
              className={`admin-form-input ${formErrors.vidaUtilDias ? 'error' : ''}`}
              min="1"
              required
            />
            {formErrors.vidaUtilDias && (
              <span className="admin-form-error">{formErrors.vidaUtilDias}</span>
            )}
          </div>
        </div>
      </div>

      <div className="admin-form-section">
        <h3 className="admin-form-section-title">Imagen del Producto</h3>
        <div className="admin-form-group">
          <label htmlFor="imagen" className="admin-form-label">
            Imagen: <span className="required-asterisk">*</span>
          </label>
          <input
            type="file"
            id="imagen"
            name="imagen"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className={`admin-form-input ${formErrors.imagen ? 'error' : ''}`}
            required
          />
          {formErrors.imagen && (
            <span className="admin-form-error">{formErrors.imagen}</span>
          )}
          {(formData.imagenPreview ||
            (isEditing && typeof formData.imagen === "string" && formData.imagen)) && (
            <div className="image-preview" style={{ marginTop: '10px' }}>
              <img
                src={formData.imagenPreview || formData.imagen}
                alt="Vista previa"
                style={{ 
                  maxWidth: "200px", 
                  maxHeight: "200px", 
                  borderRadius: '8px',
                  objectFit: "cover",
                  border: "1px solid #ddd"
                }}
                onError={(e) => {
                  console.error("Error al cargar imagen:", e);
                  e.target.style.display = "none";
                }}
              />
              {isEditing && typeof formData.imagen === "string" && (
                <p style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
                  Imagen actual
                </p>
              )}
            </div>
          )}
        </div>

        {isEditing && (
          <div className="admin-form-group">
            <label className="admin-form-label">Estado:</label>
            <label className="switch">
              <input
                type="checkbox"
                name="estado"
                checked={formData.estado === true}
                onChange={handleChange}
              />
              <span className="slider"></span>
            </label>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductoAdminForm;