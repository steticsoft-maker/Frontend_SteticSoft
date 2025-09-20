import React, { useState, useEffect, useMemo, useCallback } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import CategoriasProductoTable from "../components/CategoriasProductoTable";
import CategoriaProductoCrearModal from "../components/CategoriaProductoCrearModal";
import CategoriaProductoEditarModal from "../components/CategoriaProductoEditarModal";
import CategoriaProductoDetalleModal from "../components/CategoriaProductoDetalleModal";
import Pagination from "../../../shared/components/common/Pagination";
import {
    fetchCategoriasProducto,
    saveCategoriaProducto,
    deleteCategoriaProductoById,
    toggleCategoriaProductoEstado,
} from "../services/categoriasProductoService";
import "../css/CategoriasProducto.css";

const MySwal = withReactContent(Swal);

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
    const [currentCategoria, setCurrentCategoria] = useState(null);

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
        } else if (type === "create") {
            setIsCrearModalOpen(true);
        } else if (type === "edit" && categoria) {
            setIsEditarModalOpen(true);
        } else if (type === "delete" && categoria) {
            MySwal.fire({
                title: "¿Estás seguro?",
                text: `¿Deseas eliminar la categoría "${categoria.nombre}"?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Sí, ¡eliminar!",
                cancelButtonText: "Cancelar",
            }).then((result) => {
                if (result.isConfirmed) {
                    handleDelete(categoria);
                }
            });
        }
    };

    const closeModal = () => {
        setIsCrearModalOpen(false);
        setIsEditarModalOpen(false);
        setIsDetailsModalOpen(false);
        setCurrentCategoria(null);
    };

    const handleSave = async (categoriaData) => {
        try {
            const isEditing = !!categoriaData.idCategoriaProducto;
            await saveCategoriaProducto(categoriaData);
            closeModal();
            await loadCategorias();
            MySwal.fire({
                title: "¡Éxito!",
                text: `Categoría ${isEditing ? "actualizada" : "creada"} exitosamente.`,
                icon: "success",
            });
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                "Error al guardar la categoría. Por favor, revise los datos.";
            MySwal.fire("Error", errorMessage, "error");
        }
    };

    const handleDelete = async (categoria) => {
        try {
            await deleteCategoriaProductoById(categoria.idCategoriaProducto);
            await loadCategorias();
            MySwal.fire(
                "¡Eliminada!",
                `La categoría "${categoria.nombre}" ha sido eliminada.`,
                "success"
            );
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Error al eliminar la categoría.";
            MySwal.fire("Error", errorMessage, "error");
        }
    };

    const handleToggleEstado = async (categoria) => {
        try {
            if (!categoria) {
                throw new Error("Categoría no encontrada para cambiar estado.");
            }
            const nuevoEstado = !categoria.estado;
            await toggleCategoriaProductoEstado(categoria.idCategoriaProducto, nuevoEstado);
            await loadCategorias();
            MySwal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: `Estado cambiado a ${nuevoEstado ? "Activo" : "Inactivo"}`,
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                "Error al cambiar el estado de la categoría.";
            MySwal.fire("Error", errorMessage, "error");
        }
    };

    return (
        <div className="lista-categorias-container">
            <div className="categorias-content-wrapper">
                <h1>Gestión Categorías de Productos ({filteredCategorias.length})</h1>
                <div className="categorias-actions-bar">
                    <div className="categorias-filters">
                        <div className="categorias-search-bar">
                            <input
                                type="text"
                                placeholder="Busca por cualquier campo..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="categorias-filtro-estado-grupo">
                            <select
                                className="categorias-filtro-input"
                                value={filtroEstado}
                                onChange={(e) => setFiltroEstado(e.target.value)}
                                disabled={loading}
                            >
                                <option value="todos">Todos los Estados</option>
                                <option value="activos">Activos</option>
                                <option value="inactivos">Inactivos</option>
                            </select>
                        </div>
                    </div>
                    <button
                        className="categorias-add-button"
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
                            <div className="table-container">
                                <CategoriasProductoTable
                                    categorias={categoriasPaginadas}
                                    startIndex={indexOfFirstItem}
                                    onView={(cat) => handleOpenModal("details", cat)}
                                    onEdit={(cat) => handleOpenModal("edit", cat)}
                                    onDeleteConfirm={(cat) => handleOpenModal("delete", cat)}
                                    onToggleEstado={handleToggleEstado}
                                />
                            </div>
                            <Pagination
                                itemsPerPage={itemsPerPage}
                                totalItems={filteredCategorias.length}
                                paginate={paginate}
                                currentPage={currentPage}
                            />
                        </>
                    )}
            </div>

            <CategoriaProductoCrearModal
                isOpen={isCrearModalOpen}
                onClose={closeModal}
                onSubmit={handleSave}
            />
            <CategoriaProductoEditarModal
                isOpen={isEditarModalOpen}
                onClose={closeModal}
                onSubmit={handleSave}
                initialData={currentCategoria}
            />
            <CategoriaProductoDetalleModal
                isOpen={isDetailsModalOpen}
                onClose={closeModal}
                categoria={currentCategoria}
            />
        </div>
    );
}

export default ListaCategoriasProductoPage;