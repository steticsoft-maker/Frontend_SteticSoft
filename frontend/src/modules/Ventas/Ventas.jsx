import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaFilePdf, FaBan } from "react-icons/fa";
import NavbarAdmin from "../../components/NavbarAdmin/NavbarAdmin";
import "./Ventas.css";

const Ventas = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
      items: [
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
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    localStorage.setItem("ventas", JSON.stringify(ventas));
  }, [ventas]);

  useEffect(() => {
    if (location.state && location.state.nuevaVenta) {
      const { nuevaVenta } = location.state;
      const newId = ventas.length > 0 ? Math.max(...ventas.map((v) => v.id)) + 1 : 1;
      const ventaConId = { ...nuevaVenta, id: newId, estado: nuevaVenta.estado || "Activa" };

      setVentas((prevVentas) => [...prevVentas, ventaConId]);
      alert("¡Venta guardada exitosamente!");

      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, ventas]);

  
  const handleShowDetails = (id) => {
    navigate(`/ventas/${id}/detalle`);
  };

  const handleEstadoChange = (id, nuevoEstado) => {
    const updatedVentas = ventas.map((venta) =>
      venta.id === id ? { ...venta, estado: nuevoEstado } : venta
    );
    setVentas(updatedVentas);
  };

  
  const handlePDF = (id) => {
    navigate(`/ventas/${id}/pdf`);
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
                        onClick={() => handleShowDetails(venta.id)} 
                        title="Ver detalles"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="botonPdfVenta"
                        onClick={() => handlePDF(venta.id)} 
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
    </div>
  );
};

export default Ventas;