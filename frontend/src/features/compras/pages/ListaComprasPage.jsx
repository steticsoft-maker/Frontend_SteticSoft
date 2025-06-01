// src/features/compras/pages/ListaComprasPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from '../../../shared/components/layout/NavbarAdmin';
import ComprasTable from '../components/ComprasTable';
import CompraDetalleModal from '../components/CompraDetalleModal';
import PdfViewModal from '../../../shared/components/common/pdfViewModal';
import ConfirmModal from '../../../shared/components/common/ConfirmModal';
import ValidationModal from '../../../shared/components/common/ValidationModal';
import {
  fetchCompras,
  anularCompraById,
  cambiarEstadoCompra
} from '../services/comprasService';
import { generarPDFCompraUtil } from '../utils/pdfGeneratorCompras'; // Nombre correcto de la función
import '../css/Compras.css';

function ListaComprasPage() {
  const navigate = useNavigate();
  const [compras, setCompras] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showAnularConfirmModal, setShowAnularConfirmModal] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);

  const [selectedCompra, setSelectedCompra] = useState(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    setCompras(fetchCompras());
  }, []);

  const handleOpenDetails = (compra) => {
    setSelectedCompra(compra);
    setShowDetailsModal(true);
  };

  const handleOpenPdf = (compra) => {
    try {
        const blob = generarPDFCompraUtil(compra); // CORRECCIÓN: Usar el nombre de función importado
        const url = URL.createObjectURL(blob);
        setPdfBlobUrl(url);
        setSelectedCompra(compra);
        setShowPdfModal(true);
    } catch(e) {
        setValidationMessage("Error al generar el PDF: " + e.message);
        setIsValidationModalOpen(true);
    }
  };

  const handleOpenAnularConfirm = (compra) => {
    setSelectedCompra(compra);
    setShowAnularConfirmModal(true);
  };

  const handleCloseModals = () => {
    setShowDetailsModal(false);
    setShowPdfModal(false);
    if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
        setPdfBlobUrl(null);
    }
    setShowAnularConfirmModal(false);
    setIsValidationModalOpen(false);
    setSelectedCompra(null);
    setValidationMessage('');
  };

  const handleConfirmAnular = () => {
    if (selectedCompra) {
      const updatedCompras = anularCompraById(selectedCompra.id, compras);
      setCompras(updatedCompras);
      handleCloseModals();
    }
  };

  const handleEstadoChange = (compraId, nuevoEstado) => {
    const updatedCompras = cambiarEstadoCompra(compraId, nuevoEstado, compras);
    setCompras(updatedCompras);
  };

  const filteredCompras = compras.filter(compra =>
    (compra.proveedor?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (compra.id?.toString() || '').includes(searchTerm) ||
    (compra.fecha?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    // Contenedor principal de la página para el layout flex con NavbarAdmin
    <div className="compras-page-container"> 
      <NavbarAdmin />
      {/* Contenedor del contenido principal con el margen para el NavbarAdmin */}
      <div className="comprasContenido"> 
        {/* Wrapper interno para centrar el contenido si es necesario */}
        <div className="compras-content-wrapper"> 
          <h2 className="title-h2">Gestión de Compras</h2>
          <div className="container-busqueda-agregar"> 
            <input
              className="inputBarraBusqueda" // Asegúrate que esta clase esté bien estilizada en Compras.css
              type="text"
              placeholder="Buscar compra (proveedor, ID, fecha)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="botonSuperiorAgregarCompra" // Asegúrate que esta clase esté bien estilizada en Compras.css
              onClick={() => navigate('/compras/agregar')}
            >
              Agregar Compra
            </button>
          </div>
          <ComprasTable
            compras={filteredCompras}
            onShowDetails={handleOpenDetails}
            onGenerarPDF={handleOpenPdf}
            onAnular={handleOpenAnularConfirm}
            onEstadoChange={handleEstadoChange}
          />
        </div>
      </div>

      <CompraDetalleModal
        isOpen={showDetailsModal}
        onClose={handleCloseModals}
        compra={selectedCompra}
      />
      <PdfViewModal
        isOpen={showPdfModal}
        onClose={handleCloseModals}
        pdfUrl={pdfBlobUrl}
        title={`Detalle Compra #${selectedCompra?.id || ''}`}
      />
      <ConfirmModal
        isOpen={showAnularConfirmModal}
        onClose={handleCloseModals}
        onConfirm={handleConfirmAnular}
        title="Confirmar Anulación"
        message={`¿Está seguro de que desea anular la compra al proveedor "${selectedCompra?.proveedor || ''}" con fecha ${selectedCompra?.fecha || ''}?`}
      />
      <ValidationModal
        isOpen={isValidationModalOpen}
        onClose={handleCloseModals}
        title="Aviso de Compras"
        message={validationMessage}
      />
    </div>
  );
}

export default ListaComprasPage;