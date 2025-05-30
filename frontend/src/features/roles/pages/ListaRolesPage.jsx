// src/features/roles/pages/ListaRolesPage.jsx
import React, { useState, useEffect } from "react";
import NavbarAdmin from "../../../shared/components/layout/NavbarAdmin";
import RolesTable from "../components/RolesTable";
import RolFormModal from "../components/RolFormModal";
import ConfirmModal from "../../../shared/components/common/ConfirmModal"; // Se importa el modal genérico
import RolDetailsModal from "../components/RolDetailsModal";
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

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [currentRole, setCurrentRole] = useState(null);
  const [modalType, setModalType] = useState(""); // 'create', 'edit'
  // Se recomienda añadir un estado para el mensaje de validación si usas ValidationModal
  // const [validationMessage, setValidationMessage] = useState('');
  // const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);

  useEffect(() => {
    setRoles(fetchRoles());
  }, []);

  const handleOpenModal = (type, role = null) => {
    if (
      role &&
      role.nombre === "Administrador" &&
      (type === "edit" || type === "delete")
    ) {
      alert(
        `El rol 'Administrador' no puede ser ${
          type === "edit" ? "editado" : "eliminado"
        }.`
      );
      return;
    }
    setCurrentRole(role);
    if (type === "details") {
      setIsDetailsModalOpen(true);
    } else if (type === "delete") {
      setIsDeleteModalOpen(true);
    } else {
      // create or edit
      setModalType(type);
      setIsFormModalOpen(true);
    }
  };

  const handleCloseModals = () => {
    setIsFormModalOpen(false);
    setIsDetailsModalOpen(false);
    setIsDeleteModalOpen(false);
    setCurrentRole(null);
    setModalType("");
    // setValidationMessage('');
    // setIsValidationModalOpen(false);
  };

  const handleSaveRol = (roleData) => {
    try {
      const updatedRoles = saveRole(roleData, roles);
      setRoles(updatedRoles);
      handleCloseModals();
    } catch (error) {
      alert(error.message); // Considera usar ValidationModal aquí también
      // setValidationMessage(error.message);
      // setIsValidationModalOpen(true);
    }
  };

  const handleDeleteRol = () => {
    if (currentRole) {
      try {
        const updatedRoles = deleteRoleById(currentRole.id, roles);
        setRoles(updatedRoles);
        handleCloseModals();
      } catch (error) {
        alert(error.message); // Considera usar ValidationModal
        // setValidationMessage(error.message);
        // setIsValidationModalOpen(true);
      }
    }
  };

  const handleToggleAnular = (roleId) => {
    try {
      const roleToToggle = roles.find((r) => r.id === roleId);
      if (roleToToggle && roleToToggle.nombre === "Administrador") {
        alert("El rol 'Administrador' no puede ser anulado/activado.");
        return;
      }
      const updatedRoles = toggleRoleStatus(roleId, roles);
      setRoles(updatedRoles);
    } catch (error) {
      alert(error.message); // Considera usar ValidationModal
      // setValidationMessage(error.message);
      // setIsValidationModalOpen(true);
    }
  };

  const filteredRoles = roles.filter(
    (r) =>
      r.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="rol-container">
      {" "}
      {/* Usa la clase principal para el layout */}
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
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModals}
        onConfirm={handleDeleteRol}
        title="Confirmar Eliminación de Rol"
        message={`¿Estás seguro de que deseas eliminar el rol "${
          currentRole?.nombre || ""
        }"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
      {/* // Si decides usar ValidationModal consistentemente:
        <ValidationModal
          isOpen={isValidationModalOpen}
          onClose={handleCloseModals}
          title="Aviso de Roles"
          message={validationMessage}
        /> 
      */}
    </div>
  );
}

export default ListaRolesPage;
