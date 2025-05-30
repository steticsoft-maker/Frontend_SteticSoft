// src/features/productosAdmin/pages/ListaCategoriasProductoPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from '../../../shared/components/layout/NavbarAdmin';
import CategoriasProductoTable from '../components/CategoriasProductoTable'; 
import CategoriaProductoFormModal from '../components/CategoriaProductoFormModal'; // Corregido
import CategoriaProductoDetalleModal from '../components/CategoriaProductoDetalleModal'; // Corregido
import ConfirmModal from '../../../shared/components/common/ConfirmModal'; // Genérico
import ValidationModal from '../../../shared/components/common/ValidationModal'; // Genérico
import {
  fetchCategoriasProducto,
  saveCategoriaProducto,
  deleteCategoriaProductoById,
  toggleCategoriaProductoEstado
} from '../services/categoriasProductoService';
import '../css/CategoriasProducto.css'; // Asegurar la ruta correcta

function ListaCategoriasProductoPage() {
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);

  const [currentCategoria, setCurrentCategoria] = useState(null);
  const [formModalType, setFormModalType] = useState('create');
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    setCategorias(fetchCategoriasProducto());
  }, []);

  const handleOpenModal = (type, categoria = null) => {
    setCurrentCategoria(categoria);
    if (type === 'details') {
      setIsDetailsModalOpen(true);
    } else if (type === 'delete') {
      setIsConfirmDeleteOpen(true);
    } else { // 'create' or 'edit'
      setFormModalType(type);
      setIsFormModalOpen(true);
    }
  };

  const handleCloseModals = () => {
    setIsFormModalOpen(false);
    setIsDetailsModalOpen(false);
    setIsConfirmDeleteOpen(false);
    setIsValidationModalOpen(false);
    setCurrentCategoria(null);
    setValidationMessage('');
  };

  const handleSave = (categoriaData) => {
    try {
      const updatedCategorias = saveCategoriaProducto(categoriaData, categorias);
      setCategorias(updatedCategorias);
      handleCloseModals();
    } catch (error) {
      setValidationMessage(error.message);
      setIsValidationModalOpen(true);
    }
  };

  const handleDelete = () => {
    if (currentCategoria) {
      const updatedCategorias = deleteCategoriaProductoById(currentCategoria.id, categorias);
      setCategorias(updatedCategorias);
      handleCloseModals();
    }
  };

  const handleToggleEstado = (categoriaId) => {
    const updatedCategorias = toggleCategoriaProductoEstado(categoriaId, categorias);
    setCategorias(updatedCategorias);
  };

  const filteredCategorias = categorias.filter(cat =>
    cat.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    cat.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
    (cat.tipoUso && cat.tipoUso.toLowerCase().includes(busqueda.toLowerCase())) ||
    (cat.vidaUtil && cat.vidaUtil.toString().includes(busqueda))
  );

  return (
    <div className="categorias-container"> {/* Clase principal del CSS original */}
      <NavbarAdmin />
      <div className="CategoriaProductoContent"> {/* Clase del CSS original */}
        <h1>Gestión Categorías de Productos</h1>
        <div className="BarraBusquedaBotonAgregarCategoriaProductos">
          <input
            type="text"
            placeholder="Buscar categoría..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="inputBarraBusquedaCategoriaProductos"
          />
          <button
            className="botonAgregarCategoriaProducto"
            onClick={() => handleOpenModal('create')}
          >
            Agregar Categoría
          </button>
        </div>
        <CategoriasProductoTable
          categorias={filteredCategorias}
          onView={(cat) => handleOpenModal('details', cat)}
          onEdit={(cat) => handleOpenModal('edit', cat)}
          onDeleteConfirm={(cat) => handleOpenModal('delete', cat)}
          onToggleEstado={handleToggleEstado}
        />
      </div>

      <CategoriaProductoFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseModals}
        onSubmit={handleSave}
        initialData={currentCategoria}
        modalType={formModalType}
      />
      <CategoriaProductoDetalleModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseModals}
        categoria={currentCategoria}
      />
      <ConfirmModal // Usar el genérico
        isOpen={isConfirmDeleteOpen}
        onClose={handleCloseModals}
        onConfirm={handleDelete}
        title="Confirmar Eliminación"
        message={`¿Está seguro de que desea eliminar la categoría "${currentCategoria?.nombre || ''}"?`}
      />
      <ValidationModal
        isOpen={isValidationModalOpen}
        onClose={handleCloseModals}
        title="Aviso"
        message={validationMessage}
      />
    </div>
  );
}
export default ListaCategoriasProductoPage;