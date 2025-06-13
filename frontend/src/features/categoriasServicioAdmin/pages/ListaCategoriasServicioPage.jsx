// Ubicación: src/features/categoriasServicioAdmin/pages/ListaCategoriasServicioPage.jsx
import React, { useState, useEffect, useCallback } from 'react';

// --- Componentes hijos ---
import CategoriasTabla from '../components/CategoriasServicioTable';
import CategoriaForm from '../components/CategoriaServicioForm.jsx';
import CategoriaServicioDetalleModal from '../components/CategoriaServicioDetalleModal';
import ConfirmModal from '../components/confirmModal'; 

// --- Estilos ---
import '../css/CategoriasServicio.css';

// --- Servicios de la API ---
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
  const [filtroCategorias, setFiltroCategorias] = useState([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState('');

  // --- Estados para los modales ---
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // AÑADIDO: Estado para el modal de confirmación
  const [categoriaActual, setCategoriaActual] = useState(null);
  const [categoriaParaEliminar, setCategoriaParaEliminar] = useState(null); // AÑADIDO: Estado para guardar la categoría a eliminar

  // --- Lógica de carga de datos ---
  const cargarCategorias = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getCategoriasServicio();
      const data = response?.data?.data || response?.data || [];
      setCategorias(data);
      setFiltroCategorias(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Error al cargar categorías.');
      setCategorias([]);
      setFiltroCategorias([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarCategorias();
  }, [cargarCategorias]);

  // --- Lógica de búsqueda ---
  useEffect(() => {
    const resultados = categorias.filter(cat =>
      cat.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase())
    );
    setFiltroCategorias(resultados);
  }, [terminoBusqueda, categorias]);

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
    setError('');
    try {
      if (isEditMode && categoriaActual) {
        await updateCategoriaServicio(categoriaActual.idCategoriaServicio, formData);
      } else {
        await createCategoriaServicio(formData);
      }
      setIsFormModalOpen(false);
      cargarCategorias();
    } catch (apiError) {
      console.error("Error en submit de formulario:", apiError);
      throw apiError;
    }
  };

  // CAMBIADO: Esta función ahora solo abre el modal de confirmación
  const handleEliminarCategoria = (categoria) => {
    setCategoriaParaEliminar(categoria); // Guarda la categoría que el usuario quiere eliminar
    setIsConfirmModalOpen(true);         // Abre el modal de confirmación
  };

  // AÑADIDO: Esta nueva función ejecuta la eliminación real después de la confirmación
  const handleConfirmarEliminacion = async () => {
    if (!categoriaParaEliminar) return;

    setLoadingId(categoriaParaEliminar.idCategoriaServicio);
    setError('');
    
    try {
      await deleteCategoriaServicio(categoriaParaEliminar.idCategoriaServicio);
      cargarCategorias(); // Recarga la lista si la eliminación fue exitosa
    } catch (err) {
      setError(err?.response?.data?.message || 'Error al eliminar la categoría.');
    } finally {
      setLoadingId(null);
      setIsConfirmModalOpen(false); // Cierra el modal en cualquier caso
      setCategoriaParaEliminar(null); // Limpia el estado
    }
  };

  const handleCambiarEstadoCategoria = async (categoria) => {
    setLoadingId(categoria.idCategoriaServicio);
    setError('');
    try {
      await cambiarEstadoCategoriaServicio(categoria.idCategoriaServicio, !categoria.estado);
      cargarCategorias();
    } catch (err) {
      setError(err?.response?.data?.message || 'Error al cambiar estado.');
    } finally {
      setLoadingId(null);
    }
  };

  // --- Renderizado del Componente ---
  return (
    <div className="Categoria-content">
      <div className="categorias-servicio-content-wrapper">
        <h1>Gestión de Categorías de Servicio</h1>

        <div className="ContainerBotonAgregarCategoria">
          <div className="BusquedaBotonCategoria">
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
            />
          </div>
          <button className="botonAgregarCategoria" onClick={handleAbrirCrearModal}>
            Agregar Nueva Categoría
          </button>
        </div>

        {error && <p className="error" style={{textAlign: 'center', width: '100%'}}>ERROR: {error}</p>}

        {loading ? (
          <p>Cargando categorías...</p>
        ) : (
          <CategoriasTabla
            categorias={filtroCategorias}
            onEditar={handleAbrirEditarModal}
            onEliminar={handleEliminarCategoria} // Se pasa la función que abre el modal
            onCambiarEstado={handleCambiarEstadoCategoria}
            onVerDetalles={handleVerDetalles}
            loadingId={loadingId}
          />
        )}
      </div>

      {/* Renderizado de Modales */}
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

      {/* AÑADIDO: Renderizado del modal de confirmación */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmarEliminacion}
        title="Confirmar Eliminación"
        confirmText="Sí, Eliminar"
        isConfirming={loadingId !== null}
      >
        <p>
          ¿Estás seguro de que deseas eliminar la categoría
          <strong> "{categoriaParaEliminar?.nombre}"</strong>?
        </p>
        <p style={{color: 'red', fontSize: '0.9rem'}}>Esta acción no se puede deshacer.</p>
      </ConfirmModal>
    </div>
  );
};

export default ListaCategoriasServicioPage;