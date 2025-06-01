// src/features/usuarios/pages/ListaUsuariosPage.jsx
import React, { useState, useEffect } from "react";
import NavbarAdmin from "../../../shared/components/layout/NavbarAdmin";
import UsuariosTable from "../components/UsuariosTable";
// Importaremos los nuevos modales separados
import UsuarioCrearModal from "../components/UsuarioCrearModal"; // NUEVO
import UsuarioEditarModal from "../components/UsuarioEditarModal"; // NUEVO
import UsuarioDetalleModal from "../components/UsuarioDetalleModal";
import ConfirmModal from "../../../shared/components/common/ConfirmModal";
import ValidationModal from "../../../shared/components/common/ValidationModal"; // Mantener este
import {
  fetchUsuarios,
  saveUsuario,
  deleteUsuarioById,
  toggleUsuarioStatus,
} from "../services/usuariosService";
import "../css/Usuarios.css";

function ListaUsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  // Estados separados para los modales de crear y editar
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  // Otros estados de modal
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);

  const [currentUsuario, setCurrentUsuario] = useState(null);
  const [validationMessage, setValidationMessage] = useState("");
  // formModalType ya no es necesario

  useEffect(() => {
    setUsuarios(fetchUsuarios());
  }, []);

  const handleOpenModal = (type, usuario = null) => {
    if (
      usuario &&
      usuario.rol === "Administrador" &&
      (type === "edit" || type === "delete")
    ) {
      setValidationMessage(
        `El usuario 'Administrador' no puede ser ${
          type === "edit" ? "editado" : "eliminado"
        }.`
      );
      setIsValidationModalOpen(true);
      return;
    }

    setCurrentUsuario(usuario);
    if (type === "details") {
      setIsDetailsModalOpen(true);
    } else if (type === "delete") {
      setIsDeleteModalOpen(true);
    } else if (type === "create") {
      // Usar 'create' consistentemente
      setIsCrearModalOpen(true);
    } else if (type === "edit") {
      if (usuario) {
        // Asegurarse que hay datos para editar
        setIsEditarModalOpen(true);
      } else {
        console.error(
          "Intento de abrir modal de edición sin datos de usuario."
        );
      }
    }
  };

  const handleCrearModalClose = () => {
    setIsCrearModalOpen(false);
  };

  const handleEditarModalClose = () => {
    setIsEditarModalOpen(false);
    setCurrentUsuario(null);
  };

  const closeOtherModals = () => {
    setIsDetailsModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsValidationModalOpen(false);
    setValidationMessage("");
    if (!isCrearModalOpen && !isEditarModalOpen) {
      setCurrentUsuario(null);
    }
  };

  const handleSave = (usuarioData) => {
    try {
      const isEditing = !!usuarioData.id;
      const updatedUsuarios = saveUsuario(
        usuarioData,
        usuarios,
        isEditing ? currentUsuario : null // Pasar el currentUsuario original si es edición
      );
      setUsuarios(updatedUsuarios);
      if (isEditing) {
        handleEditarModalClose();
      } else {
        handleCrearModalClose();
      }
    } catch (error) {
      setValidationMessage(error.message);
      setIsValidationModalOpen(true);
    }
  };

  const handleDelete = () => {
    if (currentUsuario && currentUsuario.id) {
      try {
        const updatedUsuarios = deleteUsuarioById(currentUsuario.id, usuarios);
        setUsuarios(updatedUsuarios);
        closeOtherModals();
      } catch (error) {
        setValidationMessage(error.message);
        setIsValidationModalOpen(true);
      }
    }
  };

  const handleToggleAnular = (usuarioId) => {
    try {
      const usuarioToToggle = usuarios.find((u) => u.id === usuarioId);
      if (usuarioToToggle && usuarioToToggle.rol === "Administrador") {
        setValidationMessage(
          "El usuario 'Administrador' no puede ser anulado/activado."
        );
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
          <button
            className="usuarios-botonAgregar"
            onClick={() => handleOpenModal("create")}
          >
            Crear Usuario
          </button>
        </div>
        <UsuariosTable
          usuarios={filteredUsuarios}
          onView={(usuario) => handleOpenModal("details", usuario)}
          onEdit={(usuario) => handleOpenModal("edit", usuario)}
          onDeleteConfirm={(usuario) => handleOpenModal("delete", usuario)}
          onToggleAnular={handleToggleAnular}
        />
      </div>

      {/* Modales separados */}
      <UsuarioCrearModal
        isOpen={isCrearModalOpen}
        onClose={handleCrearModalClose}
        onSubmit={handleSave}
        allUsers={usuarios} // Para la lógica de getAvailableRoles
      />
      <UsuarioEditarModal
        isOpen={isEditarModalOpen}
        onClose={handleEditarModalClose}
        onSubmit={handleSave}
        initialData={currentUsuario}
        allUsers={usuarios} // Para la lógica de getAvailableRoles
      />
      <UsuarioDetalleModal
        isOpen={isDetailsModalOpen}
        onClose={closeOtherModals}
        usuario={currentUsuario}
      />
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeOtherModals}
        onConfirm={handleDelete}
        title="Confirmar Eliminación de Usuario"
        message={`¿Estás seguro de que deseas eliminar al usuario "${
          currentUsuario?.nombre || ""
        }"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
      <ValidationModal
        isOpen={isValidationModalOpen}
        onClose={closeOtherModals}
        title="Aviso de Usuarios"
        message={validationMessage}
      />
    </div>
  );
}

export default ListaUsuariosPage;
