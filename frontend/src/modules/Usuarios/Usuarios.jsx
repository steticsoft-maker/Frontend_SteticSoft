import React, { useState, useEffect } from "react";
import NavbarAdmin from "../../components/NavbarAdmin";
import "./Usuarios.css";

const Usuarios = () => {
  // Usuarios pre-registrados
  const initialUsuarios = [
    {
      id: 1,
      nombre: "Administrador",
      documento: "123456789",
      email: "Admin@gmail.com",
      telefono: "3200000000",
      direccion: "Calle Principal 123",
      rol: "Administrador",
      anulado: false,
    },
    {
      id: 2,
      nombre: "Pepe",
      documento: "987654321",
      email: "Pepe@gmail.com",
      telefono: "3209999999",
      direccion: "Calle Secundaria 456",
      rol: "Cliente",
      anulado: false,
    },
  ];

  const [usuarios, setUsuarios] = useState(initialUsuarios);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "create", "edit", "details"
  const [currentUsuario, setCurrentUsuario] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  // Guardar usuarios en LocalStorage cuando cambie el estado
  useEffect(() => {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }, [usuarios]);

  // Manejar creación/edición de usuarios
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

  // Abrir modal
  const openModal = (type, usuario = null) => {
    setModalType(type);
    setCurrentUsuario(usuario);
    setShowModal(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setShowModal(false);
    setModalType("");
    setCurrentUsuario(null);
  };

  // Eliminar un usuario
  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      setUsuarios(usuarios.filter((u) => u.id !== id));
    }
  };

  // Cambiar estado del usuario (anulado/activo)
  const toggleAnular = (id) => {
    const updatedUsuarios = usuarios.map((u) =>
      u.id === id ? { ...u, anulado: !u.anulado } : u
    );
    setUsuarios(updatedUsuarios);
  };

  // Filtrar usuarios por búsqueda
  const filteredUsuarios = usuarios.filter((u) =>
    u.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="usuarios-container">
      <NavbarAdmin />
      <div className="main-content">
        <h1>Gestión de Usuarios</h1>
        {/* Buscador */}
        <input
          type="text"
          placeholder="Buscar usuario..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="search-input"
        />

        {/* Botón para crear usuario */}
        <button className="action-button" onClick={() => openModal("create")}>
          Crear Usuario
        </button>

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
              <th>Anulado</th>
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
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={usuario.anulado || false}
                      onChange={() => toggleAnular(usuario.id)}
                    />
                    <span className="slider"></span>
                  </label>
                </td>
                <td>
                  <button
                    className="table-button"
                    onClick={() => openModal("details", usuario)}
                  >
                    Ver
                  </button>
                  <button
                    className="table-button"
                    onClick={() => openModal("edit", usuario)}
                  >
                    Editar
                  </button>
                  <button
                    className="table-button delete-button"
                    onClick={() => handleDelete(usuario.id)}
                  >
                    Eliminar
                  </button>
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
                  <strong>Anulado:</strong>{" "}
                  {currentUsuario.anulado ? "Sí" : "No"}
                </p>
                <button className="close-button" onClick={closeModal}>
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
                    <option value="Administrador">Administrador</option>
                    <option value="Empleado">Empleado</option>
                    <option value="Cliente">Cliente</option>
                  </select>
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

export default Usuarios;
