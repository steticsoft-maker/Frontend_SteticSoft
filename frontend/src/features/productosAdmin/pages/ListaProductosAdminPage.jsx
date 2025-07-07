// src/features/productosAdmin/pages/ListaProductosAdminPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import NavbarAdmin from '../../../shared/components/layout/NavbarAdmin';
import ProductosAdminTable from '../components/ProductosAdminTable';
import ProductoAdminCrearModal from '../components/ProductoAdminCrearModal';
import ProductoAdminEditarModal from '../components/ProductoAdminEditarModal';
import ProductoAdminDetalleModal from '../components/ProductoAdminDetalleModal';
import ConfirmModal from '../../../shared/components/common/ConfirmModal';
import ValidationModal from '../../../shared/components/common/ValidationModal';

// CAMBIO: Importamos el objeto del servicio, no las funciones sueltas
import { productosAdminService } from '../services/productosAdminService';
import '../css/ProductosAdmin.css';

function ListaProductosAdminPage() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [isLoading, setIsLoading] = useState(true); // NUEVO: Estado de carga
  const [error, setError] = useState(null); // NUEVO: Estado de error

  // Estados para modales (sin cambios)
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);

  const [currentProducto, setCurrentProducto] = useState(null);
  const [validationMessage, setValidationMessage] = useState('');

  // CAMBIO: Lógica para cargar datos desde la API
  const cargarProductos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await productosAdminService.getProductos();
      // Asumiendo que la API devuelve { success: true, data: [...] }
      setProductos(response || []);
    } catch (err) {
      setError(err.message || "Error al cargar los productos.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

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
  
  // CAMBIO: Lógica de guardado asíncrona que llama a la API
  const handleSave = async (productoData) => {
  try {
    // ✅ CORRECCIÓN: Cambiamos 'productoData.id' por 'productoData.idProducto'
    // para que coincida con el nombre del ID que se maneja en el formulario de edición.
    if (productoData.idProducto) { // Editando un producto existente
      await productosAdminService.updateProducto(productoData.idProducto, productoData);
    } else { // Creando un producto nuevo
      await productosAdminService.createProducto(productoData);
    }
    await cargarProductos();
    closeModal();
  } catch (err) {
    setValidationMessage(err.message || "Error al guardar el producto.");
    setIsValidationModalOpen(true);
  }
};

  // CAMBIO: Lógica de borrado asíncrona
  const handleDelete = async () => {
  // ✅ CORRECCIÓN: Cambiamos 'currentProducto?.id' por 'currentProducto?.idProducto'
  if (currentProducto?.idProducto) {
    try {
      // Llamamos al servicio con el ID correcto
      await productosAdminService.deleteProducto(currentProducto.idProducto);
      await cargarProductos(); // Recargamos la lista para que el producto desaparezca
      closeModal();
    } catch (err) {
      setValidationMessage(err.message || "Error al eliminar el producto.");
      setIsValidationModalOpen(true);
      // No cerramos el modal de confirmación aquí, solo el de validación después.
    }
  }
};
  
  // CAMBIO: Lógica de cambio de estado asíncrona
  const handleToggleEstado = async (productoId) => {
    const producto = productos.find(p => p.id === productoId);
    if (producto) {
        try {
            await productosAdminService.toggleEstado(productoId, !producto.estado);
            await cargarProductos();
        } catch(err) {
            setValidationMessage(err.message || "Error al cambiar el estado.");
            setIsValidationModalOpen(true);
        }
    }
  };

  const filteredProductos = productos.filter(p =>
    (p.nombre?.toLowerCase() || '').includes(busqueda.toLowerCase()) ||
    (p.categoria?.toLowerCase() || '').includes(busqueda.toLowerCase())
  );

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
                placeholder="Buscar producto (nombre, categoría)..."
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
            <ProductosAdminTable
              productos={filteredProductos}
              onView={(prod) => handleOpenModal('details', prod)}
              onEdit={(prod) => handleOpenModal('edit', prod)}
              onDeleteConfirm={(prod) => handleOpenModal('delete', prod)}
              onToggleEstado={handleToggleEstado}
            />
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