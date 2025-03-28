import React, { useState, useEffect } from "react";
import NavbarAdmin from "../../components/NavbarAdmin";
import "./Ventas.css";

const Ventas = () => {
  const initialVentas = [
    {
      id: 1,
      fecha: "2025-03-28",
      cliente: "Juan Pérez",
      total: 50000,
      estado: true, // True = Activa, False = Anulada
    },
    {
      id: 2,
      fecha: "2025-03-29",
      cliente: "María Gómez",
      total: 120000,
      estado: true,
    },
  ];

  const [ventas, setVentas] = useState(initialVentas);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3); // Ventas por página
  const [showModal, setShowModal] = useState(false);
  const [currentVenta, setCurrentVenta] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    localStorage.setItem("ventas", JSON.stringify(ventas));
  }, [ventas]);

  const openModal = (venta) => {
    setCurrentVenta(venta);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentVenta(null);
  };

  const toggleEstado = (id) => {
    const updatedVentas = ventas.map((v) =>
      v.id === id ? { ...v, estado: !v.estado } : v
    );
    setVentas(updatedVentas);
  };

  const handlePDF = (venta) => {
    // Aquí puedes usar una librería como jsPDF para generar el PDF
    alert(`Generar PDF para la venta de ${venta.cliente} con ID ${venta.id}.`);
  };

  const filteredVentas = ventas.filter((v) =>
    v.cliente.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Paginación
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
        <input
          type="text"
          placeholder="Buscar venta por cliente..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="search-input"
        />
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
                <td>{venta.total}</td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={venta.estado}
                      onChange={() => toggleEstado(venta.id)}
                    />
                    <span className="slider"></span>
                  </label>
                </td>
                <td>
                  <button
                    className="table-button"
                    onClick={() => openModal(venta)}
                  >
                    Detalles
                  </button>
                  <button
                    className="table-button pdf-button"
                    onClick={() => handlePDF(venta)}
                  >
                    PDF
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
              <strong>Total:</strong> {currentVenta.total}
            </p>
            <p>
              <strong>Estado:</strong>{" "}
              {currentVenta.estado ? "Activa" : "Anulada"}
            </p>
            <button className="close-button" onClick={closeModal}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ventas;
