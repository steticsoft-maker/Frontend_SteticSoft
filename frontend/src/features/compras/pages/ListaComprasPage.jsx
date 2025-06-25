// RUTA: src/features/compras/pages/ListaComprasPage.jsx
// DESCRIPCIÓN: Versión final con la recarga de datos (`fetchCompras`) después de anular.

import React, { useState, useEffect, useCallback } from 'react';
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

function ListaComprasPage() {
  const navigate = useNavigate();
  const [compras, setCompras] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  // Estados para modales
  const [isDetalleModalOpen, setIsDetalleModalOpen] = useState(false);
  const [isAnularModalOpen, setIsAnularModalOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [selectedCompra, setSelectedCompra] = useState(null);
  const [validationMessage, setValidationMessage] = useState('');
  
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

  const handleOpenDetalle = (compra) => {
    setSelectedCompra(compra);
    setIsDetalleModalOpen(true);
  };

  const handleOpenAnular = (compraId) => {
    const compraParaAnular = compras.find(c => c.idCompra === compraId);
    setSelectedCompra(compraParaAnular);
    setIsAnularModalOpen(true);
  };

  const generateAndShowPdf = async (compraResumen) => {
    if (!compraResumen) return;
    
    try {
      const compraCompletaResponse = await comprasService.getCompraById(compraResumen.idCompra);
      const compraCompleta = compraCompletaResponse.data;

      if (!compraCompleta) {
        throw new Error("No se pudieron obtener los detalles completos para el PDF.");
      }
      
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
  
  // CAMBIO 1: Se elimina la función 'handleEstadoChange' que ya no se utiliza.

  const handleCloseModals = () => {
    setIsDetalleModalOpen(false);
    setIsAnularModalOpen(false);
    setIsValidationModalOpen(false);
    setIsPdfModalOpen(false);
    setSelectedCompra(null);
    setValidationMessage('');
    setPdfDataUri('');
  };

  const handleConfirmAnular = async () => {
    if (!selectedCompra) return;
    try {
      await comprasService.anularCompra(selectedCompra.idCompra);
      setValidationMessage('¡Compra anulada exitosamente! El stock ha sido revertido.');
      
      await fetchCompras(); 

    } catch (err) {
      setValidationMessage(err.response?.data?.message || 'Error al anular la compra.');
    } finally {
      setIsValidationModalOpen(true);
      // CORRECCIÓN: el modal de confirmación ahora se cierra aquí para asegurar que el usuario vea el mensaje de validación.
      setIsAnularModalOpen(false);
    }
  };

  const filteredCompras = compras.filter(compra =>
    (compra.proveedor?.nombre?.toLowerCase() || '').includes(busqueda.toLowerCase()) ||
    (compra.idCompra?.toString() || '').includes(busqueda)
  );

  return (
    <div className="lista-compras-container">
      <NavbarAdmin />
      <div className="compras-content-wrapper">
        <h1>Listado de Compras</h1>
        <div className="proveedores-actions-bar">
          <div className="proveedores-search-bar">
            <input
              type="text"
              placeholder="Buscar por ID, Proveedor..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <button
            className="proveedores-add-button"
            onClick={() => navigate('/admin/compras/agregar')}
          >
            Agregar Compra
          </button>
        </div>

        {isLoading ? <p>Cargando compras...</p> : error ? <p className="error-message">{error}</p> : (
          // CAMBIO 2: Se elimina la prop 'onEstadoChange' del componente ComprasTable.
          <ComprasTable
            compras={filteredCompras}
            onDetalle={handleOpenDetalle}
            onAnular={handleOpenAnular}
            onGenerarPDF={generateAndShowPdf}
          />
        )}
      </div>

      {isDetalleModalOpen && <CompraDetalleModal compra={selectedCompra} onClose={handleCloseModals} />}
      
      <PdfViewModal
        isOpen={isPdfModalOpen}
        onClose={handleCloseModals}
        pdfUrl={pdfDataUri}
        title={`Detalle Compra #${selectedCompra?.idCompra || ''}`}
      />

      <ConfirmModal
        isOpen={isAnularModalOpen}
        onClose={handleCloseModals}
        onConfirm={handleConfirmAnular}
        title="Confirmar Anulación"
        message={`¿Estás seguro de que deseas anular la compra N° ${selectedCompra?.idCompra}? Esta acción no se puede deshacer y el stock de los productos será revertido.`}
        confirmText="Sí, Anular"
        cancelText="No, Cancelar"
      />
      
      <ValidationModal
        isOpen={isValidationModalOpen}
        onClose={handleCloseModals}
        title="Aviso"
        message={validationMessage}
      />
    </div>
  );
}

export default ListaComprasPage;