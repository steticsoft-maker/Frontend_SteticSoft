// src/features/compras/pages/ListaComprasPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from '../../../shared/components/layout/NavbarAdmin';
import ComprasTable from '../components/ComprasTable';
import CompraDetalleModal from '../components/CompraDetalleModal';
import PdfViewModal from '../../../shared/components/common/pdfViewModal';
import ConfirmModal from '../../../shared/components/common/ConfirmModal'; // Genérico
import ValidationModal from '../../../shared/components/common/ValidationModal'; // Genérico
import {
  fetchCompras,
  anularCompraById,
  cambiarEstadoCompra
} from '../services/comprasService';
import { generarPDFCompraUtil } from '../utils/pdfGeneratorCompras';
import '../css/Compras.css'; // Asegurar la ruta correcta

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
        const blob = generarPDFCompra(compra);
        const url = URL.createObjectURL(blob);
        setPdfBlobUrl(url);
        setSelectedCompra(compra); // Para el título del modal
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
    if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
    setPdfBlobUrl(null);
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
    compra.proveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    compra.id.toString().includes(searchTerm) ||
    compra.fecha.includes(searchTerm)
  );

  return (
    <div className="compras-page-container"> {/* Nueva clase para la página */}
      <NavbarAdmin />
      <div className="comprasContenido"> {/* Clase del CSS original */}
        <h2 className="title-h2">Gestión de Compras</h2>
        <div className="container-busqueda-agregar"> {/* Clase del CSS original */}
          <input
            className="inputBarraBusqueda" /* Clase del CSS original */
            type="text"
            placeholder="Buscar compra (proveedor, ID, fecha)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="botonSuperiorAgregarCompra" /* Clase del CSS original */
            onClick={() => navigate('/compras/agregar')} // Ruta a la página de agregar compra
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