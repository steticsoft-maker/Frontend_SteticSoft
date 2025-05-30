// src/features/categoriasServicioAdmin/pages/ListaCategoriasServicioPage.jsx
import React, { useState, useEffect } from 'react';
import NavbarAdmin from '../../../shared/components/layout/NavbarAdmin';
import CategoriasServicioTable from '../components/CategoriasServicioTable';
import CategoriaServicioFormModal from '../components/CategoriaServicioFormModal';
import CategoriaServicioDetalleModal from '../components/CategoriaServicioDetalleModal';
import ConfirmModal from '../../../shared/components/common/ConfirmModal';
import ValidationModal from '../../../shared/components/common/ValidationModal';
import {
  fetchCategoriasServicio,
  saveCategoriaServicio,
  deleteCategoriaServicioById,
  toggleCategoriaServicioEstado
} from '../services/categoriasServicioService';
import '../css/CategoriasServicio.css'; // Nueva ruta CSS

function ListaCategoriasServicioPage() {
  const [categorias, setCategorias] = useState([]);
  const [search, setSearch] = useState('');

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);

  const [currentCategoria, setCurrentCategoria] = useState(null);
  const [formModalType, setFormModalType] = useState('agregar');
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    setCategorias(fetchCategoriasServicio());
  }, []);

  const handleOpenModal = (type, categoria = null) => {
    setCurrentCategoria(categoria);
    if (type === 'ver') {
      setIsDetailsModalOpen(true);
    } else if (type === 'delete') {
      setIsConfirmDeleteOpen(true);
    } else { // 'agregar' o 'editar'
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
      const updatedCategorias = saveCategoriaServicio(categoriaData, categorias);
      setCategorias(updatedCategorias);
      handleCloseModals();
    } catch (error) {
      setValidationMessage(error.message);
      setIsValidationModalOpen(true);
    }
  };

  const handleDelete = () => {
    if (currentCategoria) {
      const updatedCategorias = deleteCategoriaServicioById(currentCategoria.id, categorias);
      setCategorias(updatedCategorias);
      handleCloseModals();
    }
  };

  const handleToggleEstado = (categoriaId) => {
    const updatedCategorias = toggleCategoriaServicioEstado(categoriaId, categorias);
    setCategorias(updatedCategorias);
  };

  const filteredCategorias = categorias.filter(c =>
    c.nombre.toLowerCase().includes(search.toLowerCase()) ||
    (c.descripcion && c.descripcion.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="Categoria-container"> {/* Usar clase del CSS original */}
      <NavbarAdmin />
      <div className="Categoria-content"> {/* Usar clase del CSS original */}
        <h1>Categorías de Servicios</h1>
        <div className="ContainerBotonAgregarCategoria"> {/* Usar clase del CSS original */}
          <div className="BusquedaBotonCategoria"> {/* Usar clase del CSS original */}
            <input
              type="text"
              placeholder="Buscar categoría..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="botonAgregarCategoria" onClick={() => handleOpenModal('agregar')}> {/* Clase del CSS original */}
            Agregar Categoría
          </button>
        </div>
        <CategoriasServicioTable
          categorias={filteredCategorias}
          onView={(cat) => handleOpenModal('ver', cat)}
          onEdit={(cat) => handleOpenModal('agregar', cat)} // Debería ser 'editar'
          onDeleteConfirm={(cat) => handleOpenModal('delete', cat)}
          onToggleEstado={handleToggleEstado}
        />
      </div>
      <CategoriaServicioFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseModals}
        onSubmit={handleSave}
        initialData={currentCategoria}
        modalType={formModalType}
      />
      <CategoriaServicioDetalleModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseModals}
        categoria={currentCategoria}
      />
      <ConfirmModal
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

export default ListaCategoriasServicioPage;