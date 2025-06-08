// src/features/proveedores/pages/ListaProveedoresPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import NavbarAdmin from "../../../shared/components/layout/NavbarAdmin";
import ProveedoresTable from "../components/ProveedoresTable";
import ProveedorCrearModal from "../components/ProveedorCrearModal";
import ProveedorEditarModal from "../components/ProveedorEditarModal";
import ProveedorDetalleModal from "../components/ProveedorDetalleModal";
import ConfirmModal from "../../../shared/components/common/ConfirmModal";
import ValidationModal from "../../../shared/components/common/ValidationModal";
import { proveedoresService } from "../services/proveedoresService";
import "../css/Proveedores.css";

function ListaProveedoresPage() {
  const [proveedores, setProveedores] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [currentProveedor, setCurrentProveedor] = useState(null);
  const [validationMessage, setValidationMessage] = useState("");
  const [modalAction, setModalAction] = useState(null);

  const cargarProveedores = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // La función del servicio devuelve la lista de proveedores directamente
      const datosRecibidos = await proveedoresService.getProveedores();
      // CORRECCIÓN CLAVE: Se usa la respuesta directa (datosRecibidos) en lugar de buscar una propiedad .data
      setProveedores(datosRecibidos || []);
    } catch (err) {
      setError(err.message || "Error al cargar los proveedores.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarProveedores();
  }, [cargarProveedores]);

  const closeModal = () => {
    setIsCrearModalOpen(false);
    setIsEditarModalOpen(false);
    setIsDetailsModalOpen(false);
    setIsConfirmDeleteOpen(false);
    setIsValidationModalOpen(false);
    setCurrentProveedor(null);
    setValidationMessage("");
    setModalAction(null);
  };

  const handleOpenModal = (type, proveedor = null) => {
    setCurrentProveedor(proveedor);
    if (type === "ver") setIsDetailsModalOpen(true);
    else if (type === "delete") { setModalAction('delete'); setIsConfirmDeleteOpen(true); }
    else if (type === "status") { setModalAction('status'); setIsConfirmDeleteOpen(true); }
    else if (type === "create") setIsCrearModalOpen(true);
    else if (type === "edit" && proveedor) setIsEditarModalOpen(true);
  };

  const handleSave = async (proveedorData) => {
    try {
      if (proveedorData.idProveedor) {
        await proveedoresService.updateProveedor(proveedorData.idProveedor, proveedorData);
        setValidationMessage("Proveedor actualizado exitosamente.");
      } else {
        await proveedoresService.createProveedor(proveedorData);
        setValidationMessage("Proveedor creado exitosamente.");
      }
      closeModal();
      await cargarProveedores();
    } catch (err) {
      setValidationMessage(err.response?.data?.message || "Error al guardar el proveedor.");
      setIsValidationModalOpen(true);
    }
  };

  const handleDelete = async () => {
    if (currentProveedor?.idProveedor) {
      try {
        await proveedoresService.deleteProveedor(currentProveedor.idProveedor);
        setValidationMessage("Proveedor eliminado exitosamente.");
        await cargarProveedores();
      } catch (err) {
        setValidationMessage(err.response?.data?.message || "Error al eliminar. Es posible que esté asociado a una compra.");
      } finally {
        closeModal();
        setIsValidationModalOpen(true);
      }
    }
  };

  const handleToggleEstado = async () => {
    if (currentProveedor) {
      try {
        await proveedoresService.toggleEstado(currentProveedor.idProveedor, !currentProveedor.estado);
        setValidationMessage("Estado del proveedor cambiado exitosamente.");
        await cargarProveedores();
      } catch (err) {
        setValidationMessage(err.response?.data?.message || "Error al cambiar el estado.");
      } finally {
        closeModal();
        setIsValidationModalOpen(true);
      }
    }
  };
  
  const handleConfirmAction = () => {
    if (modalAction === 'delete') handleDelete();
    else if (modalAction === 'status') handleToggleEstado();
  };

  const filteredProveedores = proveedores.filter((p) => {
    const term = search.toLowerCase();
    return (
      p.nombre?.toLowerCase().includes(term) ||
      p.nitEmpresa?.toLowerCase().includes(term) ||
      p.correo?.toLowerCase().includes(term)
    );
  });

  const getConfirmModalMessage = () => {
      if (!currentProveedor) return '';
      if (modalAction === 'delete') return `¿Estás seguro de que deseas eliminar al proveedor "${currentProveedor.nombre}"?`;
      if (modalAction === 'status') return `¿Estás seguro de que deseas ${currentProveedor.estado ? 'desactivar' : 'activar'} al proveedor "${currentProveedor.nombre}"?`;
      return '';
  };

  return (
    <div className="proveedores-page-container">
      <NavbarAdmin />
      <div className="proveedores-main-content">
        <div className="proveedores-content-wrapper">
          <h1>Gestión de Proveedores</h1>
          <div className="proveedores-actions-bar">
            <div className="proveedores-search-bar">
              <input type="text" placeholder="Buscar por nombre, NIT o correo..." value={search} onChange={(e) => setSearch(e.target.value)} disabled={isLoading} />
            </div>
            <button className="proveedores-add-button" onClick={() => handleOpenModal("create")} disabled={isLoading}>
              Agregar Proveedor
            </button>
          </div>
          
          {isLoading && <p>Cargando proveedores...</p>}
          {error && <p className="error-message">{error}</p>}
          {!isLoading && !error && (
            <ProveedoresTable
              proveedores={filteredProveedores}
              onView={(prov) => handleOpenModal("ver", prov)}
              onEdit={(prov) => handleOpenModal("edit", prov)}
              onDeleteConfirm={(prov) => handleOpenModal("delete", prov)}
              onToggleEstado={(prov) => handleOpenModal("status", prov)}
            />
          )}
        </div>
      </div>

      <ProveedorCrearModal isOpen={isCrearModalOpen} onClose={closeModal} onSubmit={handleSave} />
      <ProveedorEditarModal isOpen={isEditarModalOpen} onClose={closeModal} onSubmit={handleSave} initialData={currentProveedor} />
      <ProveedorDetalleModal isOpen={isDetailsModalOpen} onClose={closeModal} proveedor={currentProveedor} />
      <ConfirmModal isOpen={isConfirmDeleteOpen} onClose={closeModal} onConfirm={handleConfirmAction} title="Confirmar Acción" message={getConfirmModalMessage()} />
      <ValidationModal isOpen={isValidationModalOpen} onClose={closeModal} title="Aviso de Proveedores" message={validationMessage} />
    </div>
  );
}

export default ListaProveedoresPage;