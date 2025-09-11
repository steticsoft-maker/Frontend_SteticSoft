// RUTA: src/features/compras/pages/ListaComprasPage.jsx

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ComprasTable from '../components/ComprasTable';
import CompraDetalleModal from '../components/CompraDetalleModal';
import PdfViewModal from '../../../shared/components/common/PdfViewModal';
import { comprasService } from '../services/comprasService';
import { generarPDFCompraUtil } from '../utils/pdfGeneratorCompras.js';
import '../css/Compras.css';

const Paginacion = ({ currentPage, totalPages, onPageChange }) => {
    // ... (componente de paginación sin cambios)
    if (totalPages <= 1) return null;
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    return (
        <nav className="paginacion-container">
            <ul className="paginacion">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => onPageChange(currentPage - 1)}>Anterior</button>
                </li>
                {pageNumbers.map(number => (
                    <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => onPageChange(number)}>{number}</button>
                    </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => onPageChange(currentPage + 1)}>Siguiente</button>
                </li>
            </ul>
        </nav>
    );
};

const MySwal = withReactContent(Swal);

function ListaComprasPage() {
    const navigate = useNavigate();
    const [compras, setCompras] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [busqueda, setBusqueda] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('todos'); // ✨ 1. Se añade el estado para el filtro

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); 

    // ... (estados de modales sin cambios)
    const [isDetalleModalOpen, setIsDetalleModalOpen] = useState(false);
    const [selectedCompra, setSelectedCompra] = useState(null);
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
    const [pdfDataUri, setPdfDataUri] = useState('');


    const fetchCompras = useCallback(async () => {
        // ... (lógica de fetch sin cambios)
        setIsLoading(true);
        setError(null);
        try {
            const response = await comprasService.getCompras();
            setCompras(response.data || response || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al obtener las compras.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCompras();
    }, [fetchCompras]);

    // ✨ 2. Se mejora el useEffect para resetear la página cuando cambia cualquier filtro
    useEffect(() => {
        setCurrentPage(1);
    }, [busqueda, filtroEstado]);

    const comprasFiltradas = useMemo(() => {
        let dataFiltrada = [...compras];

        // Primero, filtrar por estado
        if (filtroEstado !== 'todos') {
            const esCompletado = filtroEstado === 'completadas'; // El estado en la data es booleano
            dataFiltrada = dataFiltrada.filter(compra => compra.estado === esCompletado);
        }

        // Luego, filtrar por búsqueda
        const termino = busqueda.toLowerCase();
        if (termino) {
            dataFiltrada = dataFiltrada.filter(compra => {
                const estadoTexto = compra.estado ? 'completado' : 'anulada';
                return (
                    (compra.idCompra?.toString() || '').includes(termino) ||
                    (compra.proveedor?.nombre?.toLowerCase() || '').includes(termino) ||
                    (new Date(compra.fecha).toLocaleDateString('es-CO')).includes(termino) ||
                    (compra.total?.toString() || '').replace('.', ',').includes(termino) ||
                    estadoTexto.includes(termino)
                );
            });
        }
        
        return dataFiltrada;

    }, [compras, busqueda, filtroEstado]); // Se añade 'filtroEstado' a las dependencias

    
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const comprasPaginadas = comprasFiltradas.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(comprasFiltradas.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // --- Lógica de modales y acciones (SIN CAMBIOS) ---
    const handleOpenDetalle = (compra) => {
        //...
        setSelectedCompra(compra);
        setIsDetalleModalOpen(true);
    };

    const handleOpenAnular = (compra) => {
        MySwal.fire({
            title: '¿Estás seguro?',
            text: `Deseas anular la compra N° ${compra.idCompra}? Esta acción no se puede deshacer y el stock de los productos será revertido.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, ¡anular!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                handleConfirmAnular(compra.idCompra);
            }
        });
    };
    
    const generateAndShowPdf = async (compraResumen) => {
        if (!compraResumen) return;
        try {
            const compraCompletaResponse = await comprasService.getCompraById(compraResumen.idCompra);
            const compraCompleta = compraCompletaResponse.data;
            if (!compraCompleta) throw new Error("No se pudieron obtener los detalles completos para el PDF.");
            const dataUri = generarPDFCompraUtil(compraCompleta);
            if (dataUri) {
                setPdfDataUri(dataUri);
                setSelectedCompra(compraCompleta);
                setIsPdfModalOpen(true);
            } else {
                throw new Error("La utilidad de PDF no pudo generar el archivo.");
            }
        } catch (err) {
            MySwal.fire("Error", err.message || "No se pudo generar el PDF.", "error");
        }
    };
    
    const handleCloseModals = () => {
        setIsDetalleModalOpen(false);
        setIsPdfModalOpen(false);
        setSelectedCompra(null);
        setPdfDataUri('');
    };

    const handleConfirmAnular = async (compraId) => {
        try {
            await comprasService.anularCompra(compraId);
            MySwal.fire('¡Anulada!', 'La compra ha sido anulada y el stock revertido.', 'success');
            await fetchCompras();
        } catch (err) {
            MySwal.fire("Error", err.response?.data?.message || 'Error al anular la compra.', "error");
        }
    };

    return (
        <div className="lista-compras-container">
            <div className="compras-content-wrapper">
                <h1>Listado de Compras</h1>
                
                <div className="proveedores-content-wrapper">
                    <div className="proveedores-actions-bar">
                        {/* ✨ 3. Se añade el HTML del filtro de estado */}
                        <div className="proveedores-filters">
                            <div className="proveedores-search-bar">
                                <input
                                    type="text"
                                    placeholder="Busca por cualquier campo..."
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                />
                            </div>
                            <div className="filtro-estado-grupo">
                                <select
                                    id="filtro-estado"
                                    className="filtro-input"
                                    value={filtroEstado}
                                    onChange={(e) => setFiltroEstado(e.target.value)}
                                >
                                    <option value="todos">Todos los Estados</option>
                                    <option value="completadas">Completadas</option>
                                    <option value="anuladas">Anuladas</option>
                                </select>
                            </div>
                        </div>
                        <button
                            className="proveedores-add-button"
                            onClick={() => navigate('/admin/compras/agregar')}
                        >
                            Agregar Compra
                        </button>
                    </div>

                    {isLoading ? <p>Cargando compras...</p> : error ? <p className="error-message">{error}</p> : (
                        <>
                            <ComprasTable
                                compras={comprasPaginadas}
                                onDetalle={handleOpenDetalle}
                                onAnular={handleOpenAnular}
                                onGenerarPDF={generateAndShowPdf}
                                startIndex={indexOfFirstItem}
                            />
                            <Paginacion
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </>
                    )}
                </div>
            </div>

            {/* --- Modales (SIN CAMBIOS) --- */}
            {isDetalleModalOpen && <CompraDetalleModal compra={selectedCompra} onClose={handleCloseModals} />}
            <PdfViewModal isOpen={isPdfModalOpen} onClose={handleCloseModals} pdfUrl={pdfDataUri} title={`Detalle Compra #${selectedCompra?.idCompra || ''}`} />
        </div>
    );
}

export default ListaComprasPage;