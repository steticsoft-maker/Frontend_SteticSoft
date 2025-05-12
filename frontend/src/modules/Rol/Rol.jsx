import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarAdmin from "../../components/NavbarAdmin/NavbarAdmin";
import "./Rol.css"; // Usaremos el CSS modificado con nombres consistentes
import { FaEye, FaTrash, FaEdit } from "react-icons/fa";

// Definimos los módulos disponibles y sus IDs (igual que antes)
const modulosPermisos = [
  { id: 1, nombre: "Usuarios" },
  { id: 2, nombre: "Ventas" },
  { id: 3, nombre: "Productos" },
  { id: 4, nombre: "Reportes" },
  { id: 5, nombre: "Clientes" },
  { id: 6, nombre: "Proveedores" },
  { id: 7, nombre: "Inventario" },
  { id: 8, nombre: "Configuración" },
  { id: 9, nombre: "Dashboard" },
  { id: 10, nombre: "Finanzas" },
  { id: 11, nombre: "Comunicados" },
  { id: 12, nombre: "Soporte" },
];

// Datos iniciales de roles (igual que antes)
const initialRoles = [
  {
    id: 1,
    nombre: "Administrador",
    descripcion: "Acceso completo a todas las funciones del sistema.",
    permisos: modulosPermisos.map((m) => m.nombre), // Admin tiene todos los módulos por defecto
    anulado: false,
  },
  {
    id: 2,
    nombre: "Vendedor",
    descripcion: "Acceso a módulos de ventas, clientes y productos",
    permisos: ["Ventas", "Clientes", "Productos"],
    anulado: false,
  },
  {
    id: 3,
    nombre: "Consulta",
    descripcion: "Solo permisos de visualización de reportes e inventario",
    permisos: ["Reportes", "Inventario"],
    anulado: true,
  },
];

