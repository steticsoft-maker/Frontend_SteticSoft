import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import NavbarAdmin from "../../components/NavbarAdmin/NavbarAdmin";
import "./Ventas.css"; 

const PDFVenta = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [venta, setVenta] = useState(null);

  useEffect(() => {
    
    const storedVentas = localStorage.getItem("ventas");
    if (storedVentas) {
      const ventas = JSON.parse(storedVentas);
      const foundVenta = ventas.find((v) => v.id === parseInt(id));
      setVenta(foundVenta);

      if (foundVenta) {
        generatePdf(foundVenta);
      }
    }
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [id]); 

  const generatePdf = (ventaData) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Detalle de Venta", 14, 20);

    doc.setFontSize(12);
    doc.text(`Cliente: ${ventaData.cliente}`, 14, 30);
    doc.text(`Documento: ${ventaData.documento || 'N/A'}`, 14, 36);
    doc.text(`Teléfono: ${ventaData.telefono || 'N/A'}`, 14, 42);
    doc.text(`Dirección: ${ventaData.direccion || 'N/A'}`, 14, 48);
    doc.text(`Subtotal: $${ventaData.subtotal.toFixed(2)}`, 14, 54);
    doc.text(`IVA (19%): $${ventaData.iva.toFixed(2)}`, 14, 60);
    doc.text(`Total: $${ventaData.total.toFixed(2)}`, 14, 66);
    doc.text(`Estado: ${ventaData.estado}`, 14, 72);

    const items = ventaData.items.map((item, index) => [
      index + 1,
      item.nombre,
      item.cantidad,
      `$${item.precio.toLocaleString()}`,
      `$${(item.precio * item.cantidad).toLocaleString()}`,
    ]);

    autoTable(doc, {
      head: [["#", "Producto/Servicio", "Cantidad", "Precio Unitario", "Total"]],
      body: items,
      startY: 80,
    });

    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    setPdfUrl(url);
  };

  if (!venta) {
    return (
      <div className="ventas-container">
        <NavbarAdmin />
        <div className="ventasContent"
            
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center', 
              alignItems: 'center',
              minHeight: 'calc(100vh - 60px)',
              padding: '20px'
            }}
        >
          <h2>Cargando PDF...</h2>
          <p>No se encontró la venta con ID: {id}</p>
          <button className="botonCerrarModalPDF" onClick={() => navigate('/ventas')}>Volver a Ventas</button>
        </div>
      </div>
    );
  }

  return (
    <div className="ventas-container">
      <NavbarAdmin />
      <div className="ventasContent"
        
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center', 
          minHeight: 'calc(100vh - 60px)', 
          padding: '20px' 
        }}
      >
        <div className="modal-content-ventas">
          <h2>Vista Previa del PDF de Venta #{venta.id}</h2>
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              title="Vista previa PDF"
              width="550px"
              height="500px"
              style={{ border: "1px solid #ccc" }}
            />
          ) : (
            <p>Generando PDF...</p>
          )}
          <div className="modal-ventas-buttons">
            <button
              className="botonCerrarModalPDF"
              onClick={() => {
                
                if (pdfUrl) {
                  URL.revokeObjectURL(pdfUrl);
                }
                navigate('/ventas');
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFVenta;