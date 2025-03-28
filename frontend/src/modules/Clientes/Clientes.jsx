import React, { useState, useEffect } from "react";
import NavbarAdmin from "../../components/NavbarAdmin";
import "./Clientes.css";

const Clientes = () => {
  const initialClientes = [
    {
      id: 1,
      nombre: "Juan Pérez",
      email: "juan.perez@gmail.com",
      telefono: "3211234567",
      direccion: "Calle Principal 123",
      estado: true, // Activo = true, Inactivo = false
    },
    {
      id: 2,
      nombre: "María Gómez",
      email: "maria.gomez@gmail.com",
      telefono: "3129876543",
      direccion: "Carrera Secundaria 456",
      estado: true,
    },
  ];

  const [clientes, setClientes] = useState(initialClientes);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "edit" o "details"
  const [currentCliente, setCurrentCliente] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    localStorage.setItem("clientes", JSON.stringify(clientes));
  }, [clientes]);

  const openModal = (type, cliente = null) => {
    setModalType(type);
    setCurrentCliente(cliente);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType("");
    setCurrentCliente(null);
  };

  const handleSave = (cliente) => {
    const updatedClientes = clientes.map((c) =>
      c.id === currentCliente.id ? { ...currentCliente, ...cliente } : c
    );
    setClientes(updatedClientes);
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
      setClientes(clientes.filter((c) => c.id !== id));
    }
  };

  const toggleEstado = (id) => {
    const updatedClientes = clientes.map((c) =>
      c.id === id ? { ...c, estado: !c.estado } : c
    );
    setClientes(updatedClientes);
  };

  const filteredClientes = clientes.filter((c) =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="clientes-container">
      <NavbarAdmin />
      <div className="main-content">
        <h1>Gestión de Clientes</h1>
        <input
          type="text"
          placeholder="Buscar cliente..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="search-input"
        />
        <table className="clientes-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredClientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.nombre}</td>
                <td>{cliente.email}</td>
                <td>{cliente.telefono}</td>
                <td>{cliente.direccion}</td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={cliente.estado}
                      onChange={() => toggleEstado(cliente.id)}
                    />
                    <span className="slider"></span>
                  </label>
                </td>
                <td>
                  <button
                    className="table-button"
                    onClick={() => openModal("details", cliente)}
                  >
                    Ver
                  </button>
                  <button
                    className="table-button"
                    onClick={() => openModal("edit", cliente)}
                  >
                    Editar
                  </button>
                  <button
                    className="table-button delete-button"
                    onClick={() => handleDelete(cliente.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && currentCliente && (
        <div className="modal">
          <div className="modal-content">
            {modalType === "details" ? (
              <>
                <h2>Detalles del Cliente</h2>
                <p>
                  <strong>Nombre:</strong> {currentCliente.nombre}
                </p>
                <p>
                  <strong>Email:</strong> {currentCliente.email}
                </p>
                <p>
                  <strong>Teléfono:</strong> {currentCliente.telefono}
                </p>
                <p>
                  <strong>Dirección:</strong> {currentCliente.direccion}
                </p>
                <p>
                  <strong>Estado:</strong>{" "}
                  {currentCliente.estado ? "Activo" : "Inactivo"}
                </p>
                <button className="close-button" onClick={closeModal}>
                  Cerrar
                </button>
              </>
            ) : (
              <>
                <h2>Editar Cliente</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const cliente = {
                      nombre: formData.get("nombre"),
                      email: formData.get("email"),
                      telefono: formData.get("telefono"),
                      direccion: formData.get("direccion"),
                    };
                    handleSave(cliente);
                  }}
                >
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    defaultValue={currentCliente?.nombre || ""}
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    defaultValue={currentCliente?.email || ""}
                    required
                  />
                  <input
                    type="text"
                    name="telefono"
                    placeholder="Teléfono"
                    defaultValue={currentCliente?.telefono || ""}
                    required
                  />
                  <input
                    type="text"
                    name="direccion"
                    placeholder="Dirección"
                    defaultValue={currentCliente?.direccion || ""}
                    required
                  />
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

export default Clientes;