const Rol = () => {
  const [roles, setRoles] = useState(() => {
    const savedRoles = localStorage.getItem("roles");
    return savedRoles ? JSON.parse(savedRoles) : initialRoles;
  });
  const [busqueda, setBusqueda] = useState("");

  // Estados para el modal (siguiendo el patrón de Usuarios.jsx)
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "create", "edit", "details", "confirmDelete", "validation"
  const [currentRole, setCurrentRole] = useState(null); // Rol actual para editar, ver detalles o eliminar
  // Nuevo estado para manejar los datos del formulario dentro del modal (para crear/editar)
  const [formRoleData, setFormRoleData] = useState({
    id: null,
    nombre: "",
    descripcion: "",
    permisos: [], // Nombres de módulos seleccionados
    anulado: false,
  });
  // Estado para almacenar los IDs de los módulos seleccionados en el formulario
  const [modulosSeleccionadosIds, setModulosSeleccionadosIds] = useState([]);
  // Estado para controlar la visibilidad de la sección de selección de módulos en el formulario
  const [mostrarSeleccionModulos, setMostrarSeleccionModulos] = useState(false);

  // Cargar/Guardar roles en localStorage
  useEffect(() => {
    localStorage.setItem("roles", JSON.stringify(roles));
  }, [roles]);

  // Efecto para inicializar los datos del formulario cuando el modal se abre en modo edición o creación
  useEffect(() => {
    if (modalType === "create") {
      // Reset para el modo creación
      setFormRoleData({
        id: null,
        nombre: "",
        descripcion: "",
        permulos: [],
        anulado: false,
      });
      setModulosSeleccionadosIds([]);
      setMostrarSeleccionModulos(false); // Oculto por defecto en creación
    } else if (modalType === "edit" && currentRole) {
      // Cargar datos para el modo edición
      setFormRoleData({
        id: currentRole.id,
        nombre: currentRole.nombre || "",
        descripcion: currentRole.descripcion || "",
        permisos: currentRole.permisos || [],
        anulado: currentRole.anulado || false,
      });

      // Mapear nombres de módulos guardados a IDs para el estado de selección
      const selectedModuleIds = modulosPermisos
        .filter((modulo) =>
          (currentRole.permisos || []).includes(modulo.nombre)
        )
        .map((modulo) => modulo.id);
      setModulosSeleccionadosIds(selectedModuleIds);

      // Si es el rol Administrador, seleccionar automáticamente todos los módulos y mostrar la sección
      if (currentRole.nombre === "Administrador") {
        const allModuloIds = modulosPermisos.map((m) => m.id);
        setModulosSeleccionadosIds(allModuloIds);
        setMostrarSeleccionModulos(true); // Mostrar para Admin (no editable)
      } else {
        setMostrarSeleccionModulos(false); // Ocultar por defecto al editar (para otros roles)
      }
    } else if (modalType === "confirmDelete" && currentRole) {
      // Si es modal de confirmación, no necesitamos datos del formulario, solo el currentRole
    }
    // No hacemos nada si es 'details' o 'validation', ya que solo usan currentRole o un mensaje simple
  }, [modalType, currentRole, modulosPermisos]);

  // Efecto adicional para el caso de que los módulos cambien (aunque en este caso son estáticos)
  // y para asegurar que el admin siempre tenga todo seleccionado y visible en el formulario
  useEffect(() => {
    if (modalType === "edit" && currentRole?.nombre === "Administrador") {
      const allModuloIds = modulosPermisos.map((m) => m.id);
      setModulosSeleccionadosIds(allModuloIds);
      setMostrarSeleccionModulos(true); // Asegurar que esté visible para Admin
    }
  }, [modalType, currentRole?.nombre, modulosPermisos]); // Depende del nombre del rol y los módulos

  // Función para agregar o quitar un módulo (toggle) en el formulario
  const toggleModulo = (moduloId) => {
    // Si es el rol Administrador, no permitir cambios
    if (modalType === "edit" && currentRole?.nombre === "Administrador") {
      return;
    }

    setModulosSeleccionadosIds((prevIds) => {
      if (prevIds.includes(moduloId)) {
        return prevIds.filter((id) => id !== moduloId);
      } else {
        return [...prevIds, moduloId];
      }
    });
  };

  // Función para alternar la visibilidad de la sección de selección de módulos en el formulario
  const handleToggleSeleccionModulos = () => {
    // Si es el rol Administrador, no permitir alternar
    if (modalType === "edit" && currentRole?.nombre === "Administrador") {
      return; // Opcional: Puedes mostrar un mensaje aquí si quieres
    }
    setMostrarSeleccionModulos(!mostrarSeleccionModulos);
  };

  // Lógica para guardar/actualizar rol desde el formulario
  const handleSave = () => {
    // Validar campos obligatorios (ejemplo básico)
    if (!formRoleData.nombre.trim()) {
      // Podrías usar un estado para mensajes de validación si quieres un modal específico,
      // pero por ahora usamos alert para simplificar.
      alert("Debes ingresar un nombre para el rol");
      return;
    }

    // Mapear IDs de módulos seleccionados a nombres para guardar
    const selectedModuloNames = modulosSeleccionadosIds
      .map((id) => {
        const modulo = modulosPermisos.find((m) => m.id === id);
        return modulo ? modulo.nombre : null;
      })
      .filter((name) => name !== null);

    const rolAGuardar = {
      id:
        modalType === "edit" && formRoleData.id ? formRoleData.id : Date.now(), // Usar ID existente o generar uno nuevo
      nombre: formRoleData.nombre,
      descripcion: formRoleData.descripcion,
      permisos: selectedModuloNames, // Guardamos los nombres de los módulos seleccionados
      // Anulado solo editable en modo edición si no es Admin
      anulado: modalType === "edit" ? formRoleData.anulado : false,
    };

    setRoles((prevRoles) => {
      if (modalType === "edit") {
        // Actualizar rol existente
        return prevRoles.map((rol) =>
          rol.id === rolAGuardar.id ? rolAGuardar : rol
        );
      } else {
        // modalType === 'create'
        // Verificar si ya existe un rol con el mismo nombre (case insensitive)
        const nameExists = prevRoles.some(
          (r) => r.nombre.toLowerCase() === rolAGuardar.nombre.toLowerCase()
        );
        if (nameExists) {
          alert("Ya existe un rol con este nombre.");
          // No agregar el rol si el nombre ya existe
          return prevRoles;
        }
        // Agregar nuevo rol
        return [...prevRoles, rolAGuardar];
      }
    });

    closeModal(); // Cerrar modal al guardar
  };

  // Abrir modal (Crear, Editar, Detalles, Confirmación, Validación)
  const openModal = (type, role = null) => {
    // Validaciones antes de abrir modales específicos
    if (type === "edit" && role?.nombre === "Administrador") {
      alert(
        "El rol 'Administrador' tiene permisos fijos (todos los módulos) y no se puede editar a través de este formulario."
      );
      return;
    }
    if (type === "confirmDelete" && role?.nombre === "Administrador") {
      alert("El rol 'Administrador' no puede ser eliminado.");
      return;
    }
    // Nota: Para 'details', podrías decidir si el Admin se ve diferente o con campos deshabilitados.
    // Por ahora, el renderModalContentRol manejará cómo se muestra el Admin en detalles.

    setModalType(type);
    setCurrentRole(role); // Pasa los datos del rol si es editar, detalles o eliminar
    setShowModal(true);
    // El useEffect para inicializar formRoleData se activará con el cambio de modalType/currentRole
  };

  // Cerrar modal principal
  const closeModal = () => {
    setShowModal(false);
    setModalType("");
    setCurrentRole(null);
    // Reset de los estados del formulario al cerrar
    setFormRoleData({
      id: null,
      nombre: "",
      descripcion: "",
      permisos: [],
      anulado: false,
    });
    setModulosSeleccionadosIds([]);
    setMostrarSeleccionModulos(false);
  };

  // Anular/Activar rol
  const toggleAnular = (id) => {
    // No permitir anular/activar al rol "Administrador"
    const rolToToggle = roles.find((r) => r.id === id);
    if (rolToToggle?.nombre === "Administrador") {
      alert("El rol 'Administrador' no puede ser anulado/activado.");
      return;
    }

    const updatedRoles = roles.map((r) =>
      r.id === id ? { ...r, anulado: !r.anulado } : r
    );
    setRoles(updatedRoles);
  };

  // Renderizar el contenido específico dentro del modal
  const renderModalContentRol = () => {
    const isCreating = modalType === "create";
    const isEditing = modalType === "edit";
    const isDetails = modalType === "details";
    const isConfirmDelete = modalType === "confirmDelete";
    const isValidation = modalType === "validation"; // Aunque no tenemos un modal 'validation' completo aún

    // === Contenido del modal de Detalles ===
    if (isDetails && currentRole) {
      return (
        <div className="rol-modalContent-details">
          {" "}
          {/* Clase específica para detalles */}
          <h2>Detalles del Rol</h2>
          <p>
            <strong>Nombre:</strong> {currentRole.nombre}
          </p>
          <p>
            <strong>Descripción:</strong> {currentRole.descripcion}
          </p>
          <div>
            <strong>Módulos Asignados:</strong>
            <ul className="rol-listaModulosDetalle">
              {" "}
              {/* Nueva clase para lista en detalles */}
              {(currentRole.permisos || []).map((moduloNombre, index) => (
                <li key={index}>{moduloNombre}</li>
              ))}
            </ul>
          </div>
          <p>
            <strong>Estado:</strong>{" "}
            {currentRole.anulado ? "Inactivo" : "Activo"}
          </p>
          <button className="rol-modalButton-cerrar" onClick={closeModal}>
            Cerrar
          </button>
        </div>
      );
    }

    // === Contenido del modal de Confirmación para eliminar ===
    if (isConfirmDelete && currentRole) {
      return (
        <div className="rol-modalContent-confirm">
          {" "}
          {/* Clase específica para confirmación */}
          <h3>¿Eliminar rol?</h3>
          <p>
            ¿Estás seguro de que deseas eliminar el rol{" "}
            <strong>{currentRole.nombre}</strong>?
          </p>
          <div className="rol-form-actions">
            {" "}
            {/* Reutilizamos clase para los botones */}
            <button
              className="rol-form-buttonGuardar"
              onClick={() => {
                setRoles(roles.filter((r) => r.id !== currentRole.id));
                closeModal(); // Cerrar después de eliminar
              }}
            >
              Eliminar
            </button>
            <button className="rol-form-buttonCancelar" onClick={closeModal}>
              Cancelar
            </button>
          </div>
        </div>
      );
    }

    // === Contenido del modal de Formulario (Crear/Editar) ===
    if (isCreating || isEditing) {
      // El rol 'Administrador' no puede ser modificado en este formulario
      const isRoleAdmin = isEditing && currentRole?.nombre === "Administrador";

      return (
        <div className="rol-modalContent-form">
          {" "}
          {/* Clase específica para formulario */}
          <h2>{isCreating ? "Crear Rol" : "Editar Rol"}</h2>
          {isRoleAdmin ? (
            <p className="rol-admin-message">
              El rol 'Administrador' tiene permisos fijos (todos los módulos) y
              no puede ser modificado desde aquí.
            </p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              {/* Sección Información del Rol */}
              <div className="rol-seccionInformacionRol">
                {" "}
                {/* Clase reutilizada */}
                <h3>Información del Rol</h3>
                <div className="rol-formularioInformacionRol">
                  {" "}
                  {/* Clase reutilizada */}
                  <div className="rol-campoContainer">
                    {" "}
                    {/* Clase reutilizada */}
                    <label htmlFor="nombreRolInput" className="rol-label">
                      Nombre del Rol:
                    </label>
                    <input
                      id="nombreRolInput"
                      type="text"
                      placeholder="Ingrese el nombre del rol"
                      value={formRoleData.nombre}
                      onChange={(e) =>
                        setFormRoleData({
                          ...formRoleData,
                          nombre: e.target.value,
                        })
                      }
                      className="rol-input" // Clase reutilizada
                      disabled={isRoleAdmin} // Deshabilitar nombre si es Admin
                      required
                    />
                  </div>
                  <div className="rol-campoContainer">
                    <label htmlFor="descripcionRolInput" className="rol-label">
                      Descripción del Rol:
                    </label>
                    <textarea
                      id="descripcionRolInput"
                      placeholder="Ingrese la descripción del rol"
                      value={formRoleData.descripcion}
                      onChange={(e) =>
                        setFormRoleData({
                          ...formRoleData,
                          descripcion: e.target.value,
                        })
                      }
                      className="rol-textarea" // Clase reutilizada
                      disabled={isRoleAdmin} // Deshabilitar descripción si es Admin
                    />
                  </div>
                  {/* Checkbox para Anular/Activar solo en modo edición y si no es Admin */}
                  {isEditing && !isRoleAdmin && (
                    <div className="rol-campoContainer">
                      <label className="rol-label">Estado:</label>
                      <label className="switch">
                        {" "}
                        {/* Clase switch reutilizada */}
                        <input
                          type="checkbox"
                          checked={formRoleData.anulado}
                          onChange={(e) =>
                            setFormRoleData({
                              ...formRoleData,
                              anulado: e.target.checked,
                            })
                          }
                        />
                        <span className="slider"></span>{" "}
                        {/* Clase slider reutilizada */}
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Botón para mostrar/ocultar la sección de selección de módulos */}
              {!isRoleAdmin && ( // No mostrar el botón si es Admin
                <button
                  type="button" // Importante: Evita que el botón envíe el formulario
                  className="rol-botonSeleccionarPermisos" // Clase CSS
                  onClick={handleToggleSeleccionModulos}
                >
                  {mostrarSeleccionModulos
                    ? "Ocultar Módulos"
                    : "Seleccionar Módulos"}
                </button>
              )}

              {/* Sección de Selección de Módulos (Visible/Oculto y deshabilitado para Admin) */}
              {(mostrarSeleccionModulos || isRoleAdmin) && ( // Mostrar si se togglea o si es Admin (siempre visible para Admin)
                <div className="rol-seccionSeleccionarModulos">
                  {" "}
                  {/* Clase reutilizada */}
                  <h3>Módulos Disponibles ({modulosPermisos.length})</h3>
                  <div className="rol-contenedorModulos rol-modulos-grid">
                    {" "}
                    {/* Clases reutilizadas */}
                    {modulosPermisos.map((modulo) => (
                      <div key={modulo.id} className="rol-moduloItem">
                        {" "}
                        {/* Clase reutilizada */}
                        <input
                          type="checkbox"
                          id={`modulo-${modulo.id}`}
                          checked={modulosSeleccionadosIds.includes(modulo.id)}
                          onChange={() => toggleModulo(modulo.id)}
                          disabled={isRoleAdmin} // Deshabilitar checkbox si es Admin
                        />
                        <label htmlFor={`modulo-${modulo.id}`}>
                          {modulo.nombre}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sección de Módulos Seleccionados (Display) */}
              <div className="rol-seccionModulosSeleccionados">
                {" "}
                {/* Clase reutilizada */}
                <h3>
                  Módulos Seleccionados ({modulosSeleccionadosIds.length})
                </h3>
                {modulosSeleccionadosIds.length > 0 ? (
                  <ul className="rol-listaModulosSeleccionados">
                    {" "}
                    {/* Clase reutilizada */}
                    {modulosSeleccionadosIds
                      .map(
                        (id) => modulosPermisos.find((m) => m.id === id)?.nombre
                      )
                      .filter((nombre) => nombre !== undefined)
                      .map((moduloNombre, index) => (
                        <li key={index}>{moduloNombre}</li>
                      ))}
                  </ul>
                ) : (
                  <p>No hay módulos seleccionados</p>
                )}
              </div>

              {/* Botones de acción final (Guardar/Cancelar) */}
              {!isRoleAdmin && ( // No mostrar botones de guardar/cancelar si es Admin
                <div className="rol-form-actions">
                  {" "}
                  {/* Clase reutilizada */}
                  <button type="submit" className="rol-form-buttonGuardar">
                    {" "}
                    {/* Clase reutilizada */}
                    {isEditing ? "Actualizar Rol" : "Crear Rol"}
                  </button>
                  <button
                    type="button"
                    className="rol-form-buttonCancelar"
                    onClick={closeModal}
                  >
                    {" "}
                    {/* Clase reutilizada */}
                    Cancelar
                  </button>
                </div>
              )}
              {isRoleAdmin && ( // Mostrar solo botón de cerrar si es Admin
                <div className="rol-form-actions">
                  <button
                    type="button"
                    className="rol-modalButton-cerrar"
                    onClick={closeModal}
                  >
                    Cerrar
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
      );
    }

    // === Contenido del modal de Validación (ejemplo simple) ===
    if (isValidation) {
      // Puedes implementar un modal de validación más sofisticado aquí si es necesario,
      // pasando mensajes específicos a través del estado.
      return (
        <div className="rol-modalContent-validation">
          {" "}
          {/* Clase específica para validación */}
          <h3>Error de Validación</h3>
          <p>
            Por favor, revise los datos ingresados o la operación solicitada.
          </p>
          <button className="rol-modalButton-cerrar" onClick={closeModal}>
            Cerrar
          </button>
        </div>
      );
    }

    return null; // No renderizar nada si no hay modalType válido
  };

  const filteredRoles = roles.filter(
    (r) =>
      r.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.descripcion.toLowerCase().includes(busqueda.toLowerCase()) // Permitir buscar por descripción también
  );

  return (
    <div className="rol-container">
      <NavbarAdmin />
      {/* El contenido principal de la página */}
      <div className="rol-content">
        {" "}
        {/* Renombramos a rol-content */}
        <h1>Gestión de Roles</h1>
        {/* Barra de búsqueda y botón "Crear Rol" */}
        <div className="rol-accionesTop">
          {" "}
          {/* Renombramos a rol-accionesTop */}
          <input
            type="text"
            placeholder="Buscar rol..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="rol-barraBusqueda"
          />
          <button
            className="rol-botonAgregar" /* Renombramos a rol-botonAgregar */
            onClick={() => openModal("create")}
          >
            Crear Rol
          </button>
        </div>
        {/* Tabla de Roles */}
        <table className="rol-table">
          {" "}
          {/* Clase existente, la mantenemos */}
          <thead>
            <tr>
              <th>Nombre del Rol</th>
              <th>Descripción</th>
              <th>Módulos Asignados</th>
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
                  {/* Mostrar solo algunos módulos en la tabla */}
                  {(rol.permisos || []).length > 3
                    ? (rol.permisos || []).slice(0, 3).join(", ") + "..."
                    : (rol.permisos || []).join(", ")}
                </td>
                <td>
                  {rol.nombre !== "Administrador" ? (
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={rol.anulado || false}
                        onChange={() => toggleAnular(rol.id)}
                      />
                      <span className="slider"></span>
                    </label>
                  ) : (
                    <span>Activo</span> // Rol Admin siempre Activo visualmente
                  )}
                </td>
                <td>
                  {/* Iconos de acción en la tabla */}
                  <div className="rol-table-iconos">
                    {" "}
                    {/* Renombramos a rol-table-iconos */}
                    <button
                      className="rol-table-button" /* Renombramos a rol-table-button */
                      onClick={() => openModal("details", rol)}
                      title="Ver Detalles"
                    >
                      <FaEye />
                    </button>
                    {/* Botones de edición y eliminación solo si no es el rol Admin */}
                    {rol.nombre !== "Administrador" && (
                      <>
                        <button
                          className="rol-table-button" /* Renombramos a rol-table-button */
                          onClick={() => openModal("edit", rol)} // Abre el modal en modo edición
                          title="Editar Rol"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="rol-table-button rol-table-button-delete" /* Renombramos y añadimos clase específica */
                          onClick={() => openModal("confirmDelete", rol)} // Abre el modal de confirmación
                          title="Eliminar Rol"
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
      </div>

      {/* === Modales === */}

      {/* Modal Principal (para Crear, Editar, Detalles, Confirmación, Validación) */}
      {showModal && (
        <div className="rol-modalOverlay">
          {" "}
          {/* Renombramos a rol-modalOverlay */}
          <div className="rol-modalContent">
            {" "}
            {/* Renombramos a rol-modalContent */}
            {renderModalContentRol()}{" "}
            {/* Renderiza el contenido según modalType */}
          </div>
        </div>
      )}

      {/* Nota: Los modales de confirmación y validación ya no se renderizan aquí directamente,
           son parte de renderModalContentRol. El estado confirmDelete ya no es necesario para controlar el modal,
           solo para almacenar el rol a eliminar temporalmente si quieres esa lógica separada,
           pero el enfoque de Usuarios integra confirmación con modalType.
           Vamos a eliminar el estado confirmDelete y la lógica asociada.
      */}
      {/* Eliminamos el renderizado directo de confirmDelete */}
      {/* Eliminamos el renderizado directo del modal de validación */}
    </div>
  );
};

export default Rol;
