// RUTA: src/features/productosAdmin/pages/ListaProductosAdminPage.jsx

import React, { useState, useEffect, useCallback, useMemo } from 'react'; // ✨ Se agrega useMemo
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ProductosAdminTable from '../components/ProductosAdminTable';
import ProductoAdminCrearModal from '../components/ProductoAdminCrearModal';
import ProductoAdminEditarModal from '../components/ProductoAdminEditarModal';
import ProductoAdminDetalleModal from '../components/ProductoAdminDetalleModal';
import Pagination from "../../../shared/components/common/Pagination";
import { productosAdminService } from '../services/productosAdminService';
import '../css/ProductosAdmin.css';

const MySwal = withReactContent(Swal);

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

    const [currentProducto, setCurrentProducto] = useState(null);

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
        setCurrentProducto(null);
    };

    const handleOpenModal = (type, producto = null) => {
        setCurrentProducto(producto);
        if (type === 'details') {
            setIsDetailsModalOpen(true);
        } else if (type === 'create') {
            setIsCrearModalOpen(true);
        } else if (type === 'edit') {
            setIsEditarModalOpen(true);
        } else if (type === 'delete' && producto) {
            handleDelete(producto);
        }
    };

    const handleSave = async (productoData) => {
        try {
            if (productoData.idProducto) {
                await productosAdminService.updateProducto(productoData.idProducto, productoData);
                MySwal.fire("¡Éxito!", "Producto actualizado exitosamente.", "success");
            } else {
                const response = await productosAdminService.createProducto(productoData);
                if (response?.errors) {
                    // Si hay errores de validación, los mostramos
                    const errorMessages = response.errors.map(e => e.msg).join('<br>');
                    MySwal.fire({
                        title: "Error de validación",
                        html: errorMessages,
                        icon: "error",
                        confirmButtonText: "Entendido"
                    });
                    return response.errors;
                }
                MySwal.fire("¡Éxito!", "Producto creado exitosamente.", "success");
            }
            await cargarProductos();
            closeModal();
        } catch (err) {
            console.error("Error al guardar producto:", err);
            
            // Manejar diferentes tipos de errores
            let errorMessage = "Error al guardar el producto.";
            
            if (err.message) {
                errorMessage = err.message;
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.response?.data?.errors) {
                // Si hay errores de validación específicos
                const errorMessages = err.response.data.errors.map(e => e.msg).join('<br>');
                errorMessage = errorMessages;
            }
            
            MySwal.fire({
                title: "Error",
                html: errorMessage,
                icon: "error",
                confirmButtonText: "Entendido"
            });
        }
    };

    const handleDelete = (producto) => {
        MySwal.fire({
            title: '¿Estás seguro?',
            text: `¿Deseas eliminar el producto "${producto.nombre}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, ¡eliminar!',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await productosAdminService.deleteProducto(producto.idProducto);
                    await cargarProductos();
                    MySwal.fire(
                        '¡Eliminado!',
                        'El producto ha sido eliminado.',
                        'success'
                    );
                } catch (err) {
                    console.error("Error al eliminar producto:", err);
                    
                    // Manejar diferentes tipos de errores
                    let errorMessage = "Error al eliminar el producto.";
                    
                    if (err.message) {
                        errorMessage = err.message;
                    } else if (err.response?.data?.message) {
                        errorMessage = err.response.data.message;
                    } else if (err.response?.data?.errors) {
                        // Si hay errores de validación específicos
                        const errorMessages = err.response.data.errors.map(e => e.msg).join('<br>');
                        errorMessage = errorMessages;
                    }
                    
                    MySwal.fire({
                        title: "Error",
                        html: errorMessage,
                        icon: "error",
                        confirmButtonText: "Entendido"
                    });
                }
            }
        });
    };

    const handleToggleEstado = (producto) => {
        MySwal.fire({
            title: 'Confirmar Acción',
            text: `¿Estás seguro de que deseas ${producto.estado ? 'desactivar' : 'activar'} el producto "${producto.nombre}"?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: `Sí, ${producto.estado ? 'desactivar' : 'activar'}`,
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await productosAdminService.toggleEstado(
                        producto.idProducto,
                        !producto.estado
                    );
                    await cargarProductos();
                    MySwal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'success',
                        title: 'Estado actualizado',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true
                    });
                } catch (err) {
                    MySwal.fire("Error", err.message || "Error al cambiar el estado.", "error");
                }
            }
        });
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
                const categoria = p.categoria?.nombre || "";

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
                                    <option value="todos">Todos los estados</option>
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
                                onDeleteConfirm={handleDelete}
                                onToggleEstado={handleToggleEstado}
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
        </div>
    );
}

export default ListaProductosAdminPage;