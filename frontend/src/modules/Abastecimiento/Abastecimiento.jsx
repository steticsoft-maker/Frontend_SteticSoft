import React, { useState, useEffect } from "react";
import NavbarAdmin from "../../components/NavbarAdmin";
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
  const [modalType, setModalType] = useState("");
  const [currentProducto, setCurrentProducto] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [showProductModal, setShowProductModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    localStorage.setItem("abastecimiento", JSON.stringify(productos));
  }, [productos]);

  const openProductModal = () => setShowProductModal(true);
  const closeProductModal = () => setShowProductModal(false);

  const openEmployeeModal = () => setShowEmployeeModal(true);
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
    setEmpleadoSeleccionado(producto?.empleado || null);
    setProductoSeleccionado(producto?.nombre || null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType("");
    setCurrentProducto(null);
    setEmpleadoSeleccionado(null);
    setProductoSeleccionado(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      setProductos(productos.filter((p) => p.id !== id));
    }
  };

  const filteredProductos = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const empleados = ["Carlos López", "Ana Pérez", "Luis Torres"];
  const productosDisponibles = [
    "Shampoo Profesional",
    "Tijeras de Corte",
    "Secadora",
    "Peine",
  ];

  return (
    <div className="abastecimiento-container">
      <NavbarAdmin />
      <div className="main-content">
        <h1>Gestión de Abastecimiento</h1>
        <div className="actions-container">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="search-input"
          />
          <button className="action-button" onClick={() => openModal("create")}>
            Agregar Producto
          </button>
        </div>

        <table className="productos-table">
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
                  <div className="icon-actions">
                    <button
                      className="table-button"
                      onClick={() => openModal("details", producto)}
                    >
                      <FaEye />
                    </button>
                    <button
                      className="table-button"
                      onClick={() => openModal("edit", producto)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="table-button delete-button"
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

        {showModal && (
          <div className="modal">
            <div className="modal-content">
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
                  <button className="cancel-button" onClick={closeModal}>
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
                      className="action-button"
                      onClick={openProductModal}
                    >
                      Seleccionar Producto
                    </button>
                    <p>
                      <strong>Producto Seleccionado:</strong>{" "}
                      {productoSeleccionado || "Ninguno"}
                    </p>
                    <input
                      type="number"
                      name="cantidad"
                      placeholder="Cantidad"
                      defaultValue={currentProducto?.cantidad || ""}
                      required
                    />
                    <button
                      type="button"
                      className="action-button"
                      onClick={openEmployeeModal}
                    >
                      Seleccionar Empleado
                    </button>
                    <p>
                      <strong>Empleado Seleccionado:</strong>{" "}
                      {empleadoSeleccionado || "Ninguno"}
                    </p>
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
                  </form>
                </>
              )}
            </div>
          </div>
        )}

        {showEmployeeModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Seleccionar Empleado</h2>
              <ul className="employee-list">
                {empleados.map((emp) => (
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
              <button className="cancel-button" onClick={closeEmployeeModal}>
                Cerrar
              </button>
            </div>
          </div>
        )}

        {showProductModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Seleccionar Producto</h2>
              <ul className="employee-list">
                {productosDisponibles.map((prod) => (
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
              <button className="cancel-button" onClick={closeProductModal}>
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Abastecimiento;
