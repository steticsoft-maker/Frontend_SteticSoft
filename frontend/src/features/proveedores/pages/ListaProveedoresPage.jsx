// src/features/proveedores/pages/ListaProveedoresPage.jsx
import React, { useState, useEffect } from "react";
import NavbarAdmin from "../../../shared/components/layout/NavbarAdmin";
import ProveedoresTable from "../components/ProveedoresTable";
import ProveedorCrearModal from "../components/ProveedorCrearModal"; // NUEVO
import ProveedorEditarModal from "../components/ProveedorEditarModal"; // NUEVO
import ProveedorDetalleModal from "../components/ProveedorDetalleModal";
import ConfirmModal from "../../../shared/components/common/ConfirmModal";
import ValidationModal from "../../../shared/components/common/ValidationModal";
import {
  fetchProveedores,
  saveProveedor,
  deleteProveedorById,
  toggleProveedorEstado,
} from "../services/proveedoresService";
import "../css/Proveedores.css"; // Este CSS se actualizará

function ListaProveedoresPage() {
  const [proveedores, setProveedores] = useState([]);
  const [search, setSearch] = useState("");

  // Estados para modales separados
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);

  const [currentProveedor, setCurrentProveedor] = useState(null);
  const [validationMessage, setValidationMessage] = useState("");
  // formModalType ya no es necesario

  useEffect(() => {
    setProveedores(fetchProveedores());
  }, []);

  const handleOpenModal = (type, proveedor = null) => {
    setCurrentProveedor(proveedor);
    if (type === "ver") {
      // Cambiado de "details" para consistencia con otros módulos
      setIsDetailsModalOpen(true);
    } else if (type === "delete") {
      setIsConfirmDeleteOpen(true);
    } else if (type === "create") {
      // Usar 'create'
      setIsCrearModalOpen(true);
    } else if (type === "edit") {
      // Usar 'edit'
      if (proveedor) {
        setIsEditarModalOpen(true);
      } else {
        console.error(
          "Intento de abrir modal de edición sin datos de proveedor."
        );
      }
    }
  };

  const handleCrearModalClose = () => {
    setIsCrearModalOpen(false);
  };

  const handleEditarModalClose = () => {
    setIsEditarModalOpen(false);
    setCurrentProveedor(null);
  };

  const closeOtherModals = () => {
    setIsDetailsModalOpen(false);
    setIsConfirmDeleteOpen(false);
    setIsValidationModalOpen(false);
    setValidationMessage("");
    if (!isCrearModalOpen && !isEditarModalOpen) {
      setCurrentProveedor(null);
    }
  };

  const handleSave = (proveedorData) => {
    try {
      const isEditing = !!proveedorData.id;
      // El servicio saveProveedor ya maneja la lógica de ID para diferenciar crear/editar
      const updatedProveedores = saveProveedor(
        proveedorData,
        proveedores,
        proveedorData.id
      );
      setProveedores(updatedProveedores);
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
    if (currentProveedor && currentProveedor.id) {
      const updatedProveedores = deleteProveedorById(
        currentProveedor.id,
        proveedores
      );
      setProveedores(updatedProveedores);
      closeOtherModals();
    }
  };

  const handleToggleEstado = (proveedorId) => {
    const updatedProveedores = toggleProveedorEstado(proveedorId, proveedores);
    setProveedores(updatedProveedores);
  };

  const filteredProveedores = proveedores.filter((p) => {
    const displayName =
      p.tipoDocumento === "Natural" ? p.nombre : p.nombreEmpresa;
    const documentId =
      p.tipoDocumento === "Natural" ? p.numeroDocumento : p.nit;
    return (
      (displayName &&
        displayName.toLowerCase().includes(search.toLowerCase())) ||
      (documentId && documentId.toLowerCase().includes(search.toLowerCase())) ||
      (p.email && p.email.toLowerCase().includes(search.toLowerCase())) // Añadido búsqueda por email
    );
  });

  return (
    // Contenedor principal de la página
    <div className="proveedores-page-container">
      <NavbarAdmin />
      {/* Contenido principal con margen para NavbarAdmin */}
      <div className="proveedores-main-content">
        {/* Wrapper interno para centrar el contenido */}
        <div className="proveedores-content-wrapper">
          <h1>Gestión de Proveedores</h1> {/* Título consistente */}
          {/* Barra de acciones superior */}
          <div className="proveedores-actions-bar">
            <div className="proveedores-search-bar">
              <input
                type="text"
                placeholder="Buscar proveedor (nombre, documento, email)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              className="proveedores-add-button" // Clase consistente para el botón "Agregar"
              onClick={() => handleOpenModal("create")}
            >
              Agregar Proveedor
            </button>
          </div>
          <ProveedoresTable
            proveedores={filteredProveedores}
            onView={(prov) => handleOpenModal("ver", prov)}
            onEdit={(prov) => handleOpenModal("edit", prov)}
            onDeleteConfirm={(prov) => handleOpenModal("delete", prov)}
            onToggleEstado={handleToggleEstado}
          />
        </div>
      </div>

      {/* Modales separados */}
      <ProveedorCrearModal
        isOpen={isCrearModalOpen}
        onClose={handleCrearModalClose}
        onSubmit={handleSave}
      />
      <ProveedorEditarModal
        isOpen={isEditarModalOpen}
        onClose={handleEditarModalClose}
        onSubmit={handleSave}
        initialData={currentProveedor}
      />
      <ProveedorDetalleModal
        isOpen={isDetailsModalOpen}
        onClose={closeOtherModals}
        proveedor={currentProveedor}
      />
      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={closeOtherModals}
        onConfirm={handleDelete}
        title="Confirmar Eliminación de Proveedor" // Título específico
        message={`¿Estás seguro de que deseas eliminar al proveedor "${
          currentProveedor
            ? currentProveedor.tipoDocumento === "Natural"
              ? currentProveedor.nombre
              : currentProveedor.nombreEmpresa
            : ""
        }"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
      <ValidationModal
        isOpen={isValidationModalOpen}
        onClose={closeOtherModals}
        title="Aviso de Proveedores" // Título específico
        message={validationMessage}
      />
    </div>
  );
}

export default ListaProveedoresPage;
