import React, { useState, useEffect, useMemo, useCallback } from "react";
import NavbarAdmin from "../../../shared/components/layout/NavbarAdmin";
import CategoriasProductoTable from "../components/CategoriasProductoTable";
import CategoriaProductoCrearModal from "../components/CategoriaProductoCrearModal";
import CategoriaProductoEditarModal from "../components/CategoriaProductoEditarModal";
import CategoriaProductoDetalleModal from "../components/CategoriaProductoDetalleModal";
import ConfirmModal from "../../../shared/components/common/ConfirmModal";
import ValidationModal from "../../../shared/components/common/ValidationModal";
import Pagination from "../../../shared/components/common/Pagination";
import {
    fetchCategoriasProducto,
    saveCategoriaProducto,
    deleteCategoriaProductoById,
    toggleCategoriaProductoEstado,
} from "../services/categoriasProductoService";
import "../css/CategoriasProducto.css";

function ListaCategoriasProductoPage() {
    const [categorias, setCategorias] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("todos");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
    const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
    const [currentCategoria, setCurrentCategoria] = useState(null);
    const [validationMessage, setValidationMessage] = useState("");

    const loadCategorias = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchCategoriasProducto();
            setCategorias(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error al cargar las categorías:", err);
            setError("No se pudieron cargar las categorías. Inténtalo de nuevo.");
            setCategorias([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCategorias();
    }, [loadCategorias]);

    useEffect(() => {
        setCurrentPage(1);
    }, [busqueda, filtroEstado]);

    const filteredCategorias = useMemo(() => {
        let dataFiltrada = [...categorias];

        if (filtroEstado !== "todos") {
            const esActivo = filtroEstado === "activos";
            dataFiltrada = dataFiltrada.filter((c) => c.estado === esActivo);
        }

        const term = busqueda.toLowerCase();
        if (term) {
            dataFiltrada = dataFiltrada.filter((c) => {
                const id = c.idCategoriaProducto?.toString() || "";
                const nombre = c.nombre?.toLowerCase() || "";
                const descripcion = c.descripcion?.toLowerCase() || "";
                const estadoTexto = c.estado ? "activo" : "inactivo";

                return (
                    id.includes(term) ||
                    nombre.includes(term) ||
                    descripcion.includes(term) ||
                    estadoTexto.includes(term)
                );
            });
        }

        return dataFiltrada;
    }, [categorias, busqueda, filtroEstado]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const categoriasPaginadas = filteredCategorias.slice(indexOfFirstItem, indexOfLastItem);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleOpenModal = (type, categoria = null) => {
        setCurrentCategoria(categoria);
        if (type === "details") {
            setIsDetailsModalOpen(true);
        } else if (type === "delete") {
            setIsConfirmDeleteOpen(true);
        } else if (type === "create") {
            setIsCrearModalOpen(true);
        } else if (type === "edit") {
            if (categoria) {
                setIsEditarModalOpen(true);
            } else {
                console.error("Intento de abrir modal de edición sin datos de categoría de producto.");
            }
        }
    };

    const handleCrearModalClose = () => {
        setIsCrearModalOpen(false);
        loadCategorias();
    };

    const handleEditarModalClose = () => {
        setIsEditarModalOpen(false);
        setCurrentCategoria(null);
        loadCategorias();
    };

    const closeOtherModals = () => {
        setIsDetailsModalOpen(false);
        setIsConfirmDeleteOpen(false);
        setIsValidationModalOpen(false);
        setValidationMessage("");
        if (!isCrearModalOpen && !isEditarModalOpen) {
            setCurrentCategoria(null);
        }
        loadCategorias();
    };

    const handleSave = async (categoriaData) => {
        try {
            const isEditing = !!categoriaData.idCategoriaProducto;
            await saveCategoriaProducto(categoriaData);

            if (isEditing) {
                handleEditarModalClose();
            } else {
                handleCrearModalClose();
            }
            setValidationMessage(`Categoría ${isEditing ? "actualizada" : "creada"} exitosamente.`);
            setIsValidationModalOpen(true);
        } catch (error) {
            console.error("Error al guardar categoría:", error);
            const errorMessage = error.response?.data?.message || "Error al guardar la categoría. Por favor, revise los datos.";
            setValidationMessage(errorMessage);
            setIsValidationModalOpen(true);
        }
    };

    const handleDelete = async () => {
        if (currentCategoria && currentCategoria.idCategoriaProducto) {
            try {
                await deleteCategoriaProductoById(currentCategoria.idCategoriaProducto);
                closeOtherModals();
                setValidationMessage("Categoría eliminada exitosamente.");
                setIsValidationModalOpen(true);
            } catch (error) {
                console.error("Error al eliminar categoría:", error);
                const errorMessage = error.response?.data?.message || "Error al eliminar la categoría.";
                setValidationMessage(errorMessage);
                setIsValidationModalOpen(true);
            }
        }
    };

    const handleToggleEstado = async (idCategoriaProducto) => {
        try {
            const categoriaToToggle = categorias.find(cat => cat.idCategoriaProducto === idCategoriaProducto);
            if (!categoriaToToggle) {
                throw new Error("Categoría no encontrada para cambiar estado.");
            }
            await toggleCategoriaProductoEstado(idCategoriaProducto, !categoriaToToggle.estado);

            setValidationMessage("Estado de la categoría actualizado exitosamente.");
            setIsValidationModalOpen(true);
            loadCategorias();
        } catch (error) {
            console.error("Error al cambiar estado de categoría:", error);
            const errorMessage = error.response?.data?.message || "Error al cambiar el estado de la categoría.";
            setValidationMessage(errorMessage);
            setIsValidationModalOpen(true);
        }
    };

    return (
        <div className="categorias-producto-admin-page-container">
            <NavbarAdmin />
            <div className="categorias-producto-admin-main-content">
                <div className="categorias-producto-admin-content-wrapper">
                    <h1>Gestión Categorías de Productos</h1>
                    <div className="categorias-producto-admin-actions-bar">
                        <div className="categorias-producto-admin-filters">
                            <div className="categorias-producto-admin-search-bar">
                                <input
                                    type="text"
                                    placeholder="Busca por cualquier campo..."
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="filtro-estado-grupo">
                                <select
                                    id="filtro-estado"
                                    className="filtro-input"
                                    value={filtroEstado}
                                    onChange={(e) => setFiltroEstado(e.target.value)}
                                    disabled={loading}
                                >
                                    <option value="todos">Todos</option>
                                    <option value="activos">Activos</option>
                                    <option value="inactivos">Inactivos</option>
                                </select>
                            </div>
                        </div>
                        <button
                            className="categorias-producto-admin-add-button"
                            onClick={() => handleOpenModal("create")}
                            disabled={loading}
                        >
                            Agregar Categoría
                        </button>
                    </div>

                    {loading ? (
                        <p>Cargando categorías...</p>
                    ) : error ? (
                        <p className="error-message">{error}</p>
                    ) : (
                        <>
                            <CategoriasProductoTable
                                categorias={categoriasPaginadas}
                                startIndex={indexOfFirstItem}
                                onView={(cat) => handleOpenModal("details", cat)}
                                onEdit={(cat) => handleOpenModal("edit", cat)}
                                onDeleteConfirm={(cat) => handleOpenModal("delete", cat)}
                                onToggleEstado={handleToggleEstado}
                            />
                            <Pagination
                                itemsPerPage={itemsPerPage}
                                totalItems={filteredCategorias.length}
                                paginate={paginate}
                                currentPage={currentPage}
                            />
                        </>
                    )}
                </div>
            </div>

            <CategoriaProductoCrearModal
                isOpen={isCrearModalOpen}
                onClose={handleCrearModalClose}
                onSubmit={handleSave}
            />
            <CategoriaProductoEditarModal
                isOpen={isEditarModalOpen}
                onClose={handleEditarModalClose}
                onSubmit={handleSave}
                initialData={currentCategoria}
            />
            <CategoriaProductoDetalleModal
                isOpen={isDetailsModalOpen}
                onClose={closeOtherModals}
                categoria={currentCategoria}
            />
            <ConfirmModal
                isOpen={isConfirmDeleteOpen}
                onClose={closeOtherModals}
                onConfirm={handleDelete}
                title="Confirmar Eliminación"
                message={`¿Está seguro de que desea eliminar la categoría "${currentCategoria?.nombre || ""}"?`}
            />
            <ValidationModal
                isOpen={isValidationModalOpen}
                onClose={closeOtherModals}
                title="Aviso de Categorías de Producto"
                message={validationMessage}
            />
        </div>
    );
}

export default ListaCategoriasProductoPage;