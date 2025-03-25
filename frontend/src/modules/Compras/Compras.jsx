import React, { useState } from "react";
import NavbarAdmin from "../../components/NavbarAdmin";
import "./Compras.css";

const Compras = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCompra, setSelectedCompra] = useState(null);
  const [productos, setProductos] = useState([]);
  const [compras, setCompras] = useState([
    { id: "001", proveedor: "Proveedor A", fecha: "24/03/2025", total: "$500,000", estado: "Completado" },
    { id: "002", proveedor: "Proveedor B", fecha: "22/03/2025", total: "$320,000", estado: "Pendiente" },
  ]);

  const [compra, setCompra] = useState({
    proveedor: "",
    nit: "",
    telefono: "",
    correo: "",
    direccion: ""  // Nuevo campo agregado
  });
  

  // Función para alternar el modal de agregar compras
  const toggleModal = () => {
    setShowModal(!showModal);
    if (!showModal) {
      setCompra({ proveedor: "", nit: "", telefono: "", correo: "" });
      setProductos([]);
    }
  };

  const handleChange = (e) => {
    setCompra({ ...compra, [e.target.name]: e.target.value });
  };

  const agregarProducto = () => {
    setProductos([...productos, { id: Date.now(), nombre: "", cantidad: 1, precio: 0 }]);
  };

  const eliminarProducto = (id) => {
    setProductos(productos.filter((producto) => producto.id !== id));
  };

  const handleProductoChange = (id, e) => {
    const { name, value } = e.target;
    setProductos(
      productos.map((producto) =>
        producto.id === id ? { ...producto, [name]: value } : producto
      )
    );
  };

  // Función para confirmar anulación y actualizar el estado
  const handleAnular = (id) => {
    const confirmacion = window.confirm(`¿Estás seguro de que deseas anular la compra con ID ${id}?`);
    if (confirmacion) {
      setCompras((prevCompras) =>
        prevCompras.map((compra) =>
          compra.id === id ? { ...compra, estado: "Anulada" } : compra
        )
      );
      alert(`Compra con ID ${id} anulada correctamente.`);
    }
  };

  // Función para simular la generación de PDF
  const handleGenerarPDF = (id) => {
    alert(`Se está generando el PDF de la compra con ID ${id}...`);
  };

  // Función para mostrar detalles en el modal
  const handleVerDetalles = (compra) => {
    setSelectedCompra(compra);
    setShowDetails(true);
  };

  return (
    <div className="compras-container">
      <NavbarAdmin />
      <div className="compras-content">
        <h2 className="title-h2">Gestión de Compras</h2>

        {/* Barra de búsqueda */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar compra..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="compras-buttons">
          <button className="btn success" onClick={toggleModal}>Agregar Compra</button>
        </div>

        <div className="compras-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Proveedor</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {compras.map((compra) => (
                <tr key={compra.id}>
                  <td>{compra.id}</td>
                  <td>{compra.proveedor}</td>
                  <td>{compra.fecha}</td>
                  <td>{compra.total}</td>
                  <td className={`estado ${compra.estado.toLowerCase()}`}>{compra.estado}</td>
                  <td className="acciones">
                    {compra.estado !== "Anulada" && (
                      <button className="btn danger" onClick={() => handleAnular(compra.id)}>Anular</button>
                    )}
                    <button className="btn warning" onClick={() => handleGenerarPDF(compra.id)}>PDF</button>
                    <button className="btn info" onClick={() => handleVerDetalles(compra)}>Detalles</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal para agregar compra */}
{showModal && (
  <div className="modal">
    <div className="modal-content">
      <h3>Registrar Compra</h3>

      <label>Proveedor:</label>
      <input type="text" name="proveedor" value={compra.proveedor} onChange={handleChange} />

      <label>NIT:</label>
      <input type="text" name="nit" value={compra.nit} onChange={handleChange} />

      <label>Teléfono:</label>
      <input type="text" name="telefono" value={compra.telefono} onChange={handleChange} />

      <label>Correo:</label>
      <input type="email" name="correo" value={compra.correo} onChange={handleChange} />

      <label>Dirección:</label>  {/* Nuevo input */}
      <input type="text" name="direccion" value={compra.direccion} onChange={handleChange} />

      <h4>Productos</h4>
      {productos.map((producto) => (
        <div key={producto.id} className="producto-item">
          <input type="text" name="nombre" placeholder="Nombre" value={producto.nombre} onChange={(e) => handleProductoChange(producto.id, e)} />
          <input type="number" name="cantidad" placeholder="Cantidad" value={producto.cantidad} onChange={(e) => handleProductoChange(producto.id, e)} />
          <input type="number" name="precio" placeholder="Precio" value={producto.precio} onChange={(e) => handleProductoChange(producto.id, e)} />
          <button className="btn danger" onClick={() => eliminarProducto(producto.id)}>X</button>
        </div>
      ))}

      <button className="btn success" onClick={agregarProducto}>Agregar Producto</button>
      <div className="modal-buttons">
        <button className="btn primary" onClick={toggleModal} >Registrar Compra</button>
        <button className="btn danger" onClick={toggleModal}>Cancelar</button>
      </div>
    </div>
  </div>
)}


        {/* Modal para ver detalles */}
        {showDetails && selectedCompra && (
          <div className="modal-detalle">
            <div className="modal-content-detalle">
              <h3>Detalles de la Compra</h3>
              <p><strong>ID:</strong> {selectedCompra.id}</p>
              <p><strong>Proveedor:</strong> {selectedCompra.proveedor}</p>
              <p><strong>Fecha:</strong> {selectedCompra.fecha}</p>
              <p><strong>Total:</strong> {selectedCompra.total}</p>
              <p><strong>Estado:</strong> {selectedCompra.estado}</p>
              <button className="btn close" onClick={() => setShowDetails(false)}>Cerrar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Compras;
