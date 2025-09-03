// RUTA: src/features/productosAdmin/pages/ListaProductosAdminPage.jsx

import React, { useState, useEffect, useCallback, useMemo } from 'react'; // ✨ Se agrega useMemo
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
    const [filtroEstado, setFiltroEstado] = useState('todos'); // ✨ Nuevo estado para el filtro de estado
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

    // ✨ NUEVO: Estados para confirmación de cambio de estado
    const [isConfirmEstadoOpen, setIsConfirmEstadoOpen] = useState(false);
    const [productoEstadoActual, setProductoEstadoActual] = useState(null);

    const cargarProductos = useCallback(async () => { // ✨ Eliminamos searchTerm de los parámetros porque el filtrado ahora es local
        setIsLoading(true);
        setError(null);
        try {
            // ✨ Ahora cargamos todos los productos y el filtro se aplica en el frontend
            const response = await productosAdminService.getProductos();
            setProductos(response || []);
        } catch (err) {
            setError(err.message || "Error al cargar los productos.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        cargarProductos(); // Cargamos todos los productos al inicio
    }, [cargarProductos]);

    useEffect(() => {
        // Reinicia la página a 1 cada vez que cambia la búsqueda o el filtro de estado
        setCurrentPage(1); 
    }, [busqueda, filtroEstado]); // ✨ Se agrega filtroEstado para reiniciar la página al cambiar el filtro

    const closeModal = () => {
        setIsCrearModalOpen(false);
        setIsEditarModalOpen(false);
        setIsDetailsModalOpen(false);
        setIsConfirmDeleteOpen(false);
        setIsValidationModalOpen(false);
        setIsConfirmEstadoOpen(false); // ✨ Cierra el modal de confirmación de estado
        setCurrentProducto(null);
        setProductoEstadoActual(null); // ✨ Limpia el producto de estado
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
                const response = await productosAdminService.createProducto(productoData);
                if (response?.errors) return response.errors; // 👈 devolvemos errores al modal
                }
                await cargarProductos();
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
                await cargarProductos(); // ✨ Cargamos todos los productos de nuevo después de eliminar
                closeModal();
            } catch (err) {
                setValidationMessage(err.message || "Error al eliminar el producto.");
                setIsValidationModalOpen(true);
            }
        }
    };

    // ✨ NUEVO: Solicitar confirmación antes de cambiar estado
    const handleSolicitarToggleEstado = (productoId) => {
        const producto = productos.find(p => p.idProducto === productoId);
        if (producto) {
            setProductoEstadoActual(producto);
            setIsConfirmEstadoOpen(true);
        }
    };

    // ✨ NUEVO: Confirmar y ejecutar el cambio de estado
    const handleConfirmToggleEstado = async () => {
        if (!productoEstadoActual) return;
        try {
            await productosAdminService.toggleEstado(
                productoEstadoActual.idProducto,
                !productoEstadoActual.estado
            );
            await cargarProductos();
            setValidationMessage("Estado del producto actualizado exitosamente.");
            setIsValidationModalOpen(true);
        } catch (err) {
            setValidationMessage(err.message || "Error al cambiar el estado.");
            setIsValidationModalOpen(true);
        } finally {
            setIsConfirmEstadoOpen(false);
            setProductoEstadoActual(null);
        }
    };

    // ✨ Implementación del filtro y búsqueda usando useMemo, similar al de proveedores
    const filteredProducts = useMemo(() => {
        let dataFiltrada = [...productos];

        // 1. Filtrar por estado
        if (filtroEstado !== "todos") {
            const esActivo = filtroEstado === "activos";
            dataFiltrada = dataFiltrada.filter(p => p.estado === esActivo);
        }

        // 2. Filtrar por término de búsqueda sobre el resultado anterior
        const term = busqueda.toLowerCase();
        if (term) {
            dataFiltrada = dataFiltrada.filter(p => {
                const nombre = p.nombre || "";
                const descripcion = p.descripcion || "";
                const sku = p.sku || "";
                const precio = p.precio ? p.precio.toString() : "";
                const stock = p.stock ? p.stock.toString() : "";
                const categoria = p.categoria?.nombre || ""; // Asumiendo que categoria tiene una propiedad 'nombre'

                return (
                    nombre.toLowerCase().includes(term) ||
                    descripcion.toLowerCase().includes(term) ||
                    sku.toLowerCase().includes(term) ||
                    precio.includes(term) ||
                    stock.includes(term) ||
                    categoria.toLowerCase().includes(term)
                );
            });
        }
        return dataFiltrada;
    }, [productos, busqueda, filtroEstado]); // Dependencias para re-ejecutar el memo

    // Paginación ahora se aplica sobre los productos ya filtrados
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const productosPaginados = filteredProducts.slice(indexOfFirstItem, indexOfLastItem); // ✨ Usa filteredProducts
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="productos-admin-page-container">
            <NavbarAdmin />
            <div className="productos-admin-main-content">
                <div className="productos-admin-content-wrapper">
                    <h1>Gestión de Productos</h1>
                    <div className="productos-admin-actions-bar">
                        {/* ✨ Controles de filtro y búsqueda */}
                        <div className="productos-admin-filters"> {/* Nuevo div para agrupar filtros */}
                            <div className="productos-admin-search-bar">
                                <input
                                    type="text"
                                    placeholder="Busca por cualquier campo de la tabla"
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                            {/* ✨ Select para el filtro de estado */}
                            <div className="filtro-estado-grupo">
                                <select
                                    id="filtro-estado"
                                    className="filtro-input"
                                    value={filtroEstado}
                                    onChange={(e) => setFiltroEstado(e.target.value)}
                                    disabled={isLoading}
                                >
                                    <option value="todos">Todos</option>
                                    <option value="activos">Activos</option>
                                    <option value="inactivos">Inactivos</option>
                                </select>
                            </div>
                        </div>
                        <button
                            className="productos-admin-add-button"
                            onClick={() => handleOpenModal('create')}
                            disabled={isLoading}
                        >
                            Agregar Producto
                        </button>
                    </div>
                    {isLoading && <p>Cargando productos...</p>}
                    {error && <p className="error-message">{error}</p>}
                    {!isLoading && !error && (
                        <>
                            <ProductosAdminTable
                                productos={productosPaginados} // ✨ La tabla recibe los productos paginados y filtrados
                                onView={(prod) => handleOpenModal('details', prod)}
                                onEdit={(prod) => handleOpenModal('edit', prod)}
                                onDeleteConfirm={(prod) => handleOpenModal('delete', prod)}
                                onToggleEstado={handleSolicitarToggleEstado} // ✨ Cambiado para usar confirmación
                            />
                            <Pagination
                                itemsPerPage={itemsPerPage}
                                totalItems={filteredProducts.length} // ✨ La paginación usa la longitud de los productos filtrados
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
            {/* ✨ NUEVO: Modal de confirmación de cambio de estado */}
            <ConfirmModal
                isOpen={isConfirmEstadoOpen}
                onClose={closeModal}
                onConfirm={handleConfirmToggleEstado}
                title="Confirmar Acción"
                message={
                    productoEstadoActual
                        ? `¿Está seguro de que desea ${productoEstadoActual.estado ? "desactivar" : "activar"} el producto "${productoEstadoActual.nombre}"?`
                        : ""
                }
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