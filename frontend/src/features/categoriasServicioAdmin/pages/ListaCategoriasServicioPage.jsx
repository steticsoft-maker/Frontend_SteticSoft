// Ubicación: src/features/categoriasServicioAdmin/pages/ListaCategoriasServicioPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import CategoriasTabla from '../components/CategoriasServicioTable';
import CategoriaForm from '../components/CategoriaServicioForm.jsx';
import CategoriaServicioDetalleModal from '../components/CategoriaServicioDetalleModal';
import ConfirmModal from '../../../shared//components/common/ConfirmModal';

// --- Estilos ---
import '../css/CategoriasServicio.css';
import {
  getCategoriasServicio,
  createCategoriaServicio,
  updateCategoriaServicio,
  deleteCategoriaServicio,
  cambiarEstadoCategoriaServicio,
} from '../services/categoriasServicioService.js';

const ListaCategoriasServicioPage = () => {
  // --- Estados del componente ---
  const [categorias, setCategorias] = useState([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  // --- Estados para la paginación ---
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState('');

  // --- Estados para los modales ---
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [categoriaActual, setCategoriaActual] = useState(null);

  // --- NUEVOS ESTADOS para confirmación de cambio de estado ---
  const [isConfirmEstadoModalOpen, setIsConfirmEstadoModalOpen] = useState(false);
  const [categoriaEstadoActual, setCategoriaEstadoActual] = useState(null);

  // --- Lógica de carga de datos ---
  const cargarCategorias = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getCategoriasServicio();
      const data = response?.data?.data || response?.data || [];
      setCategorias(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Error al cargar categorías.');
      setCategorias([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarCategorias();
  }, [cargarCategorias]);
  
  // --- Lógica de filtrado y paginación combinada ---
  const categoriasFiltradas = useMemo(() => {
    let dataFiltrada = [...categorias];

    if (filtroEstado !== 'todos') {
      const esActivo = filtroEstado === 'activos';
      dataFiltrada = dataFiltrada.filter(cat => cat.estado === esActivo);
    }

    if (terminoBusqueda.trim() !== '') {
      const busquedaLower = terminoBusqueda.toLowerCase();
      dataFiltrada = dataFiltrada.filter(cat =>
        cat.nombre.toLowerCase().includes(busquedaLower) ||
        (cat.descripcion && cat.descripcion.toLowerCase().includes(busquedaLower))
      );
    }
    
    return dataFiltrada;
  }, [categorias, terminoBusqueda, filtroEstado]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return categoriasFiltradas.slice(startIndex, endIndex);
  }, [currentPage, rowsPerPage, categoriasFiltradas]);
  
  const totalPages = Math.ceil(categoriasFiltradas.length / rowsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };


  // --- Manejadores de Acciones ---
  const handleAbrirCrearModal = () => {
    setIsEditMode(false);
    setCategoriaActual(null);
    setIsFormModalOpen(true);
  };

  const handleAbrirEditarModal = (categoria) => {
    setIsEditMode(true);
    setCategoriaActual(categoria);
    setIsFormModalOpen(true);
  };
  
  const handleVerDetalles = (categoria) => {
    setCategoriaActual(categoria);
    setIsDetailModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    if (isEditMode) {
      await updateCategoriaServicio(categoriaActual.idCategoriaServicio, formData);
    } else {
      await createCategoriaServicio(formData);
    }
    setIsFormModalOpen(false);
    cargarCategorias();
  };

  const handleEliminarCategoria = (categoria) => {
    setCategoriaActual(categoria);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmarEliminacion = async () => {
    if (!categoriaActual) return;
    setLoadingId(categoriaActual.idCategoriaServicio);
    try {
      await deleteCategoriaServicio(categoriaActual.idCategoriaServicio);
      cargarCategorias();
    } catch (err) {
      setError(err?.response?.data?.message || 'Error al eliminar la categoría.');
    } finally {
      setLoadingId(null);
      setIsConfirmModalOpen(false);
      setCategoriaActual(null);
    }
  };

  // --- NUEVO: Manejador para solicitar confirmación de cambio de estado ---
  const handleSolicitarCambioEstadoCategoria = (categoria) => {
    setCategoriaEstadoActual(categoria);
    setIsConfirmEstadoModalOpen(true);
  };

  // --- NUEVO: Manejador para confirmar el cambio de estado ---
  const handleConfirmarCambioEstadoCategoria = async () => {
    if (!categoriaEstadoActual) return;
    setLoadingId(categoriaEstadoActual.idCategoriaServicio);
    try {
      await cambiarEstadoCategoriaServicio(
        categoriaEstadoActual.idCategoriaServicio,
        !categoriaEstadoActual.estado
      );
      cargarCategorias();
    } catch (err) {
      setError(err?.response?.data?.message || 'Error al cambiar estado.');
    } finally {
      setLoadingId(null);
      setIsConfirmEstadoModalOpen(false);
      setCategoriaEstadoActual(null);
    }
  };

  return (
    <div className="Categoria-content">
      <div className="categorias-servicio-content-wrapper">
        <h1>Gestión de Categorías de Servicio</h1>

        <div className="ContainerBotonAgregarCategoria">
          <div className="filtros-wrapper">
            <input
              className="filtro-input"
              type="text"
              placeholder="Buscar por nombre o descripción..."
              value={terminoBusqueda}
              onChange={(e) => {
                setTerminoBusqueda(e.target.value);
                setCurrentPage(1);
              }}
            />
            <div className="filtro-estado-grupo">
                <select
                  id="filtro-estado"
                  className="filtro-input"
                  value={filtroEstado}
                  onChange={(e) => {
                    setFiltroEstado(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="todos">Todos los estados</option>
                  <option value="activos">Activos</option>
                  <option value="inactivos">Inactivos</option>
                </select>
            </div>
          </div>

          <button className="botonAgregarCategoria" onClick={handleAbrirCrearModal}>
            Agregar Nueva Categoría
          </button>
        </div>

        {error && <p className="error" style={{textAlign: 'center', width: '100%'}}>ERROR: {error}</p>}

        {loading ? (
          <p>Cargando categorías...</p>
        ) : (
          <>
            <CategoriasTabla
              categorias={paginatedData} 
              onEditar={handleAbrirEditarModal}
              onEliminar={handleEliminarCategoria}
              onCambiarEstado={handleSolicitarCambioEstadoCategoria}
              onVerDetalles={handleVerDetalles}
              loadingId={loadingId}
            />

            {/* --- Renderizado de los controles de paginación MODIFICADO --- */}
            {totalPages > 1 && ( // Solo muestra la paginación si hay más de 1 página
              <div className="pagination-container">
                  <div className="rows-per-page-container">
                      <label htmlFor="rows-per-page">Filas por página:</label>
                      <select id="rows-per-page" value={rowsPerPage} onChange={handleRowsPerPageChange}>
                          <option value="5">5</option>
                          <option value="10">10</option>
                      </select>
                  </div>
                  <div className="pagination-controls">
                      {/* Se eliminan los botones "Anterior" y "Siguiente" */}
                      {[...Array(totalPages).keys()].map(num => (
                          <button
                              key={num + 1}
                              onClick={() => handlePageChange(num + 1)}
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

      {/* --- Modales --- */}
      <CategoriaForm
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={categoriaActual}
        isEditMode={isEditMode}
      />
      <CategoriaServicioDetalleModal
        open={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        categoria={categoriaActual}
      />
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmarEliminacion}
        title="Confirmar Eliminación"
        isConfirming={loadingId !== null}
      >
        <p>
          ¿Estás seguro de que deseas eliminar la categoría
          <strong> "{categoriaActual?.nombre}"</strong>?
        </p>
        <p style={{color: 'red', fontSize: '0.9rem'}}>Esta acción no se puede deshacer.</p>
      </ConfirmModal>

      {/* --- NUEVO: Modal de confirmación de cambio de estado --- */}
      <ConfirmModal
        isOpen={isConfirmEstadoModalOpen}
        onClose={() => setIsConfirmEstadoModalOpen(false)}
        onConfirm={handleConfirmarCambioEstadoCategoria}
        title="Confirmar Acción"
        isConfirming={loadingId !== null}
      >
        <p>
          ¿Estás seguro de que deseas {categoriaEstadoActual?.estado ? 'desactivar' : 'activar'} la categoría
          <strong> "{categoriaEstadoActual?.nombre}"</strong>?
        </p>
      </ConfirmModal>
    </div>
  );
};

export default ListaCategoriasServicioPage;