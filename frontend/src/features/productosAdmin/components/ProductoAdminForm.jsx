import React from 'react';

const ProductoAdminForm = ({ formData, onFormChange, onFileChange, categoriasDisponibles, isEditing, formErrors = {} }) => {  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    let parsedValue = value;
    // Aseguramos que los campos numéricos se manejen como números o un string vacío si el usuario borra el campo
    if (name === 'existencia' || name === 'precio' || name === 'stockMinimo' || name === 'stockMaximo' || name === 'idCategoriaProducto') {
      parsedValue = value === '' ? '' : Number(value);
    }
    
    onFormChange(name, type === 'checkbox' ? checked : parsedValue);
  };

  // RUTA: src/features/productosAdmin/components/ProductoAdminForm.jsx

return (
  // ✅ 1. Envolvemos todo en el nuevo contenedor de grid
  <div className="producto-admin-form-grid">
    {/* --- Columna 1 --- */}
    <div className="producto-admin-form-group">
      <label htmlFor="nombre">Nombre: <span className="required-asterisk">*</span></label>
      <input type="text" id="nombre" name="nombre" value={formData.nombre || ''} onChange={handleChange} required />
      {formErrors.nombre && <p className="error-message">{formErrors.nombre}</p>}
    </div>

    {/* --- Columna 2 --- */}
    <div className="producto-admin-form-group">
      <label htmlFor="idCategoriaProducto">Categoría: <span className="required-asterisk">*</span></label>
      <select id="idCategoriaProducto" name="idCategoriaProducto" value={formData.idCategoriaProducto || ''} onChange={handleChange} required>
        <option value="" disabled>Seleccionar categoría</option>
        {categoriasDisponibles.map((cat) => (
          <option key={cat.idCategoriaProducto} value={cat.idCategoriaProducto}>
            {cat.nombre}
          </option>
        ))}
      </select>
      {formErrors.idCategoriaProducto && <p className="error-message">{formErrors.idCategoriaProducto}</p>}
    </div>

    {/* --- Columna 1 --- */}
    <div className="producto-admin-form-group">
        <label htmlFor="tipoUso">Tipo de Uso</label>
        <select id="tipoUso" name="tipoUso" value={formData.tipoUso} onChange={handleChange}>
            <option value="Venta Directa">Venta Directa</option>
            <option value="Interno">Interno</option>
            <option value="Otro">Otro</option>
        </select>
        {formErrors.tipoUso && <p className="error-message">{formErrors.tipoUso}</p>}
    </div>
    
    {/* --- Columna 2 --- */}
    <div className="producto-admin-form-group">
        <label htmlFor="vidaUtilDias">Vida Útil (días)</label>
        <input type="number" id="vidaUtilDias" name="vidaUtilDias" value={formData.vidaUtilDias} onChange={handleChange} min="0" />
        {formErrors.vidaUtilDias && <p className="error-message">{formErrors.vidaUtilDias}</p>}
    </div>

    {/* --- Columna 1 --- */}
    <div className="producto-admin-form-group">
      <label htmlFor="precio">Precio: <span className="required-asterisk">*</span></label>
      <input type="number" id="precio" name="precio" value={formData.precio || ''} onChange={handleChange} required min="0" step="0.01" />
      {formErrors.precio && <p className="error-message">{formErrors.precio}</p>}
    </div>

    {/* --- Columna 2 --- */}
    <div className="producto-admin-form-group">
      <label htmlFor="existencia">Existencia: <span className="required-asterisk">*</span></label>
      <input type="number" id="existencia" name="existencia" value={formData.existencia || ''} onChange={handleChange} required min="0" />
      {formErrors.existencia && <p className="error-message">{formErrors.existencia}</p>}
    </div>

    {/* --- Columna 1 --- */}
    <div className="producto-admin-form-group">
      <label htmlFor="stockMinimo">Stock Mínimo:</label>
      <input type="number" id="stockMinimo" name="stockMinimo" value={formData.stockMinimo || ''} onChange={handleChange} min="0" />
      {formErrors.stockMinimo && <p className="error-message">{formErrors.stockMinimo}</p>}
    </div>

    {/* --- Columna 2 --- */}
    <div className="producto-admin-form-group">
      <label htmlFor="stockMaximo">Stock Máximo:</label>
      <input type="number" id="stockMaximo" name="stockMaximo" value={formData.stockMaximo || ''} onChange={handleChange} min="0" />
      {formErrors.stockMaximo && <p className="error-message">{formErrors.stockMaximo}</p>}
    </div>

    {/* ✅ 2. Estos campos ocuparán todo el ancho */}
    <div className="producto-admin-form-group full-width">
      <label htmlFor="descripcion">Descripción:</label>
      <textarea id="descripcion" name="descripcion" value={formData.descripcion || ''} onChange={handleChange} />
      {formErrors.descripcion && <p className="error-message">{formErrors.descripcion}</p>}
    </div>

    <div className="producto-admin-form-group full-width">
      <label htmlFor="imagen">Imagen del Producto:</label>
      <input type="file" id="imagen" name="imagen" accept="image/*" onChange={onFileChange} />
      {/* Mostrar la imagen de vista previa si existe, de lo contrario, la imagen actual si es edición */}
      {(formData.imagenPreview || (isEditing && formData.imagen)) && (
        <img
          src={formData.imagenPreview || (isEditing && formData.imagen)}
          alt="Vista previa"
          style={{ maxWidth: '100px', marginTop: '10px' }}
        />
      )}
      {formErrors.imagen && <p className="error-message">{formErrors.imagen}</p>}
    </div>
    
    {isEditing && (
      <div className="producto-admin-form-group">
        <label>Estado (Activo):</label>
        <label className="switch">
          <input type="checkbox" name="estado" checked={formData.estado} onChange={handleChange} />
          <span className="slider round"></span>
        </label>
      </div>
    )}
  </div>
);
};

export default ProductoAdminForm;