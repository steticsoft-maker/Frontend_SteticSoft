// src/components/CategoriaServicioFormModal.jsx
import React, { useState, useEffect } from 'react';

const CategoriaServicioFormModal = ({ isOpen, onClose, onSubmit, isEditMode, initialData }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    estado: true,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && initialData) {
        setFormData({
          nombre: initialData.nombre || '',
          descripcion: initialData.descripcion || '',
          estado: initialData.estado ?? true,
        });
      } else {
        setFormData({
          nombre: '',
          descripcion: '',
          estado: true, // Siempre se crea como 'true' (Activo)
        });
      }
      setError('');
    }
  }, [isOpen, isEditMode, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    setLoading(true);
    try {
      // Al enviar, el objeto 'formData' todavía contiene el 'estado' correcto.
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Error al guardar la categoría.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-Categoria">
      <div className="modal-content-Categoria formulario">
        <h3>{isEditMode ? 'Editar Categoría' : 'Agregar Nueva Categoría'}</h3>

        <form className="modal-Categoria-form-grid" onSubmit={handleSubmit}>
          <div className="camposAgregarCategoria">
            <label htmlFor="nombre">
              Nombre <span className="requiredCategoria">*</span>
            </label>
            <input
              id="nombre"
              name="nombre"
              className="campoAgregarCategoria"
              type="text"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ingrese el nombre de la categoría"
              required
              disabled={loading}
            />
          </div>
          <div className="camposAgregarCategoria">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              className="campoAgregarCategoria"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Ingrese una descripción (opcional)"
              rows="3"
              disabled={loading}
            />
          </div>
          
          {/* SE HA ELIMINADO EL CAMPO 'ESTADO' DE LA VISTA */}
          
          {error && <div className="error">{error}</div>}

          <div className="containerBotonesAgregarCategoria">
            <button
              type="submit"
              className="botonEditarCategoria"
              disabled={loading}
            >
              {loading ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Agregar')}
            </button>
            <button
              type="button"
              className="botonCancelarEditarProveedor"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoriaServicioFormModal;