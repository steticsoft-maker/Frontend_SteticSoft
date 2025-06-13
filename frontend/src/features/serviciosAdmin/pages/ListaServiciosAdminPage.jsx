// src/features/serviciosAdmin/pages/ListaServiciosAdminPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import NavbarAdmin from "../../../shared/components/layout/NavbarAdmin";

// --- Componentes hijos ---
import ServiciosAdminTable from "../components/ServiciosAdminTable";
import ServicioAdminFormModal from "../components/ServicioAdminFormModal";
import ServicioAdminDetalleModal from "../components/ServicioAdminDetalleModal";
import ConfirmModal from "../../../shared/components/common/ConfirmModal";
import ValidationModal from "../../../shared/components/common/ValidationModal";

// --- Servicios de la API (Funciones Reales) ---
import {
  getServicios,
  createServicio,
  updateServicio,
  deleteServicio,
  cambiarEstadoServicio,
  getActiveCategoriasForSelect, // Importante para el formulario
} from "../services/serviciosAdminService";

// --- Estilos ---
import "../css/ServiciosAdmin.css";

function ListaServiciosAdminPage() {
  // --- Estados para los datos de la API ---
  const [servicios, setServicios] = useState([]);
  const [categorias, setCategorias] = useState([]); // Para el dropdown del formulario
  const [filtroServicios, setFiltroServicios] = useState([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- Estados para los modales y selección ---
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  
  const [currentServicio, setCurrentServicio] = useState(null);
  const [formType, setFormType] = useState("create");
  const [validationMessage, setValidationMessage] = useState("");

  // --- Lógica de Carga de Datos (API) ---
const cargarDatos = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [serviciosResponse, categoriasData] = await Promise.all([
        getServicios(),
        getActiveCategoriasForSelect(),
      ]);
      
      const serviciosData = serviciosResponse?.data || [];
      setServicios(serviciosData);
      setFiltroServicios(serviciosData);
      
      // AÑADIMOS UN CONSOLE.LOG PARA VERIFICAR
      console.log("Categorías cargadas para el formulario:", categoriasData);
      setCategorias(categoriasData);

    } catch (err) {
      const errorMessage = err?.message || 'Error al cargar los datos iniciales.';
      setError(errorMessage);
      setServicios([]);
      setFiltroServicios([]);
      setCategorias([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // --- Lógica de Búsqueda (Cliente) ---
  useEffect(() => {
    const resultados = servicios.filter(s =>
      s.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      s.categoria?.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase())
    );
    setFiltroServicios(resultados);
  }, [terminoBusqueda, servicios]);

  // --- Manejadores de Modales ---
  const handleOpenModal = (type, servicio = null) => {
    setCurrentServicio(servicio);
    if (type === "details") {
      setIsDetailsModalOpen(true);
    } else if (type === "delete") {
      setIsConfirmModalOpen(true);
    } else { // 'create' o 'edit'
      setFormType(type);
      setIsFormModalOpen(true);
    }
  };

  const closeModal = (modal) => {
    if (modal === 'form') setIsFormModalOpen(false);
    if (modal === 'details') setIsDetailsModalOpen(false);
    if (modal === 'confirm') setIsConfirmModalOpen(false);
    if (modal === 'validation') setIsValidationModalOpen(false);
    setCurrentServicio(null);
  };
  
  // --- Manejadores de Acciones (API) ---
  const handleSave = async (servicioData) => {
    try {
      if (formType === "edit" && currentServicio) {
        await updateServicio(currentServicio.idServicio, servicioData);
      } else {
        await createServicio(servicioData);
      }
      closeModal('form');
      cargarDatos(); // Recargar todo para reflejar los cambios
    } catch (error) {
      setValidationMessage(error.message || "Error al guardar el servicio.");
      setIsValidationModalOpen(true);
    }
  };

  const handleDelete = async () => {
    if (currentServicio) {
      try {
        await deleteServicio(currentServicio.idServicio);
        closeModal('confirm');
        cargarDatos();
      } catch (error) {
        setValidationMessage(error.message || "Error al eliminar el servicio.");
        setIsValidationModalOpen(true);
      }
    }
  };

  const handleToggleEstado = async (servicio) => {
    try {
      await cambiarEstadoServicio(servicio.idServicio, !servicio.estado);
      cargarDatos();
    } catch (error) {
      setValidationMessage(error.message || "Error al cambiar el estado.");
      setIsValidationModalOpen(true);
    }
  };

  // --- Renderizado ---
  return (
    <div className="servicios-admin-page-container">
      <NavbarAdmin />
      <div className="servicios-content">
        <h1 className="tituloServicios">Gestión de Servicios</h1>
        <div className="barraBusqueda-BotonSuperiorAgregarServicio">
          <div className="BarraBusquedaServicio">
            <input
              type="text"
              placeholder="Buscar por nombre o categoría..."
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
            />
          </div>
          <button
            className="botonAgregarServicio"
            onClick={() => handleOpenModal("create")}
          >
            Agregar Servicio
          </button>
        </div>
        
        {error && <p className="error" style={{textAlign: 'center'}}>{error}</p>}
        
        {loading ? (
          <p>Cargando servicios...</p>
        ) : (
          <ServiciosAdminTable
            servicios={filtroServicios}
            onView={(servicio) => handleOpenModal("details", servicio)}
            onEdit={(servicio) => handleOpenModal("edit", servicio)}
            onDeleteConfirm={(servicio) => handleOpenModal("delete", servicio)}
            onToggleEstado={handleToggleEstado}
          />
        )}
      </div>

      {/* --- Modales --- */}
      <ServicioAdminFormModal
        isOpen={isFormModalOpen}
        onClose={() => closeModal('form')}
        onSubmit={handleSave}
        initialData={currentServicio}
        modalType={formType}
        categorias={categorias} // Se pasan las categorías para el dropdown
      />
      <ServicioAdminDetalleModal
        isOpen={isDetailsModalOpen}
        onClose={() => closeModal('details')}
        servicio={currentServicio}
      />
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => closeModal('confirm')}
        onConfirm={handleDelete}
        title="Confirmar Eliminación"
        message={`¿Estás seguro de que deseas eliminar el servicio "${currentServicio?.nombre || ""}"?`}
        confirmText="Eliminar"
      />
      <ValidationModal
        isOpen={isValidationModalOpen}
        onClose={() => closeModal('validation')}
        title="Aviso de Servicios"
        message={validationMessage}
      />
    </div>
  );
}

export default ListaServiciosAdminPage;