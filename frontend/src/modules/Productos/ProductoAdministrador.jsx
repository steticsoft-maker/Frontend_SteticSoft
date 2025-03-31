import React, { useState, useEffect } from "react";
import NavbarAdmin from "../../components/NavbarAdmin";
import "./ProductosAdministrador.css";

const Productos = () => {
  const initialProductos = [

    { id: 1, nombre: "Producto A", categoria: "Categoría 1", precio: 10000, stock: 50, estado: true, foto: null },
    { id: 2, nombre: "Producto B", categoria: "Categoría 2", precio: 20000, stock: 30, estado: false, foto: null },


    {
      id: 1,
      nombre: "Producto A",
      categoria: "Categoría 1",
      precio: 10000,
      stock: 50,
      estado: true,
      foto: null,
    },
    {
      id: 2,
      nombre: "Producto B",
      categoria: "Categoría 2",
      precio: 20000,
      stock: 30,
      estado: false,
      foto: null,
    },



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
      <div className="main-content">
        <h1>Gestión de Productos</h1>
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
        <table className="productos-table">
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
                <button className="close-button" onClick={closeModal}>
                  Cerrar
                </button>
              </>
            ) : (
              <>
                <h2>


                  {modalType === "create" ? "Agregar Producto" : "Editar Producto"}



                  {modalType === "create"
                    ? "Agregar Producto"
                    : "Editar Producto"}
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

                      estado: modalType === "create" ? true : currentProducto.estado,



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
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                  {currentProducto?.foto && (


                    <><><img src={currentProducto.foto} alt="Vista previa" width="100" /><img src={currentProducto.foto} alt="Vista previa" width="100" /></><img
                        src={currentProducto.foto}
                        alt="Vista previa"
                        width="100" /></>

                  )}
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

export default Productos;
