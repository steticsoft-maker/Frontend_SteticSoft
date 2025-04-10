// ...importaciones (sin cambios)
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faFilePdf, faBan } from "@fortawesome/free-solid-svg-icons";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import NavbarAdmin from "../../components/NavbarAdmin";
import "./Compras.css";

const Compras = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [compras, setCompras] = useState([
    {
      proveedor: "Proveedor A",
      fecha: "24/03/2025",
      total: "$500,000",
      estado: "Completado",
      productos: [
        { nombre: "Shampoo", cantidad: 2, precio: 10000, total: 20000 },
        { nombre: "Tinte", cantidad: 3, precio: 25000, total: 75000 },
      ],
    },
    {
      proveedor: "Proveedor B",
      fecha: "22/03/2025",
      total: "$320,000",
      estado: "Pendiente",
      productos: [],
    },
  ]);

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCompra, setSelectedCompra] = useState(null);

  const [showAnularModal, setShowAnularModal] = useState(false);
  const [indexToAnular, setIndexToAnular] = useState(null);

  const [showPDFModal, setShowPDFModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const handleAnular = (index) => {
    setIndexToAnular(index);
    setShowAnularModal(true);
  };

  const confirmAnularCompra = () => {
    if (indexToAnular !== null) {
      const updatedCompras = [...compras];
      updatedCompras[indexToAnular].estado = "Anulada";
      setCompras(updatedCompras);
      setShowAnularModal(false);
      setIndexToAnular(null);
    }
  };

  const handleGenerarPDF = (compra) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Detalle de Compra", 14, 20);
  
    doc.setFontSize(12);
    doc.text(`Proveedor: ${compra.proveedor}`, 14, 30);
    doc.text(`Fecha: ${compra.fecha}`, 14, 36);
    doc.text(`Total: ${compra.total}`, 14, 42);
  
    const productos = compra.productos.length > 0
      ? compra.productos.map((prod, i) => [
          i + 1,
          prod.nombre,
          prod.cantidad,
          `$${prod.precio.toLocaleString()}`,
          `$${prod.total.toLocaleString()}`,
        ])
      : [["-", "No hay productos", "-", "-", "-"]];
  
    autoTable(doc, {
      head: [["#", "Nombre", "Cantidad", "Precio Unitario", "Total"]],
      body: productos,
      startY: 50,
    });
  
    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    setPdfUrl(url);
    setShowPDFModal(true);
  };
  

  const handleShowDetails = (compra) => {
    setSelectedCompra(compra);
    setShowDetailsModal(true);
  };

  const handleEstadoChange = (index) => {
    const updatedCompras = [...compras];
    updatedCompras[index].estado =
      updatedCompras[index].estado === "Pendiente"
        ? "Completado"
        : "Pendiente";
    setCompras(updatedCompras);
  };

  return (
    <div className="compras-container">
      <NavbarAdmin />
      <div className="compras-content">
        <h2 className="title-h2">Gestión de Compras</h2>

        <div className="barra-superior">
          <input
            type="text"
            placeholder="Buscar compra..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-busqueda"
          />
          <button
            className="btnAgregarCompra"
            onClick={() => navigate("/agregar-compra")}
          >
            Agregar Compra
          </button>
        </div>

        <div className="compras-table">
          <table>
            <thead>
              <tr>
                <th>Proveedor</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {compras
                .filter((compra) =>
                  compra.proveedor
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )
                .map((compra, index) => (
                  <tr key={index}>
                    <td>{compra.proveedor}</td>
                    <td>{compra.fecha}</td>
                    <td>{compra.total}</td>
                    <td className={`estado ${compra.estado.toLowerCase()}`}>
                      {compra.estado === "Anulada" ? (
                        <span>Anulada</span>
                      ) : (
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={compra.estado === "Completado"}
                            onChange={() => handleEstadoChange(index)}
                          />
                          <span className="slider"></span>
                        </label>
                      )}
                    </td>
                    <td className="acciones">
                      <button
                        className="btnVerCompra"
                        onClick={() => handleShowDetails(compra)}
                        title="Ver detalles"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        className="btnPDFCompra"
                        onClick={() => handleGenerarPDF(compra)}
                        title="Generar PDF"
                      >
                        <FontAwesomeIcon icon={faFilePdf} />
                      </button>
                      {compra.estado !== "Anulada" && (
                        <button
                          className="btn danger"
                          onClick={() => handleAnular(index)}
                          title="Anular compra"
                        >
                          <FontAwesomeIcon icon={faBan} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalles */}
      {showDetailsModal && selectedCompra && (
        <div className="modal">
          <div className="modal-content">
            <h2>Detalles de la Compra</h2>
            <p><strong>Proveedor:</strong> {selectedCompra.proveedor}</p>
            <p><strong>Fecha:</strong> {selectedCompra.fecha}</p>
            <p><strong>Total:</strong> {selectedCompra.total}</p>
            <h3>Productos</h3>
            <ul>
              {selectedCompra.productos.length > 0 ? (
                selectedCompra.productos.map((producto, index) => (
                  <li key={index}>
                    {producto.nombre} - {producto.cantidad} x ${producto.precio.toLocaleString()} = ${producto.total.toLocaleString()}
                  </li>
                ))
              ) : (
                <p>No hay productos registrados.</p>
              )}
            </ul>
            <button className="btn close" onClick={() => setShowDetailsModal(false)}>Cerrar</button>
          </div>
        </div>
      )}

      {/* Modal de Confirmación para Anular */}
      {showAnularModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Confirmar Anulación</h2>
            <p>¿Está seguro de que desea anular esta compra?</p>
            <div className="modal-buttons">
              <button className="btn danger" onClick={confirmAnularCompra}>
                Sí, anular
              </button>
              <button className="btn close" onClick={() => setShowAnularModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

{/* Modal para vista previa del PDF */}
{showPDFModal && pdfUrl && (
  <div className="modal">
    <div className="modal-content">
      <h2>Vista Previa del PDF</h2>
      <iframe
        src={pdfUrl}
        title="Vista previa PDF"
        width="550px"
        height="500px"
        style={{ border: "1px solid #ccc" }}
      />
      <div className="modal-buttons">
        <a
          href={pdfUrl}
          download="Compra.pdf"
          className="btn"
          style={{ marginRight: "10px" }}
        >
          Descargar PDF
        </a>
        <button
          className="btn close"
          onClick={() => {
            setShowPDFModal(false);
            URL.revokeObjectURL(pdfUrl);
            setPdfUrl(null);
          }}
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default Compras;
