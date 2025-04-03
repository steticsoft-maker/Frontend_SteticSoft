import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa"; // Importar íconos
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
  const [modalType, setModalType] = useState(""); // "create", "edit", "details"
  const [currentCategoria, setCurrentCategoria] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [showProductos, setShowProductos] = useState(false); // Controla el botón desplegable

  useEffect(() => {
    localStorage.setItem("categorias", JSON.stringify(categorias));
  }, [categorias]);

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
    if (type === "create") setCurrentCategoria(null); // Restablece el formulario para agregar categoría
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType("");
    setCurrentCategoria(null);
    setShowProductos(false); // Restablece el desplegable
  };

  const handleSave = (categoria) => {
    if (modalType === "create") {
      setCategorias([...categorias, { ...categoria, id: Date.now(), estado: true, productos: [] }]);
    } else if (modalType === "edit") {
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
        <h1>Gestión Categorías de Productos</h1>
        <div className="header-actions">
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
        </div>
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
                    title="Ver"
                  >
                    <FaEye /> {/* Ícono de FontAwesome para "Ver" */}
                  </button>
                  <button
                    className="table-button"
                    onClick={() => openModal("edit", categoria)}
                    title="Editar"
                  >
                    <FaEdit /> {/* Ícono de FontAwesome para "Editar" */}
                  </button>
                  <button
                    className="table-button delete-button"
                    onClick={() => handleDelete(categoria.id)}
                    title="Eliminar"
                  >
                    <FaTrash /> {/* Ícono de FontAwesome para "Eliminar" */}
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
            {modalType === "create" && (
              <>
                <h2>Agregar Categoría</h2>
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
                  <input type="text" name="nombre" placeholder="Nombre" required />
                  <textarea className="DescripcionAgregarCategoria" name="descripcion" placeholder="Descripción" required />
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
 