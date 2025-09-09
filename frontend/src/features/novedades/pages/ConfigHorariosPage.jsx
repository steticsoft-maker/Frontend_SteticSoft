import React, { useState, useEffect, useCallback, useMemo } from "react";
import NovedadesTable from "../components/NovedadesTable";
import NovedadModal from "../components/NovedadModal";
import NovedadDetalleModal from "../components/HorarioDetalleModal";
import ConfirmModal from "../../../shared/components/common/ConfirmModal";
import {
  obtenerTodasLasNovedades,
  eliminarNovedad,
  cambiarEstadoNovedad,
} from "../services/horariosService";
import { toast } from "react-toastify";
import "../css/ConfigHorarios.css";

function ConfigHorariosPage() {
  const [novedades, setNovedades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [modalState, setModalState] = useState({
    type: null,
    novedad: null,
  });

  // ------------------------------
  // Cargar novedades
  // ------------------------------
  const queryParams = useMemo(() => {
    const params = {};
    if (filtroEstado) params.estado = filtroEstado === "activos";
    if (search) params.busqueda = search;
    return params;
  }, [filtroEstado, search]);

  const cargarNovedades = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await obtenerTodasLasNovedades(queryParams);
      setNovedades(data);
    } catch (err) {
      setError(err.message);
      toast.error("Error al cargar las novedades.");
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      cargarNovedades();
    }, 400); // ligero debounce
    return () => clearTimeout(timerId);
  }, [cargarNovedades]);

  // ------------------------------
  // Paginación
  // ------------------------------
  const paginatedNovedades = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return novedades.slice(startIndex, startIndex + rowsPerPage);
  }, [novedades, currentPage, rowsPerPage]);

  const totalPages = useMemo(
    () => Math.ceil(novedades.length / rowsPerPage),
    [novedades.length, rowsPerPage]
  );

  // ------------------------------
  // Handlers
  // ------------------------------
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setFiltroEstado(e.target.value);
    setCurrentPage(1);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  const openModal = (type, novedad = null) =>
    setModalState({ type, novedad });
  const closeModal = () => setModalState({ type: null, novedad: null });

  const handleSuccess = () => {
    closeModal();
    cargarNovedades();
  };

  const handleDeleteConfirm = async () => {
    if (!modalState.novedad) return;
    try {
      await eliminarNovedad(modalState.novedad.idNovedad);
      toast.success("Novedad eliminada con éxito.");
      handleSuccess();
    } catch (err) {
      toast.error(`Error al eliminar: ${err.message}`);
      closeModal();
    }
  };

  const handleToggleConfirm = async () => {
    if (!modalState.novedad) return;
    try {
      await cambiarEstadoNovedad(
        modalState.novedad.idNovedad,
        !modalState.novedad.estado
      );
      toast.success("Estado de la novedad cambiado con éxito.");
      handleSuccess();
    } catch (err) {
      toast.error(`Error al cambiar estado: ${err.message}`);
      closeModal();
    }
  };

  // ------------------------------
  // Render
  // ------------------------------
  if (error) {
    return (
      <div className="error-message">
        <div className="content-container">
          <h1>Error en la Gestión de Novedades</h1>
          <p>{error}</p>
          <button onClick={cargarNovedades}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
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
          </div>
          <button className="add-button" onClick={() => openModal("form")}>
            + Agregar Novedad
          </button>
        </div>

        {loading ? (
          <p style={{ textAlign: "center" }}>Cargando...</p>
        ) : (
          <>
            <NovedadesTable
              novedades={paginatedNovedades}
              onView={(n) => openModal("details", n)}
              onEdit={(n) => openModal("form", n)}
              onDeleteConfirm={(n) => openModal("confirmDelete", n)}
              onToggleEstado={(n) => openModal("confirmToggle", n)}
            />

            {totalPages > 1 && (
              <div className="pagination-container">
                <div className="rows-per-page-container">
                  <label htmlFor="rows-per-page">Filas:</label>
                  <select
                    id="rows-per-page"
                    value={rowsPerPage}
                    onChange={handleRowsPerPageChange}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </div>
                <div className="pagination-controls">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </button>
                  <span>
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
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
      {modalState.type === "form" && (
        <NovedadModal
          onClose={closeModal}
          onSuccess={handleSuccess}
          novedadToEdit={modalState.novedad}
          isEditing={!!modalState.novedad}
        />
      )}
      {modalState.type === "details" && (
        <NovedadDetalleModal
          novedad={modalState.novedad}
          onClose={closeModal}
        />
      )}
      {modalState.type === "confirmDelete" && (
        <ConfirmModal
          isOpen={true}
          onClose={closeModal}
          onConfirm={handleDeleteConfirm}
          title="Confirmar Eliminación"
          message="¿Está seguro de eliminar esta novedad?"
        />
      )}
      {modalState.type === "confirmToggle" && (
        <ConfirmModal
          isOpen={true}
          onClose={closeModal}
          onConfirm={handleToggleConfirm}
          title="Confirmar Cambio de Estado"
          message={`¿Seguro que quieres ${
            modalState.novedad?.estado ? "desactivar" : "activar"
          } esta novedad?`}
        />
      )}
    </div>
  );
}

export default ConfigHorariosPage;
