import React, { useState, useEffect } from "react";
import { FaEye, FaTrash } from "react-icons/fa"; // Importar íconos
import NavbarAdmin from "../../components/NavbarAdmin";
import "./Pedidos.css";

const Pedidos = () => {
  const initialPedidos = [
    { id: 1, cliente: "Cliente A", fecha: "2025-04-01", total: 50000, estado: true },
    { id: 2, cliente: "Cliente B", fecha: "2025-04-02", total: 75000, estado: false },
  ];

  const initialProductos = [
    { id: 1, nombre: "Producto A", precio: 10000 },
    { id: 2, nombre: "Producto B", precio: 20000 },
    { id: 3, nombre: "Producto C", precio: 15000 },
  ];

  const [pedidos, setPedidos] = useState(initialPedidos);
  const [productos] = useState(initialProductos);
  const [selectedProductos, setSelectedProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "create", "details"
  const [currentPedido, setCurrentPedido] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
  }, [pedidos]);

  const handleSave = (pedido) => {
    if (modalType === "create") {
      const total = selectedProductos.reduce((acc, prod) => acc + prod.precio, 0);
      setPedidos([
        ...pedidos,
        { ...pedido, id: Date.now(), total, productos: selectedProductos },
      ]);
    }
    setSelectedProductos([]);
    closeModal();
  };

  const openModal = (type, pedido = null) => {
    setModalType(type);
    setCurrentPedido(pedido);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType("");
    setCurrentPedido(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este pedido?")) {
      setPedidos(pedidos.filter((p) => p.id !== id));
    }
  };

  const toggleEstado = (id) => {
    const updatedPedidos = pedidos.map((p) =>
      p.id === id ? { ...p, estado: !p.estado } : p
    );
    setPedidos(updatedPedidos);
  };

  const handleProductSelect = (id) => {
    const product = productos.find((p) => p.id === id);
    if (!selectedProductos.includes(product)) {
      setSelectedProductos([...selectedProductos, product]);
    }
  };

  const handleProductRemove = (id) => {
    setSelectedProductos(selectedProductos.filter((p) => p.id !== id));
  };

  // Filtrar pedidos según la búsqueda
  const filteredPedidos = pedidos.filter((pedido) =>
    pedido.cliente.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pedidos-container">
      <NavbarAdmin />
      <div className="main-content">
        <h1>Gestión de Pedidos</h1>
        <input
          type="text"
          placeholder="Buscar por cliente..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button className="action-button" onClick={() => openModal("create")}>
          Agregar Pedido
        </button>
        <table className="pedidos-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredPedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td>{pedido.cliente}</td>
                <td>{pedido.fecha}</td>
                <td>{pedido.total}</td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={pedido.estado}
                      onChange={() => toggleEstado(pedido.id)}
                    />
                    <span className="slider"></span>
                  </label>
                </td>
                <td>
                  <button
                    className="table-button"
                    onClick={() => openModal("details", pedido)}
                  >
                    <FaEye /> {/* Ícono para "Ver" */}
                  </button>
                  <button
                    className="table-button delete-button"
                    onClick={() => handleDelete(pedido.id)}
                  >
                    <FaTrash /> {/* Ícono para "Eliminar" */}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            {modalType === "details" && currentPedido ? (
              <>
                <h2>Detalles del Pedido</h2>
                <p>
                  <strong>Cliente:</strong> {currentPedido.cliente}
                </p>
                <p>
                  <strong>Fecha:</strong> {currentPedido.fecha}
                </p>
                <p>
                  <strong>Total:</strong> {currentPedido.total}
                </p>
                <p>
                  <strong>Estado:</strong>{" "}
                  {currentPedido.estado ? "Activo" : "Inactivo"}
                </p>
                <button className="close-button" onClick={closeModal}>
                  Cerrar
                </button>
              </>
            ) : (
              <>
                <h2>Agregar Pedido</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const pedido = {
                      cliente: formData.get("cliente"),
                      fecha: formData.get("fecha"),
                      estado: true,
                    };
                    handleSave(pedido);
                  }}
                >
                  <input type="text" name="cliente" placeholder="Cliente" required />
                  <input type="date" name="fecha" required />
                  <h3>Productos</h3>
                  <select
                    onChange={(e) =>
                      handleProductSelect(parseInt(e.target.value, 10))
                    }
                  >
                    <option value="">Seleccionar producto</option>
                    {productos.map((producto) => (
                      <option key={producto.id} value={producto.id}>
                        {producto.nombre} - ${producto.precio}
                      </option>
                    ))}
                  </select>
                  <ul>
                    {selectedProductos.map((producto) => (
                      <li key={producto.id}>
                        {producto.nombre} - ${producto.precio}{" "}
                        <button onClick={() => handleProductRemove(producto.id)}>
                          Eliminar
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button type="submit" className="action-button">
                    Guardar
                  </button>
                  <button className="close-button" onClick={closeModal}>
                    Cancelar
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Pedidos;
