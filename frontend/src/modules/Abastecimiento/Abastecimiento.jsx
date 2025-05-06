import React, { useState, useEffect } from "react";
import NavbarAdmin from "../../components/NavbarAdmin";
import { FaEye, FaTrash, FaEdit } from "react-icons/fa";
import "./Abastecimiento.css";

const Abastecimiento = () => {
  // Datos iniciales de productos de abastecimiento
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

  // Estados principales
  const [productos, setProductos] = useState(initialProductos);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "create", "edit", "details"
  const [currentProducto, setCurrentProducto] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  // Estados para los modales de selección
  const [showProductModal, setShowProductModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);

  // Estados para las selecciones en el formulario
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);

  // Estados para búsquedas internas de los modales
  const [busquedaProductoModal, setBusquedaProductoModal] = useState("");
  const [busquedaEmpleadoModal, setBusquedaEmpleadoModal] = useState("");

  // Estado para el modal de confirmación de eliminación de producto
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    localStorage.setItem("abastecimiento", JSON.stringify(productos));
  }, [productos]);

  // Listas de productos y empleados disponibles (simulados)
  const productosDisponibles = [
    "Shampoo Profesional",
    "Tijeras de Corte",
    "Secadora",
    "Peine",
  ];
  const empleados = ["Carlos López", "Ana Pérez", "Luis Torres"];

  // Filtrado para la búsqueda en la tabla principal
  const filteredProductos = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Filtrado para la búsqueda en el modal de selección de producto
  const filteredProductosModal = productosDisponibles.filter((prod) =>
    prod.toLowerCase().includes(busquedaProductoModal.toLowerCase())
  );

  // Filtrado para la búsqueda en el modal de selección de empleado
  const filteredEmpleadosModal = empleados.filter((emp) =>
    emp.toLowerCase().includes(busquedaEmpleadoModal.toLowerCase())
  );

  // Funciones para abrir y cerrar los modales de selección
  const openProductModal = () => {
    setBusquedaProductoModal("");
    setShowProductModal(true);
  };
  const closeProductModal = () => setShowProductModal(false);

  const openEmployeeModal = () => {
    setBusquedaEmpleadoModal("");
    setShowEmployeeModal(true);
  };
  const closeEmployeeModal = () => setShowEmployeeModal(false);

  const handleSave = (producto) => {
    if (modalType === "create") {
      setProductos([...productos, producto]);
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
    setEmpleadoSeleccionado(producto ? producto.empleado : null);
    setProductoSeleccionado(producto ? producto.nombre : null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType("");
    setCurrentProducto(null);
    setEmpleadoSeleccionado(null);
    setProductoSeleccionado(null);
  };

  // Para eliminación: se activa el modal de confirmación en lugar de window.confirm
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
      <div className="main-content-abastecimiento">
        <h1>Gestión de Abastecimiento</h1>
        <div className="containerAgregarBuscarabastecimiento">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="inputBuscarAbastecimiento"
          />
          <button className="botonAgregarAbastecimiento" onClick={() => openModal("create")}>
            Agregar Producto
          </button>
        </div>

        {/* Tabla de abastecimientos */}
        <table className="tabla-abastecimiento">
          <thead>
            <tr>
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
                <td>{producto.nombre}</td>
                <td>{producto.cantidad}</td>
                <td>{producto.empleado}</td>
                <td>{producto.fechaIngreso}</td>
                <td>
                  <div className="icon-actions-abastecimiento">
                    <button
                      className="table-icons-abastecimiento"
                      onClick={() => openModal("details", producto)}
                    >
                      <FaEye />
                    </button>
                    <button
                      className="table-icons-abastecimiento"
                      onClick={() => openModal("edit", producto)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="table-icons-abastecimiento delete-button-abastecimiento"
                      onClick={() => handleDelete(producto.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para Agregar / Editar / Ver Detalles */}
      {showModal && (
        <div className="modal-abastecimiento">
          <div className="modal-content-abastecimiento">
            {modalType === "details" && currentProducto ? (
              <>
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
                  <strong>Fecha de Ingreso:</strong>{" "}
                  {currentProducto.fechaIngreso}
                </p>
                <button className="cerrarModalAbastecimiento" onClick={closeModal}>
                  Cerrar
                </button>
              </>
            ) : (
              <>
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
                      fechaIngreso: new Date().toISOString().split("T")[0],
                    };
                    handleSave(producto);
                  }}
                >
                  <button
                    type="button"
                    className="actionButtonAgregarEliminar"
                    onClick={openProductModal}
                  >
                    Seleccionar Producto
                  </button>
                  <p>
                    <strong>Producto Seleccionado:</strong>{" "}
                    {productoSeleccionado || "Ninguno"}
                  </p>
                  <button
                    type="button"
                    className="actionButtonAgregarEliminar"
                    onClick={openEmployeeModal}
                  >
                    Seleccionar Empleado
                  </button>
                  <p>
                    <strong>Empleado Seleccionado:</strong>{" "}
                    {empleadoSeleccionado || "Ninguno"}
                  </p>
                  <input
                    className="inputCantidadAbastecimiento"
                    type="number"
                    name="cantidad"
                    placeholder="Cantidad*"
                    defaultValue={currentProducto?.cantidad || ""}
                    required
                  />
                  <div className="botonGuardar-CancelarModal">
                    <button type="submit" className="guardarModalAbastecimiento">
                      Guardar
                    </button>
                    <button
                      type="button"
                      className="cerrarModalAbastecimiento"
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

      {/* Modal para selección de Empleado con buscador */}
      {showEmployeeModal && (
        <div className="modal-overlay">
          <div className="modal-container-seleccion-empleadoProducto">
            <h2>Seleccionar Empleado</h2>
            <input
              className="inputBuscarProducto-empleado"
              type="text"
              placeholder="Buscar empleado..."
              value={busquedaEmpleadoModal}
              onChange={(e) => setBusquedaEmpleadoModal(e.target.value)}
            />
            <ul className="listaSeleccionarProducto-Empleado">
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
            <button className="cerrarModalAbastecimiento" onClick={closeEmployeeModal}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal para selección de Producto con buscador */}
      {showProductModal && (
        <div className="modal-overlay">
          <div className="modal-container-seleccion-empleadoProducto">
            <h2>Seleccionar Producto</h2>
            <input
              className="inputBuscarProducto-empleado"
              type="text"
              placeholder="Buscar producto..."
              value={busquedaProductoModal}
              onChange={(e) => setBusquedaProductoModal(e.target.value)}
            />
            <ul className="listaSeleccionarProducto-Empleado">
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
            <button className="cerrarModalAbastecimiento" onClick={closeProductModal}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar un producto */}
      {confirmDelete && (
        <div className="modal-abastecimiento">
          <div className="modal-content-abastecimiento">
            <h3>¿Eliminar producto?</h3>
            <p>
              ¿Estás seguro de que deseas eliminar el producto{" "}
              <strong>{confirmDelete.nombre}</strong>?
            </p>
            <div className="botonGuardar-CancelarModal">
              <button className="cerrarModalAbastecimiento" onClick={deleteProducto}>
                Eliminar
              </button>
              <button
                className="guardarModalAbastecimiento"
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
