import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Importa useLocation
import { FaEye, FaFilePdf, FaBan } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import NavbarAdmin from "../../components/NavbarAdmin/NavbarAdmin";
// import ProcesoVentas from "./ProcesoVentas"; // Ya no necesitas importar ProcesoVentas aquí directamente si lo manejas por ruta
import "./Ventas.css";
// import "./ProcesoVentas.css"; // Quítalo si ProcesoVentas tiene su propio CSS y no se renderiza como hijo directo

const Ventas = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Hook para acceder al estado de la navegación

  const initialVentas = [
    {
      id: 1,
      fecha: "2025-03-28",
      cliente: "Juan Pérez",
      documento: "123456789",
      telefono: "3001234567",
      direccion: "Calle 1",
      total: 50000,
      estado: "Activa",
      items: [ // Asegúrate de que sea 'items'
        { nombre: "Producto A", cantidad: 2, precio: 10000, total: 20000 },
        { nombre: "Servicio C", cantidad: 1, precio: 30000, total: 30000 },
      ],
      subtotal: 42016.81,
      iva: 7983.19,
    },
    {
      id: 2,
      fecha: "2025-03-29",
      cliente: "María Gómez",
      documento: "987654321",
      telefono: "3019876543",
      direccion: "Carrera 2",
      total: 120000,
      estado: "En proceso",
      items: [
        { nombre: "Producto C", cantidad: 1, precio: 120000, total: 120000 },
      ],
      subtotal: 100840.34,
      iva: 19159.66,
    },
  ];

  const [ventas, setVentas] = useState(() => {
    const storedVentas = localStorage.getItem("ventas");
    return storedVentas ? JSON.parse(storedVentas) : initialVentas;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedVenta, setSelectedVenta] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  // const [mostrarProcesoVentas, setMostrarProcesoVentas] = useState(false); // Este estado ya no es necesario aquí
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  // useEffect para cargar y guardar en localStorage (sin cambios importantes)
  useEffect(() => {
    localStorage.setItem("ventas", JSON.stringify(ventas));
  }, [ventas]);

  // Nuevo useEffect para verificar si hay una nueva venta en el estado de la navegación
  useEffect(() => {
    if (location.state && location.state.nuevaVenta) {
      const { nuevaVenta } = location.state;
      // Generar un ID único para la nueva venta
      const newId = ventas.length > 0 ? Math.max(...ventas.map(v => v.id)) + 1 : 1;
      const ventaConId = { ...nuevaVenta, id: newId, estado: nuevaVenta.estado || "Activa" }; // Asigna estado o usa "Activa"

      setVentas((prevVentas) => [...prevVentas, ventaConId]);
      alert("¡Venta guardada exitosamente!");

      // Limpiar el estado de la navegación para evitar que se guarde dos veces
      // al recargar la página o al volver a visitar la ruta
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, ventas]); // Dependencias para el useEffect

  // handleShowDetails, closeDetailsModal, handleEstadoChange, handlePDF, handleAnularVenta (sin cambios)
  const handleShowDetails = (venta) => {
    setSelectedVenta(venta);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedVenta(null);
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
    doc.text(`Documento: ${venta.documento || 'N/A'}`, 14, 36);
    doc.text(`Teléfono: ${venta.telefono || 'N/A'}`, 14, 42);
    doc.text(`Dirección: ${venta.direccion || 'N/A'}`, 14, 48);
    doc.text(`Subtotal: $${venta.subtotal.toFixed(2)}`, 14, 54);
    doc.text(`IVA (19%): $${venta.iva.toFixed(2)}`, 14, 60);
    doc.text(`Total: $${venta.total.toFixed(2)}`, 14, 66);
    doc.text(`Estado: ${venta.estado}`, 14, 72);

    const items = venta.items.map((item, index) => [
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
      <div className="ventasContent">
        <h1>Gestión de Ventas</h1>
          <>
            <div className="barraBotonContainer">
              <input
                type="text"
                placeholder="Buscar venta por cliente..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="barraBusquedaVenta"
              />
              <button
                className="botonAgregarVenta"
                onClick={() => navigate("/procesoventas")}
              >
                Agregar Venta
              </button>
            </div>

            <table className="ventas-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {displayedVentas.map((venta, index) => (
                  <tr key={venta.id}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
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
                      <div className="accionesTablaVentas">
                        <button
                          className="botonDetalleVenta"
                          onClick={() => handleShowDetails(venta)}
                          title="Ver detalles"
                        >
                          <FaEye />
                        </button>
                        <button
                          className="botonPdfVenta"
                          onClick={() => handlePDF(venta)}
                          title="Generar PDF"
                        >
                          <FaFilePdf />
                        </button>
                        <button
                          className="botonAnularVenta"
                          onClick={() => handleAnularVenta(venta.id)}
                          title="Anular venta"
                        >
                          <FaBan />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Paginación */}
            <div className="paginacionVenta">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => changePage(i + 1)}
                  className={currentPage === i + 1 ? "active" : ""}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </>
      </div>

      {/* Modals (sin cambios) */}
      {showDetailsModal && selectedVenta && (
        <div className="modal-ventas">
          <div className="modal-content-ventas">
            <h2>Detalle de Venta</h2>
            <p><strong>Cliente:</strong> {selectedVenta.cliente}</p>
            <p><strong>Documento:</strong> {selectedVenta.documento || 'N/A'}</p>
            <p><strong>Teléfono:</strong> {selectedVenta.telefono || 'N/A'}</p>
            <p><strong>Dirección:</strong> {selectedVenta.direccion || 'N/A'}</p>
            <p><strong>Fecha:</strong> {selectedVenta.fecha}</p>
            <p><strong>Subtotal:</strong> ${selectedVenta.subtotal.toFixed(2)}</p>
            <p><strong>IVA (19%):</strong> ${selectedVenta.iva.toFixed(2)}</p>
            <p><strong>Total:</strong> ${selectedVenta.total.toFixed(2)}</p>
            <p><strong>Estado:</strong> {selectedVenta.estado}</p>

            <table className="tablaDetallesVentas">
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
                {selectedVenta.items.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.nombre}</td>
                    <td>{item.cantidad}</td>
                    <td>${item.precio.toLocaleString()}</td>
                    <td>${(item.precio * item.cantidad).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              className="botonCerrarDetallesVenta"
              onClick={closeDetailsModal}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {showPDFModal && pdfUrl && (
        <div className="modal-ventas">
          <div className="modal-content-ventas">
            <h2>Vista Previa del PDF</h2>
            <iframe
              src={pdfUrl}
              title="Vista previa PDF"
              width="550px"
              height="500px"
              style={{ border: "1px solid #ccc" }}
            />
            <div className="modal-ventas-buttons">
              <button
                className="botonCerrarModalPDF"
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