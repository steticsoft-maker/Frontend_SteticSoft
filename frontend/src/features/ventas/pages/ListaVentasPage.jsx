import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import VentasTable from '../components/VentasTable';
import VentaDetalleModal from '../components/VentaDetalleModal';
import PdfViewModal from '../../../shared/components/common/PdfViewModal';
import ConfirmModal from '../../../shared/components/common/ConfirmModal';
import ValidationModal from '../../../shared/components/common/ValidationModal';
import {
    fetchVentas,
    anularVentaById,
    cambiarEstadoVenta
} from '../services/ventasService';
import { generarPDFVentaUtil } from '../utils/pdfGeneratorVentas';
import '../css/Ventas.css';

function ListaVentasPage() {
    const navigate = useNavigate();
    const location = useLocation();

    // Estados para la gestión de datos y UI
    const [ventas, setVentas] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [busqueda, setBusqueda] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    // Estado del filtro
    const [filtroEstado] = useState(1); // 1 = ID de estado 'Activa' o 'En proceso'

    // Estados para modales
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [showAnularConfirmModal, setShowAnularConfirmModal] = useState(false);
    const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);

    // Datos seleccionados para modales
    const [selectedVenta, setSelectedVenta] = useState(null);
    const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
    const [validationMessage, setValidationMessage] = useState('');

    /**
     * Función para cargar las ventas desde la API.
     * Ahora recibe un objeto de filtros.
     */
    const loadVentas = useCallback(async (filtros) => {
        setIsLoading(true);
        setError(null);
        try {
            // ✅ CAMBIO PRINCIPAL: Se pasa el filtro a fetchVentas
            const data = await fetchVentas(filtros);
            setVentas(data);
        } catch (err) {
            setError("No se pudieron cargar las ventas. Intenta de nuevo.");
            console.error("Error al cargar ventas:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Carga inicial de ventas al montar el componente
    useEffect(() => {
        // ✅ Carga inicial con el filtro de estado predeterminado
        loadVentas({ idEstado: filtroEstado });
    }, [loadVentas, filtroEstado]);

    // Maneja la redirección después de guardar una nueva venta
    useEffect(() => {
        if (location.state && location.state.nuevaVenta) {
            // Recargar la lista de ventas para mostrar la nueva venta
            loadVentas({ idEstado: filtroEstado });
            // Limpiar el estado de navegación
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, navigate, location.pathname, loadVentas, filtroEstado]);

    // --- Funciones de manejo de acciones ---

    const handleOpenDetails = (venta) => {
        setSelectedVenta(venta);
        setShowDetailsModal(true);
    };

    const handleOpenPdf = (venta) => {
        try {
            const blob = generarPDFVentaUtil(venta);
            const url = URL.createObjectURL(blob);
            setPdfBlobUrl(url);
            setSelectedVenta(venta);
            setShowPdfModal(true);
        } catch (e) {
            setValidationMessage("Error al generar el PDF: " + e.message);
            setIsValidationModalOpen(true);
        }
    };

    const handleOpenAnularConfirm = (venta) => {
        setSelectedVenta(venta);
        setShowAnularConfirmModal(true);
    };

    const handleCloseModals = () => {
        setShowDetailsModal(false);
        setShowPdfModal(false);
        if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
        setPdfBlobUrl(null);
        setShowAnularConfirmModal(false);
        setIsValidationModalOpen(false);
        setSelectedVenta(null);
        setValidationMessage('');
    };

    // Nueva función asíncrona para anular la venta
    const handleConfirmAnular = async () => {
        if (selectedVenta) {
            try {
                await anularVentaById(selectedVenta.idVenta);
                setValidationMessage("La venta se ha anulado exitosamente.");
                // Recargar la lista para reflejar el cambio de estado
                loadVentas({ idEstado: filtroEstado }); 
            } catch (err) {
                setValidationMessage("Error al anular la venta. Intenta de nuevo.");
                console.error("Error al anular venta:", err);
            } finally {
                setIsValidationModalOpen(true);
                handleCloseModals();
            }
        }
    };

    // Nueva función asíncrona para cambiar el estado de la venta
    const handleEstadoChange = async (ventaId, nuevoIdEstado) => {
        try {
            await cambiarEstadoVenta(ventaId, nuevoIdEstado);
            setValidationMessage(`El estado de la venta se ha cambiado.`);
            // Recargar la lista para reflejar el actualización
            loadVentas({ idEstado: filtroEstado }); 
        } catch (err) {
            setValidationMessage("Error al cambiar el estado de la venta. Intenta de nuevo.");
            console.error("Error al cambiar estado:", err);
        } finally {
            setIsValidationModalOpen(true);
        }
    };
    
    // --- Lógica de filtrado y paginación ---
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setBusqueda(value);
        setCurrentPage(1); // Reiniciar paginación al buscar
    };
    
    const filteredVentas = ventas.filter(venta => {
        const busquedaTrim = busqueda.trim().toLowerCase();
        
        if (busquedaTrim.length === 0) return true;

        return (
            (venta.cliente?.nombre && venta.cliente.nombre.toLowerCase().includes(busquedaTrim)) ||
            (venta.cliente?.apellido && venta.cliente.apellido.toLowerCase().includes(busquedaTrim)) ||
            (venta.idVenta && venta.idVenta.toString().includes(busquedaTrim)) ||
            (venta.fecha && venta.fecha.toLowerCase().includes(busquedaTrim)) ||
            (venta.total && venta.total.toString().includes(busquedaTrim))
        );
    });

    const totalPages = Math.ceil(filteredVentas.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentVentasForTable = filteredVentas.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="ventas-page-container">
            <div className="ventasContent">
                <h1>Gestión de Ventas</h1>
                <div className="barraBotonContainer">
                    <input
                        type="text"
                        placeholder="Buscar venta"
                        value={busqueda}
                        onChange={handleSearchChange}
                        className="barraBusquedaVenta"
                    />
                    <button
                        className="botonAgregarVenta"
                        onClick={() => navigate('/admin/ventas/proceso')}
                    >
                        Agregar Venta
                    </button>
                </div>

                {/* Mostrar estados de carga y error */}
                {isLoading ? (
                    <p style={{ textAlign: 'center', marginTop: '50px' }}>Cargando ventas...</p>
                ) : error ? (
                    <p className="error-message" style={{ textAlign: 'center', marginTop: '50px' }}>{error}</p>
                ) : (
                    <>
                        <VentasTable
                            ventas={currentVentasForTable}
                            onShowDetails={handleOpenDetails}
                            onGenerarPDF={handleOpenPdf}
                            onAnularVenta={handleOpenAnularConfirm}
                            onEstadoChange={handleEstadoChange}
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                        />
                        <div className="paginacionVenta">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => paginate(i + 1)}
                                    className={currentPage === i + 1 ? "active" : ""}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Modales sin cambios */}
            <VentaDetalleModal
                isOpen={showDetailsModal}
                onClose={handleCloseModals}
                venta={selectedVenta}
            />
            <PdfViewModal
                isOpen={showPdfModal}
                onClose={handleCloseModals}
                pdfUrl={pdfBlobUrl}
                title={`Detalle Venta #${selectedVenta?.idVenta || ''}`}
            />
            <ConfirmModal
                isOpen={showAnularConfirmModal}
                onClose={handleCloseModals}
                onConfirm={handleConfirmAnular}
                title="Confirmar Anulación"
                message={`¿Está seguro de que desea anular la venta #${selectedVenta?.idVenta || ''} para el cliente "${selectedVenta?.cliente?.nombre || ''} ${selectedVenta?.cliente?.apellido || ''}"?`}
            />
            <ValidationModal
                isOpen={isValidationModalOpen}
                onClose={handleCloseModals}
                title="Aviso de Ventas"
                message={validationMessage}
            />
        </div>
    );
}

export default ListaVentasPage;