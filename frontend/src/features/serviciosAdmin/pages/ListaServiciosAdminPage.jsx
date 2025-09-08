// src/features/serviciosAdmin/pages/ListaServiciosAdminPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Componentes y Servicios...
import ServiciosAdminTable from "../components/ServiciosAdminTable";
import ServicioAdminFormModal from "../components/ServicioAdminFormModal";
import ServicioAdminDetalleModal from "../components/ServicioAdminDetalleModal";
import ConfirmModal from "../../../shared/components/common/ConfirmModal";
import {
  getServicios,
  createServicio,
  updateServicio,
  deleteServicio,
  cambiarEstadoServicio,
  getActiveCategoriasForSelect,
} from "../services/serviciosAdminService";

import "../css/ServiciosAdmin.css";

function ListaServiciosAdminPage() {
  const [servicios, setServicios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalState, setModalState] = useState({ type: null, data: null });
  const [loadingId, setLoadingId] = useState(null);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const cargarDatos = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const filtrosApi = {
        estado: filtroEstado === 'todos' ? undefined : filtroEstado,
        busqueda: terminoBusqueda.trim() || undefined,
      };
      const [serviciosResponse, categoriasData] = await Promise.all([
        getServicios(filtrosApi),
        getActiveCategoriasForSelect(),
      ]);
      setServicios(Array.isArray(serviciosResponse?.data?.data) ? serviciosResponse.data.data : []);
      setCategorias(categoriasData);
    } catch {
      setError("Error al cargar los datos. Intente de nuevo.");
      setServicios([]);
    } finally {
      setLoading(false);
    }
  }, [filtroEstado, terminoBusqueda]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setCurrentPage(1);
      cargarDatos();
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [terminoBusqueda, filtroEstado, cargarDatos]);

  const handleOpenModal = (type, servicio = null) => setModalState({ type, data: servicio });
  const handleCloseModal = () => setModalState({ type: null, data: null });

  const handleSave = async (servicioData) => {
    try {
      if (modalState.type === "edit") {
        await updateServicio(modalState.data.idServicio, servicioData);
        toast.success('Servicio actualizado exitosamente!');
      } else {
        await createServicio(servicioData);
        toast.success('Servicio creado exitosamente!');
      }
      handleCloseModal();
      cargarDatos();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Error al guardar el servicio.";
      toast.error(errorMsg);
      throw err;
    }
  };

  const handleDelete = async () => {
    if (!modalState.data) return;
    setLoadingId(modalState.data.idServicio);
    try {
      await deleteServicio(modalState.data.idServicio);
      toast.success('Servicio eliminado exitosamente!');
      handleCloseModal();
      cargarDatos();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al eliminar el servicio.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleToggleEstado = async (servicio) => {
    setLoadingId(servicio.idServicio);
    try {
      await cambiarEstadoServicio(servicio.idServicio, !servicio.estado);
      toast.success(`Estado del servicio cambiado.`);
      setServicios(prev => 
        prev.map(s => s.idServicio === servicio.idServicio ? { ...s, estado: !s.estado } : s)
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al cambiar el estado.");
    } finally {
      setLoadingId(null);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = servicios.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(servicios.length / itemsPerPage);

  return (
    <div className="servicios-admin-page-container">
      <div className="servicios-content">
        <h1>Gestión de Servicios</h1>
        
        <div className="servicios-admin-controls">
          <div className="servicios-admin-search-bar">
            <input type="text" placeholder="Buscar por nombre o precio..." value={terminoBusqueda} onChange={(e) => setTerminoBusqueda(e.target.value)} />
            <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
              <option value="todos">Todos los estados</option>
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </select>
          </div>
          <button className="botonAgregarServicio" onClick={() => handleOpenModal("create")}>Agregar Servicio</button>
        </div>

        {error && <p className="error-message">{error}</p>}

        {loading ? (
          <p style={{ textAlign: 'center' }}>Cargando...</p>
        ) : (
          <>
            <ServiciosAdminTable
              servicios={currentItems}
              onView={(servicio) => handleOpenModal("details", servicio)}
              onEdit={(servicio) => handleOpenModal("edit", servicio)}
              onDeleteConfirm={(servicio) => handleOpenModal("delete", servicio)}
              onToggleEstado={handleToggleEstado}
              loadingId={loadingId}
            />
            
            {/* --- LÍNEA CORREGIDA FINALMENTE --- */}
            {servicios.length > 5 && (
              <div className="pagination-controls">
                <select 
                  value={itemsPerPage} 
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={5}>Mostrar 5</option>
                  <option value={10}>Mostrar 10</option>
                </select>
                <span>
                  Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
                </span>
                <div className="pagination-buttons">
                  <button onClick={() => setCurrentPage(c => c - 1)} disabled={currentPage === 1}>
                    Anterior
                  </button>
                  <button onClick={() => setCurrentPage(c => c + 1)} disabled={currentPage === totalPages}>
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modales */}
      <ServicioAdminFormModal isOpen={modalState.type === 'create' || modalState.type === 'edit'} onClose={handleCloseModal} onSubmit={handleSave} initialData={modalState.data} isEditMode={modalState.type === "edit"} categorias={categorias} />
      <ServicioAdminDetalleModal isOpen={modalState.type === 'details'} onClose={handleCloseModal} servicio={modalState.data} />
      <ConfirmModal isOpen={modalState.type === 'delete'} onClose={handleCloseModal} onConfirm={handleDelete} title="Confirmar Eliminación" message={`¿Estás seguro de eliminar el servicio "${modalState.data?.nombre}"?`} isConfirming={loadingId === modalState.data?.idServicio} />
    </div>
  );
}

export default ListaServiciosAdminPage;