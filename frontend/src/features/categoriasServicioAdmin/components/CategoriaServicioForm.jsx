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
      // Limpiar errores al abrir/cambiar de modo
      setErrors({});
      setApiError('');
    }
  }, [isOpen, isEditMode, initialData]);

  // --- VALIDACIÓN EN TIEMPO REAL ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validar en tiempo real para dar feedback inmediato al usuario
    validateField(name, value);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    // En el evento onBlur, realizamos una validación completa del campo
    validateField(name, value, true);
  };

  // --- FUNCIÓN DE VALIDACIÓN CENTRALIZADA ---
  const validateField = (name, value, checkLength = false) => {
    let error = '';
    const trimmedValue = value.trim();

    // Regla: No permite caracteres especiales, ni espacios al inicio o al final.
    const validationRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+(\s[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+)*$/;

    if (name === 'nombre' || name === 'descripcion') {
        if (value && !validationRegex.test(value)) {
            if (/^\s|\s$/.test(value)) {
                error = 'No se permiten espacios al inicio o al final.';
            } else {
                error = 'Solo se permiten letras, números y espacios intermedios.';
            }
        }
    }
    
    // --- Validaciones de longitud (aplicadas en onBlur o al enviar) ---
    if (name === 'nombre' && !error) {
        if (!trimmedValue) {
          error = 'El nombre es obligatorio.';
        } else if (checkLength && trimmedValue.length < 3) {
          error = 'El nombre debe tener al menos 3 caracteres.';
        }
    }

    if (name === 'descripcion' && !error) {
  if (trimmedValue.length > 200) {
    error = 'La descripción no puede exceder los 200 caracteres.';
  }
}


    setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
    return !error;
  };
  
  // --- VALIDACIÓN FINAL ANTES DE ENVIAR ---
  const validateForm = () => {
    const isNombreValid = validateField('nombre', formData.nombre, true);
    const isDescripcionValid = validateField('descripcion', formData.descripcion, true);

    return isNombreValid && isDescripcionValid;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    // Ejecutar validación final
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const datosAEnviar = {
        ...formData,
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
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
  const isFormInvalid = Object.values(errors).some(error => !!error) || !formData.nombre.trim();

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
              placeholder="Ej: Limpieza de Hogar"
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
              onBlur={handleBlur}
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