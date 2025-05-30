// src/features/usuarios/components/UsuarioFormModal.jsx
import React, { useState, useEffect } from 'react';
import UsuarioForm from './UsuarioForm';
import { getAvailableRoles } from '../services/usuariosService'; // Para obtener roles disponibles

const UsuarioFormModal = ({ isOpen, onClose, onSubmit, initialData, modalType, allUsers }) => {
  const [formData, setFormData] = useState({});
  const [availableRoles, setAvailableRoles] = useState([]);

  const isUserAdmin = modalType === 'edit' && initialData?.rol === "Administrador";

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    } else {
      setFormData({
        nombre: '', tipoDocumento: '', documento: '', email: '',
        telefono: '', direccion: '', rol: '', anulado: false,
      });
    }
    // Determinar roles disponibles al abrir/cambiar datos iniciales
    setAvailableRoles(getAvailableRoles(allUsers, initialData?.id));

  }, [initialData, allUsers, isOpen]); // Recalcular si cambian los usuarios o el initialData

  const handleFormChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="usuarios-modalOverlay">
      <div className="usuarios-modalContent usuarios-modalContent-form">
        <h2>{modalType === 'create' ? 'Crear Usuario' : 'Editar Usuario'}</h2>
        {isUserAdmin && modalType === 'edit' ? (
          <p>El usuario 'Administrador' tiene campos restringidos para edición desde aquí.</p>
        ) : null}
        <form onSubmit={handleSubmitForm}>
          <UsuarioForm
            formData={formData}
            onFormChange={handleFormChange}
            availableRoles={availableRoles}
            isEditing={modalType === 'edit'}
            isUserAdmin={isUserAdmin}
          />
          {!isUserAdmin && ( // No mostrar botones si es admin y se está editando (solo se puede ver)
            <div className="usuarios-form-actions">
              <button type="submit" className="usuarios-form-buttonGuardar">
                {modalType === 'create' ? 'Crear Usuario' : 'Actualizar Usuario'}
              </button>
              <button type="button" className="usuarios-form-buttonCancelar" onClick={onClose}>
                Cancelar
              </button>
            </div>
          )}
           {isUserAdmin && modalType === 'edit' && (
             <div className="usuarios-form-actions">
                <button type="button" className="usuarios-modalButton-cerrar" onClick={onClose}>Cerrar</button>
             </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UsuarioFormModal;