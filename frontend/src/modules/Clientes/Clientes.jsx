import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import NavbarAdmin from "../../components/NavbarAdmin/NavbarAdmin";
import "./Clientes.css";

const Clientes = () => {
  const initialClientes = [
    {
      id: 1,
      nombre: "Juan",
      apellido: "Pérez",
      email: "juan.perez@gmail.com",
      telefono: "3211234567",
      direccion: "Calle Principal 123",
      tipoDocumento: "Cédula",
      numeroDocumento: "123456789",
      ciudad: "Bogotá",
      fechaNacimiento: "1990-01-01",
      password: "12345",
      estado: true, // Activo = true, Inactivo = false
    },
    {
      id: 2,
      nombre: "María",
      apellido: "Gómez",
      email: "maria.gomez@gmail.com",
      telefono: "3129876543",
      direccion: "Carrera Secundaria 456",
      tipoDocumento: "Pasaporte",
      numeroDocumento: "987654321",
      ciudad: "Medellín",
      fechaNacimiento: "1985-05-20",
      password: "54321",
      estado: true,
    },
  ];

  const [clientes, setClientes] = useState(initialClientes);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "edit", "details" o "create"
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
    if (modalType === "create") {
      setClientes([...clientes, { ...cliente, id: Date.now(), estado: true }]);
    } else {
      const updatedClientes = clientes.map((c) =>
        c.id === currentCliente.id ? { ...currentCliente, ...cliente } : c
      );
      setClientes(updatedClientes);
    }
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
    `${c.nombre} ${c.apellido}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="clientes-container">
      <NavbarAdmin />
      <div className="main-content-clientes">
        <h1>Gestión de Clientes</h1>
        <div className="containerAgregarbuscarClientes">
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="barraBusquedaClientesInput"
          />
          <button className="buttonAgregarcliente" onClick={() => openModal("create")}>
            Agregar Cliente
          </button>
        </div>
        <table className="tablaClientes">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Correo</th>
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
                <td>{cliente.apellido}</td>
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
                    className="iconsTablaclientes"
                    onClick={() => openModal("details", cliente)}
                    title="Ver"
                  >
                    <FaEye />
                  </button>
                  <button
                    className="iconsTablaclientes"
                    onClick={() => openModal("edit", cliente)}
                    title="Editar"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="iconsTablaclientes delete-button-elimnarCliente"
                    onClick={() => handleDelete(cliente.id)}
                    title="Eliminar"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-clientes">
          <div className="modal-content-clientes">
            {modalType === "details" && currentCliente ? (
              <>
                <h2>Detalles del Cliente</h2>
                <p>
                  <strong>Nombre:</strong> {currentCliente.nombre}
                </p>
                <p>
                  <strong>Apellido:</strong> {currentCliente.apellido}
                </p>
                <p>
                  <strong>Correo:</strong> {currentCliente.email}
                </p>
                <p>
                  <strong>Teléfono:</strong> {currentCliente.telefono}
                </p>
                <p>
                  <strong>Dirección:</strong> {currentCliente.direccion}
                </p>
                <p>
                  <strong>Tipo de Documento:</strong> {currentCliente.tipoDocumento}
                </p>
                <p>
                  <strong>Número de Documento:</strong> {currentCliente.numeroDocumento}
                </p>
                <p>
                  <strong>Ciudad:</strong> {currentCliente.ciudad}
                </p>
                <p>
                  <strong>Fecha de Nacimiento:</strong> {currentCliente.fechaNacimiento}
                </p>
                <p>
                  <strong>Estado:</strong>{" "}
                  {currentCliente.estado ? "Activo" : "Inactivo"}
                </p>
                <button className="botonModalCancelar-Cerrar" onClick={closeModal}>
                  Cerrar
                </button>
              </>
            ) : modalType === "create" ? (
              <>
                <h2>Agregar Cliente</h2>
                <form
                  className="formularioModalClientes"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const cliente = {
                      nombre: formData.get("nombre"),
                      apellido: formData.get("apellido"),
                      email: formData.get("email"),
                      telefono: formData.get("telefono"),
                      direccion: formData.get("direccion"),
                      tipoDocumento: formData.get("tipoDocumento"),
                      numeroDocumento: formData.get("numeroDocumento"),
                      ciudad: formData.get("ciudad"),
                      fechaNacimiento: formData.get("fechaNacimiento"),
                      password: formData.get("password"),
                    };
                    handleSave(cliente);
                  }}
                > <div className="formularioModalInputClientes">
                  <input type="text" name="nombre" placeholder="Nombre" required />
                  <input type="text" name="apellido" placeholder="Apellido" required />
                  <input type="email" name="email" placeholder="Correo" required />
                  <input type="text" name="telefono" placeholder="Teléfono" required />
                  <input type="text" name="direccion" placeholder="Dirección" required />
                  <input type="text" name="tipoDocumento" placeholder="Tipo de Documento" required />
                  <input type="text" name="numeroDocumento" placeholder="Número de Documento" required />
                  <input type="text" name="ciudad" placeholder="Ciudad" required />
                  <input type="date" name="fechaNacimiento" placeholder="Fecha de Nacimiento" required />
                  <input type="password" name="password" placeholder="Contraseña" required />
                  </div>
                  <div>
                  <button type="submit" className="botonguardarClienteModal">
                    Guardar
                  </button>
                  <button className="botonModalCancelar-Cerrar" onClick={closeModal}>
                    Cancelar
                  </button>
                  </div>
                </form>
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
                      apellido: formData.get("apellido"),
                      email: formData.get("email"),
                      telefono: formData.get("telefono"),
                      direccion: formData.get("direccion"),
                      tipoDocumento: formData.get
                      ("tipoDocumento"),
                      numeroDocumento: formData.get("numeroDocumento"),
                      ciudad: formData.get("ciudad"),
                      fechaNacimiento: formData.get("fechaNacimiento"),
                      password: formData.get("password"),
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
                    type="text"
                    name="apellido"
                    placeholder="Apellido"
                    defaultValue={currentCliente?.apellido || ""}
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Correo"
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
                  <input
                    type="text"
                    name="tipoDocumento"
                    placeholder="Tipo de Documento"
                    defaultValue={currentCliente?.tipoDocumento || ""}
                    required
                  />
                  <input
                    type="text"
                    name="numeroDocumento"
                    placeholder="Número de Documento"
                    defaultValue={currentCliente?.numeroDocumento || ""}
                    required
                  />
                  <input
                    type="text"
                    name="ciudad"
                    placeholder="Ciudad"
                    defaultValue={currentCliente?.ciudad || ""}
                    required
                  />
                  <input
                    type="date"
                    name="fechaNacimiento"
                    placeholder="Fecha de Nacimiento"
                    defaultValue={currentCliente?.fechaNacimiento || ""}
                    required
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    defaultValue={currentCliente?.password || ""}
                    required
                  />
                  <button type="submit" className="botonguardarClienteModal">
                    Guardar
                  </button>
                  <button className="botonModalCancelar-Cerrar" onClick={closeModal}>
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
