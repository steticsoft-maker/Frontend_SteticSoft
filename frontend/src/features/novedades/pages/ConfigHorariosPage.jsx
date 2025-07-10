import React, { useState, useEffect, useCallback, useMemo } from "react";
import NavbarAdmin from "../../../shared/components/layout/NavbarAdmin";
import HorariosTable from "../components/HorariosTable";
import HorarioDetalleModal from "../components/HorarioDetalleModal";
import HorarioModal from '../components/HorarioModal';
import ConfirmModal from "../../../shared/components/common/ConfirmModal";
import { fetchHorarios, deleteHorario, toggleHorarioEstado } from "../services/horariosService";
import "../css/ConfigHorarios.css";

function ConfigHorariosPage() {
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const [currentHorario, setCurrentHorario] = useState(null);
  const [modalType, setModalType] = useState(null);

  const cargarHorarios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchHorarios();
      setHorarios(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarHorarios();
  }, [cargarHorarios]);

  const filteredHorarios = useMemo(() => {
    return horarios
      .filter(h => {
        if (filtroEstado === "todos") return true;
        const esActivo = filtroEstado === 'activos';
        return h.estado === esActivo;
      })
      .filter(h => {
        const lowerCaseSearch = search.toLowerCase().trim();
        if (!lowerCaseSearch) return true;

        const encargadoMatch = (h.empleado?.nombre ?? '').toLowerCase().includes(lowerCaseSearch) || (h.empleado?.apellido ?? '').toLowerCase().includes(lowerCaseSearch);
        
        const diasHorariosMatch = (h.dias ?? []).some(dia => 
          (dia.dia ?? '').toString().toLowerCase().includes(lowerCaseSearch) ||
          (dia.horaInicio ?? '').toLowerCase().includes(lowerCaseSearch) ||
          (dia.horaFin ?? '').toLowerCase().includes(lowerCaseSearch)
        );

        return encargadoMatch || diasHorariosMatch;
      });
  }, [horarios, search, filtroEstado]);

  const paginatedHorarios = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredHorarios.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredHorarios, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredHorarios.length / rowsPerPage);

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

  const openModal = (type, horario = null) => {
    setModalType(type);
    setCurrentHorario(horario);
  };

  const closeModal = () => {
    setModalType(null);
    setCurrentHorario(null);
  };
  
  const handleSuccess = () => {
    closeModal();
    cargarHorarios();
  };
  
  const handleDeleteConfirm = async () => {
    if (!currentHorario) return;
    try {
      await deleteHorario(currentHorario.id);
      handleSuccess();
    } catch (err) {
      alert(`Error al eliminar: ${err.message}`);
    }
  };

  const handleToggleConfirm = async () => {
    if (!currentHorario) return;
    try {
      await toggleHorarioEstado(currentHorario.id, !currentHorario.estado);
      handleSuccess();
    } catch (err) {
      alert(`Error al cambiar estado: ${err.message}`);
    }
  };

  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="novedades-page-container">
      <NavbarAdmin />
      <div className="novedades-content">
        <h1>Configuración de Horarios de Empleados</h1>
        
        <div className="novedades-actions-bar">
          <input
            className="novedades-search-bar"
            type="text"
            placeholder="Buscar por encargado, día u hora..."
            value={search}
            onChange={handleSearchChange}
          />
          <select
            className="filtro-input"
            value={filtroEstado}
            onChange={handleFilterChange}
          >
            <option value="todos">Todos los Estados</option>
            <option value="activos">Activos</option>
            <option value="inactivos">Inactivos</option>
          </select>
          <button className="novedades-add-button" onClick={() => openModal('form')}>
            Agregar Horario
          </button>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center' }}>Cargando horarios...</p>
        ) : (
          <>
            <HorariosTable
              horarios={paginatedHorarios}
              onView={horario => openModal('details', horario)}
              onEdit={horario => openModal('form', horario)}
              onDeleteConfirm={horario => openModal('confirmDelete', horario)}
              onToggleEstado={horario => openModal('confirmToggle', horario)}
            />
            {totalPages > 1 && (
              <div className="pagination-container">
                <div className="rows-per-page-container">
                  <label htmlFor="rows-per-page">Filas por página:</label>
                  <select id="rows-per-page" value={rowsPerPage} onChange={handleRowsPerPageChange}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                  </select>
                </div>
                <div className="pagination-controls">
                  {[...Array(totalPages).keys()].map(num => (
                    <button
                      key={num + 1}
                      onClick={() => setCurrentPage(num + 1)}
                      className={currentPage === num + 1 ? 'active' : ''}
                    >
                      {num + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {modalType === 'form' && (
        <HorarioModal 
          onClose={closeModal} 
          onSuccess={handleSuccess}
          horarioToEdit={currentHorario}
        />
      )}
      {modalType === 'details' && (
        <HorarioDetalleModal 
          onClose={closeModal} 
          horario={currentHorario}
        />
      )}
      {modalType === 'confirmDelete' && (
        <ConfirmModal 
          isOpen={true} 
          onClose={closeModal} 
          onConfirm={handleDeleteConfirm} 
          title="Confirmar Eliminación" 
          message={`¿Está seguro de que desea eliminar el horario de ${currentHorario?.empleado?.nombre ?? 'este empleado'}?`}
        />
      )}
      {modalType === 'confirmToggle' && (
        <ConfirmModal 
          isOpen={true} 
          onClose={closeModal} 
          onConfirm={handleToggleConfirm} 
          title="Confirmar Cambio de Estado" 
          message={`¿Seguro que quieres ${currentHorario?.estado ? 'desactivar' : 'activar'} el horario de ${currentHorario?.empleado?.nombre ?? 'este empleado'}?`}
        />
      )}
    </div>
  );
}

export default ConfigHorariosPage;