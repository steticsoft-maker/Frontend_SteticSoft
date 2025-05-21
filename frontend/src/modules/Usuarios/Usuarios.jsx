import React, { useState, useEffect } from "react";
import NavbarAdmin from "../../components/NavbarAdmin/NavbarAdmin";
import { FaEye, FaTrash, FaEdit } from "react-icons/fa";
import "./Usuarios.css";

const Usuarios = () => {
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
      tipoDocumento: "CC",
      documento: "987654321",
      email: "Pepe@gmail.com",
      telefono: "3209999999",
      direccion: "Calle 456",
      rol: "Empleado",
      anulado: true,
    },
    {
      id: 3,
      nombre: "Maria",
      tipoDocumento: "CC",
      documento: "1122334455",
      email: "maria@gmail.com",
      telefono: "3101234567",
      direccion: "Avenida Siempre Viva 742",
      rol: "Cliente",
      anulado: true,
    },
    {
      id: 4,
      nombre: "Andres",
      tipoDocumento: "CC",
      documento: "1122334455",
      email: "Andres@gmail.com",
      telefono: "3101234567",
      direccion: "Avenida Siempre Viva 742",
      rol: "Empleado",
      anulado: true,
    },
  ];

  const [usuarios, setUsuarios] = useState(() => {
    const savedUsuarios = localStorage.getItem("usuarios");
    return savedUsuarios ? JSON.parse(savedUsuarios) : initialUsuarios;
  });
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [currentUsuario, setCurrentUsuario] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [modalMensaje, setModalMensaje] = useState("");

  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }, [usuarios]);

  const handleSave = (usuario) => {
    if (
      !usuario.nombre ||
      !usuario.tipoDocumento ||
      !usuario.documento ||
      !usuario.email ||
      !usuario.telefono ||
      !usuario.direccion ||
      !usuario.rol
    ) {
      setModalMensaje("Por favor, completa todos los campos obligatorios.");
      setModalType("validation");
      setCurrentUsuario(null);
      return;
    }

    const documentoExists = usuarios.some(
      (u) =>
        u.documento === usuario.documento &&
        (modalType === "create" ||
          (modalType === "edit" && u.id !== currentUsuario?.id))
    );
    if (documentoExists) {
      setModalMensaje("Ya existe un usuario con este número de documento.");
      setModalType("validation");
      setCurrentUsuario(null);
      return;
    }

    if (modalType === "create") {
      if (
        usuario.rol === "Administrador" &&
        usuarios.some((u) => u.rol === "Administrador")
      ) {
        setModalMensaje("No se puede crear otro usuario 'Administrador'.");
        setModalType("validation");
        return;
      }
      setUsuarios([
        ...usuarios,
        { ...usuario, id: Date.now(), anulado: false },
      ]);
    } else if (modalType === "edit" && currentUsuario) {
      if (
        usuario.rol === "Administrador" &&
        currentUsuario.rol !== "Administrador" &&
        usuarios.some(
          (u) => u.rol === "Administrador" && u.id !== currentUsuario.id
        )
      ) {
        setModalMensaje("No se puede asignar 'Administrador', ya existe otro.");
        setModalType("validation");
        return;
      }
      const updatedUsuarios = usuarios.map((u) =>
        u.id === currentUsuario.id ? { ...u, ...usuario } : u
      );
      setUsuarios(updatedUsuarios);
    }
    closeModal();
  };

  const openModal = (type, usuario = null) => {
    if (
      (type === "edit" || type === "details") &&
      usuario?.rol === "Administrador" &&
      type !== "details"
    ) {
      alert("No se puede modificar al usuario 'Administrador' desde aquí.");
      return;
    }
    setModalMensaje("");
    setModalType(type);
    setCurrentUsuario(usuario);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType("");
    setCurrentUsuario(null);
    setModalMensaje("");
  };

  const openConfirmDeleteModal = (usuario) => {
    if (usuario.rol === "Administrador") {
      alert("El usuario 'Administrador' no puede ser eliminado.");
      return;
    }
    setConfirmDelete(usuario);
  };

  const deleteUsuario = () => {
    setUsuarios(usuarios.filter((u) => u.id !== confirmDelete.id));
    setConfirmDelete(null);
  };

  const toggleAnular = (id) => {
    const usuarioToToggle = usuarios.find((u) => u.id === id);
    if (usuarioToToggle?.rol === "Administrador") {
      alert("El usuario 'Administrador' no puede ser anulado/activado.");
      return;
    }

    const updatedUsuarios = usuarios.map((u) =>
      u.id === id ? { ...u, anulado: !u.anulado } : u
    );
    setUsuarios(updatedUsuarios);
  };

  const filteredUsuarios = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.documento.includes(busqueda)
  );

  const renderModalContent = () => {
    const isEditing = modalType === "edit";
    const isCreating = modalType === "create";
    const isDetails = modalType === "details";

    const rolesDisponibles = usuarios
      .map((u) => u.rol)
      .filter(
        (value, index, self) =>
          self.indexOf(value) === index && value !== "Administrador"
      );

    if (isDetails && currentUsuario) {
      return (
        <div className="usuarios-modalContent-details">
          <h2>Detalles del Usuario</h2>
          <p>
            <strong>Nombre:</strong> {currentUsuario.nombre}
          </p>
          <p>
            <strong>Tipo de Documento:</strong> {currentUsuario.tipoDocumento}
          </p>
          <p>
            <strong>Número de Documento:</strong> {currentUsuario.documento}
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
            <strong>Estado:</strong>
            {currentUsuario.anulado ? "Inactivo" : "Activo"}
          </p>
          <button className="usuarios-modalButton-cerrar" onClick={closeModal}>
            Cerrar
          </button>
        </div>
      );
    }

    if (isCreating || isEditing) {
      return (
        <div className="usuarios-modalContent-form">
          <h2>{isCreating ? "Crear Usuario" : "Editar Usuario"}</h2>
          {currentUsuario?.rol === "Administrador" ? (
            <p>Este usuario no puede ser modificado desde aquí.</p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const usuarioData = {
                  nombre: formData.get("nombre"),
                  tipoDocumento: formData.get("tipoDocumento"),
                  documento: formData.get("documento"),
                  email: formData.get("email"),
                  telefono: formData.get("telefono"),
                  direccion: formData.get("direccion"),
                  rol: formData.get("rol"),
                };
                handleSave(usuarioData);
              }}
            >
              <div className="usuarios-form-group">
                <label htmlFor="tipoDocumento" className="usuarios-form-label">
                  Tipo de Documento:
                  <span className="required-asterisk">*</span>{" "}
                </label>
                <select
                  id="tipoDocumento"
                  name="tipoDocumento"
                  defaultValue={currentUsuario?.tipoDocumento || ""}
                  required
                  className="usuarios-form-select"
                >
                  <option value="" disabled>
                    Seleccione
                  </option>
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="CE">Cédula de Extranjería</option>
                </select>
              </div>

              <div className="usuarios-form-group">
                <label htmlFor="documento" className="usuarios-form-label">
                  Número de Documento:
                  <span className="required-asterisk">*</span>{" "}
                </label>
                <input
                  type="text"
                  id="documento"
                  name="documento"
                  placeholder="Número de documento"
                  defaultValue={currentUsuario?.documento || ""}
                  required
                  className="usuarios-form-input"
                />
              </div>

              <div className="usuarios-form-group">
                <label htmlFor="nombre" className="usuarios-form-label">
                  Nombre y Apellido:
                  <span className="required-asterisk">*</span>{" "}
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  placeholder="Nombre completo"
                  defaultValue={currentUsuario?.nombre || ""}
                  required
                  className="usuarios-form-input"
                />
              </div>

              <div className="usuarios-form-group">
                <label htmlFor="email" className="usuarios-form-label">
                  Email:
                  <span className="required-asterisk">*</span>{" "}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Correo electrónico"
                  defaultValue={currentUsuario?.email || ""}
                  required
                  className="usuarios-form-input"
                />
              </div>

              <div className="usuarios-form-group">
                <label htmlFor="telefono" className="usuarios-form-label">
                  Teléfono:
                  <span className="required-asterisk">*</span>{" "}
                </label>
                <input
                  type="text"
                  id="telefono"
                  name="telefono"
                  placeholder="Número de teléfono"
                  defaultValue={currentUsuario?.telefono || ""}
                  required
                  className="usuarios-form-input"
                />
              </div>

              <div className="usuarios-form-group">
                <label htmlFor="direccion" className="usuarios-form-label">
                  Dirección:
                  <span className="required-asterisk">*</span>{" "}
                </label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  placeholder="Dirección de residencia"
                  defaultValue={currentUsuario?.direccion || ""}
                  required
                  className="usuarios-form-input"
                />
              </div>

              <div className="usuarios-form-group">
                <label htmlFor="rol" className="usuarios-form-label">
                  Rol:
                  <span className="required-asterisk">*</span>{" "}
                </label>
                <select
                  id="rol"
                  name="rol"
                  defaultValue={currentUsuario?.rol || ""}
                  required
                  className="usuarios-form-select"
                  disabled={
                    isEditing && currentUsuario?.rol === "Administrador"
                  }
                >
                  <option value="" disabled>
                    Seleccionar rol
                  </option>
                  {rolesDisponibles.map((rol) => (
                    <option key={rol} value={rol}>
                      {rol}
                    </option>
                  ))}
                  {isEditing && currentUsuario?.rol === "Administrador" && (
                    <option value="Administrador" disabled>
                      Administrador (Fijo)
                    </option>
                  )}
                </select>
              </div>

              <div className="usuarios-form-actions">
                <button type="submit" className="usuarios-form-buttonGuardar">
                  Guardar
                </button>
                <button
                  type="button"
                  className="usuarios-form-buttonCancelar"
                  onClick={closeModal}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      );
    }

    if (modalType === "validation") {
      return (
        <div className="usuarios-modalContent-validation">
          <h2>Validación</h2>
          <p>
            {modalMensaje || "Por favor, revise la información proporcionada."}
          </p>
          <button className="usuarios-modalButton-cerrar" onClick={closeModal}>
            Cerrar
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="usuarios-container">
      <NavbarAdmin />
      <div className="usuarios-content">
        <h1>Gestión de Usuarios</h1>

        <div className="usuarios-accionesTop">
          <input
            type="text"
            placeholder="Buscar usuario por nombre o documento..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="usuarios-barraBusqueda"
          />
          <button
            className="usuarios-botonAgregar"
            onClick={() => openModal("create")}
          >
            Crear Usuario
          </button>
        </div>

        <table className="usuarios-table">
          <thead>
            <tr>
              <th>Tipo Doc.</th>
              <th># Documento</th>
              <th>Nombre</th> <th>Email</th>
              <th>Teléfono</th>
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
                    <span>Activo</span>
                  )}
                </td>
                <td>
                  {usuario.rol !== "Administrador" ? (
                    <div className="usuarios-table-iconos">
                      <button
                        className="usuarios-table-button"
                        onClick={() => openModal("details", usuario)}
                        title="Ver Detalles"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="usuarios-table-button"
                        onClick={() => openModal("edit", usuario)}
                        title="Editar Usuario"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="usuarios-table-button usuarios-table-button-delete"
                        onClick={() => openConfirmDeleteModal(usuario)}
                        title="Eliminar Usuario"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ) : (
                    <div className="usuarios-table-iconos">
                      <button
                        className="usuarios-table-button"
                        onClick={() => openModal("details", usuario)}
                        title="Ver Detalles"
                      >
                        <FaEye />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="usuarios-modalOverlay">
          <div className="usuarios-modalContent">{renderModalContent()}</div>
        </div>
      )}

      {confirmDelete && (
        <div className="usuarios-modalOverlay">
          <div className="usuarios-modalContent usuarios-modalContent-confirm">
            <h3>Confirmar Eliminación</h3>
            <p>
              ¿Estás seguro de que deseas eliminar al usuario
              <strong>{confirmDelete.nombre}</strong>?
            </p>
            <div className="usuarios-form-actions">
              <button
                className="usuarios-form-buttonGuardar"
                onClick={deleteUsuario}
              >
                Eliminar
              </button>
              <button
                className="usuarios-form-buttonCancelar"
                onClick={() => setConfirmDelete(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {modalType === "validation" && !confirmDelete && (
        <div className="usuarios-modalOverlay">
          <div className="usuarios-modalContent usuarios-modalContent-validation">
            <h3>Error de Validación</h3>
            <p>
              {modalMensaje ||
                "Por favor, revise la información proporcionada."}
            </p>
            <button
              className="usuarios-modalButton-cerrar"
              onClick={closeModal}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;
