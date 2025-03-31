import React, { useState, useEffect } from "react";
import NavbarAdmin from "../../components/NavbarAdmin";
import "./CategoriaProducto.css";

const Categorias = () => {
  const initialCategorias = [
    {
      id: 1,
      nombre: "Electrónica",
      descripcion: "Productos electrónicos como celulares y laptops",
      estado: true, // Activa = true, Inactiva = false
      productos: ["Celular", "Laptop", "Televisión"],
    },
    {
      id: 2,
      nombre: "Hogar",
      descripcion: "Muebles y utensilios para el hogar",
      estado: true,
      productos: ["Sofá", "Mesa", "Lámpara"],
    },
  ];

  const [categorias, setCategorias] = useState(initialCategorias);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "edit" o "details"
  const [currentCategoria, setCurrentCategoria] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [showProductos, setShowProductos] = useState(false); // Controla el botón desplegable

  useEffect(() => {
    localStorage.setItem("categorias", JSON.stringify(categorias));
  }, [categorias]);

  const openModal = (type, categoria = null) => {
    setModalType(type);
    setCurrentCategoria(categoria);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType("");
    setCurrentCategoria(null);
    setShowProductos(false); // Restablece el desplegable
  };

  const handleSave = (categoria) => {
    if (modalType === "edit") {
      const updatedCategorias = categorias.map((cat) =>
        cat.id === currentCategoria.id ? { ...currentCategoria, ...categoria } : cat
      );
      setCategorias(updatedCategorias);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta categoría?")) {
      setCategorias(categorias.filter((cat) => cat.id !== id));
    }
  };

  const toggleEstado = (id) => {
    const updatedCategorias = categorias.map((cat) =>
      cat.id === id ? { ...cat, estado: !cat.estado } : cat
    );
    setCategorias(updatedCategorias);
  };

  const filteredCategorias = categorias.filter((cat) =>
    cat.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="categorias-container">
      <NavbarAdmin />
      <div className="main-content">
        <h1>Gestión de Categorías</h1>
        <input
          type="text"
          placeholder="Buscar categoría..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="search-input"
        />
        <button className="action-button" onClick={() => openModal("create")}>
          Agregar Categoría
        </button>
        <table className="categorias-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategorias.map((categoria) => (
              <tr key={categoria.id}>
                <td>{categoria.nombre}</td>
                <td>{categoria.descripcion}</td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={categoria.estado}
                      onChange={() => toggleEstado(categoria.id)}
                    />
                    <span className="slider"></span>
                  </label>
                </td>
                <td>
                  <button
                    className="table-button"
                    onClick={() => openModal("details", categoria)}
                  >
                    Ver
                  </button>
                  <button
                    className="table-button"
                    onClick={() => openModal("edit", categoria)}
                  >
                    Editar
                  </button>
                  <button
                    className="table-button delete-button"
                    onClick={() => handleDelete(categoria.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && currentCategoria && (
        <div className="modal">
          <div className="modal-content">
            {modalType === "details" ? (
              <>
                <h2>Detalles de la Categoría</h2>
                <p>
                  <strong>Nombre:</strong> {currentCategoria.nombre}
                </p>
                <p>
                  <strong>Descripción:</strong> {currentCategoria.descripcion}
                </p>
                <p>
                  <strong>Estado:</strong>{" "}
                  {currentCategoria.estado ? "Activa" : "Inactiva"}
                </p>
                <button
                  className="action-button"
                  onClick={() => setShowProductos(!showProductos)}
                >
                  {showProductos ? "Ocultar Productos" : "Mostrar Productos"}
                </button>
                {showProductos && (
                  <ul className="productos-list">
                    {currentCategoria.productos.map((producto, index) => (
                      <li key={index}>{producto}</li>
                    ))}
                  </ul>
                )}
                <button className="close-button" onClick={closeModal}>
                  Cerrar
                </button>
              </>
            ) : (
              <>
                <h2>Editar Categoría</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const categoria = {
                      nombre: formData.get("nombre"),
                      descripcion: formData.get("descripcion"),
                    };
                    handleSave(categoria);
                  }}
                >
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    defaultValue={currentCategoria?.nombre || ""}
                    required
                  />
                  <textarea
                    name="descripcion"
                    placeholder="Descripción"
                    defaultValue={currentCategoria?.descripcion || ""}
                    required
                  />
                  <div className="button-group">
                    <button type="submit" className="action-button">
                      Guardar
                    </button>
                    <button className="close-button" onClick={closeModal}>
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

export default Categorias;
