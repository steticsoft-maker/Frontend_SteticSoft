import React, { useState, useEffect } from "react";
import NavbarAdmin from "../../components/NavbarAdmin";
import "./Rol.css";
import { FaEye, FaTrash, FaEdit } from "react-icons/fa";

// Modal para selección de permisos
const ModalPermisos = ({
  visible,
  permisos,
  seleccionados,
  onClose,
  onSave,
}) => {
  const [search, setSearch] = useState("");
  const [seleccionTemp, setSeleccionTemp] = useState([...seleccionados]);

  // Agrupamos los permisos por módulo
  const permisosPorModulo = permisos.reduce((acc, permiso) => {
    const modulo = permiso.name.split(":")[0]?.trim() || "General";
    if (!acc[modulo]) {
      acc[modulo] = [];
    }
    acc[modulo].push(permiso);
    return acc;
  }, {});

  useEffect(() => {
    setSeleccionTemp([...seleccionados]);
  }, [seleccionados]);

  const toggle = (permiso) => {
    setSeleccionTemp((prev) =>
      prev.some((p) => p.id === permiso.id)
        ? prev.filter((p) => p.id !== permiso.id)
        : [...prev, permiso]
    );
  };

  const toggleModulo = (modulo) => {
    const permisosModulo = permisosPorModulo[modulo];
    const todosSeleccionados = permisosModulo.every((p) =>
      seleccionTemp.some((sp) => sp.id === p.id)
    );

    if (todosSeleccionados) {
      // Deseleccionar todos
      setSeleccionTemp((prev) =>
        prev.filter((p) => !permisosModulo.some((pm) => pm.id === p.id))
      );
    } else {
      // Seleccionar todos
      const nuevos = permisosModulo.filter(
        (p) => !seleccionTemp.some((sp) => sp.id === p.id)
      );
      setSeleccionTemp([...seleccionTemp, ...nuevos]);
    }
  };

  const toggleTodos = () => {
    if (seleccionTemp.length === permisos.length) {
      setSeleccionTemp([]);
    } else {
      setSeleccionTemp([...permisos]);
    }
  };

  const guardar = () => {
    onSave(seleccionTemp);
    onClose();
    setSearch("");
  };

  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content permisos-modal">
        <h3>Seleccionar Permisos</h3>
        <input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <div className="permisos-container">
          <button onClick={toggleTodos} className="select-all-button">
            {seleccionTemp.length === permisos.length
              ? "Deseleccionar todos"
              : "Seleccionar todos"}
          </button>

          {Object.entries(permisosPorModulo)
            .filter(
              ([modulo]) =>
                modulo.toLowerCase().includes(search.toLowerCase()) ||
                permisosPorModulo[modulo].some((p) =>
                  p.name.toLowerCase().includes(search.toLowerCase())
                )
            )
            .map(([modulo, permisos]) => (
              <div key={modulo} className="modulo-container">
                <div className="modulo-header">
                  <input
                    type="checkbox"
                    checked={permisos.every((p) =>
                      seleccionTemp.some((sp) => sp.id === p.id)
                    )}
                    onChange={() => toggleModulo(modulo)}
                    className="modulo-checkbox"
                  />
                  <h4>{modulo}</h4>
                </div>
                <div className="permisos-list">
                  {permisos.map((permiso) => (
                    <label key={permiso.id} className="permiso-item">
                      <input
                        type="checkbox"
                        checked={seleccionTemp.some((p) => p.id === permiso.id)}
                        onChange={() => toggle(permiso)}
                        className="permiso-checkbox"
                      />
                      <span>{permiso.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
        </div>

        <div className="modal-actions">
          <button onClick={guardar} className="save-button">
            Guardar
          </button>
          <button onClick={onClose} className="cancel-button">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

const Rol = () => {
  const initialRoles = [
    {
      id: 1,
      nombre: "Administrador",
      descripcion: "Acceso completo a todos los módulos del sistema",
      permisos: [
        "Usuarios: Crear",
        "Usuarios: Editar",
        "Usuarios: Eliminar",
        "Usuarios: Visualizar",
        "Ventas: Crear",
        "Ventas: Anular",
        "Ventas: Reportes",
        "Inventario: Gestionar",
        "Configuracion: Administrar",
      ],
      anulado: false,
    },
    {
      id: 2,
      nombre: "Vendedor",
      descripcion: "Acceso a módulo de ventas e inventario",
      permisos: ["Ventas: Crear", "Ventas: Reportes", "Inventario: Consultar"],
      anulado: false,
    },
    {
      id: 3,
      nombre: "Consulta",
      descripcion: "Solo permisos de visualización",
      permisos: ["Ventas: Reportes", "Inventario: Consultar"],
      anulado: true,
    },
  ];

  const permisosDisponibles = [
    { id: 1, name: "Usuarios: Crear" },
    { id: 2, name: "Usuarios: Editar" },
    { id: 3, name: "Usuarios: Eliminar" },
    { id: 4, name: "Usuarios: Visualizar" },
    { id: 5, name: "Ventas: Crear" },
    { id: 6, name: "Ventas: Editar" },
    { id: 7, name: "Ventas: Anular" },
    { id: 8, name: "Ventas: Reportes" },
    { id: 9, name: "Inventario: Gestionar" },
    { id: 10, name: "Inventario: Consultar" },
    { id: 11, name: "Configuracion: Administrar" },
    { id: 12, name: "Configuracion: Basicas" },
  ];

  const [roles, setRoles] = useState(initialRoles);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [currentRol, setCurrentRol] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [permisosTemp, setPermisosTemp] = useState([]);
  const [showPermisosModal, setShowPermisosModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    localStorage.setItem("roles", JSON.stringify(roles));
  }, [roles]);

  const handleSave = (rolData) => {
    const permisosSeleccionados = permisosTemp.map((p) => p.name);
    const nuevoRol = {
      ...rolData,
      permisos: permisosSeleccionados,
      id: rolData.id || Date.now(),
    };

    if (modalType === "create") {
      setRoles([...roles, nuevoRol]);
    } else if (modalType === "edit") {
      const updated = roles.map((r) => (r.id === rolData.id ? nuevoRol : r));
      setRoles(updated);
    }

    closeModal();
  };

  const openModal = (type, rol = null) => {
    setModalType(type);
    setCurrentRol(
      rol || { nombre: "", descripcion: "", permisos: [], anulado: false }
    );
    setPermisosTemp(
      rol
        ? permisosDisponibles.filter((p) => rol.permisos.includes(p.name))
        : []
    );
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentRol(null);
    setPermisosTemp([]);
  };

  const handleDelete = (id) => {
    const rol = roles.find((r) => r.id === id);
    setConfirmDelete(rol);
  };

  const deleteRol = () => {
    setRoles(roles.filter((r) => r.id !== confirmDelete.id));
    setConfirmDelete(null);
  };

  const toggleAnular = (id) => {
    setRoles(
      roles.map((r) => (r.id === id ? { ...r, anulado: !r.anulado } : r))
    );
  };

  const eliminarPermiso = (id) => {
    setPermisosTemp(permisosTemp.filter((p) => p.id !== id));
  };

  const filteredRoles = roles.filter((r) =>
    r.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="rol-container">
      <NavbarAdmin />
      <div className="main-content">
        <h1>Gestión de Roles</h1>

        <div className="actions-container">
          <input
            type="text"
            placeholder="Buscar rol..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="search-input"
          />
          <button className="action-button" onClick={() => openModal("create")}>
            Crear Rol
          </button>
        </div>

        <table className="roles-table">
          <thead>
            <tr>
              <th>Nombre del Rol</th>
              <th>Descripción</th>
              <th>Permisos</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoles.map((rol) => (
              <tr key={rol.id}>
                <td>{rol.nombre}</td>
                <td>{rol.descripcion}</td>
                <td>
                  {rol.permisos.length > 3
                    ? rol.permisos.slice(0, 3).join(", ") + "..."
                    : rol.permisos.join(", ")}
                </td>
                <td>
                  {rol.nombre !== "Administrador" ? (
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={rol.anulado}
                        onChange={() => toggleAnular(rol.id)}
                      />
                      <span className="slider"></span>
                    </label>
                  ) : (
                    <span>No disponible</span>
                  )}
                </td>
                <td>
                  <div className="icon-actions">
                    <button
                      className="table-button"
                      onClick={() => openModal("details", rol)}
                      title="Ver"
                    >
                      <FaEye />
                    </button>
                    {rol.nombre !== "Administrador" && (
                      <>
                        <button
                          className="table-button"
                          onClick={() => openModal("edit", rol)}
                          title="Editar"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="table-button delete-button"
                          onClick={() => handleDelete(rol.id)}
                          title="Eliminar"
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              {modalType === "details" ? (
                <>
                  <h2>Detalles del Rol</h2>
                  <p>
                    <strong>Nombre:</strong> {currentRol.nombre}
                  </p>
                  <p>
                    <strong>Descripción:</strong> {currentRol.descripcion}
                  </p>
                  <p>
                    <strong>Permisos:</strong> {currentRol.permisos.join(", ")}
                  </p>
                  <p>
                    <strong>Estado:</strong>{" "}
                    {currentRol.anulado ? "Inactivo" : "Activo"}
                  </p>
                  <button className="cancel-button" onClick={closeModal}>
                    Cerrar
                  </button>
                </>
              ) : (
                <>
                  <h2>{modalType === "create" ? "Crear Rol" : "Editar Rol"}</h2>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const nombre = e.target.nombre.value;
                      const descripcion = e.target.descripcion.value;
                      handleSave({ ...currentRol, nombre, descripcion });
                    }}
                  >
                    <div className="form-group">
                      <label>
                        <span className="required"></span>
                      </label>
                      <input
                        type="text"
                        name="nombre"
                        defaultValue={currentRol.nombre}
                        required
                        placeholder="Nombre del rol*"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label></label>
                      <textarea
                        name="descripcion"
                        defaultValue={currentRol.descripcion}
                        placeholder="Descripción del rol"
                        className="form-input"
                        rows="3"
                      />
                    </div>

                    <div className="form-group">
                      <label>Permisos</label>
                      <button
                        type="button"
                        className="action-button"
                        onClick={() => setShowPermisosModal(true)}
                      >
                        Seleccionar permisos
                      </button>

                      <div className="selected-permissions">
                        <h4>Permisos seleccionados:</h4>
                        {permisosTemp.length > 0 ? (
                          <ul className="permissions-list">
                            {permisosTemp.map((p) => (
                              <li key={p.id} className="permission-item">
                                {p.name}
                                <button
                                  type="button"
                                  className="remove-permission"
                                  onClick={() => eliminarPermiso(p.id)}
                                >
                                  ×
                                </button>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>No se han seleccionado permisos</p>
                        )}
                      </div>
                    </div>

                    <div className="form-buttons">
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
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        )}

        <ModalPermisos
          visible={showPermisosModal}
          permisos={permisosDisponibles}
          seleccionados={permisosTemp}
          onClose={() => setShowPermisosModal(false)}
          onSave={(nuevos) => setPermisosTemp(nuevos)}
        />

        {confirmDelete && (
          <div className="modal">
            <div className="modal-content">
              <h3>¿Eliminar rol?</h3>
              <p>
                ¿Estás seguro de que deseas eliminar el rol{" "}
                <strong>{confirmDelete.nombre}</strong>?
              </p>
              <div className="btn-container">
                <button className="btn danger" onClick={deleteRol}>
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
    </div>
  );
};

export default Rol;
