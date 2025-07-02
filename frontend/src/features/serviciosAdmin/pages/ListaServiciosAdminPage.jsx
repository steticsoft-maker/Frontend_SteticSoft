// src/features/serviciosAdmin/pages/ListaServiciosAdminPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import NavbarAdmin from "../../../shared/components/layout/NavbarAdmin";
import { toast } from 'react-toastify'; // Importar toast para notificaciones
import 'react-toastify/dist/ReactToastify.css'; // Estilos de react-toastify

// --- Componentes hijos ---
import ServiciosAdminTable from "../components/ServiciosAdminTable";
import ServicioAdminFormModal from "../components/ServicioAdminFormModal";
import ServicioAdminDetalleModal from "../components/ServicioAdminDetalleModal";
import ConfirmModal from "../../../shared/components/common/ConfirmModal";

// --- Servicios de la API (Funciones Reales) ---
import {
  getServicios,
  createServicio,
  updateServicio,
  deleteServicio,
  cambiarEstadoServicio,
  getActiveCategoriasForSelect,
} from "../services/serviciosAdminService";

// --- Estilos ---
import "../css/ServiciosAdmin.css";

function ListaServiciosAdminPage() {
  // --- Estados para los datos de la API ---
  const [servicios, setServicios] = useState([]);
  const [categoriasParaFiltroYForm, setCategoriasParaFiltroYForm] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- Estados para filtros y búsqueda ---
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState('todos'); // 'todos', 'activos', 'inactivos'
  // ELIMINADO: const [filtroCategoriaId, setFiltroCategoriaId] = useState(''); // ID de categoría para filtrar

  // --- Estados para los modales y selección ---
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  
  const [currentServicio, setCurrentServicio] = useState(null);
  const [formType, setFormType] = useState("create");
  const [loadingId, setLoadingId] = useState(null);


  // --- Lógica de Carga de Datos (API) ---
  const cargarServiciosYCategorias = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // Prepara los filtros para la API
      const filtrosApi = {};
      if (filtroEstado !== 'todos') {
        filtrosApi.estado = filtroEstado === 'activos' ? true : false;
      }
      // ELIMINADO: if (filtroCategoriaId) {
      // ELIMINADO:   filtrosApi.categoriaServicioId = filtroCategoriaId;
      // ELIMINADO: }

      // Carga servicios con filtros y categorías activas en paralelo
      const [serviciosResponse, categoriasData] = await Promise.all([
        getServicios(filtrosApi), // Pasar filtros a la API
        getActiveCategoriasForSelect(), // Todavía se necesita para el formulario
      ]);

      const serviciosData = serviciosResponse?.data || [];
      setServicios(serviciosData);
      setCategoriasParaFiltroYForm(categoriasData);

    } catch (err) {
      console.error("Error al cargar datos:", err);
      const errorMessage = err?.message || 'Error al cargar los datos iniciales.';
      setError(errorMessage);
      toast.error(errorMessage);
      setServicios([]);
      setCategoriasParaFiltroYForm([]);
    } finally {
      setLoading(false);
    }
  }, [filtroEstado]); // ELIMINADO: filtroCategoriaId de las dependencias

  useEffect(() => {
    cargarServiciosYCategorias();
  }, [cargarServiciosYCategorias]);

  // --- Lógica de Búsqueda (en cliente) ---
  const serviciosFiltradosYBuscados = useMemo(() => {
    let resultados = [...servicios];

    if (terminoBusqueda.trim() !== "") {
      const busquedaLower = terminoBusqueda.toLowerCase();
      resultados = resultados.filter(s =>
        s.nombre.toLowerCase().includes(busquedaLower) ||
        s.descripcion?.toLowerCase().includes(busquedaLower) || // Buscar también en descripción
        s.categoria?.nombre?.toLowerCase().includes(busquedaLower) || // Sigue buscando por categoría
        s.especialidad?.nombre?.toLowerCase().includes(busquedaLower)
      );
    }
    return resultados;
  }, [terminoBusqueda, servicios]);

  // --- Manejadores de Modales ---
  const handleOpenModal = (type, servicio = null) => {
    setCurrentServicio(servicio);
    if (type === "details") {
      setIsDetailsModalOpen(true);
    } else if (type === "delete") {
      setIsConfirmModalOpen(true);
    } else {
      setFormType(type);
      setIsFormModalOpen(true);
    }
    setError('');
  };

  const closeModal = (modal) => {
    if (modal === 'form') setIsFormModalOpen(false);
    if (modal === 'details') setIsDetailsModalOpen(false);
    if (modal === 'confirm') setIsConfirmModalOpen(false);
    setCurrentServicio(null);
  };

  // --- Manejadores de Acciones (API) ---
  const handleSave = async (servicioData, initialData) => {
    try {
      if (formType === "edit" && initialData) {
        await updateServicio(initialData.idServicio, servicioData);
        toast.success('Servicio actualizado exitosamente!');
      } else {
        await createServicio(servicioData);
        toast.success('Servicio creado exitosamente!');
      }
      closeModal('form');
      cargarServiciosYCategorias();
    } catch (err) {
      console.error("Error al guardar:", err);
      const errorMessage = err?.message || "Error al guardar el servicio.";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  const handleDelete = async () => {
    if (currentServicio) {
      setLoadingId(currentServicio.idServicio);
      try {
        await deleteServicio(currentServicio.idServicio);
        toast.success('Servicio eliminado exitosamente!');
        closeModal('confirm');
        cargarServiciosYCategorias();
      } catch (err) {
        console.error("Error al eliminar:", err);
        const errorMessage = err?.message || "Error al eliminar el servicio.";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoadingId(null);
      }
    }
  };

  const handleToggleEstado = async (servicio) => {
    setLoadingId(servicio.idServicio);
    try {
      await cambiarEstadoServicio(servicio.idServicio, !servicio.estado);
      toast.success(`Servicio ${!servicio.estado ? 'habilitado' : 'anulado'} exitosamente!`);
      cargarServiciosYCategorias();
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      const errorMessage = err?.message || "Error al cambiar el estado.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoadingId(null);
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
              placeholder="Buscar por nombre, descripción, categoría o especialidad..."
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
            />
            {/* Filtro por Estado (se mantiene) */}
            <select
              className="filtro-select"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="todos">Todos los estados</option>
              <option value="activos">Activos</option>
              <option value="inactivos">Inactivos</option>
            </select>
            {/* ELIMINADO: Filtro por Categoría */}
            {/* <select
              className="filtro-select"
              value={filtroCategoriaId}
              onChange={(e) => setFiltroCategoriaId(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {categoriasParaFiltroYForm.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select> */}
          </div>
          <button
            className="botonAgregarServicio"
            onClick={() => handleOpenModal("create")}
          >
            Agregar Servicio
          </button>
        </div>

        {error && <p className="error" style={{ textAlign: 'center' }}>ERROR: {error}</p>}

        {loading ? (
          <p>Cargando servicios...</p>
        ) : (
          <ServiciosAdminTable
            servicios={serviciosFiltradosYBuscados}
            onView={(servicio) => handleOpenModal("details", servicio)}
            onEdit={(servicio) => handleOpenModal("edit", servicio)}
            onDeleteConfirm={(servicio) => handleOpenModal("delete", servicio)}
            onToggleEstado={handleToggleEstado}
            loadingId={loadingId}
          />
        )}
      </div>

      {/* --- Modales --- */}
      <ServicioAdminFormModal
        isOpen={isFormModalOpen}
        onClose={() => closeModal('form')}
        onSubmit={handleSave}
        initialData={currentServicio}
        isEditMode={formType === "edit"}
        categorias={categoriasParaFiltroYForm} // Todavía se pasa al formulario
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
        message={`¿Estás seguro de que deseas eliminar el servicio "${currentServicio?.nombre || ""}"? Esta acción no se puede deshacer y el servicio no se eliminará si está asociado a ventas.`}
        confirmText={loadingId ? "Eliminando..." : "Eliminar"}
        isConfirming={loadingId !== null}
      />
    </div>
  );
}

export default ListaServiciosAdminPage;