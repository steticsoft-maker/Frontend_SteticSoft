// src/features/novedades/pages/ConfigHorariosPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import NavbarAdmin from "../../../shared/components/layout/Navbar";
import NovedadesTable from "../components/NovedadesTable";
import NovedadModal from '../components/NovedadModal';
import NovedadDetalleModal from "../components/HorarioDetalleModal";
import { 
  obtenerTodasLasNovedades, 
  eliminarNovedad, 
  cambiarEstadoNovedad 
} from "../services/horariosService";
import { toast } from 'react-toastify';
import "../css/ConfigHorarios.css";

const MySwal = withReactContent(Swal);

function ConfigHorariosPage() {
  const [novedades, setNovedades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [search, setSearch] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5); 
  
  const [currentNovedad, setCurrentNovedad] = useState(null);
  const [modalType, setModalType] = useState(null);

  const cargarNovedades = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {};
      if (filtroEstado) params.estado = filtroEstado === 'activos';
      if (search) params.busqueda = search;

      const data = await obtenerTodasLasNovedades(params);
      setNovedades(data);
    } catch (err) {
      setError(err.message);
      toast.error("Error al cargar las novedades.");
    } finally {
      setLoading(false);
    }
  }, [search, filtroEstado]);

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
  
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };
  
  const openModal = (type, novedad = null) => {
    if (type === 'confirmDelete') {
        MySwal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas eliminar esta novedad?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, ¡eliminar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                handleDeleteConfirm(novedad);
            }
        });
    } else {
        setModalType(type);
        setCurrentNovedad(novedad);
    }
  };
  const closeModal = () => { setModalType(null); setCurrentNovedad(null); };
  const handleSuccess = () => { closeModal(); cargarNovedades(); };
  const handleDeleteConfirm = async (novedad) => { if (!novedad) return; try { await eliminarNovedad(novedad.idNovedad); toast.success("Novedad eliminada con éxito."); handleSuccess(); } catch (err) { toast.error(`Error al eliminar: ${err.message}`); closeModal(); } };
  
  const handleToggleEstado = async (novedad) => {
    try {
        await cambiarEstadoNovedad(novedad.idNovedad, !novedad.estado);
        toast.success("Estado de la novedad cambiado con éxito.");
        cargarNovedades();
    } catch (err) {
        toast.error(`Error al cambiar estado: ${err.message}`);
    }
  };

  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="lista-novedades-container">
      <div className="novedades-content-wrapper">
        <h1>Gestión de Novedades de Horario ({novedades.length})</h1>
        
        <div className="novedades-actions-bar">
          <div className="novedades-filters">
            <div className="novedades-search-bar">
              <input
                className="novedades-search-input"
                type="text"
                placeholder="Buscar por encargado, fecha, hora..."
                value={search}
                onChange={handleSearchChange}
              />
            </div>
            <div className="novedades-filtro-estado-grupo">
              <select
                className="novedades-filtro-input"
                value={filtroEstado}
                onChange={handleFilterChange}
              >
                <option value="">Todos los Estados</option>
                <option value="activos">Activos</option>
                <option value="inactivos">Inactivos</option>
              </select>
            </div>
          </div>
          <button className="novedades-add-button" onClick={() => openModal('form')}>
            Agregar Novedad
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
              onToggleEstado={handleToggleEstado} 
            />
            {novedades.length > 0 && (
              <div className="pagination-wrapper">
                <div className="pagination-container">
                  <label htmlFor="rows-per-page">Filas:</label>
                  <select id="rows-per-page" value={rowsPerPage} onChange={handleRowsPerPageChange}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                  </select>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                    <button
                      key={pageNumber}
                      className={`page-number ${currentPage === pageNumber ? 'active' : ''}`}
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  ))}
                  
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {modalType === 'form' && <NovedadModal onClose={closeModal} onSuccess={handleSuccess} novedadToEdit={currentNovedad} isEditing={!!currentNovedad} />}
      {modalType === 'details' && <NovedadDetalleModal novedad={currentNovedad} onClose={closeModal} />}
    </div>
  );
}

export default ConfigHorariosPage;