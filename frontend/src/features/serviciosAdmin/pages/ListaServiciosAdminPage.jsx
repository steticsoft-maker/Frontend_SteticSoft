// src/features/serviciosAdmin/pages/ListaServiciosAdminPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import NavbarAdmin from "../../../shared/components/layout/NavbarAdmin";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- Componentes del Módulo ---
import ServiciosAdminTable from "../components/ServiciosAdminTable";
import ServicioAdminFormModal from "../components/ServicioAdminFormModal";
import ServicioAdminDetalleModal from "../components/ServicioAdminDetalleModal";
import ConfirmModal from "../../../shared/components/common/ConfirmModal";

// --- Servicios de API ---
import {
  getServicios,
  createServicio,
  updateServicio,
  deleteServicio,
  cambiarEstadoServicio,
  getActiveCategoriasForSelect,
} from "../services/serviciosAdminService";

// --- Estilos Específicos del Módulo ---
import "../css/ServiciosAdmin.css";

function ListaServiciosAdminPage() {
  const [servicios, setServicios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [currentServicio, setCurrentServicio] = useState(null);
  const [formType, setFormType] = useState("create");
  const [loadingId, setLoadingId] = useState(null);

const cargarDatos = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const filtrosApi = {
        estado: filtroEstado === 'todos' ? undefined : filtroEstado === 'activos'
      };
      if (terminoBusqueda.trim()) {
        filtrosApi.busqueda = terminoBusqueda.trim();
      }
      const [serviciosResponse, categoriasData] = await Promise.all([
        getServicios(filtrosApi),
       getActiveCategoriasForSelect(),
      ]);
    // Asegúrate de extraer el array correctamente:
      setServicios(Array.isArray(serviciosResponse?.data?.data) ? serviciosResponse.data.data : []);
      setCategorias(categoriasData);
    } catch {
    setError("Error al cargar servicios.");
    } finally {
    setLoading(false);
    }
  }, [filtroEstado, terminoBusqueda]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      cargarDatos();
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [cargarDatos]);

  const handleOpenModal = (type, servicio = null) => {
    setCurrentServicio(servicio);
    setError('');
    if (type === "details") setIsDetailsModalOpen(true);
    else if (type === "delete") setIsConfirmModalOpen(true);
    else {
      setFormType(type);
      setIsFormModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsFormModalOpen(false);
    setIsDetailsModalOpen(false);
    setIsConfirmModalOpen(false);
    setCurrentServicio(null);
  };

    // Helper para limpiar los espacios en blanco de los campos de texto
  const cleanInput = (data) => {
    const cleanedData = new FormData();
    for (let pair of data.entries()) {
      const [key, value] = pair;
      
      // CORRECCIÓN: Solo aplica trim() a los strings.
      // Los archivos (que son objetos File) se pasan tal cual, sin modificarlos.
      if (typeof value === 'string') {
        cleanedData.append(key, value.trim());
      } else {
        cleanedData.append(key, value);
      }
    }
    return cleanedData;
  };
  
  const handleSave = async (servicioData) => {
    try {
      // AHORA ESTA LÍNEA FUNCIONARÁ CORRECTAMENTE
      const cleanedData = cleanInput(servicioData);
      
      if (formType === "edit") {
        // Se usa la propiedad correcta del servicio actual (camelCase)
        await updateServicio(currentServicio.idServicio, cleanedData); 
        toast.success('Servicio actualizado exitosamente!');
      } else {
        await createServicio(cleanedData);
        toast.success('Servicio creado exitosamente!');
      }
      closeModal();
      cargarDatos();
    } catch (err) {
      toast.error(err?.message || "Error al guardar el servicio.");
      throw err;
    }
  };

  const handleDelete = async () => {
    if (!currentServicio) return;
    // Se corrige el ID del servicio
    setLoadingId(currentServicio.idServicio); 
    try {
      // Se corrige el ID del servicio
      await deleteServicio(currentServicio.idServicio); 
      toast.success('Servicio eliminado exitosamente!');
      closeModal();
      cargarDatos();
    } catch (err) {
      toast.error(err?.message || "Error al eliminar el servicio.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleToggleEstado = async (servicio) => {
    // Se corrige el ID del servicio
    setLoadingId(servicio.idServicio); 
    try {
      await cambiarEstadoServicio(servicio.idServicio, !servicio.estado); 
      toast.success(`Estado del servicio cambiado exitosamente!`);
      setServicios(prev => prev.map(s => s.idServicio === servicio.idServicio ? { ...s, estado: !s.estado } : s)); } catch (err) {
      toast.error(err?.message || "Error al cambiar el estado.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="servicios-admin-page-container">
      <NavbarAdmin />
      <div className="servicios-content">
        <h1>Gestión de Servicios</h1>
        
        <div className="servicios-admin-controls">
          <div className="servicios-admin-search-bar">
            <input
              type="text"
              placeholder="Buscar por nombre o precio..."
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
            />
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="todos">Todos los estados</option>
              <option value="activos">Activos</option>
              <option value="inactivos">Inactivos</option>
            </select>
          </div>
          <button
            className="botonAgregarServicio"
            onClick={() => handleOpenModal("create")}
          >
            Agregar Servicio
          </button>
        </div>

        {error && <p style={{ textAlign: 'center', color: 'red' }}>ERROR: {error}</p>}

        {loading ? (
          <p style={{ textAlign: 'center' }}>Cargando servicios...</p>
        ) : (
          <ServiciosAdminTable
            servicios={servicios}
            onView={(servicio) => handleOpenModal("details", servicio)}
            onEdit={(servicio) => handleOpenModal("edit", servicio)}
            onDeleteConfirm={(servicio) => handleOpenModal("delete", servicio)}
            onToggleEstado={handleToggleEstado}
            loadingId={loadingId}
          />
        )}
      </div>

      <ServicioAdminFormModal
        isOpen={isFormModalOpen}
        onClose={closeModal}
        onSubmit={handleSave}
        initialData={currentServicio}
        isEditMode={formType === "edit"}
        categorias={categorias}
      />
      <ServicioAdminDetalleModal
        isOpen={isDetailsModalOpen}
        onClose={closeModal}
        servicio={currentServicio}
      />
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={closeModal}
        onConfirm={handleDelete}
        title="Confirmar Eliminación"
        message={`¿Estás seguro de eliminar el servicio "${currentServicio?.nombre}"?`}
        // Se corrige el ID del servicio
        isConfirming={loadingId === currentServicio?.idServicio} 
      />
    </div>
  );
}

export default ListaServiciosAdminPage;
