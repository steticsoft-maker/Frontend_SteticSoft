import React, { useState, useEffect } from "react";
import NavbarAdmin from "../../components/NavbarAdmin";
import "./Pedidos.css";

const Pedidos = () => {
  const initialPedidos = [
    {
      id: 1,
      cliente: "Juan Pérez",
      fecha: "2025-04-01",
      total: 150000,
      estado: true, // Activo = true, Cancelado = false
      productos: ["Laptop", "Celular"],
    },
    {
      id: 2,
      cliente: "María Gómez",
      fecha: "2025-03-30",
      total: 80000,
      estado: false,
      productos: ["Sofá", "Mesa"],
    },
  ];

  const [pedidos, setPedidos] = useState(initialPedidos);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "edit" o "details"
  const [currentPedido, setCurrentPedido] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
  }, [pedidos]);

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

  const handleSave = (pedido) => {
    const updatedPedidos = pedidos.map((p) =>
      p.id === currentPedido.id ? { ...currentPedido, ...pedido } : p
    );
    setPedidos(updatedPedidos);
    closeModal();
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

  const filteredPedidos = pedidos.filter((p) =>
    p.cliente.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="pedidos-container">
      <NavbarAdmin />
      <div className="main-content">
        <h1>Gestión de Pedidos</h1>
        <input
          type="text"
          placeholder="Buscar pedido por cliente..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="search-input"
        />
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
                    Ver
                  </button>
                  <button
                    className="table-button"
                    onClick={() => openModal("edit", pedido)}
                  >
                    Editar
                  </button>
                  <button
                    className="table-button delete-button"
                    onClick={() => handleDelete(pedido.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && currentPedido && (
        <div className="modal">
          <div className="modal-content">
            {modalType === "details" ? (
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
                  {currentPedido.estado ? "Activo" : "Cancelado"}
                </p>
                <p>
                  <strong>Productos:</strong>
                </p>
                <ul className="productos-list">
                  {currentPedido.productos.map((producto, index) => (
                    <li key={index}>{producto}</li>
                  ))}
                </ul>
                <button className="close-button" onClick={closeModal}>
                  Cerrar
                </button>
              </>
            ) : (
              <>
                <h2>Editar Pedido</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const pedido = {
                      cliente: formData.get("cliente"),
                      fecha: formData.get("fecha"),
                      total: parseFloat(formData.get("total")),
                    };
                    handleSave(pedido);
                  }}
                >
                  <input
                    type="text"
                    name="cliente"
                    placeholder="Cliente"
                    defaultValue={currentPedido?.cliente || ""}
                    required
                  />
                  <input
                    type="date"
                    name="fecha"
                    defaultValue={currentPedido?.fecha || ""}
                    required
                  />
                  <input
                    type="number"
                    name="total"
                    placeholder="Total"
                    defaultValue={currentPedido?.total || ""}
                    required
                  />
                  <div className="button-group">
                    <button type="submit" className="action-button">
                      Guardar
                    </button>
                    <button className="close-button" onClick={closeModal}>
                      Cancelar
                    </button>
                  </div>
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
