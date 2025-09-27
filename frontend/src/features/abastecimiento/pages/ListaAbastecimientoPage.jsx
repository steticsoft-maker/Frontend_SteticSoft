import React, { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// Importación de todos nuestros componentes
import AbastecimientoTable from "../components/AbastecimientoTable";
import AbastecimientoCrearModal from "../components/AbastecimientoCrearModal";
import AbastecimientoEditarModal from "../components/AbastecimientoEditarModal";
import AbastecimientoDetalleModal from "../components/AbastecimientoDetailsModal";
import DepleteProductModal from "../components/DepleteProductModal";
import Pagination from "../../../shared/components/common/Pagination";

const MySwal = withReactContent(Swal);

// Importación de todas las funciones del servicio
import {
    fetchAbastecimientos,
    deleteAbastecimientoById,
    toggleAbastecimientoEstado,
    agotarAbastecimiento,
} from "../hooks/useAbastecimiento";
import "../css/Abastecimiento.css";

function ListaAbastecimientoPage() {
    // Todos los estados se mantienen igual
    const [abastecimientos, setAbastecimientos] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("todos");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
    const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isRazonAgotamientoOpen, setIsRazonAgotamientoOpen] = useState(false);
    const [currentAbastecimiento, setCurrentAbastecimiento] = useState(null);

    // La función para cargar datos no cambia
    const loadAbastecimientos = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const estadoParam = filtroEstado === 'todos' ? undefined : filtroEstado === 'activos';
            const params = { page: currentPage, limit: itemsPerPage, search: busqueda, estado: estadoParam };
            
            const result = await fetchAbastecimientos(params);
            setAbastecimientos(Array.isArray(result.data) ? result.data : []);
            setTotalItems(result.totalItems || 0);
        } catch (err) {
            console.error("Error al cargar los abastecimientos:", err);
            setError("No se pudieron cargar los registros. Inténtalo de nuevo.");
            setAbastecimientos([]);
        } finally {
            setLoading(false);
        }
    }, [currentPage, itemsPerPage, busqueda, filtroEstado]);

    useEffect(() => {
        loadAbastecimientos();
    }, [loadAbastecimientos]);

    // --- MANEJADORES DE ACCIONES ---

    const handleOpenModal = (type, item = null) => {
        setCurrentAbastecimiento(item);
        if (type === 'create') setIsCrearModalOpen(true);
        if (type === 'details') setIsDetailsModalOpen(true);
        if (type === 'edit') setIsEditarModalOpen(true);
        if (type === 'delete' && item) {
            MySwal.fire({
                title: "¿Estás seguro?",
                text: `¿Deseas eliminar el registro de abastecimiento para ${item.empleado?.empleado?.nombre || 'el empleado'} (${item.empleado?.correo || ''})?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Sí, ¡eliminar!",
                cancelButtonText: "Cancelar",
            }).then((result) => {
                if (result.isConfirmed) {
                    handleDelete(item);
                }
            });
        }
        if (type === 'deplete') setIsRazonAgotamientoOpen(true);
    };
    
    const handleCloseAllModals = () => {
        setIsCrearModalOpen(false);
        setIsEditarModalOpen(false);
        setIsDetailsModalOpen(false);
        setIsRazonAgotamientoOpen(false);
        setCurrentAbastecimiento(null);
    };

    const handleSaveSuccess = (message = "Operación exitosa.") => {
        handleCloseAllModals();
        MySwal.fire("¡Éxito!", message, "success");
        loadAbastecimientos(); // Recargar los datos
    };
    
    const handleToggleEstado = async (item) => {
        try {
            await toggleAbastecimientoEstado(item.idAbastecimiento, !item.estado);
            MySwal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "Estado actualizado exitosamente.",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                customClass: {
                    popup: "swal2-toast-custom",
                    title: "swal2-toast-title-custom"
                },
                didOpen: () => {
                    const popup = MySwal.getPopup();
                    if (popup) {
                        popup.style.background = "var(--color-background-light)";
                        popup.style.color = "var(--color-text-dark)";
                        popup.style.border = "1px solid var(--color-border-light)";
                        popup.style.boxShadow = "0 4px 12px var(--color-shadow-medium)";
                    }
                }
            });
            loadAbastecimientos(); // Recargar los datos
        } catch (error) {
            MySwal.fire({
                toast: true,
                position: "top-end",
                icon: "error",
                title: error.response?.data?.message || "Error al cambiar el estado.",
                showConfirmButton: false,
                timer: 4000,
                timerProgressBar: true,
                customClass: {
                    popup: "swal2-toast-custom",
                    title: "swal2-toast-title-custom"
                },
                didOpen: () => {
                    const popup = MySwal.getPopup();
                    if (popup) {
                        popup.style.background = "var(--color-background-light)";
                        popup.style.color = "var(--color-text-dark)";
                        popup.style.border = "1px solid var(--color-border-light)";
                        popup.style.boxShadow = "0 4px 12px var(--color-shadow-medium)";
                    }
                }
            });
        }
    };

    const handleDelete = async (item) => {
        if (!item) return;
        try {
            await deleteAbastecimientoById(item.idAbastecimiento);
            handleSaveSuccess("Registro eliminado exitosamente.");
        } catch (error) {
            handleCloseAllModals();
            MySwal.fire("Error", error.response?.data?.message || "Error al eliminar el registro.", "error");
        }
    };

    const handleAgotarSubmit = async (id, razon) => {
        try {
            await agotarAbastecimiento(id, razon);
            handleSaveSuccess("El producto ha sido marcado como agotado.");
        } catch (error) {
            handleCloseAllModals();
            MySwal.fire("Error", error.response?.data?.message || "Error al marcar como agotado.", "error");
        }
    };
    
    const indexOfFirstItem = (currentPage - 1) * itemsPerPage;

    return (
        <div className="lista-abastecimiento-container">
            <div className="abastecimiento-content-wrapper">
                <h1>Gestión de Abastecimiento ({totalItems})</h1>
                <div className="abastecimiento-actions-bar">
                    <div className="abastecimiento-filters">
                        <div className="abastecimiento-search-bar">
                            <input
                                type="text"
                                placeholder="Buscar por empleado, producto..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="abastecimiento-filtro-estado-grupo">
                            <select
                                className="abastecimiento-filtro-input"
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
                        className="abastecimiento-add-button"
                        onClick={() => handleOpenModal('create')}
                        disabled={loading}
                    >
                        Agregar Abastecimiento
                    </button>
                </div>

                    {loading ? <p>Cargando registros...</p> : error ? <p className="error-message">{error}</p> : (
                        <>
                            <AbastecimientoTable
                                abastecimientos={abastecimientos}
                                startIndex={indexOfFirstItem}
                                onView={(item) => handleOpenModal('details', item)}
                                onEdit={(item) => handleOpenModal('edit', item)}
                                onDeplete={(item) => handleOpenModal('deplete', item)}
                                onDeleteConfirm={(item) => handleOpenModal('delete', item)}
                                onToggleEstado={handleToggleEstado}
                            />
                            <Pagination
                                itemsPerPage={itemsPerPage}
                                totalItems={totalItems}
                                paginate={(pageNumber) => setCurrentPage(pageNumber)}
                                currentPage={currentPage}
                            />
                        </>
                    )}
            </div>

            {/* --- RENDERIZADO DE TODOS LOS MODALES --- */}

            <AbastecimientoCrearModal
                isOpen={isCrearModalOpen}
                onClose={handleCloseAllModals}
                onSaveSuccess={() => handleSaveSuccess("Abastecimiento(s) creado(s) exitosamente.")}
            />

            <AbastecimientoEditarModal
                isOpen={isEditarModalOpen}
                onClose={handleCloseAllModals}
                onSaveSuccess={() => handleSaveSuccess("Registro actualizado exitosamente.")}
                initialData={currentAbastecimiento}
            />

            <AbastecimientoDetalleModal
                isOpen={isDetailsModalOpen}
                onClose={handleCloseAllModals}
                abastecimiento={currentAbastecimiento}
            />

            <DepleteProductModal
                isOpen={isRazonAgotamientoOpen}
                onClose={handleCloseAllModals}
                onSubmit={handleAgotarSubmit}
                abastecimiento={currentAbastecimiento}
            />
        </div>
    );
}

export default ListaAbastecimientoPage;