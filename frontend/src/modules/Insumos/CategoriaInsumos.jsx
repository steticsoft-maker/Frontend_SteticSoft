import { useState } from "react";
import Navbar from "../../components/NavbarAdmin";
import "./CategoriaInsumos.css";

const CategoriaInsumos = () => {
  const [categorias, setCategorias] = useState([
    {
      id: 1,
      nombre: "Cuidado Capilar",
      descripcion: "Productos para el cuidado del cabello",
      estado: "Activo",
    },
    {
      id: 2,
      nombre: "Coloración",
      descripcion: "Tintes y colorantes para el cabello",
      estado: "Inactivo",
    },
  ]);

  const [search, setSearch] = useState("");
  const [modal, setModal] = useState({
    open: false,
    type: "",
    categoria: null,
  });
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleSearch = (e) => setSearch(e.target.value);

  const filteredCategorias = categorias.filter(
    (c) =>
      c.nombre.toLowerCase().includes(search.toLowerCase()) ||
      (c.descripcion &&
        c.descripcion.toLowerCase().includes(search.toLowerCase()))
  );

  const openModal = (type, categoria = null) => {
    setModal({
      open: true,
      type,
      categoria: categoria || {
        id: Date.now(),
        nombre: "",
        descripcion: "",
        estado: "Activo",
      },
    });
  };

  const closeModal = () => {
    setModal({ open: false, type: "", categoria: null });
  };

  const saveCategoria = (nuevaCategoria) => {
    if (modal.type === "agregar") {
      setCategorias([...categorias, nuevaCategoria]);
    } else {
      setCategorias(
        categorias.map((c) => (c.id === nuevaCategoria.id ? nuevaCategoria : c))
      );
    }
    closeModal();
  };

  const confirmDeleteCategoria = (id) => setConfirmDelete(id);

  const deleteCategoria = () => {
    setCategorias(categorias.filter((c) => c.id !== confirmDelete));
    setConfirmDelete(null);
  };

  const toggleEstado = (id) => {
    setCategorias(
      categorias.map((c) =>
        c.id === id
          ? { ...c, estado: c.estado === "Activo" ? "Inactivo" : "Activo" }
          : c
      )
    );
  };

  return (
    <div className="categorias-container">
      <Navbar />
      <div className="categorias-content">
        <h2 className="title-h2">Gestión de Categorías de Insumos</h2>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar categoría..."
            value={search}
            onChange={handleSearch}
          />
        </div>

        <button className="btn success" onClick={() => openModal("agregar")}>
          Agregar Categoría
        </button>

        <div className="categorias-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategorias.map((categoria) => (
                <tr key={categoria.id}>
                  <td>{categoria.id}</td>
                  <td>{categoria.nombre}</td>
                  <td>{categoria.descripcion || "Sin descripción"}</td>
                  <td>
                    <span
                      className={`estado ${categoria.estado.toLowerCase()}`}
                    >
                      {categoria.estado}
                    </span>
                  </td>
                  <td className="acciones">
                    <button
                      className="btn info"
                      onClick={() => openModal("ver", categoria)}
                    >
                      Ver
                    </button>
                    <button
                      className="btn warning"
                      onClick={() => openModal("editar", categoria)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn danger"
                      onClick={() => confirmDeleteCategoria(categoria.id)}
                    >
                      Eliminar
                    </button>
                    <button
                      className="btn"
                      onClick={() => toggleEstado(categoria.id)}
                    >
                      {categoria.estado === "Activo" ? "Desactivar" : "Activar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {modal.open && (
          <div className="modal">
            <div className="modal-content">
              {modal.type === "ver" ? (
                <>
                  <h3>Detalles de la Categoría</h3>
                  <p>
                    <strong>ID:</strong> {modal.categoria.id}
                  </p>
                  <p>
                    <strong>Nombre:</strong> {modal.categoria.nombre}
                  </p>
                  <p>
                    <strong>Descripción:</strong>{" "}
                    {modal.categoria.descripcion || "Sin descripción"}
                  </p>
                  <p>
                    <strong>Estado:</strong> {modal.categoria.estado}
                  </p>
                  <button className="btn close" onClick={closeModal}>
                    Cerrar
                  </button>
                </>
              ) : (
                <>
                  <h3>
                    {modal.type === "agregar"
                      ? "Agregar Categoría"
                      : "Editar Categoría"}
                  </h3>
                  <label>ID</label>
                  <input type="text" value={modal.categoria.id} disabled />
                  <label>Nombre</label>
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={modal.categoria.nombre}
                    onChange={(e) =>
                      setModal({
                        ...modal,
                        categoria: {
                          ...modal.categoria,
                          nombre: e.target.value,
                        },
                      })
                    }
                  />
                  <label>Descripción (Opcional)</label>
                  <textarea
                    placeholder="Descripción"
                    value={modal.categoria.descripcion}
                    onChange={(e) =>
                      setModal({
                        ...modal,
                        categoria: {
                          ...modal.categoria,
                          descripcion: e.target.value,
                        },
                      })
                    }
                  />
                  <button
                    className="btn success"
                    onClick={() => saveCategoria(modal.categoria)}
                  >
                    Guardar
                  </button>
                  <button className="btn close" onClick={closeModal}>
                    Cancelar
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Confirmación de eliminación */}
        {confirmDelete && (
          <div className="modal">
            <div className="modal-content">
              <h3>¿Eliminar Categoría?</h3>
              <p>Esta acción no se puede deshacer.</p>
              <button className="btn danger" onClick={deleteCategoria}>
                Eliminar
              </button>
              <button
                className="btn close"
                onClick={() => setConfirmDelete(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriaInsumos;
