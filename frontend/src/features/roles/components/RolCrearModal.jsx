// INICIO DE MODIFICACIÓN
import React, { useState, useEffect } from 'react';
import RolForm from './RolForm';

const RolCrearModal = ({ isOpen, onClose, onSubmit, permisosDisponibles, permisosAgrupados }) => {
  const getInitialFormState = () => ({
    nombre: '',
    descripcion: '',
    idPermisos: [],
    estado: true,
    tipoPerfil: 'EMPLEADO'
  });

  const [formData, setFormData] = useState(getInitialFormState());
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormState());
      setErrors({});
      setLoading(false);
    }
  }, [isOpen]);

  const handleFormChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prevErr => ({ ...prevErr, [name]: null }));
    }
  };

  const handleToggleModulo = (permisoId) => {
    setFormData(prev => {
        const idPermisosActuales = prev.idPermisos || [];
        const idPermisosNuevos = idPermisosActuales.includes(permisoId)
            ? idPermisosActuales.filter(id => id !== permisoId)
            : [...idPermisosActuales, permisoId];
        return { ...prev, idPermisos: idPermisosNuevos };
    });
  };

  const handleSelectAll = () => {
    const allIds = permisosDisponibles.map(p => p.idPermiso);
    setFormData(prev => ({ ...prev, idPermisos: allIds }));
  };

  const handleDeselectAll = () => {
    setFormData(prev => ({ ...prev, idPermisos: [] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const backendErrors = error.response.data.errors.reduce((acc, err) => {
          acc[err.param] = err.msg;
          return acc;
        }, {});
        setErrors(backendErrors);
      } else {
        setErrors({ general: error.message || "Ocurrió un error inesperado al crear el rol." });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="rol-modalOverlay">
      <div className="rol-modalContent rol-modalContent-form">
        <button type="button" className="modal-close-button-x" onClick={onClose}>
          &times;
        </button>
        <h2>Crear Rol</h2>
        <form onSubmit={handleSubmit}>
          <RolForm
            formData={formData}
            onFormChange={handleFormChange}
            permisosDisponibles={permisosDisponibles}
            permisosAgrupados={permisosAgrupados}
            onToggleModulo={handleToggleModulo}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
            isEditing={false}
            isRoleAdmin={false}
            errors={errors}
          />
          {errors.permisos && <p className="rol-error-permisos">{errors.permisos}</p>}
          {errors.general && <p className="error-message">{errors.general}</p>}
          <div className="rol-form-actions">
            <button type="submit" className="rol-form-buttonGuardar" disabled={loading}>
              {loading ? 'Creando...' : 'Crear Rol'}
            </button>
            <button type="button" className="rol-form-buttonCancelar" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
// FIN DE MODIFICACIÓN

export default RolCrearModal;