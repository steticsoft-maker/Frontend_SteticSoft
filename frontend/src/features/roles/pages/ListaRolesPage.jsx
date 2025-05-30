// src/features/roles/pages/ListaRolesPage.jsx
import React, { useState, useEffect } from 'react';
import NavbarAdmin from '../../../shared/components/layout/NavbarAdmin';
import RolesTable from '../components/RolesTable';
import RolFormModal from '../components/RolFormModal';
import ConfirmDeleteRolModal from '../components/ConfirmDeleteRolModal';
import RolDetailsModal from '../components/RolDetailsModal'; // Necesitarás crear este también
import { fetchRoles, saveRole, deleteRoleById, toggleRoleStatus } from '../services/rolesService';
import '../css/Rol.css';

function ListaRolesPage() {
  const [roles, setRoles] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [currentRole, setCurrentRole] = useState(null);
  const [modalType, setModalType] = useState(''); // 'create', 'edit'

  useEffect(() => {
    setRoles(fetchRoles());
  }, []);

  const handleOpenModal = (type, role = null) => {
    if (role && role.nombre === "Administrador" && (type === "edit" || type === "delete")) {
        alert(`El rol 'Administrador' no puede ser ${type === "edit" ? "editado" : "eliminado"}.`);
        return;
    }
    setCurrentRole(role);
    if (type === 'details') {
        setIsDetailsModalOpen(true);
    } else if (type === 'delete') {
        setIsDeleteModalOpen(true);
    } else { // create or edit
        setModalType(type);
        setIsFormModalOpen(true);
    }
  };

  const handleCloseModals = () => {
    setIsFormModalOpen(false);
    setIsDetailsModalOpen(false);
    setIsDeleteModalOpen(false);
    setCurrentRole(null);
    setModalType('');
  };

  const handleSaveRol = (roleData) => {
    try {
      const updatedRoles = saveRole(roleData, roles);
      setRoles(updatedRoles);
      handleCloseModals();
    } catch (error) {
      alert(error.message); // Mostrar error de validación del servicio
    }
  };

  const handleDeleteRol = () => {
    if (currentRole) {
      try {
        const updatedRoles = deleteRoleById(currentRole.id, roles);
        setRoles(updatedRoles);
        handleCloseModals();
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const handleToggleAnular = (roleId) => {
     try {
        const roleToToggle = roles.find(r => r.id === roleId);
        if (roleToToggle && roleToToggle.nombre === "Administrador") {
            alert("El rol 'Administrador' no puede ser anulado/activado.");
            return;
        }
        const updatedRoles = toggleRoleStatus(roleId, roles);
        setRoles(updatedRoles);
    } catch (error) {
        alert(error.message);
    }
  };

  const filteredRoles = roles.filter(
    r => r.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
         r.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="rol-container"> {/* Usa la clase principal para el layout */}
      <NavbarAdmin />
      <div className="rol-content">
        <h1>Gestión de Roles</h1>
        <div className="rol-accionesTop">
          <input
            type="text"
            placeholder="Buscar rol..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="rol-barraBusqueda"
          />
          <button className="rol-botonAgregar" onClick={() => handleOpenModal('create')}>
            Crear Rol
          </button>
        </div>
        <RolesTable
          roles={filteredRoles}
          onView={(role) => handleOpenModal('details', role)}
          onEdit={(role) => handleOpenModal('edit', role)}
          onDeleteConfirm={(role) => handleOpenModal('delete', role)}
          onToggleAnular={handleToggleAnular}
        />
      </div>

      <RolFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseModals}
        onSubmit={handleSaveRol}
        initialData={currentRole}
        modalType={modalType}
      />
      
      <RolDetailsModal 
        isOpen={isDetailsModalOpen}
        onClose={handleCloseModals}
        role={currentRole}
      />

      <ConfirmDeleteRolModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModals}
        onConfirm={handleDeleteRol}
        roleName={currentRole?.nombre}
      />
    </div>
  );
}

export default ListaRolesPage;