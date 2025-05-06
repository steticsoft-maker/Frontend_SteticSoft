import React, { useState, useEffect } from "react";
import NavbarAdmin from "../../components/NavbarAdmin";
import { FaEye, FaTrash, FaEdit } from "react-icons/fa";
import "./Usuarios.css";

const Usuarios = () => {
  // Datos iniciales con el nuevo campo tipoDocumento
  const initialUsuarios = [
    {
      id: 1,
      nombre: "Administrador",
      tipoDocumento: "CC",
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
      tipoDocumento: "TI",
      documento: "987654321",
      email: "Pepe@gmail.com",
      telefono: "3209999999",
      direccion: "Calle 456",
      rol: "Cliente",
      anulado: true,
    },
  ];

  // Estados principales
  const [usuarios, setUsuarios] = useState(initialUsuarios);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "create", "edit", "details"
  const [currentUsuario, setCurrentUsuario] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  // Estados para los modales extra
  const [modalMensaje, setModalMensaje] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

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

  // En lugar de window.confirm, se usa el modal de confirmación
  const handleDelete = (id) => {
    const usuario = usuarios.find((u) => u.id === id);
    setConfirmDelete(usuario);
  };

  const deleteUsuario = () => {
    setUsuarios(usuarios.filter((u) => u.id !== confirmDelete.id));
    setConfirmDelete(null);
  };

  const toggleAnular = (id) => {
    const updatedUsuarios = usuarios.map((u) =>
      u.id === id ? { ...u, anulado: !u.anulado } : u
    );
    setUsuarios(updatedUsuarios);
  };

  // Función para cerrar el modal de validación
  const cerrarModalMensaje = () => {
    setModalMensaje("");
  };

  const filteredUsuarios = usuarios.filter((u) =>
    u.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="usuarios-container">
      <NavbarAdmin />
      <div className="usuarios-content">
        <h1>Gestión de Usuarios</h1>

        <div className="containerBarraBusquedaBotonAgregarUsuarios">
          <input
            type="text"
            placeholder="Buscar usuario..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="BarraBusquedaInput"
          />
          <button className="botonCrearUsuario" onClick={() => openModal("create")}>
            Crear Usuario
          </button>
        </div>

        <table className="usuarios-table">
          <thead>
            <tr>
              <th>Tipo de Documento</th>
              <th>Número de Documento</th>
              <th>Nombre</th>
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
                <td>{usuario.tipoDocumento}</td>
                <td>{usuario.documento}</td>
                <td>{usuario.nombre}</td>
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
                    <div className="iconosTablaUsuarios">
                      <button
                        className="tablaBotonesUsuarios"
                        onClick={() => openModal("details", usuario)}
                        title="Ver"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="tablaBotonesUsuarios"
                        onClick={() => openModal("edit", usuario)}
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="tablaBotonesUsuarios delete-button-usuarios"
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
        <div className="modal-usuarios">
          <div className="modal-content-usuarios">
            {modalType === "details" && currentUsuario ? (
              <>
                <h2>Detalles del Usuario</h2>
                <p>
                  <strong>Nombre:</strong> {currentUsuario.nombre}
                </p>
                <p>
                  <strong>Tipo de Documento:</strong>{" "}
                  {currentUsuario.tipoDocumento}
                </p>
                <p>
                  <strong>Número de Documento:</strong>{" "}
                  {currentUsuario.documento}
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
                      tipoDocumento: formData.get("tipoDocumento"),
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

                  <select
                    name="tipoDocumento"
                    defaultValue={currentUsuario?.tipoDocumento || ""}
                    required
                  >
                    <option value="" disabled>
                      Seleccione tipo de documento
                    </option>
                    <option value="CC">CC</option>
                    <option value="TI">TI</option>
                  </select>

                  <input
                    type="text"
                    name="documento"
                    placeholder="Número de Documento"
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

                  <div className="containerBotonesGuardarCancelarAgregarUsuario">
                    <button type="submit" className="botonGuardarAgregarUsuario">
                      Guardar
                    </button>
                    <button
                      type="button"
                      className="botonCancelarAgregarUsuario"
                      onClick={closeModal}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal de validaciones */}
      {modalMensaje && (
        <div className="modal-overlay-usuarios">
          <div className="modal-container-usuarios">
            <p>{modalMensaje}</p>
            <button onClick={cerrarModalMensaje}>Cerrar</button>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      {confirmDelete && (
        <div className="modal-usuarios">
          <div className="modal-content-usuarios">
            <h3>¿Eliminar usuario?</h3>
            <p>
              ¿Estás seguro de que deseas eliminar al usuario{" "}
              <strong>{confirmDelete.nombre}</strong>?
            </p>
            <div className="btn-container">
              <button className="btn danger" onClick={deleteUsuario}>
                Eliminar
              </button>
              <button
                className="btnCancelar"
                onClick={() => setConfirmDelete(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;
