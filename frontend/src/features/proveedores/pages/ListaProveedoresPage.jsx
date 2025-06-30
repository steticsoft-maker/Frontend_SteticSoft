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
      const datosRecibidos = await proveedoresService.getProveedores();
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
    // --- INICIO DE CORRECCIÓN BLINDADA ---
    // 1. Extraer el ID y asegurarse de que es un número.
    const idProveedorLimpio = parseInt(proveedorData.idProveedor, 10);

    // 2. Crear un objeto de datos COMPLETAMENTE NUEVO y limpio para enviar.
    // Esto rompe cualquier referencia extraña que pudiera estar causando la mutación.
    const datosLimpiosParaEnviar = {
      nombre: proveedorData.nombre,
      tipo: proveedorData.tipo,
      telefono: proveedorData.telefono,
      correo: proveedorData.correo,
      direccion: proveedorData.direccion,
      tipoDocumento: proveedorData.tipoDocumento,
      numeroDocumento: proveedorData.numeroDocumento,
      nitEmpresa: proveedorData.nitEmpresa,
      nombrePersonaEncargada: proveedorData.nombrePersonaEncargada,
      telefonoPersonaEncargada: proveedorData.telefonoPersonaEncargada,
      emailPersonaEncargada: proveedorData.emailPersonaEncargada,
      estado: proveedorData.estado,
    };

    // Depuración final para confirmar que todo es correcto antes de enviar.
    console.log("ID FINAL A ENVIAR:", idProveedorLimpio);
    console.log("DATOS FINALES A ENVIAR:", datosLimpiosParaEnviar);
    // --- FIN DE CORRECCIÓN BLINDADA ---

    const onSaveSuccess = async () => {
      closeModal();
      await cargarProveedores();
      setIsValidationModalOpen(true);
    };

    try {
      if (idProveedorLimpio) {
        // Se envían el ID limpio y los datos limpios.
        await proveedoresService.updateProveedor(idProveedorLimpio, datosLimpiosParaEnviar);
        setValidationMessage("Proveedor actualizado exitosamente.");
      } else {
        await proveedoresService.createProveedor(datosLimpiosParaEnviar);
        setValidationMessage("Proveedor creado exitosamente.");
      }
      await onSaveSuccess();
    } catch (err) {
      const apiErrorMessage = err.response?.data?.message || "Ocurrió un error inesperado.";
      const userFriendlyMessage = `Error al guardar: ${apiErrorMessage}. Por favor, revise los campos únicos como Correo, NIT o Documento.`;
      
      setValidationMessage(userFriendlyMessage);
      setIsValidationModalOpen(true);
    }
  };

  const handleDelete = async () => {
    if (currentProveedor?.idProveedor) {
      setIsConfirmDeleteOpen(false);
      try {
        await proveedoresService.deleteProveedor(currentProveedor.idProveedor);
        setValidationMessage("Proveedor eliminado exitosamente.");
        await cargarProveedores();
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Ocurrió un error inesperado al intentar eliminar.";
        setValidationMessage(errorMessage);
      } finally {
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
    if (!term) return true;

    const nombre = p.nombre || '';
    const tipoDocumento = p.tipo === 'Natural' 
      ? `${p.tipoDocumento || ''} ${p.numeroDocumento || ''}` 
      : p.nitEmpresa || '';
    const telefono = p.telefono || '';
    const correo = p.correo || '';
    const direccion = p.direccion || '';

    return (
      nombre.toLowerCase().includes(term) ||
      tipoDocumento.toLowerCase().includes(term) ||
      telefono.toLowerCase().includes(term) ||
      correo.toLowerCase().includes(term) ||
      direccion.toLowerCase().includes(term)
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
              <input type="text" placeholder="Buscar por cualquier campo..." value={search} onChange={(e) => setSearch(e.target.value)} disabled={isLoading} />
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