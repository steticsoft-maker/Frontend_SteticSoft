// RUTA: src/features/productosAdmin/pages/ListaProductosAdminPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import NavbarAdmin from '../../../shared/components/layout/NavbarAdmin';
import ProductosAdminTable from '../components/ProductosAdminTable';
import ProductoAdminCrearModal from '../components/ProductoAdminCrearModal';
import ProductoAdminEditarModal from '../components/ProductoAdminEditarModal';
import ProductoAdminDetalleModal from '../components/ProductoAdminDetalleModal';
import ConfirmModal from '../../../shared/components/common/ConfirmModal';
import ValidationModal from '../../../shared/components/common/ValidationModal';
import Pagination from "../../../shared/components/common/Pagination";
import { productosAdminService } from '../services/productosAdminService';
import '../css/ProductosAdmin.css';

function ListaProductosAdminPage() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Estados para modales (sin cambios)
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);

  const [currentProducto, setCurrentProducto] = useState(null);
  const [validationMessage, setValidationMessage] = useState('');

  const cargarProductos = useCallback(async (searchTerm = "") => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await productosAdminService.getProductos(searchTerm);
      setProductos(response || []);
    } catch (err) {
      setError(err.message || "Error al cargar los productos.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
        cargarProductos(busqueda);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [busqueda, cargarProductos]);

  const closeModal = () => {
    setIsCrearModalOpen(false);
    setIsEditarModalOpen(false);
    setIsDetailsModalOpen(false);
    setIsConfirmDeleteOpen(false);
    setIsValidationModalOpen(false);
    setCurrentProducto(null);
    setValidationMessage('');
  };

  const handleOpenModal = (type, producto = null) => {
    setCurrentProducto(producto);
    if (type === 'details') setIsDetailsModalOpen(true);
    else if (type === 'delete') setIsConfirmDeleteOpen(true);
    else if (type === 'create') setIsCrearModalOpen(true);
    else if (type === 'edit') setIsEditarModalOpen(true);
  };
  
  const handleSave = async (productoData) => {
    try {
      if (productoData.idProducto) {
        await productosAdminService.updateProducto(productoData.idProducto, productoData);
      } else {
        await productosAdminService.createProducto(productoData);
      }
      await cargarProductos(busqueda);
      closeModal();
    } catch (err) {
      setValidationMessage(err.message || "Error al guardar el producto.");
      setIsValidationModalOpen(true);
    }
  };

  const handleDelete = async () => {
    if (currentProducto?.idProducto) {
      try {
        await productosAdminService.deleteProducto(currentProducto.idProducto);
        await cargarProductos(busqueda);
        closeModal();
      } catch (err) {
        setValidationMessage(err.message || "Error al eliminar el producto.");
        setIsValidationModalOpen(true);
      }
    }
  };
  
  const handleToggleEstado = async (productoId) => {
    const producto = productos.find(p => p.idProducto === productoId);
    if (producto) {
        try {
            await productosAdminService.toggleEstado(productoId, !producto.estado);
            await cargarProductos(busqueda);
        } catch(err) {
            setValidationMessage(err.message || "Error al cambiar el estado.");
            setIsValidationModalOpen(true);
        }
    }
  };
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const productosPaginados = productos.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="productos-admin-page-container">
      <NavbarAdmin />
      <div className="productos-admin-main-content">
        <div className="productos-admin-content-wrapper">
          <h1>Gestión de Productos</h1>
          <div className="productos-admin-actions-bar">
            <div className="productos-admin-search-bar">
              <input
                type="text"
                placeholder="Busca por cualquier campo de la tabla"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <button
              className="productos-admin-add-button"
              onClick={() => handleOpenModal('create')}
            >
              Agregar Producto
            </button>
          </div>
          {isLoading && <p>Cargando productos...</p>}
          {error && <p className="error-message">{error}</p>}
          {!isLoading && !error && (
            <>
              <ProductosAdminTable
                productos={productosPaginados}
                onView={(prod) => handleOpenModal('details', prod)}
                onEdit={(prod) => handleOpenModal('edit', prod)}
                onDeleteConfirm={(prod) => handleOpenModal('delete', prod)}
                onToggleEstado={handleToggleEstado}
              />
              <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={productos.length}
                paginate={paginate}
                currentPage={currentPage}
              />
            </>
          )}
        </div>
      </div>

      <ProductoAdminCrearModal
        isOpen={isCrearModalOpen}
        onClose={closeModal}
        onSubmit={handleSave}
      />
      <ProductoAdminEditarModal
        isOpen={isEditarModalOpen}
        onClose={closeModal}
        onSubmit={handleSave}
        initialData={currentProducto}
      />
      <ProductoAdminDetalleModal
        isOpen={isDetailsModalOpen}
        onClose={closeModal}
        producto={currentProducto}
      />
      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={closeModal}
        onConfirm={handleDelete}
        title="Confirmar Eliminación"
        message={`¿Está seguro de que desea eliminar el producto "${currentProducto?.nombre || ''}"?`}
      />
      <ValidationModal
        isOpen={isValidationModalOpen}
        onClose={closeModal}
        title="Aviso de Productos"
        message={validationMessage}
      />
    </div>
  );
}

export default ListaProductosAdminPage;