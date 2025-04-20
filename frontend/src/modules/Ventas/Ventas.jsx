import React, { useState, useEffect } from "react";
import { FaEye, FaFilePdf, FaBan } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import NavbarAdmin from "../../components/NavbarAdmin";
import ProcesoVentas from "./ProcesoVentas";
import "./Ventas.css";
import "./ProcesoVentas.css";

const Ventas = () => {
  const initialVentas = [
    {
      id: 1,
      fecha: "2025-03-28",
      cliente: "Juan Pérez",
      total: 50000,
      estado: "Activa",
      productos: [
        { nombre: "Producto A", cantidad: 2, precio: 10000, total: 20000 },
        { nombre: "Producto B", cantidad: 3, precio: 20000, total: 60000 },
      ],
    },
    {
      id: 2,
      fecha: "2025-03-29",
      cliente: "María Gómez",
      total: 120000,
      estado: "En proceso",
      productos: [
        { nombre: "Producto C", cantidad: 1, precio: 120000, total: 120000 },
      ],
    },
  ];

  const [ventas, setVentas] = useState(initialVentas);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [showModal, setShowModal] = useState(false);
  const [currentVenta, setCurrentVenta] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarProcesoVentas, setMostrarProcesoVentas] = useState(false);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    localStorage.setItem("ventas", JSON.stringify(ventas));
  }, [ventas]);

  const guardarVenta = (nuevaVenta) => {
    setVentas([...ventas, nuevaVenta]);
    setMostrarProcesoVentas(false);
  };

  const openModal = (venta) => {
    setCurrentVenta(venta);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentVenta(null);
  };

  const handleEstadoChange = (id, nuevoEstado) => {
    const updatedVentas = ventas.map((venta) =>
      venta.id === id ? { ...venta, estado: nuevoEstado } : venta
    );
    setVentas(updatedVentas);
  };

  const handlePDF = (venta) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Detalle de Venta", 14, 20);

    doc.setFontSize(12);
    doc.text(`Cliente: ${venta.cliente}`, 14, 30);
    doc.text(`Fecha: ${venta.fecha}`, 14, 36);
    doc.text(`Total: $${venta.total.toFixed(2)}`, 14, 42);
    doc.text(`Estado: ${venta.estado}`, 14, 48);

    const productos = venta.productos.map((prod, index) => [
      index + 1,
      prod.nombre,
      prod.cantidad,
      `$${prod.precio.toLocaleString()}`,
      `$${prod.total.toLocaleString()}`,
    ]);

    autoTable(doc, {
      head: [["#", "Producto/Servicio", "Cantidad", "Precio Unitario", "Total"]],
      body: productos,
      startY: 55,
    });

    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    setPdfUrl(pdfUrl);
    setShowPDFModal(true);
  };

  const handleAnularVenta = (id) => {
    const updatedVentas = ventas.map((venta) =>
      venta.id === id ? { ...venta, estado: "Anulada" } : venta
    );
    setVentas(updatedVentas);
    alert("La venta ha sido anulada exitosamente");
  };

  const filteredVentas = ventas.filter((venta) =>
    venta.cliente.toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalPages = Math.ceil(filteredVentas.length / itemsPerPage);
  const displayedVentas = filteredVentas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const changePage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="ventas-container">
      <NavbarAdmin />
      <div className="main-content">
        <h1>Gestión de Ventas</h1>
        {mostrarProcesoVentas ? (
          <ProcesoVentas guardarVenta={guardarVenta} />
        ) : (
          <>
            <div className="header-actions">
              <input
                type="text"
                placeholder="Buscar venta por cliente..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="search-input"
              />
              <button
                className="action-button"
                onClick={() => setMostrarProcesoVentas(true)}
              >
                Agregar Venta
              </button>
            </div>
            <table className="ventas-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {displayedVentas.map((venta) => (
                  <tr key={venta.id}>
                    <td>{venta.fecha}</td>
                    <td>{venta.cliente}</td>
                    <td>${venta.total.toFixed(2)}</td>
                    <td>
                      <select
                        value={venta.estado}
                        onChange={(e) =>
                          handleEstadoChange(venta.id, e.target.value)
                        }
                        className={`estado-select estado-${(venta.estado || "")
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        <option value="En proceso">En proceso</option>
                        <option value="Activa">Activa</option>
                        <option value="Inactiva">Inactiva</option>
                        <option value="Anulada">Anulada</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="table-button"
                        onClick={() => openModal(venta)}
                      >
                        <FaEye />
                      </button>
                      <button
                        className="table-button pdf-button"
                        onClick={() => handlePDF(venta)}
                      >
                        <FaFilePdf />
                      </button>
                      <button
                        className="table-button anular-button"
                        onClick={() => handleAnularVenta(venta.id)}
                      >
                        <FaBan />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => changePage(index + 1)}
                  disabled={currentPage === index + 1}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {showModal && currentVenta && (
        <div className="modal">
          <div className="modal-content">
            <h2>Detalles de la Venta</h2>
            <p>
              <strong>Fecha:</strong> {currentVenta.fecha}
            </p>
            <p>
              <strong>Cliente:</strong> {currentVenta.cliente}
            </p>
            <p>
              <strong>Total:</strong> ${currentVenta.total.toFixed(2)}
            </p>
            <p>
              <strong>Estado:</strong> {currentVenta.estado}
            </p>
            <button className="close-button" onClick={closeModal}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {showPDFModal && pdfUrl && (
        <div className="modal">
          <div className="modal-content pdf-modal">
            <h2>Vista Previa del PDF</h2>
            <iframe
              src={pdfUrl}
              title="Vista previa PDF"
              width="550px"
              height="500px"
              style={{ border: "1px solid #ccc" }}
            />
            <div className="modal-actions">
              <button
                className="close-button"
                onClick={() => {
                  setShowPDFModal(false);
                  URL.revokeObjectURL(pdfUrl);
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

export default Ventas;
