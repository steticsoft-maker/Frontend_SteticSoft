import React, { useState, useEffect } from "react";
// Asumiendo que NavbarAdmin no cambia, mantenemos la importación
import NavbarAdmin from "../../components/NavbarAdmin";
// Asumiendo que los iconos no cambian, mantenemos la importación
import { FaEye, FaTrash, FaEdit } from "react-icons/fa";
// Importamos el nuevo archivo CSS
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
      anulado: false, // Cambiado a false ya que el Admin suele estar activo
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
      anulado: false, // Estado inicial
    },
    {
      id: 3,
      nombre: "Maria", // Nuevo usuario para ejemplo
      tipoDocumento: "CC",
      documento: "1122334455",
      email: "maria@gmail.com",
      telefono: "3101234567",
      direccion: "Avenida Siempre Viva 742",
      rol: "Empleado",
      anulado: false, // Estado inicial
    },
  ];

  // Estados principales
  const [usuarios, setUsuarios] = useState(() => {
    const savedUsuarios = localStorage.getItem("usuarios");
    return savedUsuarios ? JSON.parse(savedUsuarios) : initialUsuarios;
  });
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "create", "edit", "details", "validation"
  const [currentUsuario, setCurrentUsuario] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  // Estado para el modal de confirmación de eliminar
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Cargar/Guardar usuarios en localStorage
  useEffect(() => {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }, [usuarios]);

  // Lógica para guardar/actualizar usuario
  const handleSave = (usuario) => {
    // Validar campos obligatorios (ejemplo básico)
    if (
      !usuario.nombre ||
      !usuario.documento ||
      !usuario.email ||
      !usuario.rol
    ) {
      setModalType("validation");
      setCurrentUsuario(null); // No necesitamos un usuario para este modal
      // Podrías pasar un mensaje específico al estado o manejarlo aquí
      return; // Detiene el proceso si falta info
    }

    if (modalType === "create") {
      // Asegurarse de que el Admin no pueda ser creado (si ya existe en initial)
      if (
        usuario.rol === "Administrador" &&
        usuarios.some((u) => u.rol === "Administrador")
      ) {
        setModalType("validation");
        // Podrías pasar un mensaje específico como estado: setModalMensaje("Ya existe un administrador.");
        return;
      }
      setUsuarios([
        ...usuarios,
        { ...usuario, id: Date.now(), anulado: false },
      ]); // Añadir nuevo usuario
    } else if (modalType === "edit" && currentUsuario) {
      // No permitir cambiar el rol a Admin si ya existe otro Admin
      if (
        usuario.rol === "Administrador" &&
        currentUsuario.rol !== "Administrador" &&
        usuarios.some(
          (u) => u.rol === "Administrador" && u.id !== currentUsuario.id
        )
      ) {
        setModalType("validation");
        // setModalMensaje("No se puede asignar 'Administrador', ya existe otro.");
        return;
      }
      const updatedUsuarios = usuarios.map(
        (u) => (u.id === currentUsuario.id ? { ...u, ...usuario } : u) // Combinar datos existentes con los del formulario
      );
      setUsuarios(updatedUsuarios);
    }
    closeModal(); // Cerrar modal al guardar
  };

  // Abrir modal (Crear, Editar, Detalles)
  const openModal = (type, usuario = null) => {
    // No permitir editar o ver detalles del Admin si no quieres exponerlo así
    if (
      (type === "edit" || type === "details") &&
      usuario?.rol === "Administrador"
    ) {
      // Puedes mostrar un modal de validación o simplemente no hacer nada
      alert(
        "No se pueden modificar o ver detalles del Administrador directamente."
      );
      return;
    }
    setModalType(type);
    setCurrentUsuario(usuario); // Pasa los datos del usuario si es editar o detalles
    setShowModal(true);
  };

  // Cerrar modal principal
  const closeModal = () => {
    setShowModal(false);
    setModalType("");
    setCurrentUsuario(null);
  };

  // Abrir modal de confirmación de eliminar
  const openConfirmDeleteModal = (usuario) => {
    // No permitir eliminar al usuario "Administrador"
    if (usuario.rol === "Administrador") {
      alert("El usuario 'Administrador' no puede ser eliminado.");
      return;
    }
    setConfirmDelete(usuario);
  };

  // Eliminar usuario después de confirmar
  const deleteUsuario = () => {
    setUsuarios(usuarios.filter((u) => u.id !== confirmDelete.id));
    setConfirmDelete(null); // Cerrar modal de confirmación
  };

  // Anular/Activar usuario
  const toggleAnular = (id) => {
    // No permitir anular/activar al usuario "Administrador"
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

  // Filtrar usuarios por nombre
  const filteredUsuarios = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.documento.includes(busqueda) // Permitir buscar por documento también
  );

  // Renderizar el formulario o detalles dentro del modal
  const renderModalContent = () => {
    const isEditing = modalType === "edit";
    const isCreating = modalType === "create";
    const isDetails = modalType === "details";

    // Obtener la lista de roles disponibles para el select (excluir Admin si no se puede asignar)
    const rolesDisponibles = usuarios
      .map((u) => u.rol)
      .filter(
        (value, index, self) =>
          self.indexOf(value) === index && value !== "Administrador"
      ); // Obtiene roles únicos existentes, excluyendo Admin
    // Podrías tener una lista fija de roles disponibles si no quieres que dependa de los usuarios actuales
    // const rolesDisponibles = ["Empleado", "Cliente", "Gerente"]; // Ejemplo de lista fija

    // Contenido del modal de Detalles
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
            <strong>Estado:</strong>{" "}
            {currentUsuario.anulado ? "Inactivo" : "Activo"}
          </p>
          <button className="usuarios-modalButton-cerrar" onClick={closeModal}>
            Cerrar
          </button>
        </div>
      );
    }

    // Contenido del modal de Crear/Editar
    if (isCreating || isEditing) {
      return (
        <div className="usuarios-modalContent-form">
          <h2>{isCreating ? "Crear Usuario" : "Editar Usuario"}</h2>
          {/* El rol 'Administrador' no se puede editar/crear por el formulario general */}
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
                  // El estado 'anulado' se maneja con el switch en la tabla, no en este formulario
                };
                handleSave(usuarioData);
              }}
            >
              <div className="usuarios-form-group">
                <label htmlFor="nombre">Nombre:</label>
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
                <label htmlFor="tipoDocumento">Tipo de Documento:</label>
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
                  <option value="TI">Tarjeta de Identidad</option>
                  <option value="CE">Cédula de Extranjería</option>
                  <option value="PA">Pasaporte</option>
                </select>
              </div>

              <div className="usuarios-form-group">
                <label htmlFor="documento">Número de Documento:</label>
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
                <label htmlFor="email">Email:</label>
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
                <label htmlFor="telefono">Teléfono:</label>
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
                <label htmlFor="direccion">Dirección:</label>
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
                <label htmlFor="rol">Rol:</label>
                {/* No permitir cambiar el rol si es el usuario 'Administrador' */}
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
                  {/* Si es modo edición y el usuario actual es Admin, mostrar Admin como opción deshabilitada */}
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

    // Contenido del modal de Validación (ejemplo simple)
    if (modalType === "validation") {
      const message =
        modalMensaje ||
        "Por favor, completa todos los campos obligatorios o verifica la información."; // Mensaje por defecto
      return (
        <div className="usuarios-modalContent-validation">
          <h2>Validación</h2>
          <p>{message}</p>
          <button className="usuarios-modalButton-cerrar" onClick={closeModal}>
            Cerrar
          </button>
        </div>
      );
    }

    return null; // No renderizar nada si no hay modal type válido
  };

  return (
    <div className="usuarios-container">
      <NavbarAdmin />
      {/* El contenido principal de la página */}
      <div className="usuarios-content">
        <h1>Gestión de Usuarios</h1>

        {/* Barra de búsqueda y botón "Crear Usuario" */}
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

        {/* Tabla de Usuarios */}
        <table className="usuarios-table">
          <thead>
            <tr>
              <th>Tipo Doc.</th>
              <th># Documento</th>
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
                    <span>Activo</span> // Rol Admin siempre Activo visualmente
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
                      {/* Solo botón de ver detalles para el Admin */}
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

      {/* === Modales === */}

      {/* Modal Principal (para Crear, Editar, Detalles) */}
      {showModal && (
        <div className="usuarios-modalOverlay">
          <div className="usuarios-modalContent">{renderModalContent()}</div>
        </div>
      )}

      {/* Modal de Confirmación para eliminar */}
      {confirmDelete && (
        <div className="usuarios-modalOverlay">
          {" "}
          {/* Reutilizamos el overlay */}
          <div className="usuarios-modalContent usuarios-modalContent-confirm">
            {" "}
            {/* Estilo específico para confirmación */}
            <h3>Confirmar Eliminación</h3>
            <p>
              ¿Estás seguro de que deseas eliminar al usuario{" "}
              <strong>{confirmDelete.nombre}</strong>?
            </p>
            <div className="usuarios-form-actions">
              {" "}
              {/* Reutilizamos estilos de botones */}
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

      {/* Modal de Validaciones (simple) */}
      {modalType === "validation" &&
        !confirmDelete && ( // Asegura que no se muestre si también hay confirmación
          <div className="usuarios-modalOverlay">
            <div className="usuarios-modalContent usuarios-modalContent-validation">
              <h3>Error de Validación</h3>
              <p>
                Por favor, revise los datos ingresados o la operación
                solicitada.
              </p>{" "}
              {/* Mensaje genérico */}
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
