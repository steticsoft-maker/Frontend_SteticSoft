// src/features/ventas/pages/ListaVentasPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // useLocation si aún la usas para recibir nuevaVenta
import NavbarAdmin from '../../../shared/components/layout/NavbarAdmin';
import VentasTable from '../components/VentasTable';
import VentaDetalleModal from '../components/VentaDetalleModal'; // Modal de detalles de venta
import PdfViewModal from '../../../shared/components/common/PdfViewModal'; // Modal genérico para PDF
import ConfirmModal from '../../../shared/components/common/ConfirmModal';
import ValidationModal from '../../../shared/components/common/ValidationModal';
import {
  fetchVentas,
  anularVentaById,
  cambiarEstadoVenta
  // generarPDFVenta ya no se importa del servicio, se usa la utilidad directamente
} from '../services/ventasService';
import { generarPDFVentaUtil } from '../utils/pdfGeneratorVentas'; // Importar utilidad de PDF
import '../css/Ventas.css';

function ListaVentasPage() {
  const navigate = useNavigate();
  const location = useLocation(); // Para recibir nuevaVenta de ProcesoVentaPage

  const [ventas, setVentas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Estados de los Modales
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showAnularConfirmModal, setShowAnularConfirmModal] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  
  const [selectedVenta, setSelectedVenta] = useState(null); // Para detalles, PDF, anular
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    setVentas(fetchVentas());
  }, []);

  // Efecto para agregar nueva venta (si viene de ProcesoVentaPage)
  useEffect(() => {
    if (location.state && location.state.nuevaVenta) {
      const { nuevaVenta } = location.state;
      setVentas((prevVentas) => {
        // Lógica para asegurar ID único si es necesario (ya lo hace el servicio)
        // Solo agregamos si no existe ya (simple check)
        if (!prevVentas.find(v => v.id === nuevaVenta.id)) {
            return [...prevVentas, nuevaVenta];
        }
        return prevVentas;
      });
      // Limpiar el estado de la ubicación para no re-agregarla
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]); // location.pathname added


  useEffect(() => {
    // Persistir ventas cuando cambien
    if(ventas.length > 0) { // Solo guardar si hay ventas, para no sobrescribir con array vacío al inicio si localStorage tenía datos
        localStorage.setItem('ventas_steticsoft_v2', JSON.stringify(ventas));
    }
  }, [ventas]);


  const handleOpenDetails = (venta) => {
    setSelectedVenta(venta);
    setShowDetailsModal(true);
  };

  const handleOpenPdf = (venta) => {
    try {
      const blob = generarPDFVentaUtil(venta);
      const url = URL.createObjectURL(blob);
      setPdfBlobUrl(url);
      setSelectedVenta(venta); // Para el título del modal
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
            placeholder="Buscar venta (cliente, ID, fecha)..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="barraBusquedaVenta"
          />
          <button
            className="botonAgregarVenta"
            onClick={() => navigate('/admin/ventas/proceso')} // Cambiado de /procesoventas
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
        {/* Paginación */}
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