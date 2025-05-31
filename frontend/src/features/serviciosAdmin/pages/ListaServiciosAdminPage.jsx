// src/features/serviciosAdmin/pages/ListaServiciosAdminPage.jsx
import React, { useState, useEffect } from "react";
import NavbarAdmin from "../../../shared/components/layout/NavbarAdmin";
import ServiciosAdminTable from "../components/ServiciosAdminTable"; // Se mantiene tu tabla de servicios
import ServicioAdminFormModal from "../components/ServicioAdminFormModal"; // Este será el nuevo modal adaptado
import ServicioAdminDetalleModal from "../components/ServicioAdminDetalleModal"; // Se mantiene tu modal de detalles
import ConfirmModal from "../../../shared/components/common/ConfirmModal";
import ValidationModal from "../../../shared/components/common/ValidationModal";
import {
  fetchServiciosAdmin,
  saveServicioAdmin,
  deleteServicioAdminById,
  toggleServicioAdminEstado,
} from "../services/serviciosAdminService"; // Servicios específicos para 'serviciosAdmin'
import "../css/ServiciosAdmin.css";

function ListaServiciosAdminPage() {
  const [servicios, setServicios] = useState([]); // Estado para 'servicios'
  const [busqueda, setBusqueda] = useState("");

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);

  const [currentServicio, setCurrentServicio] = useState(null); // Para el servicio actual
  const [formModalType, setFormModalType] = useState("create"); // 'create' o 'edit'
  const [validationMessage, setValidationMessage] = useState("");

  useEffect(() => {
    setServicios(fetchServiciosAdmin()); // Carga inicial de servicios
  }, []);

  const handleOpenModal = (type, servicio = null) => {
    // console.log(`[ListaServiciosAdminPage] Abriendo modal - Tipo: ${type}, Servicio:`, servicio); // Log para depurar
    // No hay lógica de "Administrador" aquí como en usuarios, así que es más simple
    setCurrentServicio(servicio);
    if (type === "details") {
      setIsDetailsModalOpen(true);
    } else if (type === "delete") {
      setIsConfirmDeleteOpen(true);
    } else {
      // 'create' o 'edit'
      setFormModalType(type);
      setIsFormModalOpen(true);
    }
  };

  // Función específica para cerrar el modal de FORMULARIO y resetear su estado
  const handleFormModalClose = () => {
    // console.log("[ListaServiciosAdminPage] Cerrando FormModal y reseteando estados");
    setIsFormModalOpen(false);
    setCurrentServicio(null);
    setFormModalType("create"); // Volver al tipo por defecto para la próxima apertura
  };

  // Función para cerrar OTROS modales (Detalles, Confirmación, Validación)
  const closeOtherModals = () => {
    setIsDetailsModalOpen(false);
    setIsConfirmDeleteOpen(false);
    setIsValidationModalOpen(false);
    setValidationMessage("");
    // Solo limpiar currentServicio si el form modal no está abierto,
    // para evitar interferencias si un modal de validación se muestra SOBRE el form modal.
    if (!isFormModalOpen) {
      setCurrentServicio(null);
    }
  };

  const handleSave = (servicioData) => {
    try {
      // Pasamos 'servicios' (la lista actual) y 'currentServicio' (para saber si es edición)
      const updatedServicios = saveServicioAdmin(
        servicioData,
        servicios,
        currentServicio
      );
      setServicios(updatedServicios);
      handleFormModalClose(); // Cierra y resetea el modal de formulario después de guardar
    } catch (error) {
      setValidationMessage(error.message);
      setIsValidationModalOpen(true);
      // No cerramos el FormModal aquí para que el usuario pueda corregir si el error es del formulario
    }
  };

  const handleDelete = () => {
    if (currentServicio) {
      try {
        const updatedServicios = deleteServicioAdminById(
          currentServicio.id,
          servicios
        );
        setServicios(updatedServicios);
        closeOtherModals(); // Cierra el modal de confirmación y resetea
      } catch (error) {
        setValidationMessage(error.message);
        setIsValidationModalOpen(true);
      }
    }
  };

  const handleToggleEstado = (servicioId) => {
    try {
      // No hay lógica especial de "Administrador" para servicios
      const updatedServicios = toggleServicioAdminEstado(servicioId, servicios);
      setServicios(updatedServicios);
    } catch (error) {
      setValidationMessage(error.message); // Mostrar error si el servicio lo lanza
      setIsValidationModalOpen(true);
    }
  };

  const filteredServicios = servicios.filter(
    (s) =>
      s.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (s.categoria &&
        s.categoria.toLowerCase().includes(busqueda.toLowerCase()))
  );

  return (
    <div className="servicios-admin-page-container">
      {" "}
      {/* Clase de página principal */}
      <NavbarAdmin />
      <div className="servicios-content">
        {" "}
        {/* Contenedor del contenido principal */}
        <h1 className="tituloServicios">Gestión de Servicios</h1>{" "}
        {/* Título específico */}
        <div className="barraBusqueda-BotonSuperiorAgregarServicio">
          {" "}
          {/* Contenedor barra y botón */}
          <div className="BarraBusquedaServicio">
            {" "}
            {/* Clase específica para la barra */}
            <input
              type="text"
              placeholder="Buscar servicio (nombre, categoría)..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              // className="usuarios-barraBusqueda" // Usar clase de ServiciosAdmin.css si es diferente
            />
          </div>
          <button
            className="botonAgregarServicio" // Clase específica
            onClick={() => handleOpenModal("create")}
          >
            Agregar Servicio
          </button>
        </div>
        <ServiciosAdminTable
          servicios={filteredServicios}
          onView={(servicio) => handleOpenModal("details", servicio)}
          onEdit={(servicio) => handleOpenModal("edit", servicio)}
          onDeleteConfirm={(servicio) => handleOpenModal("delete", servicio)}
          onToggleEstado={handleToggleEstado}
        />
      </div>
      <ServicioAdminFormModal // Este será el nuevo, adaptado de UsuarioFormModal
        isOpen={isFormModalOpen}
        onClose={handleFormModalClose} // Usar la función de cierre específica
        onSubmit={handleSave}
        initialData={currentServicio}
        modalType={formModalType}
        // allServicios={servicios} // No se necesita pasar todos los servicios al modal de form, a diferencia de usuarios con roles
      />
      <ServicioAdminDetalleModal // Este se mantiene como está
        isOpen={isDetailsModalOpen}
        onClose={closeOtherModals}
        servicio={currentServicio}
      />
      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={closeOtherModals}
        onConfirm={handleDelete}
        title="Confirmar Eliminación de Servicio" // Título específico
        message={`¿Estás seguro de que deseas eliminar el servicio "${
          currentServicio?.nombre || ""
        }"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
      <ValidationModal
        isOpen={isValidationModalOpen}
        onClose={closeOtherModals}
        title="Aviso de Servicios" // Título específico
        message={validationMessage}
      />
    </div>
  );
}

export default ListaServiciosAdminPage;
