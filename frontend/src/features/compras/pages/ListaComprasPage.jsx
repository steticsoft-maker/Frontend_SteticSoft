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

/**
 * Normaliza una fecha de entrada a un objeto con múltiples formatos de string.
 */
const normalizeDateMultiFormat = (input) => {
    try {
        if (!input) return {};

        let date;

        if (input instanceof Date) {
            date = input;
        } else if (typeof input === 'number') {
            date = new Date(input);
        } else {
            const str = String(input).trim();
            let match;

            match = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
            if (match) {
                date = new Date(match[1], match[2] - 1, match[3]);
            } else {
                match = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
                if (match) {
                    date = new Date(match[3], match[2] - 1, match[1]);
                } else {
                    match = str.match(/^(\d{2})(\d{2})(\d{4})$/);
                    if (match) {
                        date = new Date(match[3], match[2] - 1, match[1]);
                    } else {
                        match = str.match(/^(\d{4})(\d{2})(\d{2})$/);
                        if (match) {
                            date = new Date(match[1], match[2] - 1, match[3]);
                        } else {
                            date = new Date(str);
                        }
                    }
                }
            }
        }

        if (!date || isNaN(date.getTime())) {
            return {};
        }

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return {
            slash: `${day}/${month}/${year}`,
            dash: `${day}-${month}-${year}`,
            iso: `${year}-${month}-${day}`,
            compact: `${day}${month}${year}`,
            isoCompact: `${year}${month}${day}`,
        };
    } catch (error) {
        console.error("Error parsing date:", error);
        return {};
    }
};

const Paginacion = ({ currentPage, totalPages, onPageChange }) => {
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
    const [filtroEstado, setFiltroEstado] = useState('todos');

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); 

    const [isDetalleModalOpen, setIsDetalleModalOpen] = useState(false);
    const [selectedCompra, setSelectedCompra] = useState(null);
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
    const [pdfDataUri, setPdfDataUri] = useState('');

    const fetchCompras = useCallback(async () => {
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

    useEffect(() => {
        setCurrentPage(1);
    }, [busqueda, filtroEstado]);

    const comprasFiltradas = useMemo(() => {
        let dataFiltrada = [...compras];

        if (filtroEstado !== 'todos') {
            const esCompletado = filtroEstado === 'completadas';
            dataFiltrada = dataFiltrada.filter(compra => compra.estado === esCompletado);
        }

        const termino = busqueda.trim();
        if (!termino) return dataFiltrada;

        const terminoLower = termino.toLowerCase();
        const terminoDigits = termino.replace(/\D/g, '');

        return dataFiltrada.filter(compra => {
            try {
                const estadoTexto = compra.estado ? 'completado' : 'anulada';

                // 🔹 Normalización de total (acepta punto, coma, miles)
                const totalRaw = compra.total != null ? String(compra.total) : '';
                const totalNormalized = totalRaw.replace(/[.,\s]/g, ''); // solo dígitos
                const terminoNormalized = termino.replace(/[.,\s]/g, ''); // normalizar búsqueda

                if (
                    (compra.idCompra?.toString() || '').includes(termino) ||
                    (compra.proveedor?.nombre?.toLowerCase() || '').includes(terminoLower) ||
                    estadoTexto.includes(terminoLower) ||
                    (totalRaw && (
                        totalRaw.includes(termino) ||
                        totalRaw.replace('.', ',').includes(termino) ||
                        totalRaw.replace(',', '.').includes(termino) ||
                        totalNormalized.includes(terminoNormalized)
                    ))
                ) {
                    return true;
                }

                // 🔹 Búsqueda en fecha
                const fechaFormats = normalizeDateMultiFormat(compra.fecha);
                if (Object.keys(fechaFormats).length > 0) {
                    if (fechaFormats.slash.includes(termino) || fechaFormats.dash.includes(termino)) {
                        return true;
                    }
                    if (terminoDigits && (
                        fechaFormats.compact.includes(terminoDigits) ||
                        fechaFormats.isoCompact.includes(terminoDigits)
                    )) {
                        return true;
                    }
                }

                return false;
            } catch (error) {
                console.error("Error during filtering:", error);
                return false;
            }
        });
    }, [compras, busqueda, filtroEstado]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const comprasPaginadas = comprasFiltradas.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(comprasFiltradas.length / itemsPerPage);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const handleOpenDetalle = async (compraResumen) => {
        setIsLoading(true);
        try {
            const compraCompletaResponse = await comprasService.getCompraById(compraResumen.idCompra);
            const compraCompleta = compraCompletaResponse.data;
            if (!compraCompleta) throw new Error("No se pudieron obtener los detalles completos de la compra.");
            setSelectedCompra(compraCompleta);
            setIsDetalleModalOpen(true);
        } catch (err) {
            MySwal.fire("Error", err.message || "No se pudo cargar el detalle de la compra.", "error");
        } finally {
            setIsLoading(false);
        }
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
                <div className="compras-content-wrapper">
                    <div className="compras-actions-bar">
                        <div className="compras-filters">
                            <div className="compras-search-bar">
                                <input
                                    type="text"
                                    placeholder="Busca por cualquier campo..."
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                />
                            </div>
                            <div className="compras-filtro-estado-grupo">
                                <select
                                    id="filtro-estado"
                                    className="compras-filtro-input"
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
                            className="compras-add-button"
                            onClick={() => navigate('/admin/compras/agregar')}
                        >
                            Agregar Compra
                        </button>
                    </div>
                    {isLoading ? (
                        <p>Cargando compras...</p>
                    ) : error ? (
                        <p className="error-message">{error}</p>
                    ) : (
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
            {isDetalleModalOpen && (
                <CompraDetalleModal compra={selectedCompra} onClose={handleCloseModals} />
            )}
            <PdfViewModal
                isOpen={isPdfModalOpen}
                onClose={handleCloseModals}
                pdfUrl={pdfDataUri}
                title={`Detalle Compra #${selectedCompra?.idCompra || ''}`}
            />
        </div>
    );
}

export default ListaComprasPage;
