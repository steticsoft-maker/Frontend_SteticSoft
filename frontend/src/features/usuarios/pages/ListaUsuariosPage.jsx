// src/features/usuarios/pages/ListaUsuariosPage.jsx
import React, { useState, useEffect } from 'react';
import NavbarAdmin from '../../../shared/components/layout/NavbarAdmin';
import UsuariosTable from '../components/UsuariosTable';
import UsuarioFormModal from '../components/UsuarioFormModal';
import UsuarioDetalleModal from '../components/UsuarioDetalleModal';
import ConfirmModal from '../../../shared/components/common/ConfirmModal'; 
import ValidationModal from '../../../shared/components/common/ValidationModal';
import {
  fetchUsuarios,
  saveUsuario,
  deleteUsuarioById,
  toggleUsuarioStatus,
} from '../services/usuariosService';
import '../css/Usuarios.css';

function ListaUsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  
  const [currentUsuario, setCurrentUsuario] = useState(null);
  const [formModalType, setFormModalType] = useState('create'); // 'create' o 'edit'
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    setUsuarios(fetchUsuarios());
  }, []);

  const handleOpenModal = (type, usuario = null) => {
    if (usuario && usuario.rol === "Administrador" && (type === "edit" || type === "delete")) {
        setValidationMessage(`El usuario 'Administrador' no puede ser ${type === "edit" ? "editado" : "eliminado"}.`);
        setIsValidationModalOpen(true);
        return;
    }
    
    setCurrentUsuario(usuario);
    if (type === 'details') {
      setIsDetailsModalOpen(true);
    } else if (type === 'delete') {
      setIsDeleteModalOpen(true);
    } else { // 'create' or 'edit'
      setFormModalType(type);
      setIsFormModalOpen(true);
    }
  };

  const handleCloseModals = () => {
    setIsFormModalOpen(false);
    setIsDetailsModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsValidationModalOpen(false);
    setCurrentUsuario(null);
    setValidationMessage('');
  };

  const handleSave = (usuarioData) => {
    try {
      const updatedUsuarios = saveUsuario(usuarioData, usuarios, currentUsuario);
      setUsuarios(updatedUsuarios);
      handleCloseModals();
    } catch (error) {
      setValidationMessage(error.message);
      setIsValidationModalOpen(true);
    }
  };

  const handleDelete = () => {
    if (currentUsuario) {
      try {
        const updatedUsuarios = deleteUsuarioById(currentUsuario.id, usuarios);
        setUsuarios(updatedUsuarios);
        handleCloseModals();
      } catch (error) {
         setValidationMessage(error.message);
         setIsValidationModalOpen(true);
      }
    }
  };

  const handleToggleAnular = (usuarioId) => {
    try {
      const usuarioToToggle = usuarios.find(u => u.id === usuarioId);
        if (usuarioToToggle && usuarioToToggle.rol === "Administrador") {
            setValidationMessage("El usuario 'Administrador' no puede ser anulado/activado.");
            setIsValidationModalOpen(true);
            return;
        }
      const updatedUsuarios = toggleUsuarioStatus(usuarioId, usuarios);
      setUsuarios(updatedUsuarios);
    } catch (error) {
       setValidationMessage(error.message);
       setIsValidationModalOpen(true);
    }
  };

  const filteredUsuarios = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.documento.includes(busqueda)
  );

  return (
    <div className="usuarios-container">
      <NavbarAdmin />
      <div className="usuarios-content">
        <h1>Gestión de Usuarios</h1>
        <div className="usuarios-accionesTop">
          <input
            type="text"
            placeholder="Buscar usuario por nombre o documento..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="usuarios-barraBusqueda"
          />
          <button className="usuarios-botonAgregar" onClick={() => handleOpenModal('create')}>
            Crear Usuario
          </button>
        </div>
        <UsuariosTable
          usuarios={filteredUsuarios}
          onView={(usuario) => handleOpenModal('details', usuario)}
          onEdit={(usuario) => handleOpenModal('edit', usuario)}
          onDeleteConfirm={(usuario) => handleOpenModal('delete', usuario)}
          onToggleAnular={handleToggleAnular}
        />
      </div>

      <UsuarioFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseModals}
        onSubmit={handleSave}
        initialData={currentUsuario}
        modalType={formModalType}
        allUsers={usuarios} 
      />
      <UsuarioDetalleModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseModals}
        usuario={currentUsuario}
      />
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModals}
        onConfirm={handleDelete}
        title="Confirmar Eliminación de Usuario"
        message={`¿Estás seguro de que deseas eliminar al usuario "${currentUsuario?.nombre || ''}"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
      <ValidationModal
        isOpen={isValidationModalOpen}
        onClose={handleCloseModals}
        title="Aviso de Usuarios" 
        message={validationMessage}
        // buttonText="Entendido" // Es el valor por defecto, opcional
      />
    </div>
  );
}

export default ListaUsuariosPage;