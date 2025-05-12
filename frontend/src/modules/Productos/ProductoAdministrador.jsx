import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa"; // Importar íconos
import NavbarAdmin from "../../components/NavbarAdmin/NavbarAdmin";
import "./ProductosAdministrador.css";

const Productos = () => {
  const initialProductos = [
    { id: 1, nombre: "Producto A", categoria: "Categoría 1", precio: 10000, stock: 50, estado: true, foto: null },
    { id: 2, nombre: "Producto B", categoria: "Categoría 2", precio: 20000, stock: 30, estado: false, foto: null },
  ];

  const [productos, setProductos] = useState(initialProductos);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "create", "edit", "details"
  const [currentProducto, setCurrentProducto] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [categorias] = useState(["Categoría 1", "Categoría 2", "Categoría 3"]);

  useEffect(() => {
    localStorage.setItem("productos", JSON.stringify(productos));
  }, [productos]);

  const handleSave = (producto) => {
    if (modalType === "create") {
      setProductos([...productos, { ...producto, id: Date.now() }]);
    } else {
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
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType("");
    setCurrentProducto(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      setProductos(productos.filter((p) => p.id !== id));
    }
  };

  const toggleEstado = (id) => {
    const updatedProductos = productos.map((p) =>
      p.id === id ? { ...p, estado: !p.estado } : p
    );
    setProductos(updatedProductos);
  };

  const handleFileUpload = (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setCurrentProducto((prev) => ({ ...prev, foto: reader.result }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const filteredProductos = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="productos-container">
      <NavbarAdmin />
      <div className="productoAdministradorContent">
        <h1>Gestión de Productos</h1>
        <div className="BarraBusquedaAgregarProductoAdministrador">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="inputBarraBusqueda"
          />
          <button className="botonAgregarProductoAdministrador" onClick={() => openModal("create")}>
            Agregar Producto
          </button>
        </div>
        <table className="tablaProductosAdministrador">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProductos.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.nombre}</td>
                <td>{producto.categoria}</td>
                <td>{producto.precio}</td>
                <td>{producto.stock}</td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={producto.estado}
                      onChange={() => toggleEstado(producto.id)}
                    />
                    <span className="slider"></span>
                  </label>
                </td>
                <td>
                  <button
                    className="iconBotonProductoAdministrador"
                    onClick={() => openModal("details", producto)}
                    title="Ver"
                  >
                    <FaEye />
                  </button>
                  <button
                    className="iconBotonProductoAdministrador"
                    onClick={() => openModal("edit", producto)}
                    title="Editar"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="iconBotonProductoAdministrador EliminarProductoAdministradorIcon"
                    onClick={() => handleDelete(producto.id)}
                    title="Eliminar"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="modalProductosAdministrador">
          <div className="modal-content-ProductosAdministrador">
            {modalType === "details" && currentProducto ? (
              <>
                <h2>Detalles del Producto</h2>
                <p>
                  <strong>Nombre:</strong> {currentProducto.nombre}
                </p>
                <p>
                  <strong>Categoría:</strong> {currentProducto.categoria}
                </p>
                <p>
                  <strong>Precio:</strong> {currentProducto.precio}
                </p>
                <p>
                  <strong>Stock:</strong> {currentProducto.stock}
                </p>
                <p>
                  <strong>Estado:</strong>{" "}
                  {currentProducto.estado ? "Activo" : "Inactivo"}
                </p>
                {currentProducto.foto && (
                  <img src={currentProducto.foto} alt="Producto" width="200" />
                )}
                <button className="cerrarModalVerDetallesProductoAdministrador" onClick={closeModal}>
                  Cerrar
                </button>
              </>
            ) : (
              <>
                <h2>
                  {modalType === "create" ? "Agregar Producto" : "Editar Producto"}
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const producto = {
                      nombre: formData.get("nombre"),
                      categoria: formData.get("categoria"),
                      precio: parseFloat(formData.get("precio")),
                      stock: parseInt(formData.get("stock"), 10),
                      estado:
                        modalType === "create" ? true : currentProducto.estado,
                      foto: currentProducto?.foto || null,
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
                  <select
                    name="categoria"
                    defaultValue={currentProducto?.categoria || ""}
                    required
                  >
                    <option value="" disabled>
                      Seleccionar categoría
                    </option>
                    {categorias.map((cat, index) => (
                      <option key={index} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    name="precio"
                    placeholder="Precio"
                    defaultValue={currentProducto?.precio || ""}
                    required
                  />
                  <input
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    defaultValue={currentProducto?.stock || ""}
                    required
                  />
                  <label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
                  </label>
                  {currentProducto?.foto && (
                    <img
                      src={currentProducto.foto}
                      alt="Vista previa"
                      width="100"
                    />
                  )}
                  <div className="botonesGuardarCancelarProductoAdministrador">
                    <button type="submit" className="botonGuardarProducto">
                      Guardar
                    </button>
                    <button
                      type="button"
                      className="botonCancelarAgregarProducto"
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
    </div>
  );
};

export default Productos;
