// src/features/serviciosAdmin/components/ServicioAdminFormModal.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import '../css/ServiciosAdmin.css';

// --- Constantes de Validación ---
const NAME_REGEX = /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚüÜ\s]*$/;

const ServicioAdminFormModal = ({ isOpen, onClose, onSubmit, initialData, isEditMode, categorias }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoriaServicioId: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const initialFormData = {
        nombre: isEditMode ? initialData.nombre || '' : '',
        descripcion: isEditMode ? initialData.descripcion || '' : '',
        precio: isEditMode ? initialData.precio || '' : '',
        categoriaServicioId: isEditMode ? (initialData.idCategoriaServicio || '') : '',
      };
      
      setFormData(initialFormData);
      setFormErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen, isEditMode, initialData]);

  // --- Validaciones ---
  const validarCaracteres = (name, value) => {
    if (name === "nombre" && !NAME_REGEX.test(value)) {
      setFormErrors(prev => ({
        ...prev,
        [name]: "No se permiten caracteres especiales."
      }));
    } else {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validarObligatorioYEspacios = (name, value) => {
    let error = "";
    if (name === "nombre") {
      if (!value) error = "El nombre es obligatorio.";
      else if (value.trim() !== value) error = "No debe tener espacios al inicio o al final.";
    }

    if (name === "precio") {
      if (!String(value)) error = "El precio es obligatorio.";
      else if (isNaN(value) || Number(value) < 0) error = "El precio debe ser un número válido y no negativo.";
    }

    if (name === "categoriaServicioId") {
      if (!value) error = "Debe seleccionar una categoría.";
    }

    setFormErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validación inmediata de caracteres especiales
    if (name === "nombre") {
      validarCaracteres(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    // Trimear espacios al salir del campo
    const trimmedValue = typeof value === "string" ? value.trim() : value;
    setFormData(prev => ({ ...prev, [name]: trimmedValue }));

    // Validaciones de obligatorio y espacios
    validarObligatorioYEspacios(name, trimmedValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = {};
    let firstErrorField = null;

    // Validar todos los campos antes de enviar
    Object.keys(formData).forEach(name => {
      const value = typeof formData[name] === "string" ? formData[name].trim() : formData[name];
      const error = validarObligatorioYEspacios(name, value);
      if (error) {
        validationErrors[name] = error;
        if (!firstErrorField) {
          firstErrorField = name;
        }
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Por favor, corrige los errores del formulario.");
      setFormErrors(validationErrors);
      if (firstErrorField) {
        const element = document.querySelector(`[name=${firstErrorField}]`);
        element?.focus();
      }
      return;
    }
    
    setIsSubmitting(true);
    
    const dataToSend = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion,
        precio: formData.precio,
        categoriaServicioId: formData.categoriaServicioId,
    };
    
    try {
        await onSubmit(dataToSend);
    } catch {
        // El error ya se maneja en la página principal
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
              <input 
                name="nombre" 
                value={formData.nombre || ''} 
                onChange={handleChange} 
                onBlur={handleBlur} 
                className={`form-control ${formErrors.nombre ? 'is-invalid' : ''}`} 
              />
              {formErrors.nombre && <span className="field-error-message">{formErrors.nombre}</span>}
            </div>

            <div className="servicios-admin-form-group">
              <label>Descripción</label>
              <textarea 
                name="descripcion" 
                value={formData.descripcion || ''} 
                onChange={handleChange} 
                onBlur={handleBlur} 
                className="form-control" 
              />
            </div>
            
            <div className="servicios-admin-form-group">
              <label>Precio <span className="required-asterisk">*</span></label>
              <input 
                name="precio" 
                type="number" 
                step="any" 
                value={formData.precio || ''} 
                onChange={handleChange} 
                onBlur={handleBlur} 
                className={`form-control ${formErrors.precio ? 'is-invalid' : ''}`} 
              />
              {formErrors.precio && <span className="field-error-message">{formErrors.precio}</span>}
            </div>
            
            <div className="servicios-admin-form-group">
              <label>Categoría <span className="required-asterisk">*</span></label>
              <select 
                name="categoriaServicioId" 
                value={formData.categoriaServicioId || ''} 
                onChange={handleChange} 
                onBlur={handleBlur} 
                className={`form-control ${formErrors.categoriaServicioId ? 'is-invalid' : ''}`}
              >
                <option value="">Seleccione una categoría...</option>
                {(categorias || []).map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              {formErrors.categoriaServicioId && <span className="field-error-message">{formErrors.categoriaServicioId}</span>}
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
