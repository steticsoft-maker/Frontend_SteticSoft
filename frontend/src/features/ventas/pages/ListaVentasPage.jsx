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

    // ✅ CAMBIO 1: El estado del filtro ahora es dinámico con su función 'set'
    const [filtroEstado, setFiltroEstado] = useState('1'); // Inicia mostrando 'Activas' por defecto

    // Estados para modales
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [showAnularConfirmModal, setShowAnularConfirmModal] = useState(false);
    const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);

    // Datos seleccionados para modales
    const [selectedVenta, setSelectedVenta] = useState(null);
    const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
    const [validationMessage, setValidationMessage] = useState('');

    const loadVentas = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Construye el objeto de filtros basado en el estado actual
            const filtros = {};
            if (filtroEstado) {
                filtros.idEstado = filtroEstado;
            }
            const data = await fetchVentas(filtros);
            setVentas(data);
        } catch (err) {
            setError("No se pudieron cargar las ventas. Intenta de nuevo.");
            console.error("Error al cargar ventas:", err);
        } finally {
            setIsLoading(false);
        }
    }, [filtroEstado]); // Depende del estado del filtro para volver a cargar

    // ✅ CAMBIO 2: El useEffect ahora reacciona a los cambios en 'loadVentas'
    useEffect(() => {
        loadVentas();
    }, [loadVentas]);

    // Maneja la redirección después de guardar una nueva venta
    useEffect(() => {
        if (location.state && location.state.nuevaVenta) {
            loadVentas();
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, navigate, location.pathname, loadVentas]);

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
    
    const handleConfirmAnular = async () => {
        if (selectedVenta) {
            try {
                await anularVentaById(selectedVenta.idVenta);
                setValidationMessage("La venta se ha anulado exitosamente.");
                loadVentas(); 
            } catch (err) {
                setValidationMessage("Error al anular la venta. Intenta de nuevo.");
                console.error("Error al anular venta:", err);
            } finally {
                setIsValidationModalOpen(true);
                handleCloseModals();
            }
        }
    };

    const handleEstadoChange = async (ventaId, nuevoIdEstado) => {
        try {
            await cambiarEstadoVenta(ventaId, nuevoIdEstado);
            setValidationMessage(`El estado de la venta se ha cambiado.`);
            // ✅ CAMBIO 3: Simplemente recargamos las ventas. La lista se actualizará
            //    y la venta "desaparecerá" si ya no cumple con el filtro actual.
            loadVentas(); 
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
        setCurrentPage(1);
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
                
                {/* ✅ CAMBIO 4: Se añade el menú desplegable para los filtros */}
                <div className="filtros-container">
                    <label htmlFor="filtro-estado">Filtrar por estado: </label>
                    <select 
                        id="filtro-estado"
                        value={filtroEstado}
                        onChange={(e) => setFiltroEstado(e.target.value)}
                        className="filtro-estado-select"
                    >
                        <option value="">Todas</option>
                        <option value="1">Activa</option>
                        <option value="2">En proceso</option>
                        <option value="3">Completada</option>
                        <option value="4">Anulada</option>
                    </select>
                </div>

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