// src/features/ventas/pages/ListaVentasPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from '../../../shared/components/layout/NavbarAdmin';
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

  const [ventas, setVentas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showAnularConfirmModal, setShowAnularConfirmModal] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  
  const [selectedVenta, setSelectedVenta] = useState(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [validationMessage, setValidationMessage] = useState('');

  // **CAMBIO CLAVE**: Carga las ventas una única vez al montar el componente.
  // Esto asegura que siempre se obtenga el estado más reciente de localStorage.
  useEffect(() => {
    const loadedVentas = fetchVentas();
    setVentas(loadedVentas);
  }, []);

  // **ELIMINADO**: Se ha eliminado el useEffect que escuchaba el location.state.
  // Ya no es necesario, ya que la página siempre cargará el estado correcto del servicio.

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

  const handleConfirmAnular = () => {
    if (selectedVenta) {
      const updatedVentas = anularVentaById(selectedVenta.id, ventas);
      setVentas(updatedVentas);
      handleCloseModals();
    }
  };

  const handleEstadoChange = (ventaId, nuevoEstado) => {
    const updatedVentas = cambiarEstadoVenta(ventaId, nuevoEstado, ventas);
    setVentas(updatedVentas);
  };

  const filteredVentas = ventas.filter(venta =>
    (venta.cliente && venta.cliente.toLowerCase().includes(busqueda.toLowerCase())) ||
    (venta.id && venta.id.toString().includes(busqueda)) ||
    (venta.fecha && venta.fecha.includes(busqueda))
  );

  const totalPages = Math.ceil(filteredVentas.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVentasForTable = filteredVentas.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="ventas-page-container">
      <NavbarAdmin />
      <div className="ventasContent">
        <h1>Gestión de Ventas</h1>
        <div className="barraBotonContainer">
          <input
            type="text"
            placeholder="Buscar venta"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="barraBusquedaVenta"
          />
          <button
            className="botonAgregarVenta"
            onClick={() => navigate('/admin/ventas/proceso')}
          >
            Agregar Venta
          </button>
        </div>
        <VentasTable
          ventas={currentVentasForTable}
          onShowDetails={handleOpenDetails}
          onGenerarPDF={handleOpenPdf}
          onAnularVenta={handleOpenAnularConfirm}
          onEstadoChange={handleEstadoChange}
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
      </div>
      <VentaDetalleModal
        isOpen={showDetailsModal}
        onClose={handleCloseModals}
        venta={selectedVenta}
      />
      <PdfViewModal
        isOpen={showPdfModal}
        onClose={handleCloseModals}
        pdfUrl={pdfBlobUrl}
        title={`Detalle Venta #${selectedVenta?.id || ''}`}
      />
      <ConfirmModal
        isOpen={showAnularConfirmModal}
        onClose={handleCloseModals}
        onConfirm={handleConfirmAnular}
        title="Confirmar Anulación"
        message={`¿Está seguro de que desea anular la venta #${selectedVenta?.id || ''} para el cliente "${selectedVenta?.cliente || ''}"?`}
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