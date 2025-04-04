// Rol.jsx
import React, { useState, useEffect } from "react";
import NavbarAdmin from "../../components/NavbarAdmin";
import "./Rol.css";
import { FaEye, FaTrash, FaEdit } from "react-icons/fa";

const ModalPermisos = ({
  visible,
  permisos,
  seleccionados,
  onClose,
  onSave,
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [seleccionTemp, setSeleccionTemp] = useState([...seleccionados]);
  const porPagina = 5;

  const filtrados = permisos.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPaginas = Math.ceil(filtrados.length / porPagina);
  const paginados = filtrados.slice((page - 1) * porPagina, page * porPagina);

  const toggle = (permiso) => {
    setSeleccionTemp((prev) =>
      prev.some((p) => p.id === permiso.id)
        ? prev.filter((p) => p.id !== permiso.id)
        : [...prev, permiso]
    );
  };

  const guardar = () => {
    onSave(seleccionTemp);
    onClose();
    setSearch("");
    setPage(1);
  };

  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Seleccionar Permisos</h3>
        <input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <div className="checkbox-group">
          {paginados.map((permiso) => (
            <label key={permiso.id} className="checkbox-item">
              <input
                type="checkbox"
                checked={seleccionTemp.some((p) => p.id === permiso.id)}
                onChange={() => toggle(permiso)}
              />
              {permiso.name}
            </label>
          ))}
        </div>
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Anterior
          </button>
          <button
            disabled={page === totalPaginas}
            onClick={() => setPage((p) => p + 1)}
          >
            Siguiente
          </button>
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
      permisos: [
        "Crear usuario",
        "Editar usuario",
        "Eliminar usuario",
        "Visualizar Empleados",
        "Gestionar abastecimiento",
        "Configuraciones avanzadas",
      ],
      anulado: true,
    },
    {
      id: 2,
      nombre: "Empleado",
      permisos: ["Visualizar reportes", "Gestionar inventario"],
      anulado: true,
    },
    {
      id: 3,
      nombre: "Cliente",
      permisos: ["Visualizar reportes"],
      anulado: true,
    },
  ];

  const permisosDisponibles = [
    { id: 1, name: "Crear usuario" },
    { id: 2, name: "Editar usuario" },
    { id: 3, name: "Eliminar usuario" },
    { id: 4, name: "Visualizar Empleados" },
    { id: 5, name: "Gestionar abastecimiento" },
    { id: 6, name: "Configuraciones avanzadas" },
    { id: 7, name: "Visualizar reportes" },
    { id: 8, name: "Gestionar inventario" },
  ];

  const [roles, setRoles] = useState(initialRoles);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "create", "edit", "details"
  const [currentRol, setCurrentRol] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [permisosTemp, setPermisosTemp] = useState([]);

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
    setCurrentRol(rol || { nombre: "", permisos: [], anulado: true });
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
    if (window.confirm("¿Eliminar este rol?")) {
      setRoles(roles.filter((r) => r.id !== id));
    }
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
              <th>Permisos</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoles.map((rol) => (
              <tr key={rol.id}>
                <td>{rol.nombre}</td>
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
                    <strong>Permisos:</strong> {currentRol.permisos.join(", ")}
                  </p>
                  <p>
                    <strong>Anulado:</strong> {currentRol.anulado ? "Sí" : "No"}
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
                      handleSave({ ...currentRol, nombre });
                    }}
                  >
                    <input
                      type="text"
                      name="nombre"
                      defaultValue={currentRol.nombre}
                      required
                      placeholder="Nombre del rol"
                      className="search-input"
                    />

                    <button
                      type="button"
                      className="action-button"
                      onClick={() => setShowModal("permisos")}
                    >
                      Agregar permisos
                    </button>

                    <div className="checkbox-group">
                      <h4>Permisos seleccionados:</h4>
                      {permisosTemp.map((p) => (
                        <div key={p.id} className="checkbox-item">
                          {p.name}
                          <button
                            style={{ color: "red", marginLeft: 10 }}
                            onClick={() => eliminarPermiso(p.id)}
                            type="button"
                          >
                            Eliminar
                          </button>
                        </div>
                      ))}
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

            <ModalPermisos
              visible={showModal === "permisos"}
              permisos={permisosDisponibles}
              seleccionados={permisosTemp}
              onClose={() => setShowModal(true)}
              onSave={setPermisosTemp}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Rol;
