// src/features/productosAdmin/components/ProductoAdminForm.jsx
import React from 'react';

const ProductoAdminForm = ({ formData, onFormChange, onFileChange, categoriasDisponibles, isEditing }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onFormChange(name, type === 'checkbox' ? checked : value);
  };

  return (
    <>
      {/* El CSS original usa .modal-content-ProductosAdministrador directamente para los inputs */}
      {/* Vamos a agruparlos con una clase para más control si es necesario */}
      <div className="producto-admin-form-group">
        <label htmlFor="nombre">Nombre: <span className="required-asterisk">*</span></label>
        <input type="text" id="nombre" name="nombre" placeholder="Nombre del producto" value={formData.nombre || ''} onChange={handleChange} required />
      </div>

      <div className="producto-admin-form-group">
        <label htmlFor="categoria">Categoría: <span className="required-asterisk">*</span></label>
        <select id="categoria" name="categoria" value={formData.categoria || ''} onChange={handleChange} required>
          <option value="" disabled>Seleccionar categoría</option>
          {categoriasDisponibles.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="producto-admin-form-group">
        <label htmlFor="precio">Precio: <span className="required-asterisk">*</span></label>
        <input type="number" id="precio" name="precio" placeholder="Precio" value={formData.precio || ''} onChange={handleChange} required min="0" step="0.01" />
      </div>

      <div className="producto-admin-form-group">
        <label htmlFor="stock">Stock: <span className="required-asterisk">*</span></label>
        <input type="number" id="stock" name="stock" placeholder="Stock" value={formData.stock || ''} onChange={handleChange} required min="0" />
      </div>

      <div className="producto-admin-form-group">
        <label htmlFor="descripcion">Descripción:</label>
        <textarea id="descripcion" name="descripcion" placeholder="Descripción del producto" value={formData.descripcion || ''} onChange={handleChange} />
      </div>

      <div className="producto-admin-form-group">
        <label htmlFor="foto">Foto del Producto:</label>
        <input type="file" id="foto" name="foto" accept="image/*" onChange={onFileChange} />
        {formData.fotoPreview && ( // formData.fotoPreview sería la URL de la imagen para previsualizar
          <img src={formData.fotoPreview} alt="Vista previa" style={{ maxWidth: '100px', marginTop: '10px' }} />
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