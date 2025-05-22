import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faFilePdf, faBan } from "@fortawesome/free-solid-svg-icons";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import NavbarAdmin from "../../components/NavbarAdmin/NavbarAdmin";
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
      productos: [
        { nombre: "Gel para cabello", cantidad: 4, precio: 40000, total: 160000 },
        { nombre: "Labial", cantidad: 4, precio: 20000, total: 80000 },
      ],
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
      <div className="comprasContenido">
        <h2 className="title-h2">Gestión de Compras</h2>

        <div className="container-busqueda-agregar">
          <input
            className="inputBarraBusqueda"
            type="text"
            placeholder="Buscar compra..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}/>
          <button
            className="botonSuperiorAgregarCompra"
            onClick={() => navigate("/agregar-compra")}>
            Agregar Compra
          </button>
        </div>

        <div className="tablaCompras">
          <table>
            <thead>
              <tr>
                <th>#</th> {/* Nueva columna para la enumeración */}
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
                    <td>{index + 1}</td> {/* Muestra el número de fila */}
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
                    <td className="accionesTablaCompras">
                      <button
                        className="botonVerDetallesCompra"
                        onClick={() => handleShowDetails(compra)}
                        title="Ver detalles">
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        className="botonGenerarPDF"
                        onClick={() => handleGenerarPDF(compra)}
                        title="Generar PDF">
                        <FontAwesomeIcon icon={faFilePdf} />
                      </button>
                      {compra.estado !== "Anulada" && (
                        <button
                          className="botonAnularCompra"
                          onClick={() => handleAnular(index)}
                          title="Anular compra">
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

      {showDetailsModal && selectedCompra && (
        <div className="modal-compras">
          <div className="modal-content-compras">
            <h2>Detalle de Compra</h2>
            <p><strong>Proveedor:</strong> {selectedCompra.proveedor}</p>
            <p><strong>Fecha:</strong> {selectedCompra.fecha}</p>
            <p><strong>Total:</strong> {selectedCompra.total}</p>

            <table className="tablaDetallesCompras">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedCompra.productos.map((producto, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{producto.nombre}</td>
                    <td>{producto.cantidad}</td>
                    <td>${producto.precio.toLocaleString()}</td>
                    <td>${producto.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              className="botonCerrarDetallesCompra"
              onClick={() => setShowDetailsModal(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {showAnularModal && (
        <div className="modal-compras">
          <div className="modal-content-compras">
            <h2>Confirmar Anulación</h2>
            <p>¿Está seguro de que desea anular esta compra?</p>
            <div className="modal-compras-buttons-anular">
              <button className="botonConfirmarAnularCompra" onClick={confirmAnularCompra}>
                Sí, anular
              </button>
              <button className="botonCerrarModalAnularCompra" onClick={() => setShowAnularModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showPDFModal && pdfUrl && (
        <div className="modal-compras">
          <div className="modal-content-compras">
            <h2>Vista Previa del PDF</h2>
            <iframe
              src={pdfUrl}
              title="Vista previa PDF"
              width="550px"
              height="500px"
              style={{ border: "1px solid #ccc" }}/>
            <div className="modal-compras-buttons">
              <button
                className="botonCerrarModalAnularCompra-PDF"
                onClick={() => {
                  setShowPDFModal(false);
                  URL.revokeObjectURL
                  (pdfUrl);
                }}>
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