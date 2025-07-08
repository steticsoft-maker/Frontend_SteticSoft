// RUTA: src/features/compras/pages/ListaComprasPage.jsx

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from '../../../shared/components/layout/NavbarAdmin';
import ComprasTable from '../components/ComprasTable';
import CompraDetalleModal from '../components/CompraDetalleModal';
import PdfViewModal from '../../../shared/components/common/PdfViewModal';
import ConfirmModal from '../../../shared/components/common/ConfirmModal';
import ValidationModal from '../../../shared/components/common/ValidationModal';
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
    const [isAnularModalOpen, setIsAnularModalOpen] = useState(false);
    const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
    const [selectedCompra, setSelectedCompra] = useState(null);
    const [validationMessage, setValidationMessage] = useState('');
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

    const handleOpenAnular = (compraId) => {
        //...
        const compraParaAnular = compras.find(c => c.idCompra === compraId);
        setSelectedCompra(compraParaAnular);
        setIsAnularModalOpen(true);
    };
    
    const generateAndShowPdf = async (compraResumen) => {
        //...
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
            console.error("Error al generar PDF:", err);
            setValidationMessage(err.message || "No se pudo generar el PDF.");
            setIsValidationModalOpen(true);
        }
    };
    
    const handleCloseModals = () => {
        //...
        setIsDetalleModalOpen(false);
        setIsAnularModalOpen(false);
        setIsValidationModalOpen(false);
        setIsPdfModalOpen(false);
        setSelectedCompra(null);
        setValidationMessage('');
        setPdfDataUri('');
    };

    const handleConfirmAnular = async () => {
        //...
        if (!selectedCompra) return;
        try {
            await comprasService.anularCompra(selectedCompra.idCompra);
            setValidationMessage('¡Compra anulada exitosamente! El stock ha sido revertido.');
            await fetchCompras();
        } catch (err) {
            setValidationMessage(err.response?.data?.message || 'Error al anular la compra.');
        } finally {
            setIsValidationModalOpen(true);
            setIsAnularModalOpen(false);
        }
    };

    return (
        <div className="lista-compras-container">
            <NavbarAdmin />
            <div className="compras-content-wrapper">
                <h1>Listado de Compras</h1>
                
                <div className="proveedores-content-wrapper">
                    <div className="proveedores-actions-bar">
                        {/* ✨ 3. Se añade el HTML del filtro de estado */}
                        <div className="proveedores-filters">
                            <div className="proveedores-search-bar">
                                <input
                                    type="text"
                                    placeholder="Buscar por ID, proveedor, fecha..."
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
            <ConfirmModal isOpen={isAnularModalOpen} onClose={handleCloseModals} onConfirm={handleConfirmAnular} title="Confirmar Anulación" message={`¿Estás seguro de que deseas anular la compra N° ${selectedCompra?.idCompra}? Esta acción no se puede deshacer y el stock de los productos será revertido.`} confirmText="Sí, Anular" cancelText="No, Cancelar" />
            <ValidationModal isOpen={isValidationModalOpen} onClose={handleCloseModals} title="Aviso" message={validationMessage} />
        </div>
    );
}

export default ListaComprasPage;