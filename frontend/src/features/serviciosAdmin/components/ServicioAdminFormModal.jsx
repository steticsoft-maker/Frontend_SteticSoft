// src/features/serviciosAdmin/components/ServicioAdminFormModal.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import '../css/ServiciosAdmin.css';

const ServicioAdminFormModal = ({ isOpen, onClose, onSubmit, initialData, isEditMode, categorias }) => {
  
  const [formData, setFormData] = useState({});
  const [imagenFile, setImagenFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case 'nombre':
        if (!value.trim()) error = "El nombre es obligatorio.";
        break;
      case 'precio':
        if (!String(value).trim()) error = "El precio es obligatorio.";
        else if (isNaN(value) || Number(value) < 0) error = "El precio debe ser un número no negativo.";
        break;
      case 'id_categoria_servicio':
        if (!value) error = "Debe seleccionar una categoría.";
        break;
      default:
        break;
    }
    setFormErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  useEffect(() => {
    if (isOpen) {
      setFormErrors({});
      setIsSubmitting(false);
      setImagenFile(null);
      
      const getInitialImageUrl = () => {
        if (isEditMode && initialData?.imagen) {
          const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
          return `${backendUrl}/${initialData.imagen}`;
        }
        return '';
      };

      setFormData({
        nombre: isEditMode ? initialData.nombre || '' : '',
        descripcion: isEditMode ? initialData.descripcion || '' : '',
        precio: isEditMode ? initialData.precio || '' : '',
        // Se corrige el nombre de la propiedad para la categoría
        id_categoria_servicio: isEditMode ? initialData.id_categoria_servicio || '' : '',
      });
      setPreviewUrl(getInitialImageUrl());
    }
  }, [isOpen, isEditMode, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagenFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar todos los campos antes de continuar
    const validationErrors = {};
    let hasErrors = false;
    
    const requiredFields = ['nombre', 'precio', 'id_categoria_servicio'];
    requiredFields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        validationErrors[field] = error;
        hasErrors = true;
      }
    });

    setFormErrors(validationErrors);
    if (hasErrors) {
      toast.error("Por favor, corrige los errores del formulario.");
      return;
    }
    
    setIsSubmitting(true);
    
    const submissionData = new FormData();
    submissionData.append('nombre', formData.nombre);
    submissionData.append('precio', formData.precio);
    // Se corrige el nombre de la propiedad
    submissionData.append('id_categoria_servicio', formData.id_categoria_servicio);
    
    if (formData.descripcion) {
      submissionData.append('descripcion', formData.descripcion);
    }

    if (imagenFile) {
      submissionData.append('imagen', imagenFile);
    }

    try {
      await onSubmit(submissionData);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Error al guardar.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="servicios-admin-modal-overlay">
      <div className="servicios-admin-modal-content">
        <h3>{isEditMode ? 'Editar Servicio' : 'Agregar Nuevo Servicio'}</h3>
        
        <form onSubmit={handleSubmit} noValidate>
          <div className="servicios-admin-form-grid">
            <div className="servicios-admin-form-group">
              <label>Nombre del Servicio <span className="required-asterisk">*</span></label>
              <input name="nombre" value={formData.nombre || ''} onChange={handleChange} className="form-control" />
              {formErrors.nombre && <span className="field-error-message">{formErrors.nombre}</span>}
            </div>
            
            <div className="servicios-admin-form-group">
              <label>Descripción</label>
              <textarea name="descripcion" value={formData.descripcion || ''} onChange={handleChange} className="form-control" />
            </div>

            <div className="servicios-admin-form-group">
              <label>Precio <span className="required-asterisk">*</span></label>
              <input name="precio" type="number" step="0.01" value={formData.precio || ''} onChange={handleChange} className="form-control" />
              {formErrors.precio && <span className="field-error-message">{formErrors.precio}</span>}
            </div>
            
            {/* Se elimina el campo de duración estimada */}
            
            <div className="servicios-admin-form-group">
              <label>Categoría <span className="required-asterisk">*</span></label>
              <select name="id_categoria_servicio" value={formData.id_categoria_servicio || ''} onChange={handleChange} className="form-control">
                <option value="">Seleccione una categoría...</option>
                {(categorias || []).map(cat => (
                  // Se usa cat.value y cat.label que se formatean en serviciosAdminService
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              {formErrors.id_categoria_servicio && <span className="field-error-message">{formErrors.id_categoria_servicio}</span>}
            </div>
            
            <div className="servicios-admin-form-group">
              <label>Imagen</label>
              <input type="file" accept="image/*" onChange={handleFileChange} className="form-control" />
              {previewUrl && (
                <div className="image-preview">
                  <img src={previewUrl} alt="Vista previa" />
                </div>
              )}
            </div>
          </div>

          <div className="servicios-admin-form-actions">
            <button type="submit" className="guardar" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
            <button type="button" className="cancelar" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServicioAdminFormModal;
