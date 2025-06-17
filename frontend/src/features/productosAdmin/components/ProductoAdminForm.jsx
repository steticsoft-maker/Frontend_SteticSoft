import React from 'react';

const ProductoAdminForm = ({ formData, onFormChange, onFileChange, categoriasDisponibles, isEditing }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    let parsedValue = value;
    // Aseguramos que los campos numéricos se manejen como números o un string vacío si el usuario borra el campo
    if (name === 'existencia' || name === 'precio' || name === 'stockMinimo' || name === 'stockMaximo' || name === 'idCategoriaProducto') {
      parsedValue = value === '' ? '' : Number(value);
    }
    
    onFormChange(name, type === 'checkbox' ? checked : parsedValue);
  };

  return (
    <>
      <div className="producto-admin-form-group">
        <label htmlFor="nombre">Nombre: <span className="required-asterisk">*</span></label>
        <input type="text" id="nombre" name="nombre" placeholder="Nombre del producto" value={formData.nombre || ''} onChange={handleChange} required />
      </div>

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
      </div>

      <div className="producto-admin-form-group">
        <label htmlFor="precio">Precio: <span className="required-asterisk">*</span></label>
        <input type="number" id="precio" name="precio" placeholder="Precio" value={formData.precio || ''} onChange={handleChange} required min="0" step="0.01" />
      </div>

      <div className="producto-admin-form-group">
        <label htmlFor="existencia">Existencia: <span className="required-asterisk">*</span></label>
        <input type="number" id="existencia" name="existencia" placeholder="Existencia actual" value={formData.existencia || ''} onChange={handleChange} required min="0" />
      </div>

      <div className="producto-admin-form-group">
        <label htmlFor="stockMinimo">Stock Mínimo:</label>
        <input
          type="number"
          id="stockMinimo"
          name="stockMinimo"
          placeholder="Stock mínimo"
          value={formData.stockMinimo || ''}
          onChange={handleChange}
          min="0"
        />
      </div>

      <div className="producto-admin-form-group">
        <label htmlFor="stockMaximo">Stock Máximo:</label>
        <input
          type="number"
          id="stockMaximo"
          name="stockMaximo"
          placeholder="Stock máximo"
          value={formData.stockMaximo || ''}
          onChange={handleChange}
          min="0"
        />
      </div>

      <div className="producto-admin-form-group">
        <label htmlFor="descripcion">Descripción:</label>
        <textarea id="descripcion" name="descripcion" placeholder="Descripción del producto" value={formData.descripcion || ''} onChange={handleChange} />
      </div>

      <div className="producto-admin-form-group">
        <label htmlFor="imagen">Imagen del Producto:</label>
        <input type="file" id="imagen" name="imagen" accept="image/*" onChange={onFileChange} />
        {formData.imagenPreview && ( 
          <img src={formData.imagenPreview} alt="Vista previa" style={{ maxWidth: '100px', marginTop: '10px' }} />
        )}
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
    </>
  );
};

export default ProductoAdminForm;