import React, { useState, useEffect } from "react";
import NavbarAdmin from "../../components/NavbarAdmin";
import { FaEye, FaTrash, FaEdit } from "react-icons/fa";
import "./Usuarios.css";

const Usuarios = () => {
  const initialUsuarios = [
    {
      id: 1,
      nombre: "Administrador",
      documento: "123456789",
      email: "Admin@gmail.com",
      telefono: "3200000000",
      direccion: "Calle 123",
      rol: "Administrador",
      anulado: true,
    },
    {
      id: 2,
      nombre: "Pepe",
      documento: "987654321",
      email: "Pepe@gmail.com",
      telefono: "3209999999",
      direccion: "Calle 456",
      rol: "Cliente",
      anulado: true,
    },
  ];

  const [usuarios, setUsuarios] = useState(initialUsuarios);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "create", "edit", "details"
  const [currentUsuario, setCurrentUsuario] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }, [usuarios]);

  const handleSave = (usuario) => {
    if (modalType === "create") {
      setUsuarios([...usuarios, usuario]);
    } else if (modalType === "edit" && currentUsuario) {
      const updatedUsuarios = usuarios.map((u) =>
        u.id === currentUsuario.id ? { ...currentUsuario, ...usuario } : u
      );
      setUsuarios(updatedUsuarios);
    }
    closeModal();
  };

  const openModal = (type, usuario = null) => {
    setModalType(type);
    setCurrentUsuario(usuario);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType("");
    setCurrentUsuario(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      setUsuarios(usuarios.filter((u) => u.id !== id));
    }
  };

  const toggleAnular = (id) => {
    const updatedUsuarios = usuarios.map((u) =>
      u.id === id ? { ...u, anulado: !u.anulado } : u
    );
    setUsuarios(updatedUsuarios);
  };

  const filteredUsuarios = usuarios.filter((u) =>
    u.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="usuarios-container">
      <NavbarAdmin />
      <div className="main-content">
        <h1>Gestión de Usuarios</h1>
        {/* Buscador */}
        <div className="actions-container">
          <input
            type="text"
            placeholder="Buscar usuario..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="search-input"
          />
          <button className="action-button" onClick={() => openModal("create")}>
            Crear Usuario
          </button>
        </div>

        {/* Tabla de usuarios */}
        <table className="usuarios-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Documento</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.nombre}</td>
                <td>{usuario.documento}</td>
                <td>{usuario.email}</td>
                <td>{usuario.telefono}</td>
                <td>{usuario.direccion}</td>
                <td>{usuario.rol}</td>
                <td>
                  {usuario.rol !== "Administrador" ? (
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={usuario.anulado || false}
                        onChange={() => toggleAnular(usuario.id)}
                      />
                      <span className="slider"></span>
                    </label>
                  ) : (
                    <span>No disponible</span>
                  )}
                </td>
                <td>
                  {usuario.rol !== "Administrador" && (
                    <div className="icon-actions">
                      <button
                        className="table-button"
                        onClick={() => openModal("details", usuario)}
                        title="Ver"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="table-button"
                        onClick={() => openModal("edit", usuario)}
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="table-button delete-button"
                        onClick={() => handleDelete(usuario.id)}
                        title="Eliminar"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para Crear/Editar/Detalles */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            {modalType === "details" && currentUsuario ? (
              <>
                <h2>Detalles del Usuario</h2>
                <p>
                  <strong>Nombre:</strong> {currentUsuario.nombre}
                </p>
                <p>
                  <strong>Documento:</strong> {currentUsuario.documento}
                </p>
                <p>
                  <strong>Email:</strong> {currentUsuario.email}
                </p>
                <p>
                  <strong>Teléfono:</strong> {currentUsuario.telefono}
                </p>
                <p>
                  <strong>Dirección:</strong> {currentUsuario.direccion}
                </p>
                <p>
                  <strong>Rol:</strong> {currentUsuario.rol}
                </p>
                <p>
                  <strong>Estado:</strong>{" "}
                  {currentUsuario.anulado ? "Sí" : "No"}
                </p>
                <button className="cancel-button" onClick={closeModal}>
                  Cerrar
                </button>
              </>
            ) : (
              <>
                <h2>
                  {modalType === "create" ? "Crear Usuario" : "Editar Usuario"}
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const usuario = {
                      id: currentUsuario ? currentUsuario.id : Date.now(),
                      nombre: formData.get("nombre"),
                      documento: formData.get("documento"),
                      email: formData.get("email"),
                      telefono: formData.get("telefono"),
                      direccion: formData.get("direccion"),
                      rol: formData.get("rol"),
                      anulado: currentUsuario?.anulado || false,
                    };
                    handleSave(usuario);
                  }}
                >
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    defaultValue={currentUsuario?.nombre || ""}
                    required
                  />
                  <input
                    type="text"
                    name="documento"
                    placeholder="Documento"
                    defaultValue={currentUsuario?.documento || ""}
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    defaultValue={currentUsuario?.email || ""}
                    required
                  />
                  <input
                    type="text"
                    name="telefono"
                    placeholder="Teléfono"
                    defaultValue={currentUsuario?.telefono || ""}
                    required
                  />
                  <input
                    type="text"
                    name="direccion"
                    placeholder="Dirección"
                    defaultValue={currentUsuario?.direccion || ""}
                    required
                  />
                  <select
                    name="rol"
                    defaultValue={currentUsuario?.rol || ""}
                    required
                  >
                    <option value="" disabled>
                      Seleccionar rol
                    </option>
                    <option value="Empleado">Empleado</option>
                    <option value="Cliente">Cliente</option>
                  </select>
                  <button type="submit" className="save-button">
                    Guardar
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={closeModal}
                  >
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

export default Usuarios;
