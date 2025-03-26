import React, { useState, useEffect } from "react";
import NavbarAdmin from "../../components/NavbarAdmin";
import "./Categoria.css";

const Categorias = () => {
  // Categorías pre-registradas
  const initialCategorias = [
    {
      id: 1,
      nombre: "Belleza",
      descripcion: "Servicios relacionados con el cuidado estético",
      anulado: false,
    },
    {
      id: 2,
      nombre: "Bienestar",
      descripcion: "Servicios para mejorar la salud y relajación",
      anulado: false,
    },
    {
      id: 3,
      nombre: "Uñas",
      descripcion: "Servicios de manicura y pedicura",
      anulado: false,
    },
  ];

  // Estados
  const [categorias, setCategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "create", "edit", "details"
  const [currentCategoria, setCurrentCategoria] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  // Inicializar datos si no existen en localStorage
  const initializeData = () => {
    const storedCategorias = localStorage.getItem("categorias");
    if (!storedCategorias) {
      localStorage.setItem("categorias", JSON.stringify(initialCategorias));
      return initialCategorias;
    }
    return JSON.parse(storedCategorias);
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    const categoriasData = initializeData();
    setCategorias(categoriasData);
    setIsInitialized(true);
  }, []);

  // Guardar categorías en localStorage cuando cambien
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("categorias", JSON.stringify(categorias));
      // Disparar evento para notificar a otros componentes
      window.dispatchEvent(new Event("storage"));
    }
  }, [categorias, isInitialized]);

  // Manejar creación/edición de categorías
  const handleSave = (categoria) => {
    if (modalType === "create") {
      setCategorias([...categorias, categoria]);
    } else if (modalType === "edit" && currentCategoria) {
      const updatedCategorias = categorias.map((c) =>
        c.id === currentCategoria.id ? { ...categoria } : c
      );
      setCategorias(updatedCategorias);
    }
    closeModal();
  };

  // Abrir modal
  const openModal = (type, categoria = null) => {
    setModalType(type);
    setCurrentCategoria(
      categoria || {
        id: Date.now(),
        nombre: "",
        descripcion: "",
        anulado: false,
      }
    );
    setShowModal(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setShowModal(false);
    setModalType("");
    setCurrentCategoria(null);
  };

  // Eliminar una categoría
  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta categoría?")) {
      setCategorias(categorias.filter((c) => c.id !== id));
    }
  };

  // Cambiar estado de la categoría (anulado/activo)
  const toggleAnular = (id) => {
    const updatedCategorias = categorias.map((c) =>
      c.id === id ? { ...c, anulado: !c.anulado } : c
    );
    setCategorias(updatedCategorias);
  };

  // Filtrar categorías por búsqueda
  const filteredCategorias = categorias.filter(
    (c) =>
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (c.descripcion &&
        c.descripcion.toLowerCase().includes(busqueda.toLowerCase()))
  );

  return (
    <div className="categorias-container">
      <NavbarAdmin />
      <div className="main-content">
        <h1>Gestión de Categorías</h1>

        {/* Buscador */}
        <input
          type="text"
          placeholder="Buscar categoría..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="search-input"
        />

        {/* Botón para crear categoría */}
        <button
          className="action-button"
          onClick={() => openModal("create")}
        >
          Crear Categoría
        </button>

        {/* Tabla de categorías */}
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
              <tr key={categoria.id} className={categoria.anulado ? "inactive" : ""}>
                <td>{categoria.nombre}</td>
                <td className="descripcion-cell">
                  {categoria.descripcion || "Sin descripción"}
                </td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={categoria.anulado || false}
                      onChange={() => toggleAnular(categoria.id)}
                    />
                    <span className="slider"></span>
                  </label>
                  <span className="status-text">
                    {categoria.anulado ? "Inactivo" : "Activo"}
                  </span>
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

      {/* Modal para Crear/Editar/Detalles */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            {modalType === "details" && currentCategoria ? (
              <>
                <h2>Detalles de la Categoría</h2>
                <div className="detail-group">
                  <strong>Nombre:</strong>
                  <p>{currentCategoria.nombre}</p>
                </div>
                <div className="detail-group">
                  <strong>Descripción:</strong>
                  <p>{currentCategoria.descripcion || "Sin descripción"}</p>
                </div>
                <div className="detail-group">
                  <strong>Estado:</strong>
                  <p>{currentCategoria.anulado ? "Inactivo" : "Activo"}</p>
                </div>
                <button className="close-button" onClick={closeModal}>
                  Cerrar
                </button>
              </>
            ) : (
              <>
                <h2>
                  {modalType === "create" ? "Crear Categoría" : "Editar Categoría"}
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const categoria = {
                      id: currentCategoria ? currentCategoria.id : Date.now(),
                      nombre: formData.get("nombre"),
                      descripcion: formData.get("descripcion"),
                      anulado: formData.get("anulado") === "on",
                    };
                    handleSave(categoria);
                  }}
                >
                  <div className="form-group">
                    <label htmlFor="nombre">Nombre:</label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      placeholder="Nombre de la categoría"
                      defaultValue={currentCategoria?.nombre || ""}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="descripcion">Descripción (opcional):</label>
                    <textarea
                      id="descripcion"
                      name="descripcion"
                      placeholder="Descripción breve de la categoría"
                      defaultValue={currentCategoria?.descripcion || ""}
                      rows="3"
                    />
                  </div>

                  {modalType === "edit" && (
                    <div className="form-group">
                      <label htmlFor="anulado">Estado:</label>
                      <label className="switch">
                        <input
                          type="checkbox"
                          id="anulado"
                          name="anulado"
                          defaultChecked={currentCategoria?.anulado || false}
                        />
                        <span className="slider"></span>
                      </label>
                      <span className="status-text">
                        {currentCategoria?.anulado ? "Inactivo" : "Activo"}
                      </span>
                    </div>
                  )}

                  <div className="form-actions">
                    <button
                      type="submit"
                      className="action-button"
                    >
                      Guardar
                    </button>
                    <button
                      type="button"
                      className="close-button"
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

export default Categorias;