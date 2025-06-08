import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from '../../../shared/components/layout/NavbarAdmin';
import ComprasTable from '../components/ComprasTable';
// CORRECCIÓN: Se importa sin llaves {} porque es un 'export default'
import CompraDetalleModal from '../components/CompraDetalleModal'; 
import PdfViewModal from '../../../shared/components/common/PdfViewModal';
import ConfirmModal from '../../../shared/components/common/ConfirmModal';
import ValidationModal from '../../../shared/components/common/ValidationModal';
import { comprasService } from '../services/comprasService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logoEmpresa from '/logo.png';
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
      // Asumiendo que la API envuelve los datos en un objeto { success: true, data: [...] }
      setCompras(response.data || []); 
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
      const compra = compraCompletaResponse.data;

      if (!compra) {
        throw new Error("No se pudieron obtener los detalles completos para el PDF.");
      }
      
      const doc = new jsPDF();
      doc.addImage(logoEmpresa, 'PNG', 10, 10, 30, 30);
      doc.setFontSize(18);
      doc.text(`Detalle de Compra N°: ${compra.idCompra}`, 50, 25);
      doc.setFontSize(12);
      doc.text(`Fecha: ${new Date(compra.fecha).toLocaleDateString()}`, 10, 50);
      doc.text(`Proveedor: ${compra.proveedor?.nombre || 'N/A'}`, 10, 57);
      
      const tableColumn = ["Producto", "Cantidad", "Valor Unitario", "Subtotal"];
      const tableRows = (compra.productosComprados || []).map(producto => {
          const detalle = producto.detalleCompra || {};
          const cantidad = detalle.cantidad || 0;
          const valorUnitario = detalle.valorUnitario || 0;
          const subtotalItem = cantidad * valorUnitario;
          return [ 
              producto.nombre || 'N/A', 
              cantidad, 
              `$${Number(valorUnitario).toLocaleString('es-CO')}`, 
              `$${subtotalItem.toLocaleString('es-CO')}`
          ];
      });
      
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 70,
      });
      
      const dataUri = doc.output('datauristring');
      setPdfDataUri(dataUri);
      setSelectedCompra(compra);
      setIsPdfModalOpen(true);

    } catch (err) {
      console.error("Error al generar PDF:", err);
      setValidationMessage(err.response?.data?.message || "No se pudo generar el PDF.");
      setIsValidationModalOpen(true);
    }
  };
  
  const handleEstadoChange = (compraId, nuevoEstado) => {
    // Aquí iría la lógica para llamar al servicio de API que actualiza el estado.
    console.log(`Cambiando estado de compra ${compraId} a ${nuevoEstado}`);
    // Ejemplo de actualización optimista en el UI:
    setCompras(prevCompras =>
      prevCompras.map(compra =>
        compra.idCompra === compraId ? { ...compra, estadoProceso: nuevoEstado } : compra
      )
    );
  };

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
      setValidationMessage('¡Compra anulada exitosamente!');
      fetchCompras();
    } catch (err) {
      setValidationMessage(err.response?.data?.message || 'Error al anular la compra.');
    } finally {
      setIsValidationModalOpen(true);
      handleCloseModals();
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
          <ComprasTable
            compras={filteredCompras}
            onDetalle={handleOpenDetalle}
            onAnular={handleOpenAnular}
            onEstadoChange={handleEstadoChange}
            onGenerarPDF={generateAndShowPdf}
          />
        )}
      </div>

      {isDetalleModalOpen && <CompraDetalleModal compra={selectedCompra} onClose={handleCloseModals} />}
      
      {isPdfModalOpen && (
        <PdfViewModal
            isOpen={isPdfModalOpen}
            onClose={handleCloseModals}
            pdfDataUri={pdfDataUri}
            fileName={`compra_${selectedCompra?.idCompra || 'detalle'}.pdf`}
        />
      )}

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