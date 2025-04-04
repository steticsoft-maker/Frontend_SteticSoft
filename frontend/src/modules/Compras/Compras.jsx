import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faFilePdf, faBan } from "@fortawesome/free-solid-svg-icons";
import NavbarAdmin from "../../components/NavbarAdmin";
import "./Compras.css";

const Compras = () => {
  const navigate = useNavigate(); // Inicializa el hook de navegación
  const [searchTerm, setSearchTerm] = useState("");
  const [compras, setCompras] = useState([
    { proveedor: "Proveedor A", fecha: "24/03/2025", total: "$500,000", estado: "Completado", productos: [] },
    { proveedor: "Proveedor B", fecha: "22/03/2025", total: "$320,000", estado: "Pendiente", productos: [] },
  ]);

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCompra, setSelectedCompra] = useState(null);

  const handleAnular = (index) => {
    if (window.confirm("¿Está seguro de que desea anular esta compra?")) {
      const updatedCompras = [...compras];
      updatedCompras[index].estado = "Anulada";
      setCompras(updatedCompras);
    }
  };

  const handleGenerarPDF = () => {
    alert("Función de generación de PDF en desarrollo.");
  };

  const handleShowDetails = (compra) => {
    setSelectedCompra(compra);
    setShowDetailsModal(true);
  };

  const handleEstadoChange = (index) => {
    const updatedCompras = [...compras];
    updatedCompras[index].estado = updatedCompras[index].estado === "Pendiente" ? "Completado" : "Pendiente";
    setCompras(updatedCompras);
  };

  return (
    <div className="compras-container">
      <NavbarAdmin />
      <div className="compras-content">
        <h2 className="title-h2">Gestión de Compras</h2>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar compra..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="compras-buttons">
          <button className="btn success" onClick={() => navigate("/agregar-compra")}>
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
                  compra.proveedor.toLowerCase().includes(searchTerm.toLowerCase())
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
                      <button className="btnVerCompra" onClick={() => handleShowDetails(compra)} title="Ver detalles">
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button className="btnPDFCompra" onClick={handleGenerarPDF} title="Generar PDF">
                        <FontAwesomeIcon icon={faFilePdf} />
                      </button>
                      {compra.estado !== "Anulada" && (
                        <button className="btn danger" onClick={() => handleAnular(index)} title="Anular compra">
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
    </div>
  );
};

export default Compras;
