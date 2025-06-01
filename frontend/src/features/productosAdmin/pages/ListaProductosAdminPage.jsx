// src/features/productosAdmin/pages/ListaProductosAdminPage.jsx
import React, { useState, useEffect } from 'react';
import NavbarAdmin from '../../../shared/components/layout/NavbarAdmin';
import ProductosAdminTable from '../components/ProductosAdminTable';
// Importar nuevos modales
import ProductoAdminCrearModal from '../components/ProductoAdminCrearModal'; // NUEVO
import ProductoAdminEditarModal from '../components/ProductoAdminEditarModal'; // NUEVO
import ProductoAdminDetalleModal from '../components/ProductoAdminDetalleModal';
import ConfirmModal from '../../../shared/components/common/ConfirmModal';
import ValidationModal from '../../../shared/components/common/ValidationModal';
import {
  fetchProductosAdmin,
  saveProductoAdmin,
  deleteProductoAdminById,
  toggleProductoAdminEstado
} from '../services/productosAdminService';
import '../css/ProductosAdmin.css';

function ListaProductosAdminPage() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  // Estados separados para los modales
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);

  const [currentProducto, setCurrentProducto] = useState(null);
  const [validationMessage, setValidationMessage] = useState('');
  // formModalType ya no se usa

  useEffect(() => {
    setProductos(fetchProductosAdmin());
  }, []);

  const handleOpenModal = (type, producto = null) => {
    setCurrentProducto(producto);
    if (type === 'details') {
      setIsDetailsModalOpen(true);
    } else if (type === 'delete') {
      setIsConfirmDeleteOpen(true);
    } else if (type === 'create') {
      setIsCrearModalOpen(true);
    } else if (type === 'edit') {
      if (producto) {
        setIsEditarModalOpen(true);
      } else {
        console.error("Intento de abrir modal de edición sin datos de producto.");
      }
    }
  };

  const handleCrearModalClose = () => {
    setIsCrearModalOpen(false);
  };

  const handleEditarModalClose = () => {
    setIsEditarModalOpen(false);
    setCurrentProducto(null);
  };

  const closeOtherModals = () => {
    setIsDetailsModalOpen(false);
    setIsConfirmDeleteOpen(false);
    setIsValidationModalOpen(false);
    setValidationMessage('');
    if (!isCrearModalOpen && !isEditarModalOpen) {
        setCurrentProducto(null);
    }
  };

  const handleSave = (productoData) => {
    try {
      const isEditing = !!productoData.id;
      // saveProductoAdmin en tu servicio ya maneja la lógica de id para crear/editar
      const updatedProductos = saveProductoAdmin(productoData, productos); 
      setProductos(updatedProductos);
      if (isEditing) {
        handleEditarModalClose();
      } else {
        handleCrearModalClose();
      }
    } catch (error) {
      setValidationMessage(error.message);
      setIsValidationModalOpen(true);
    }
  };

  const handleDelete = () => {
    if (currentProducto && currentProducto.id) {
      const updatedProductos = deleteProductoAdminById(currentProducto.id, productos);
      setProductos(updatedProductos);
      closeOtherModals();
    }
  };

  const handleToggleEstado = (productoId) => {
    const updatedProductos = toggleProductoAdminEstado(productoId, productos);
    setProductos(updatedProductos);
  };

  const filteredProductos = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    (p.categoria && p.categoria.toLowerCase().includes(busqueda.toLowerCase()))
  );

  return (
    // Usar clase de página principal consistente
    <div className="productos-admin-page-container"> 
      <NavbarAdmin />
      {/* Usar clase de contenido principal consistente */}
      <div className="productos-admin-main-content"> 
        {/* Wrapper interno para centrar si es necesario */}
        <div className="productos-admin-content-wrapper">
            <h1>Gestión de Productos</h1>
            {/* Contenedor para búsqueda y botón agregar, usar clases consistentes */}
            <div className="productos-admin-actions-bar"> 
            <div className="productos-admin-search-bar">
                <input
                type="text"
                placeholder="Buscar producto (nombre, categoría)..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                // className="inputBarraBusqueda" // Reemplazar con clase más específica si es necesario
                />
            </div>
            <button 
                className="productos-admin-add-button" // Clase específica y consistente
                onClick={() => handleOpenModal('create')}
            >
                Agregar Producto
            </button>
            </div>
            <ProductosAdminTable
            productos={filteredProductos}
            onView={(prod) => handleOpenModal('details', prod)}
            onEdit={(prod) => handleOpenModal('edit', prod)}
            onDeleteConfirm={(prod) => handleOpenModal('delete', prod)}
            onToggleEstado={handleToggleEstado}
            />
        </div>
      </div>

      <ProductoAdminCrearModal
        isOpen={isCrearModalOpen}
        onClose={handleCrearModalClose}
        onSubmit={handleSave}
      />
      <ProductoAdminEditarModal
        isOpen={isEditarModalOpen}
        onClose={handleEditarModalClose}
        onSubmit={handleSave}
        initialData={currentProducto}
      />
      <ProductoAdminDetalleModal
        isOpen={isDetailsModalOpen}
        onClose={closeOtherModals}
        producto={currentProducto}
      />
      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={closeOtherModals}
        onConfirm={handleDelete}
        title="Confirmar Eliminación"
        message={`¿Está seguro de que desea eliminar el producto "${currentProducto?.nombre || ''}"?`}
      />
      <ValidationModal
        isOpen={isValidationModalOpen}
        onClose={closeOtherModals}
        title="Aviso de Productos" // Título específico
        message={validationMessage}
      />
    </div>
  );
}

export default ListaProductosAdminPage;