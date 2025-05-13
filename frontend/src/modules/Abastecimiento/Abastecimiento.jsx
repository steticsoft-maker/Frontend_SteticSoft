import React, { useState, useEffect } from "react";
import NavbarAdmin from "../../components/NavbarAdmin/NavbarAdmin";
import { FaEye, FaTrash, FaEdit } from "react-icons/fa";
import "./Abastecimiento.css";

const Abastecimiento = () => {
  const initialProductos = [
    {
      id: 1,
      nombre: "Shampoo Profesional",
      cantidad: 50,
      fechaIngreso: "2025-04-01",
      empleado: "Carlos López",
    },
    {
      id: 2,
      nombre: "Tijeras de Corte",
      cantidad: 20,
      fechaIngreso: "2025-04-02",
      empleado: "Ana Pérez",
    },
  ];

  const [productos, setProductos] = useState(initialProductos);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "create", "edit", "details", "selection"
  const [currentProducto, setCurrentProducto] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const [showProductModal, setShowProductModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);

  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);

  const [busquedaProductoModal, setBusquedaProductoModal] = useState("");
  const [busquedaEmpleadoModal, setBusquedaEmpleadoModal] = useState("");

  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    localStorage.setItem("abastecimiento", JSON.stringify(productos));
  }, [productos]);

  const productosDisponibles = [
    "Shampoo Profesional",
    "Tijeras de Corte",
    "Secadora",
    "Peine",
  ];
  const empleados = ["Carlos López", "Ana Pérez", "Luis Torres"];

  const filteredProductos = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const filteredProductosModal = productosDisponibles.filter((prod) =>
    prod.toLowerCase().includes(busquedaProductoModal.toLowerCase())
  );

  const filteredEmpleadosModal = empleados.filter((emp) =>
    emp.toLowerCase().includes(busquedaEmpleadoModal.toLowerCase())
  );

  const openProductModal = () => {
    setBusquedaProductoModal("");
    setModalType("selection"); // Usar modalType general para controlar overlay
    setShowProductModal(true);
  };
  const closeProductModal = () => {
    setShowProductModal(false);
    if (!showEmployeeModal) {
      // Solo cerrar el modal general si el otro modal de selección no está abierto
      setModalType("");
    }
  };

  const openEmployeeModal = () => {
    setBusquedaEmpleadoModal("");
    setModalType("selection"); // Usar modalType general para controlar overlay
    setShowEmployeeModal(true);
  };
  const closeEmployeeModal = () => {
    setShowEmployeeModal(false);
    if (!showProductModal) {
      // Solo cerrar el modal general si el otro modal de selección no está abierto
      setModalType("");
    }
  };

  const handleSave = (producto) => {
    // Validación básica
    if (!producto.nombre || !producto.cantidad || !producto.empleado) {
      alert(
        "Por favor, completa todos los campos obligatorios (Producto, Cantidad, Empleado)."
      );
      return;
    }

    if (modalType === "create") {
      setProductos([...productos, { ...producto, id: Date.now() }]);
    } else if (modalType === "edit" && currentProducto) {
      const updatedProductos = productos.map((p) =>
        p.id === currentProducto.id ? { ...currentProducto, ...producto } : p
      );
      setProductos(updatedProductos);
    }
    closeModal();
  };

  const openModal = (type, producto = null) => {
    setModalType(type);
    setCurrentProducto(producto);
    // Resetear selecciones al abrir modal de creación/edición
    if (type === "create") {
      setProductoSeleccionado(null);
      setEmpleadoSeleccionado(null);
    } else if (type === "edit" && producto) {
      // Cargar datos del producto para edición
      setProductoSeleccionado(producto.nombre);
      setEmpleadoSeleccionado(producto.empleado);
    }
    // Si es detalles, las selecciones no son necesarias en el formulario
    setShowModal(true); // Controla el modal principal (form/details)
    setModalType(type); // Asegura que modalType esté configurado
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType("");
    setCurrentProducto(null);
    // Resetear selecciones al cerrar el modal principal
    setProductoSeleccionado(null);
    setEmpleadoSeleccionado(null);
    // Cerrar también modales de selección si estuvieran abiertos
    setShowProductModal(false);
    setShowEmployeeModal(false);
  };

  const handleDelete = (id) => {
    const prod = productos.find((p) => p.id === id);
    setConfirmDelete(prod);
  };

  const deleteProducto = () => {
    setProductos(productos.filter((p) => p.id !== confirmDelete.id));
    setConfirmDelete(null);
  };

  return (
    <div className="abastecimiento-container">
      <NavbarAdmin />
      {/* Área principal al lado de la barra lateral */}
      <div className="main-content-area">
        {/* Contenedor para centrar el bloque de contenido (título, acciones, tabla) */}
        <div className="abastecimiento-content-wrapper">
          <h1>Gestión de Abastecimiento</h1>
          <div className="containerAgregarBuscarAbastecimiento">
            {" "}
            {/* Clase existente */}
            <input
              type="text"
              placeholder="Buscar producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="inputBuscarAbastecimiento"
            />
            <button
              className="botonAgregarAbastecimiento"
              onClick={() => openModal("create")}
            >
              Agregar Producto
            </button>
          </div>

          {/* Tabla de abastecimientos */}
          <table className="tabla-abastecimiento">
            {" "}
            {/* Clase existente */}
            <thead>
              <tr>
                {/* Columnas a mostrar */}
                <th>Nombre</th>
                <th>Cantidad</th>
                <th>Empleado Asignado</th>
                <th>Fecha de Ingreso</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProductos.map((producto) => (
                <tr key={producto.id}>
                  {/* Datos de las columnas */}
                  <td>{producto.nombre}</td>
                  <td>{producto.cantidad}</td>
                  <td>{producto.empleado}</td>
                  <td>{producto.fechaIngreso}</td>
                  <td>
                    {/* Iconos de acción */}
                    <div className="icon-actions-abastecimiento">
                      <button
                        className="table-icons-abastecimiento"
                        onClick={() => openModal("details", producto)}
                        title="Ver Detalles"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="table-icons-abastecimiento"
                        onClick={() => openModal("edit", producto)}
                        title="Editar Producto"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="table-icons-abastecimiento delete-button-abastecimiento"
                        onClick={() => handleDelete(producto.id)}
                        title="Eliminar Producto"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>{" "}
        {/* Fin abastecimiento-content-wrapper */}
      </div>{" "}
      {/* Fin main-content-area */}
      {/* Modal Principal (Agregar / Editar / Ver Detalles) */}
      {showModal && (
        <div className="modal-abastecimiento-overlay">
          <div className="modal-abastecimiento-content">
            {modalType === "details" && currentProducto ? (
              /* Reemplazado Fragment con un div con la clase para alinear texto */
              <div className="abastecimiento-details-text">
                <h2>Detalles del Producto</h2>
                <p>
                  <strong>Nombre:</strong> {currentProducto.nombre}
                </p>
                <p>
                  <strong>Cantidad:</strong> {currentProducto.cantidad}
                </p>
                <p>
                  <strong>Empleado:</strong> {currentProducto.empleado}
                </p>
                <p>
                  <strong>Fecha de Ingreso:</strong>
                  {currentProducto.fechaIngreso}
                </p>
                {/* El botón de cerrar puede ir dentro o fuera de este div dependiendo del diseño deseado */}
                <button
                  className="modal-abastecimiento-button-cerrar"
                  onClick={closeModal}
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <>
                {/* ... Código del formulario ... */}
                <h2>
                  {modalType === "create"
                    ? "Agregar Producto"
                    : "Editar Producto"}
                </h2>
                <form
                  className="formularioModalAbastecimiento"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const producto = {
                      id: currentProducto ? currentProducto.id : Date.now(),
                      nombre: productoSeleccionado,
                      cantidad: Number(formData.get("cantidad")),
                      empleado: empleadoSeleccionado,
                      fechaIngreso: new Date().toISOString().split("T")[0], // Captura la fecha actual
                    };
                    handleSave(producto);
                  }}
                >
                  {/* Botones para abrir modales de selección */}
                  <div className="form-group-abastecimiento">
                    <label className="form-label-abastecimiento">
                      Producto:
                      <span className="required-asterisk">*</span>{" "}
                      {/* Asterisco rojo */}
                    </label>
                    <button
                      type="button"
                      className="form-button-select-abastecimiento"
                      onClick={openProductModal}
                    >
                      Seleccionar Producto
                    </button>
                    <p>
                      <strong>Producto Seleccionado:</strong>{" "}
                      {productoSeleccionado || "Ninguno"}
                    </p>
                  </div>

                  <div className="form-group-abastecimiento">
                    <label className="form-label-abastecimiento">
                      Empleado:
                      <span className="required-asterisk">*</span>{" "}
                      {/* Asterisco rojo */}
                    </label>
                    <button
                      type="button"
                      className="form-button-select-abastecimiento"
                      onClick={openEmployeeModal}
                    >
                      Seleccionar Empleado
                    </button>
                    <p>
                      <strong>Empleado Seleccionado:</strong>{" "}
                      {empleadoSeleccionado || "Ninguno"}
                    </p>
                  </div>

                  {/* Campo Cantidad */}
                  <div className="form-group-abastecimiento">
                    <label
                      htmlFor="cantidad"
                      className="form-label-abastecimiento"
                    >
                      Cantidad:
                      <span className="required-asterisk">*</span>{" "}
                      {/* Asterisco rojo */}
                    </label>
                    <input
                      id="cantidad"
                      className="form-input-abastecimiento"
                      type="number"
                      name="cantidad"
                      placeholder="Cantidad"
                      defaultValue={currentProducto?.cantidad || ""}
                      required
                    />
                  </div>

                  {/* Botones Guardar/Cancelar */}
                  <div className="form-actions-abastecimiento">
                    <button
                      type="submit"
                      className="form-button-guardar-abastecimiento"
                    >
                      Guardar
                    </button>
                    <button
                      type="button"
                      className="form-button-cancelar-abastecimiento"
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
      {/* Modales de selección de Producto/Empleado */}
      {/* Reutilizamos el mismo overlay principal para mantener la consistencia visual */}
      {(showEmployeeModal || showProductModal) && (
        <div className="modal-abastecimiento-overlay">
          {" "}
          {/* Reutiliza la clase de overlay principal */}
          {/* Contenedor específico para el modal de selección */}
          <div className="modal-abastecimiento-selection-container">
            {" "}
            {/* Nueva clase consistente */}
            {showEmployeeModal && (
              <>
                <h2>Seleccionar Empleado</h2>
                <input
                  className="modal-selection-input-abastecimiento" // Nueva clase consistente
                  type="text"
                  placeholder="Buscar empleado..."
                  value={busquedaEmpleadoModal}
                  onChange={(e) => setBusquedaEmpleadoModal(e.target.value)}
                />
                <ul className="modal-selection-list-abastecimiento">
                  {" "}
                  {/* Nueva clase consistente */}
                  {filteredEmpleadosModal.map((emp) => (
                    <li key={emp}>
                      <button
                        onClick={() => {
                          setEmpleadoSeleccionado(emp);
                          closeEmployeeModal();
                        }}
                      >
                        {emp}
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  className="modal-abastecimiento-button-cerrar"
                  onClick={closeEmployeeModal}
                >
                  {" "}
                  {/* Reutiliza la clase del botón cerrar */}
                  Cerrar
                </button>
              </>
            )}
            {showProductModal && (
              <>
                <h2>Seleccionar Producto</h2>
                <input
                  className="modal-selection-input-abastecimiento" // Nueva clase consistente
                  type="text"
                  placeholder="Buscar producto..."
                  value={busquedaProductoModal}
                  onChange={(e) => setBusquedaProductoModal(e.target.value)}
                />
                <ul className="modal-selection-list-abastecimiento">
                  {" "}
                  {/* Nueva clase consistente */}
                  {filteredProductosModal.map((prod) => (
                    <li key={prod}>
                      <button
                        onClick={() => {
                          setProductoSeleccionado(prod);
                          closeProductModal();
                        }}
                      >
                        {prod}
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  className="modal-abastecimiento-button-cerrar"
                  onClick={closeProductModal}
                >
                  {" "}
                  {/* Reutiliza la clase del botón cerrar */}
                  Cerrar
                </button>
              </>
            )}
          </div>{" "}
          {/* Fin modal-abastecimiento-selection-container */}
        </div>
      )}
      {/* Modal de confirmación para eliminar un producto */}
      {confirmDelete && (
        <div className="modal-abastecimiento-overlay">
          {" "}
          {/* Reutiliza la clase de overlay principal */}
          <div className="modal-abastecimiento-content modal-abastecimiento-confirm">
            {" "}
            {/* Reutiliza la clase base y añade una específica */}
            <h3>¿Eliminar producto?</h3>
            <p>
              ¿Estás seguro de que deseas eliminar el producto
              <strong>{confirmDelete.nombre}</strong>?
            </p>
            <div className="form-actions-abastecimiento">
              {" "}
              {/* Reutiliza la clase de botones de acción */}
              <button
                className="form-button-guardar-abastecimiento"
                onClick={deleteProducto}
              >
                {" "}
                {/* Reutiliza clase, CSS definirá color de eliminación */}
                Eliminar
              </button>
              <button
                className="form-button-cancelar-abastecimiento" // Reutiliza clase
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

export default Abastecimiento;
