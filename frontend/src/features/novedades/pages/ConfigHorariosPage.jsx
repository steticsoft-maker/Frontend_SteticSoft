// src/features/horarios/pages/GestionNovedadesPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import NavbarAdmin from "../../../shared/components/layout/NavbarAdmin";

// --- MODIFICADO: Importar componentes y servicios correctos ---
import NovedadesTable from "../components/NovedadesTable";
// import NovedadDetalleModal from "../components/NovedadDetalleModal"; // Descomentar si creas este componente
import NovedadModal from '../components/NovedadModal';
import ConfirmModal from "../../../shared/components/common/ConfirmModal";
import { 
  obtenerTodasLasNovedades, 
  eliminarNovedad, 
  cambiarEstadoNovedad 
} from "../services/horariosService"; // <-- SERVICIO CORRECTO
import { toast } from 'react-toastify';
import "../css/ConfigHorarios.css"; // Puedes renombrar este CSS si quieres

// --- MODIFICADO: Renombrado del componente ---
function GestionNovedadesPage() {
  const [novedades, setNovedades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // --- MODIFICADO: Estados para filtros que se enviarán a la API ---
  const [search, setSearch] = useState("");
  const [filtroEstado, setFiltroEstado] = useState(""); // Usaremos "" para 'todos'

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const [currentNovedad, setCurrentNovedad] = useState(null);
  const [modalType, setModalType] = useState(null);

  // --- MODIFICADO: Carga las novedades pasando los filtros al backend ---
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
  }, [search, filtroEstado]); // Se re-ejecuta si los filtros cambian

  useEffect(() => {
    // Usamos un debounce para no llamar a la API en cada tecla presionada
    const timerId = setTimeout(() => {
      cargarNovedades();
    }, 500); // Espera 500ms después de que el usuario deja de escribir

    return () => clearTimeout(timerId);
  }, [cargarNovedades]);


  // --- Paginación (se aplica a los datos ya filtrados por el backend) ---
  const paginatedNovedades = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return novedades.slice(startIndex, startIndex + rowsPerPage);
  }, [novedades, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(novedades.length / rowsPerPage);

  // --- MANEJADORES ---
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };
  
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };
  
  const handleFilterChange = (event) => {
    setFiltroEstado(event.target.value);
    setCurrentPage(1);
  };

  const openModal = (type, novedad = null) => {
    setModalType(type);
    setCurrentNovedad(novedad);
  };

  const closeModal = () => {
    setModalType(null);
    setCurrentNovedad(null);
  };
  
  const handleSuccess = () => {
    closeModal();
    cargarNovedades();
    toast.success("Operación realizada con éxito.");
  };
  
  // --- MODIFICADO: Lógica de eliminación ---
  const handleDeleteConfirm = async () => {
    if (!currentNovedad) return;
    try {
      await eliminarNovedad(currentNovedad.idNovedad); // <-- Se usa la función y el ID correctos
      handleSuccess();
    } catch (err) {
      toast.error(`Error al eliminar: ${err.message}`);
    }
  };

  // --- MODIFICADO: Lógica de cambio de estado ---
  const handleToggleConfirm = async () => {
    if (!currentNovedad) return;
    try {
      await cambiarEstadoNovedad(currentNovedad.idNovedad, !currentNovedad.estado); // <-- Se usa la función y el ID correctos
      handleSuccess();
    } catch (err) {
      toast.error(`Error al cambiar estado: ${err.message}`);
    }
  };

  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="page-container">
      <NavbarAdmin />
      <div className="content-container">
        <h1>Gestión de Novedades de Horario</h1>
        
        <div className="actions-bar">
          <input
            className="search-bar"
            type="text"
            placeholder="Buscar por correo, fecha..."
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
      <label htmlFor="rows-per-page">Filas por página:</label>
      <select
        id="rows-per-page"
        value={rowsPerPage}
        onChange={handleRowsPerPageChange} // <-- Esta línea conecta la función
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
      </select>
    </div>

    <div className="pagination-controls">
      <button
        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
        disabled={currentPage === 1}
      >
        Anterior
      </button>
      <span>
        Página {currentPage} de {totalPages}
      </span>
      <button
        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
      >
        Siguiente
      </button>
    </div>
  </div>
)}
          </>
        )}
      </div>
      {modalType === 'form' && (
        <NovedadModal 
          onClose={closeModal} 
          onSuccess={handleSuccess}
          novedadToEdit={currentNovedad}
          isEditing={!!currentNovedad}
        />
      )}
      {/* {modalType === 'details' && (
        <NovedadDetalleModal 
          onClose={closeModal} 
          novedad={currentNovedad}
        />
      )} */}
      {modalType === 'confirmDelete' && (
        <ConfirmModal 
          isOpen={true} 
          onClose={closeModal} 
          onConfirm={handleDeleteConfirm} 
          title="Confirmar Eliminación" 
          message={`¿Está seguro de eliminar la novedad del ${currentNovedad?.fechaInicio}?`}
        />
      )}
      {modalType === 'confirmToggle' && (
        <ConfirmModal 
          isOpen={true} 
          onClose={closeModal} 
          onConfirm={handleToggleConfirm} 
          title="Confirmar Cambio de Estado" 
          message={`¿Seguro que quieres ${currentNovedad?.estado ? 'desactivar' : 'activar'} esta novedad?`}
        />
      )}
    </div>
  );
}

export default GestionNovedadesPage;