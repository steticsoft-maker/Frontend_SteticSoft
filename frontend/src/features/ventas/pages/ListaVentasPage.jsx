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
    cambiarEstadoVenta,
    getVentaById // ✅ 1. IMPORTAR LA FUNCIÓN PARA OBTENER UNA VENTA
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
    const [filtroEstado, setFiltroEstado] = useState('1'); 
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [showAnularConfirmModal, setShowAnularConfirmModal] = useState(false);
    const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
    const [selectedVenta, setSelectedVenta] = useState(null);
    const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
    const [validationMessage, setValidationMessage] = useState('');

    const loadVentas = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const filtros = {};
            if (filtroEstado) { filtros.idEstado = filtroEstado; }
            const data = await fetchVentas(filtros);
            setVentas(data);
        } catch (err) {
            setError("No se pudieron cargar las ventas. Intenta de nuevo.");
            console.error("Error al cargar ventas:", err);
        } finally {
            setIsLoading(false);
        }
    }, [filtroEstado]);

    useEffect(() => { loadVentas(); }, [loadVentas]);

    useEffect(() => {
        if (location.state?.nuevaVenta) {
            loadVentas();
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, navigate, location.pathname, loadVentas]);

    // ✅ 2. FUNCIÓN CORREGIDA PARA BUSCAR LA VENTA COMPLETA
    const handleOpenDetails = async (ventaResumida) => {
        setIsLoading(true);
        try {
            // Llama a la API para obtener la información completa de la venta
            const ventaCompleta = await getVentaById(ventaResumida.idVenta);
            setSelectedVenta(ventaCompleta);
            setShowDetailsModal(true);
        } catch (err) {
            console.error("Error al obtener el detalle de la venta:", err);
            setValidationMessage("No se pudo cargar el detalle de la venta. Inténtalo de nuevo.");
            setIsValidationModalOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenPdf = (venta) => {
        try {
            if (!venta) throw new Error("No hay datos de la venta para generar el PDF.");
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
            setShowAnularConfirmModal(false); 
            try {
                const response = await anularVentaById(selectedVenta.idVenta);
                const ventaAnulada = response?.data?.data;

                if (ventaAnulada && typeof ventaAnulada === 'object') {
                    setVentas(ventasActuales =>
                        ventasActuales.map(v =>
                            v.idVenta === selectedVenta.idVenta ? ventaAnulada : v
                        )
                    );
                    setValidationMessage("La venta se ha anulado exitosamente.");
                } else {
                    setValidationMessage("Venta anulada. Actualizando lista...");
                    loadVentas();
                }
            } catch (err) {
                setValidationMessage("Error al anular la venta. Intenta de nuevo.");
                console.error("Error al anular venta:", err);
            } finally {
                setIsValidationModalOpen(true);
                setSelectedVenta(null);
            }
        }
    };

    const handleEstadoChange = async (ventaId, nuevoIdEstado) => {
        try {
            const response = await cambiarEstadoVenta(ventaId, nuevoIdEstado);
            const ventaActualizada = response?.data?.data;

            if (ventaActualizada && typeof ventaActualizada === 'object') {
                setVentas(ventasActuales =>
                    ventasActuales.map(v =>
                        v.idVenta === ventaId ? ventaActualizada : v
                    )
                );
                setValidationMessage(`El estado de la venta se ha cambiado.`);
            } else {
                loadVentas();
            }
        } catch (err) {
            setValidationMessage("Error al cambiar el estado de la venta. Intenta de nuevo.");
            console.error("Error al cambiar estado:", err);
            loadVentas(); 
        } finally {
            setIsValidationModalOpen(true);
        }
    };
    
    const handleSearchChange = (e) => {
        setBusqueda(e.target.value);
        setCurrentPage(1);
    };
    
    const filteredVentas = ventas.filter(venta => {
        if (!venta) return false;
        const busquedaTrim = busqueda.trim().toLowerCase();
        if (!busquedaTrim) return true;
        return (
            (venta.cliente?.nombre?.toLowerCase().includes(busquedaTrim)) ||
            (venta.cliente?.apellido?.toLowerCase().includes(busquedaTrim)) ||
            (venta.idVenta?.toString().includes(busquedaTrim))
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
                    <input type="text" placeholder="Buscar venta" value={busqueda} onChange={handleSearchChange} className="barraBusquedaVenta" />
                    <button className="botonAgregarVenta" onClick={() => navigate('/admin/ventas/proceso')}>Agregar Venta</button>
                </div>
                <div className="filtros-container">
                    <label htmlFor="filtro-estado">Filtrar por estado: </label>
                    <select id="filtro-estado" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="filtro-estado-select">
                        <option value="">Todas</option>
                        <option value="1">Activa</option>
                        <option value="2">En proceso</option>
                        <option value="3">Completada</option>
                        <option value="4">Anulada</option>
                    </select>
                </div>
                {isLoading ? (<p style={{ textAlign: 'center', marginTop: '50px' }}>Cargando ventas...</p>) : 
                 error ? (<p className="error-message" style={{ textAlign: 'center', marginTop: '50px' }}>{error}</p>) : 
                 (<>
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
                        {Array.from({ length: totalPages }, (_, i) => (<button key={i + 1} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? "active" : ""}>{i + 1}</button>))}
                    </div>
                 </>)}
            </div>
            
            {/* Modales */}
            <VentaDetalleModal isOpen={showDetailsModal} onClose={handleCloseModals} venta={selectedVenta} />
            <PdfViewModal isOpen={showPdfModal} onClose={handleCloseModals} pdfUrl={pdfBlobUrl} title={`Detalle Venta #${selectedVenta?.idVenta || ''}`} />
            <ConfirmModal isOpen={showAnularConfirmModal} onClose={handleCloseModals} onConfirm={handleConfirmAnular} title="Confirmar Anulación" message={`¿Está seguro de que desea anular la venta #${selectedVenta?.idVenta || ''} para el cliente "${selectedVenta?.cliente?.nombre || ''} ${selectedVenta?.cliente?.apellido || ''}"?`} />
            <ValidationModal isOpen={isValidationModalOpen} onClose={handleCloseModals} title="Aviso de Ventas" message={validationMessage} />
        </div>
    );
}

export default ListaVentasPage;