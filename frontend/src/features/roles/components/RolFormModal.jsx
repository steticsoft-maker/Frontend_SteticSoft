// src/features/roles/components/RolFormModal.jsx
import React, { useState, useEffect } from 'react';
import RolForm from './RolForm';
import { getModulosPermisos } from '../services/rolesService'; // Para obtener la lista de módulos

const RolFormModal = ({ isOpen, onClose, onSubmit, initialData, modalType }) => {
  const [formData, setFormData] = useState({ nombre: '', descripcion: '', permisos: [], anulado: false });
  const [modulosSeleccionadosIds, setModulosSeleccionadosIds] = useState([]);
  const [mostrarPermisos, setMostrarPermisos] = useState(false);
  const modulosDisponibles = getModulosPermisos();

  const isRoleAdmin = modalType === "edit" && initialData?.nombre === "Administrador";

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        nombre: initialData.nombre || '',
        descripcion: initialData.descripcion || '',
        permisos: initialData.permisos || [], // Nombres de permisos
        anulado: initialData.anulado || false,
      });
      const selectedIds = modulosDisponibles
        .filter(m => (initialData.permisos || []).includes(m.nombre))
        .map(m => m.id);
      setModulosSeleccionadosIds(selectedIds);
      setMostrarPermisos(isRoleAdmin || selectedIds.length > 0); // Mostrar si es admin o si ya tiene permisos
    } else { // Creación
      setFormData({ nombre: '', descripcion: '', permisos: [], anulado: false });
      setModulosSeleccionadosIds([]);
      setMostrarPermisos(false); // Oculto por defecto al crear
    }
  }, [initialData, modalType, isRoleAdmin, modulosDisponibles]);


  const handleFormChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleModulo = (moduloId) => {
    if (isRoleAdmin) return;
    setModulosSeleccionadosIds(prev =>
      prev.includes(moduloId) ? prev.filter(id => id !== moduloId) : [...prev, moduloId]
    );
  };
  
  const handleToggleMostrarPermisos = () => {
    if(isRoleAdmin) return;
    setMostrarPermisos(prev => !prev);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    const permisosNombres = modulosSeleccionadosIds
      .map(id => modulosDisponibles.find(m => m.id === id)?.nombre)
      .filter(Boolean);
    onSubmit({ ...formData, permisos: permisosNombres });
  };

  if (!isOpen) return null;

  return (
    <div className="rol-modalOverlay">
      <div className="rol-modalContent rol-modalContent-form">
        <h2>{modalType === 'create' ? 'Crear Rol' : 'Editar Rol'}</h2>
        {isRoleAdmin && (
          <p className="rol-admin-message">
            El rol 'Administrador' tiene permisos fijos y no puede ser modificado.
          </p>
        )}
        <form onSubmit={handleSubmitForm}>
          <RolForm
            formData={formData}
            onFormChange={handleFormChange}
            modulosPermisos={modulosDisponibles}
            modulosSeleccionadosIds={modulosSeleccionadosIds}
            onToggleModulo={handleToggleModulo}
            isEditing={modalType === 'edit'}
            isRoleAdmin={isRoleAdmin}
            mostrarPermisos={mostrarPermisos}
            onToggleMostrarPermisos={handleToggleMostrarPermisos}
          />
          {!isRoleAdmin && (
            <div className="rol-form-actions">
              <button type="submit" className="rol-form-buttonGuardar">
                {modalType === 'create' ? 'Crear Rol' : 'Actualizar Rol'}
              </button>
              <button type="button" className="rol-form-buttonCancelar" onClick={onClose}>
                Cancelar
              </button>
            </div>
          )}
          {isRoleAdmin && (
             <div className="rol-form-actions">
                <button type="button" className="rol-modalButton-cerrar" onClick={onClose}>Cerrar</button>
             </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default RolFormModal;