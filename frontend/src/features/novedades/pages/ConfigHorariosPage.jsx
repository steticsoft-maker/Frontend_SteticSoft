import React, { useState, useEffect, useCallback, useMemo } from "react";
import NavbarAdmin from "../../../shared/components/layout/NavbarAdmin";
import NovedadesTable from "../components/NovedadesTable";
import NovedadModal from '../components/NovedadModal';
import NovedadDetalleModal from "../components/HorarioDetalleModal";
import ConfirmModal from "../../../shared/components/common/ConfirmModal";
import { 
  obtenerTodasLasNovedades, 
  eliminarNovedad, 
  cambiarEstadoNovedad 
} from "../services/horariosService";
// El servicio de usuarios ya no es necesario aquí
// import { getUsuariosAPI } from "../../usuarios/services/usuariosService"; 
import { toast } from 'react-toastify';
import "../css/ConfigHorarios.css";

function ConfigHorariosPage() {
  const [novedades, setNovedades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [search, setSearch] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  // Se eliminan los estados 'filtroEmpleado' y 'listaEmpleados'

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const [currentNovedad, setCurrentNovedad] = useState(null);
  const [modalType, setModalType] = useState(null);

  // Se elimina la función 'cargarEmpleados'

  const cargarNovedades = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {};
      if (filtroEstado) params.estado = filtroEstado === 'activos';
      if (search) params.busqueda = search;
      // Se elimina la lógica de 'filtroEmpleado' de los parámetros

      const data = await obtenerTodasLasNovedades(params);
      setNovedades(data);
    } catch (err) {
      setError(err.message);
      toast.error("Error al cargar las novedades.");
    } finally {
      setLoading(false);
    }
  }, [search, filtroEstado]); // Se elimina 'filtroEmpleado' de las dependencias

  // Se elimina el useEffect que llamaba a 'cargarEmpleados'

  useEffect(() => {
    const timerId = setTimeout(() => {
      cargarNovedades();
    }, 500);
    return () => clearTimeout(timerId);
  }, [cargarNovedades]);

  const paginatedNovedades = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return novedades.slice(startIndex, startIndex + rowsPerPage);
  }, [novedades, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(novedades.length / rowsPerPage);

  // --- MANEJADORES ---
  const handleSearchChange = (event) => { setSearch(event.target.value); setCurrentPage(1); };
  const handleFilterChange = (event) => { setFiltroEstado(event.target.value); setCurrentPage(1); };
  
  // Se elimina la función 'handleEmpleadoFilterChange'
  
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };
  
  const openModal = (type, novedad = null) => { setModalType(type); setCurrentNovedad(novedad); };
  const closeModal = () => { setModalType(null); setCurrentNovedad(null); };
  const handleSuccess = () => { closeModal(); cargarNovedades(); };
  const handleDeleteConfirm = async () => { if (!currentNovedad) return; try { await eliminarNovedad(currentNovedad.idNovedad); toast.success("Novedad eliminada con éxito."); handleSuccess(); } catch (err) { toast.error(`Error al eliminar: ${err.message}`); closeModal(); } };
  const handleToggleConfirm = async () => { if (!currentNovedad) return; try { await cambiarEstadoNovedad(currentNovedad.idNovedad, !currentNovedad.estado); toast.success("Estado de la novedad cambiado con éxito."); handleSuccess(); } catch (err) { toast.error(`Error al cambiar estado: ${err.message}`); closeModal(); } };


  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="page-container">
      <NavbarAdmin />
      <div className="content-container">
        <h1>Gestión de Novedades de Horario</h1>
        
        <div className="actions-bar">
          <div className="filters-container">
            <input
              className="search-bar"
              type="text"
              placeholder="Buscar por encargado, fecha, hora..."
              value={search}
              onChange={handleSearchChange}
            />
            <select
              className="filter-select"
              value={filtroEstado}
              onChange={handleFilterChange}
            >
              <option value="">Todos los Estados</option>
              <option value="activos">Activos</option>
              <option value="inactivos">Inactivos</option>
            </select>
            {/* Se elimina el select de empleados de aquí */}
          </div>
          <button className="add-button" onClick={() => openModal('form')}>
            + Agregar Novedad
          </button>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center' }}>Cargando...</p>
        ) : (
          <>
            <NovedadesTable
              novedades={paginatedNovedades}
              onView={novedad => openModal('details', novedad)}
              onEdit={novedad => openModal('form', novedad)}
              onDeleteConfirm={novedad => openModal('confirmDelete', novedad)}
              onToggleEstado={novedad => openModal('confirmToggle', novedad)}
            />
            
            {totalPages > 1 && (
              <div className="pagination-container">
                <div className="rows-per-page-container">
                  <label htmlFor="rows-per-page">Filas:</label>
                  <select id="rows-per-page" value={rowsPerPage} onChange={handleRowsPerPageChange}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </div>
                <div className="pagination-controls">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                    Anterior
                  </button>
                  <span>Página {currentPage} de {totalPages}</span>
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Modales */}
      {modalType === 'form' && <NovedadModal onClose={closeModal} onSuccess={handleSuccess} novedadToEdit={currentNovedad} isEditing={!!currentNovedad} />}
      {modalType === 'details' && <NovedadDetalleModal novedad={currentNovedad} onClose={closeModal} />}
      {modalType === 'confirmDelete' && <ConfirmModal isOpen={true} onClose={closeModal} onConfirm={handleDeleteConfirm} title="Confirmar Eliminación" message="¿Está seguro de eliminar esta novedad?" />}
      {modalType === 'confirmToggle' && <ConfirmModal isOpen={true} onClose={closeModal} onConfirm={handleToggleConfirm} title="Confirmar Cambio de Estado" message={`¿Seguro que quieres ${currentNovedad?.estado ? 'desactivar' : 'activar'} esta novedad?`} />}
    </div>
  );
}

export default ConfigHorariosPage;