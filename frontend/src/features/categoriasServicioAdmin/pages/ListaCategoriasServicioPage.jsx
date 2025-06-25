// Ubicación: src/features/categoriasServicioAdmin/pages/ListaCategoriasServicioPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import CategoriasTabla from '../components/CategoriasServicioTable';
import CategoriaForm from '../components/CategoriaServicioForm.jsx';
import CategoriaServicioDetalleModal from '../components/CategoriaServicioDetalleModal';
import ConfirmModal from '../components/confirmModal'; 

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

  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState('');

  // --- Estados para los modales (sin cambios) ---
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [categoriaActual, setCategoriaActual] = useState(null);

  // --- Lógica de carga de datos (pequeño ajuste en el catch) ---
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
  // --- Manejadores de Acciones (sin cambios, pero he limpiado el de submit) ---
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
    try {
      if (isEditMode) {
        await updateCategoriaServicio(categoriaActual.idCategoriaServicio, formData);
      } else {
        await createCategoriaServicio(formData);
      }
      setIsFormModalOpen(false);
      cargarCategorias();
    } catch (err) {
      throw err;
    }
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
  
  const handleCambiarEstadoCategoria = async (categoria) => {
    setLoadingId(categoria.idCategoriaServicio);
    try {
      await cambiarEstadoCategoriaServicio(categoria.idCategoriaServicio, !categoria.estado);
      cargarCategorias();
    } catch (err) {
      setError(err?.response?.data?.message || 'Error al cambiar estado.');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="Categoria-content">
      <div className="categorias-servicio-content-wrapper">
        <h1>Gestión de Categorías de Servicio</h1>

        <div className="ContainerBotonAgregarCategoria">
          <div className="BusquedaBotonCategoria">
            <input
              type="text"
              placeholder="Buscar por nombre o descripción..."
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
            />
          </div>
          {}
          <select
            className="filtro-estado-select"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="todos">Todos los estados</option>
            <option value="activos">Activos</option>
            <option value="inactivos">Inactivos</option>
          </select>
          <button className="botonAgregarCategoria" onClick={handleAbrirCrearModal}>
            Agregar Nueva Categoría
          </button>
        </div>

        {error && <p className="error" style={{textAlign: 'center', width: '100%'}}>ERROR: {error}</p>}

        {loading ? (
          <p>Cargando categorías...</p>
        ) : (
          <CategoriasTabla
            categorias={categoriasFiltradas}
            onEditar={handleAbrirEditarModal}
            onEliminar={handleEliminarCategoria}
            onCambiarEstado={handleCambiarEstadoCategoria}
            onVerDetalles={handleVerDetalles}
            loadingId={loadingId}
          />
        )}
      </div>

      {}
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
    </div>
  );
};

export default ListaCategoriasServicioPage;