import React, { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Componentes y Servicios
import ServiciosAdminTable from "../components/ServiciosAdminTable";
import ServicioAdminFormModal from "../components/ServicioAdminFormModal";
import ServicioAdminDetalleModal from "../components/ServicioAdminDetalleModal";
import {
  getServicios,
  createServicio,
  updateServicio,
  deleteServicio,
  cambiarEstadoServicio,
  getActiveCategoriasForSelect,
} from "../services/serviciosAdminService";

const MySwal = withReactContent(Swal);

function ListaServiciosAdminPage() {
  const [servicios, setServicios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalState, setModalState] = useState({ type: null, data: null });
  const [loadingId, setLoadingId] = useState(null); // Para deshabilitar botones de acciones específicas
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
      // Carga de servicios y categorías en paralelo para mayor eficiencia
      const [serviciosResponse, categoriasData] = await Promise.all([
        getServicios(filtrosApi),
        getActiveCategoriasForSelect(),
      ]);
      setServicios(Array.isArray(serviciosResponse?.data?.data) ? serviciosResponse.data.data : []);
      setCategorias(categoriasData);
    } catch{
      setError("Error al cargar los datos. Por favor, intente de nuevo más tarde.");
      setServicios([]);
    } finally {
      setLoading(false);
    }
  }, [filtroEstado, terminoBusqueda]);

  // Efecto para recargar datos cuando cambian los filtros (con debounce)
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setCurrentPage(1); // Resetear a la primera página con cada nuevo filtro
      cargarDatos();
    }, 500); // Espera 500ms después de que el usuario deja de escribir
    return () => clearTimeout(debounceTimer);
  }, [terminoBusqueda, filtroEstado, cargarDatos]);

  const handleOpenModal = (type, servicio = null) => {
    if (type === 'delete' && servicio) {
        MySwal.fire({
            title: '¿Estás seguro?',
            text: `¿Deseas eliminar el servicio "${servicio.nombre}"? Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, ¡eliminar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                handleDelete(servicio);
            }
        });
    } else {
        setModalState({ type, data: servicio });
    }
  };

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
      cargarDatos(); // Recargar datos para mostrar los cambios
    } catch (err) {
      const errorMsg = err.message || "Error al guardar el servicio.";
      toast.error(errorMsg);
      throw err; // Re-lanza el error para que el modal sepa que la sumisión falló
    }
  };

  const handleDelete = async (servicio) => {
    if (!servicio) return;
    setLoadingId(servicio.idServicio);
    try {
      await deleteServicio(servicio.idServicio);
      toast.success(`Servicio "${servicio.nombre}" eliminado.`);
      cargarDatos(); // Recargar datos
    } catch (err) {
      toast.error(err.message || "Error al eliminar el servicio.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleToggleEstado = async (servicio) => {
    setLoadingId(servicio.idServicio);
    try {
      await cambiarEstadoServicio(servicio.idServicio, !servicio.estado);
      toast.success(`Estado de "${servicio.nombre}" cambiado.`);
      // Actualización optimista para una UI más fluida
      setServicios(prev => 
        prev.map(s => s.idServicio === servicio.idServicio ? { ...s, estado: !s.estado } : s)
      );
    } catch (err) {
      toast.error(err.message || "Error al cambiar el estado.");
      // Opcional: podrías recargar los datos aquí para revertir el cambio visual en caso de error
      // cargarDatos();
    } finally {
      setLoadingId(null);
    }
  };

  // Lógica de paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = servicios.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(servicios.length / itemsPerPage);

  return (
    <div className="lista-servicios-container">
      <div className="servicios-content-wrapper">
        <h1>Gestión de Servicios</h1>
        
        <div className="servicios-actions-bar">
          <div className="servicios-filters">
            <div className="servicios-search-bar">
              <input
                type="text"
                placeholder="Buscar por nombre o precio..."
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
                className="servicios-search-input"
              />
            </div>
            <div className="servicios-filtro-estado-grupo">
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="servicios-filtro-input"
              >
                <option value="todos">Todos los Estados</option>
                <option value="true">Activos</option>
                <option value="false">Inactivos</option>
              </select>
            </div>
          </div>
          <button className="servicios-add-button" onClick={() => handleOpenModal("create")}>
            Agregar Servicio
          </button>
        </div>

          {error && <p className="error-message">{error}</p>}

          {loading ? (
            <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando...</p>
          ) : (
            <>
              <div className="table-container">
                <ServiciosAdminTable
                  servicios={currentItems}
                  onView={(servicio) => handleOpenModal("details", servicio)}
                  onEdit={(servicio) => handleOpenModal("edit", servicio)}
                  onDeleteConfirm={(servicio) => handleOpenModal("delete", servicio)}
                  onToggleEstado={handleToggleEstado}
                  loadingId={loadingId}
                />
              </div>
              
              <div className="pagination-wrapper">
                <div className="pagination-container">
                  <select 
                    value={itemsPerPage} 
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                  </select>
                  <span>Filas</span>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      className={`page-number ${currentPage === page ? 'active' : ''}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
            </>
        )}
      </div>
      <ServicioAdminFormModal 
        isOpen={modalState.type === 'create' || modalState.type === 'edit'} 
        onClose={handleCloseModal} 
        onSubmit={handleSave} 
        initialData={modalState.data} 
        isEditMode={modalState.type === "edit"} 
        categorias={categorias} 
      />
      <ServicioAdminDetalleModal 
        isOpen={modalState.type === 'details'} 
        onClose={handleCloseModal} 
        servicio={modalState.data} 
      />
    </div>
  );
}

export default ListaServiciosAdminPage;