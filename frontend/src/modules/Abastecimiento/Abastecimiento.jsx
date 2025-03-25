import React, { useState, useEffect } from "react";
import NavbarAdmin from "../../components/NavbarAdmin";
import "./Abastecimiento.css";

const Abastecimiento = () => {
  const [productos, setProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "create", "edit", "details"
  const [currentProducto, setCurrentProducto] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  // Cargar productos desde LocalStorage al cargar el componente
  useEffect(() => {
    const data = localStorage.getItem("productos");
    if (data) {
      setProductos(JSON.parse(data));
    }
  }, []);

  // Guardar productos en LocalStorage cuando cambie el estado
  useEffect(() => {
    localStorage.setItem("productos", JSON.stringify(productos));
  }, [productos]);

  // Manejar creación/edición de productos
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

  // Abrir el modal para crear/editar/ver detalles
  const openModal = (type, producto = null) => {
    setModalType(type);
    setCurrentProducto(producto);
    setShowModal(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setShowModal(false);
    setModalType("");
    setCurrentProducto(null);
  };

  // Eliminar un producto
  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      setProductos(productos.filter((p) => p.id !== id));
    }
  };

  // Filtrar productos por búsqueda
  const filteredProductos = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="abastecimiento-container">
      <NavbarAdmin />
      <div className="main-content">
        <h1>Gestión de Abastecimiento</h1>
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="search-input"
        />
        <button className="action-button" onClick={() => openModal("create")}>
          Crear Producto
        </button>
        <table className="productos-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Porcentaje</th>
              <th>Kg</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProductos.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.nombre}</td>
                <td>{producto.descripcion}</td>
                <td>{producto.porcentaje}</td>
                <td>{producto.kg}</td>
                <td>
                  <button
                    className="table-button"
                    onClick={() => openModal("details", producto)}
                  >
                    Ver
                  </button>
                  <button
                    className="table-button"
                    onClick={() => openModal("edit", producto)}
                  >
                    Editar
                  </button>
                  <button
                    className="table-button delete-button"
                    onClick={() => handleDelete(producto.id)}
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
            {modalType === "details" && currentProducto ? (
              <>
                <h2>Detalles del Producto</h2>
                <p>
                  <strong>Nombre:</strong> {currentProducto.nombre}
                </p>
                <p>
                  <strong>Descripción:</strong> {currentProducto.descripcion}
                </p>
                <p>
                  <strong>Porcentaje:</strong> {currentProducto.porcentaje}%
                </p>
                <p>
                  <strong>Kg:</strong> {currentProducto.kg} kg
                </p>
                <p>
                  <strong>Empleado:</strong>{" "}
                  {currentProducto.empleado || "Sin asignar"}
                </p>
                <button className="close-button" onClick={closeModal}>
                  Cerrar
                </button>
              </>
            ) : (
              <>
                <h2>
                  {modalType === "create"
                    ? "Crear Producto"
                    : "Editar Producto"}
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const producto = {
                      id: currentProducto ? currentProducto.id : Date.now(),
                      nombre: formData.get("nombre"),
                      descripcion: formData.get("descripcion"),
                      porcentaje: formData.get("porcentaje"),
                      kg: formData.get("kg"),
                      empleado: formData.get("empleado"), // Nuevo campo empleado
                    };
                    handleSave(producto);
                  }}
                >
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    defaultValue={currentProducto?.nombre || ""}
                    required
                  />
                  <input
                    type="text"
                    name="descripcion"
                    placeholder="Descripción"
                    defaultValue={currentProducto?.descripcion || ""}
                    required
                  />
                  <input
                    type="number"
                    name="porcentaje"
                    placeholder="Porcentaje"
                    defaultValue={currentProducto?.porcentaje || ""}
                    required
                  />
                  <input
                    type="number"
                    name="kg"
                    placeholder="Kg"
                    defaultValue={currentProducto?.kg || ""}
                    required
                  />
                  <input
                    type="text"
                    name="empleado"
                    placeholder="Nombre del Empleado"
                    defaultValue={currentProducto?.empleado || ""}
                  />
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

export default Abastecimiento;
