import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import VentasTable from '../components/VentasTable';
import VentaDetalleModal from '../components/VentaDetalleModal';
import PdfViewModal from '../../../shared/components/common/PdfViewModal';
import {
    fetchVentas,
    anularVentaById,
    cambiarEstadoVenta,
    getVentaById
} from '../services/ventasService';
import { generarPDFVentaUtil } from '../utils/pdfGeneratorVentas';
import '../css/Ventas.css';

const MySwal = withReactContent(Swal);

function ListaVentasPage() {
    const navigate = useNavigate();
    const location = useLocation();

    // Estados para la gestión de datos y UI
    const [ventas, setVentas] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [busqueda, setBusqueda] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    // ✅ CAMBIO 1: Se ajusta la cantidad de registros por página a 10
    const [itemsPerPage] = useState(10);
    const [filtroEstado, setFiltroEstado] = useState('1');
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [selectedVenta, setSelectedVenta] = useState(null);
    const [pdfBlobUrl, setPdfBlobUrl] = useState(null);

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

    const handleOpenDetails = async (ventaResumida) => {
        setIsLoading(true);
        try {
            const ventaCompleta = await getVentaById(ventaResumida.idVenta);
            setSelectedVenta(ventaCompleta);
            setShowDetailsModal(true);
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
            MySwal.fire("Error", "No se pudo cargar el detalle de la venta. Inténtalo de nuevo.", "error");
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
            MySwal.fire("Error", "Error al generar el PDF: " + e.message, "error");
        }
    };

    const handleOpenAnularConfirm = (venta) => {
        const clienteNombre = venta.cliente ? `${venta.cliente.nombre || ''} ${venta.cliente.apellido || ''}`.trim() : 'N/A';
        MySwal.fire({
            title: '¿Estás seguro?',
            html: `¿Deseas anular la venta <strong>#${venta.idVenta}</strong> para el cliente <strong>${clienteNombre}</strong>? <br/>Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, ¡anular!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                handleConfirmAnular(venta.idVenta);
            }
        });
    };

    const handleCloseModals = () => {
        setShowDetailsModal(false);
        setShowPdfModal(false);
        if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
        setPdfBlobUrl(null);
        setSelectedVenta(null);
    };
    
    const handleConfirmAnular = async (ventaId) => {
        try {
            await anularVentaById(ventaId);
            MySwal.fire('¡Anulada!', 'La venta ha sido anulada exitosamente.', 'success');
            loadVentas();
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
            MySwal.fire("Error", "Error al anular la venta. Intenta de nuevo.", "error");
        }
    };

    const handleEstadoChange = async (ventaId, nuevoIdEstado) => {
        try {
            await cambiarEstadoVenta(ventaId, nuevoIdEstado);
            MySwal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'El estado de la venta ha sido cambiado.',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });
            loadVentas();
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
            MySwal.fire("Error", "Error al cambiar el estado de la venta. Intenta de nuevo.", "error");
            loadVentas(); 
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
        <div className="lista-ventas-container">
            <div className="ventas-content-wrapper">
                <h1>Gestión de Ventas</h1>

                <div className="ventas-actions-bar">
                    <div className="ventas-filters">
                        <div className="ventas-search-bar">
                            <input
                                type="text"
                                placeholder="Busca por cualquier campo..."
                                value={busqueda}
                                onChange={handleSearchChange}
                            />
                        </div>
                        <div className="ventas-filtro-estado-grupo">
                            <select
                                id="filtro-estado"
                                className="ventas-filtro-input"
                                value={filtroEstado}
                                onChange={(e) => setFiltroEstado(e.target.value)}
                            >
                                <option value="">Todas</option>
                                <option value="1">Activa</option>
                                <option value="2">En proceso</option>
                                <option value="3">Completada</option>
                                <option value="4">Anulada</option>
                            </select>
                        </div>
                    </div>
                    <button
                        className="ventas-add-button"
                        onClick={() => navigate('/admin/ventas/proceso')}
                    >
                        Agregar Venta
                    </button>
                </div>

                {isLoading ? (
                    <p style={{ textAlign: 'center', marginTop: '50px' }}>Cargando ventas...</p>
                ) : error ? (
                    <p className="error-message" style={{ textAlign: 'center', marginTop: '50px' }}>{error}</p>
                ) : (
                    <>
                        <div className="table-container">
                            <VentasTable
                                ventas={currentVentasForTable}
                                onShowDetails={handleOpenDetails}
                                onGenerarPDF={handleOpenPdf}
                                onAnularVenta={handleOpenAnularConfirm}
                                onEstadoChange={handleEstadoChange}
                                currentPage={currentPage}
                                itemsPerPage={itemsPerPage}
                            />
                        </div>
                        
                        {/* ✅ CAMBIO 2: La paginación solo se muestra si hay más de una página (más de 10 registros) */}
                        {totalPages > 1 && (
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
                        )}
                    </>
                )}
            </div>
            
            {/* Modales */}
            <VentaDetalleModal isOpen={showDetailsModal} onClose={handleCloseModals} venta={selectedVenta} />
            <PdfViewModal isOpen={showPdfModal} onClose={handleCloseModals} pdfUrl={pdfBlobUrl} title={`Detalle Venta #${selectedVenta?.idVenta || ''}`} />
        </div>
    );
}

export default ListaVentasPage;