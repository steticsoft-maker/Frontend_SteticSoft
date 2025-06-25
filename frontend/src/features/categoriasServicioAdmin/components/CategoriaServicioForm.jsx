import React, { useState, useEffect } from 'react';

const INITIAL_FORM_STATE = {
  nombre: '',
  descripcion: '',
  estado: true
};

const CategoriaForm = ({ isOpen, onClose, onSubmit, initialData, isEditMode }) => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && initialData) {
        setFormData({
          nombre: initialData.nombre || '',
          descripcion: initialData.descripcion || '',
          estado: initialData.estado,
        });
      } else {
        setFormData(INITIAL_FORM_STATE);
      }
      setErrors({});
      setApiError('');
    }
  }, [isOpen, isEditMode, initialData]);

  // --- CAMBIO CLAVE 1: Lógica de validación dentro de handleChange ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'nombre') {
      let error = '';
      if (/\s/.test(value)) {
        error = 'El nombre no puede contener espacios.';
      }
      else if (/[^a-zA-Z0-9]/.test(value)) {
        error = 'Solo se permiten letras y números.';
      }
      setErrors(prevErrors => ({
        ...prevErrors,
        nombre: error
      }));
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const validateForm = () => {
    const newErrors = { ...errors };
    const nombreTrimmed = formData.nombre;

    if (!nombreTrimmed) {
      newErrors.nombre = 'El nombre es obligatorio.';
    } else if (nombreTrimmed.length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres.';
    }
    if (formData.descripcion.trim().length > 255) {
      newErrors.descripcion = 'La descripción no puede exceder los 255 caracteres.';
    } else {
      if ('descripcion' in newErrors) delete newErrors.descripcion;
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => !error);
  };
  
  const handleBlur = (e) => {
    const { name } = e.target;
    if (name === 'nombre' && !errors.nombre && formData.nombre.length > 0 && formData.nombre.length < 3) {
         setErrors(prev => ({ ...prev, nombre: 'Debe tener al menos 3 caracteres.' }));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) {
      console.log("Validación final falló, envío detenido.");
      return;
    }

    setLoading(true);
    try {
      const datosAEnviar = {
        ...formData,
      };
      
      await onSubmit(datosAEnviar);
      onClose();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Ocurrió un error al guardar.';
      setApiError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  const isFormInvalid = Object.values(errors).some(error => !!error) || !formData.nombre;

  return (
    <div className="modal-Categoria">
      <div className="modal-content-Categoria formulario">
        <button type="button" className="modal-close-button" onClick={onClose} title="Cerrar">&times;</button>
        <h3>{isEditMode ? 'Editar Categoría de Servicio' : 'Nueva Categoría'}</h3>
        
        <form onSubmit={handleSubmit} noValidate>
          <div className="camposAgregarCategoria">
            <label htmlFor="nombre">Nombre <span className="requiredCategoria">*</span></label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              className={`campoAgregarCategoria ${errors.nombre ? 'input-error' : ''}`}
              value={formData.nombre}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
              required
              autoComplete="off"
              placeholder="Ej: LimpiezaHogar"
            />
            {errors.nombre && <div className="error">{errors.nombre}</div>}
          </div>

          <div className="camposAgregarCategoria">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              className={`campoAgregarCategoria ${errors.descripcion ? 'input-error' : ''}`}
              value={formData.descripcion}
              onChange={handleChange}
              rows="4"
              disabled={loading}
            ></textarea>
            {errors.descripcion && <div className="error">{errors.descripcion}</div>}
          </div>
          
          {apiError && <p className="error" style={{textAlign: 'center', width: '100%'}}>{apiError}</p>}

          <div className="containerBotonesAgregarCategoria">
            <button type="submit" className="botonEditarCategoria" disabled={loading || isFormInvalid}>
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
            <button type="button" className="botonEliminarCategoria" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoriaForm;