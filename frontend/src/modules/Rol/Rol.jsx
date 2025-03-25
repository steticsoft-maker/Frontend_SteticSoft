import React, { useState, useEffect } from "react";
import NavbarAdmin from "../../components/NavbarAdmin";
import "./Rol.css";

const Rol = () => {
  // Roles pre-registrados
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
      anulado: false,
    },
    {
      id: 2,
      nombre: "Empleado",
      permisos: ["Visualizar reportes", "Gestionar inventario"],
      anulado: false,
    },
    {
      id: 3,
      nombre: "Cliente",
      permisos: ["Visualizar reportes"],
      anulado: false,
    },
  ];

  const permisosDisponibles = [
    { id: 1, name: "Crear usuario" },
    { id: 2, name: "Editar usuario" },
    { id: 3, name: "Eliminar usuario" },
    { id: 4, name: "Visualizar Empleados" },
    { id: 5, name: "Gestionar abastecimiento" },
    { id: 6, name: "Configuraciones avanzadas" },
  ];

  const [roles, setRoles] = useState(initialRoles);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "create", "edit", "details"
  const [currentRol, setCurrentRol] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1); // Página actual para paginación
  const itemsPorPagina = 3; // Número de permisos por página

  const permisosPaginados = permisosDisponibles.slice(
    (paginaActual - 1) * itemsPorPagina,
    paginaActual * itemsPorPagina
  );

  // Guardar roles en LocalStorage cuando cambie el estado
  useEffect(() => {
    localStorage.setItem("roles", JSON.stringify(roles));
  }, [roles]);

  // Manejar creación/edición de roles
  const handleSave = (rol) => {
    const permisosSeleccionados = permisosDisponibles
      .filter((permiso) => rol.permisos.includes(permiso.name))
      .map((permiso) => permiso.name);

    if (modalType === "create") {
      setRoles([...roles, { ...rol, permisos: permisosSeleccionados }]);
    } else if (modalType === "edit" && currentRol) {
      const updatedRoles = roles.map((r) =>
        r.id === currentRol.id
          ? { ...currentRol, ...rol, permisos: permisosSeleccionados }
          : r
      );
      setRoles(updatedRoles);
    }
    closeModal();
  };

  // Abrir modal
  const openModal = (type, rol = null) => {
    setModalType(type);
    setCurrentRol(rol || { permisos: [] });
    setShowModal(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setShowModal(false);
    setModalType("");
    setCurrentRol(null);
  };

  // Eliminar un rol
  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este rol?")) {
      setRoles(roles.filter((r) => r.id !== id));
    }
  };

  // Cambiar estado del rol (anulado/activo)
  const toggleAnular = (id) => {
    const updatedRoles = roles.map((r) =>
      r.id === id ? { ...r, anulado: !r.anulado } : r
    );
    setRoles(updatedRoles);
  };

  // Filtrar roles por búsqueda
  const filteredRoles = roles.filter((r) =>
    r.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="rol-container">
      <NavbarAdmin />
      <div className="main-content">
        <h1>Gestión de Roles</h1>
        {/* Buscador */}
        <input
          type="text"
          placeholder="Buscar rol..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="search-input"
        />

        {/* Botón para crear rol */}
        <button className="action-button" onClick={() => openModal("create")}>
          Crear Rol
        </button>

        {/* Tabla de roles */}
        <table className="roles-table">
          <thead>
            <tr>
              <th>Nombre del Rol</th>
              <th>Permisos</th>
              <th>Anulado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoles.map((rol) => (
              <tr key={rol.id}>
                <td>{rol.nombre}</td>
                <td>
                  {rol.permisos?.length > 3
                    ? rol.permisos.slice(0, 3).join(", ") + "..."
                    : rol.permisos.join(", ")}
                </td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={rol.anulado || false}
                      onChange={() => toggleAnular(rol.id)}
                    />
                    <span className="slider"></span>
                  </label>
                </td>
                <td>
                  <button
                    className="table-button"
                    onClick={() => openModal("details", rol)}
                  >
                    Ver
                  </button>
                  <button
                    className="table-button"
                    onClick={() => openModal("edit", rol)}
                  >
                    Editar
                  </button>
                  <button
                    className="table-button delete-button"
                    onClick={() => handleDelete(rol.id)}
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
            {modalType === "details" && currentRol ? (
              <>
                <h2>Detalles del Rol</h2>
                <p>
                  <strong>Nombre:</strong> {currentRol.nombre}
                </p>
                <p>
                  <strong>Permisos:</strong> {currentRol.permisos?.join(", ")}
                </p>
                <p>
                  <strong>Anulado:</strong> {currentRol.anulado ? "Sí" : "No"}
                </p>
                <button className="close-button" onClick={closeModal}>
                  Cerrar
                </button>
              </>
            ) : (
              <>
                <h2>{modalType === "create" ? "Crear Rol" : "Editar Rol"}</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const permisosSeleccionados = permisosDisponibles.filter(
                      (permiso) =>
                        formData.get(`permiso-${permiso.id}`) === "on"
                    );
                    const rol = {
                      id: currentRol ? currentRol.id : Date.now(),
                      nombre: formData.get("nombre"),
                      permisos: permisosSeleccionados.map((p) => p.name),
                      anulado: currentRol?.anulado || false,
                    };
                    handleSave(rol);
                  }}
                >
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre del Rol"
                    defaultValue={currentRol?.nombre || ""}
                    required
                  />

                  <div className="checkbox-group">
                    <h3>Seleccionar Permisos:</h3>
                    {permisosPaginados.map((permiso, index) => (
                      <label key={permiso.id} className="checkbox-item">
                        <input
                          type="checkbox"
                          name={`permiso-${permiso.id}`}
                          defaultChecked={
                            currentRol?.permisos?.includes(permiso.name) ||
                            false
                          }
                        />
                        {permiso.name}
                      </label>
                    ))}
                  </div>

                  {/* Controles de paginación */}
                  <div className="pagination">
                    <button
                      type="button"
                      disabled={paginaActual === 1}
                      onClick={() => setPaginaActual((prev) => prev - 1)}
                    >
                      Anterior
                    </button>
                    <button
                      type="button"
                      disabled={
                        paginaActual ===
                        Math.ceil(permisosDisponibles.length / itemsPorPagina)
                      }
                      onClick={() => setPaginaActual((prev) => prev + 1)}
                    >
                      Siguiente
                    </button>
                  </div>

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

export default Rol;
