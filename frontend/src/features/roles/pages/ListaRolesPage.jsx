// src/features/roles/pages/ListaRolesPage.jsx
import React, { useState, useEffect } from "react";
import NavbarAdmin from "../../../shared/components/layout/NavbarAdmin";
import RolesTable from "../components/RolesTable";
// Importaremos los nuevos modales separados
import RolCrearModal from "../components/RolCrearModal"; // NUEVO
import RolEditarModal from "../components/RolEditarModal"; // NUEVO
import ConfirmModal from "../../../shared/components/common/ConfirmModal";
import RolDetailsModal from "../components/RolDetailsModal";
import ValidationModal from "../../../shared/components/common/ValidationModal"; // Asumiendo que quieres usarlo
import {
  fetchRoles,
  saveRole,
  deleteRoleById,
  toggleRoleStatus,
} from "../services/rolesService";
import "../css/Rol.css";

function ListaRolesPage() {
  const [roles, setRoles] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  // Estados separados para los modales de crear y editar
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  // Otros estados de modal
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false); // Para el ValidationModal

  const [currentRole, setCurrentRole] = useState(null);
  const [validationMessage, setValidationMessage] = useState(""); // Para el ValidationModal
  // modalType ya no es necesario aquí

  useEffect(() => {
    setRoles(fetchRoles());
  }, []);

  const handleOpenModal = (type, role = null) => {
    if (
      role &&
      role.nombre === "Administrador" &&
      (type === "edit" || type === "delete")
    ) {
      setValidationMessage(
        // Usar ValidationModal en lugar de alert
        `El rol 'Administrador' no puede ser ${
          type === "edit" ? "editado" : "eliminado"
        }.`
      );
      setIsValidationModalOpen(true);
      return;
    }
    setCurrentRole(role);
    if (type === "details") {
      setIsDetailsModalOpen(true);
    } else if (type === "delete") {
      setIsDeleteModalOpen(true);
    } else if (type === "create") {
      // Usar 'create' consistentemente
      setIsCrearModalOpen(true);
    } else if (type === "edit") {
      if (role) {
        setIsEditarModalOpen(true);
      } else {
        console.error("Intento de abrir modal de edición sin datos de rol.");
      }
    }
  };

  const handleCrearModalClose = () => {
    setIsCrearModalOpen(false);
  };

  const handleEditarModalClose = () => {
    setIsEditarModalOpen(false);
    setCurrentRole(null);
  };

  const closeOtherModals = () => {
    setIsDetailsModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsValidationModalOpen(false);
    setValidationMessage("");
    if (!isCrearModalOpen && !isEditarModalOpen) {
      setCurrentRole(null);
    }
  };

  const handleSaveRol = (roleData) => {
    try {
      const isEditing = !!roleData.id;
      const updatedRoles = saveRole(roleData, roles); // saveRole ya maneja si es creación o edición por el id
      setRoles(updatedRoles);
      if (isEditing) {
        handleEditarModalClose();
      } else {
        handleCrearModalClose();
      }
    } catch (error) {
      setValidationMessage(error.message); // Usar ValidationModal
      setIsValidationModalOpen(true);
    }
  };

  const handleDeleteRol = () => {
    if (currentRole && currentRole.id) {
      try {
        const updatedRoles = deleteRoleById(currentRole.id, roles);
        setRoles(updatedRoles);
        closeOtherModals();
      } catch (error) {
        setValidationMessage(error.message); // Usar ValidationModal
        setIsValidationModalOpen(true);
      }
    }
  };

  const handleToggleAnular = (roleId) => {
    try {
      const roleToToggle = roles.find((r) => r.id === roleId);
      if (roleToToggle && roleToToggle.nombre === "Administrador") {
        setValidationMessage(
          "El rol 'Administrador' no puede ser anulado/activado."
        ); // Usar ValidationModal
        setIsValidationModalOpen(true);
        return;
      }
      const updatedRoles = toggleRoleStatus(roleId, roles);
      setRoles(updatedRoles);
    } catch (error) {
      setValidationMessage(error.message); // Usar ValidationModal
      setIsValidationModalOpen(true);
    }
  };

  const filteredRoles = roles.filter(
    (r) =>
      r.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="rol-container">
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
          <button
            className="rol-botonAgregar"
            onClick={() => handleOpenModal("create")}
          >
            Crear Rol
          </button>
        </div>
        <RolesTable
          roles={filteredRoles}
          onView={(role) => handleOpenModal("details", role)}
          onEdit={(role) => handleOpenModal("edit", role)}
          onDeleteConfirm={(role) => handleOpenModal("delete", role)}
          onToggleAnular={handleToggleAnular}
        />
      </div>

      {/* Modales separados */}
      <RolCrearModal
        isOpen={isCrearModalOpen}
        onClose={handleCrearModalClose}
        onSubmit={handleSaveRol}
      />
      <RolEditarModal
        isOpen={isEditarModalOpen}
        onClose={handleEditarModalClose}
        onSubmit={handleSaveRol}
        initialData={currentRole}
      />
      <RolDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={closeOtherModals}
        role={currentRole}
      />
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeOtherModals}
        onConfirm={handleDeleteRol}
        title="Confirmar Eliminación de Rol"
        message={`¿Estás seguro de que deseas eliminar el rol "${
          currentRole?.nombre || ""
        }"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
      <ValidationModal
        isOpen={isValidationModalOpen}
        onClose={closeOtherModals}
        title="Aviso de Roles"
        message={validationMessage}
      />
    </div>
  );
}

export default ListaRolesPage;
