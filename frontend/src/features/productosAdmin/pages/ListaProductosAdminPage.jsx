// src/features/productosAdmin/pages/ListaProductosAdminPage.jsx
import React, { useState, useEffect } from 'react';
import NavbarAdmin from '../../../shared/components/layout/NavbarAdmin';
import ProductosAdminTable from '../components/ProductosAdminTable';
import ProductoAdminFormModal from '../components/ProductoAdminFormModal';
import ProductoAdminDetalleModal from '../components/ProductoAdminDetalleModal';
import ConfirmModal from '../../../shared/components/common/ConfirmModal'; // Genérico
import ValidationModal from '../../../shared/components/common/ValidationModal'; // Genérico
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

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);

  const [currentProducto, setCurrentProducto] = useState(null);
  const [formModalType, setFormModalType] = useState('create');
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    setProductos(fetchProductosAdmin());
  }, []);

  const handleOpenModal = (type, producto = null) => {
    setCurrentProducto(producto);
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
    setCurrentProducto(null);
    setValidationMessage('');
  };

  const handleSave = (productoData) => {
    try {
      const updatedProductos = saveProductoAdmin(productoData, productos);
      setProductos(updatedProductos);
      handleCloseModals();
    } catch (error) {
      setValidationMessage(error.message);
      setIsValidationModalOpen(true);
    }
  };

  const handleDelete = () => {
    if (currentProducto) {
      const updatedProductos = deleteProductoAdminById(currentProducto.id, productos);
      setProductos(updatedProductos);
      handleCloseModals();
    }
  };

  const handleToggleEstado = (productoId) => {
    const updatedProductos = toggleProductoAdminEstado(productoId, productos);
    setProductos(updatedProductos);
  };

  const filteredProductos = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="productos-admin-page-container"> {/* Nueva clase para la página */}
      <NavbarAdmin />
      <div className="productoAdministradorContent"> {/* Clase del CSS original */}
        <h1>Gestión de Productos</h1>
        <div className="search-add-container">
          <input
            type="text"
            placeholder="Buscar producto (nombre, categoría)..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="inputBarraBusqueda" // Clase del CSS original
          />
          <button className="botonAgregarProductoAdministrador" onClick={() => handleOpenModal('create')}>
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

      <ProductoAdminFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseModals}
        onSubmit={handleSave}
        initialData={currentProducto}
        modalType={formModalType}
      />
      <ProductoAdminDetalleModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseModals}
        producto={currentProducto}
      />
      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={handleCloseModals}
        onConfirm={handleDelete}
        title="Confirmar Eliminación"
        message={`¿Está seguro de que desea eliminar el producto "${currentProducto?.nombre || ''}"?`}
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

export default ListaProductosAdminPage;