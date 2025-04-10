import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../components/NavbarAdmin";
import "./CategoriaInsumos.css";

const CategoriaInsumos = () => {
  const [categorias, setCategorias] = useState([
    {
      nombre: "Cuidado Capilar",
      descripcion: "Productos para el cuidado del cabello",
      estado: "Activo",
    },
    {
      nombre: "Coloración",
      descripcion: "Tintes y colorantes para el cabello",
      estado: "Inactivo",
    },
  ]);

  const [search, setSearch] = useState("");
  const [modal, setModal] = useState({ open: false, type: "", categoria: null });
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = (e) => setSearch(e.target.value);

  const filteredCategorias = categorias.filter(
    (c) =>
      c.nombre.toLowerCase().includes(search.toLowerCase()) ||
      (c.descripcion && c.descripcion.toLowerCase().includes(search.toLowerCase()))
  );

  const openModal = (type, categoria = null) => {
    setError("");
    setModal({
      open: true,
      type,
      categoria: categoria || { nombre: "", descripcion: "", estado: "Activo" },
    });
  };

  const closeModal = () => {
    setModal({ open: false, type: "", categoria: null });
    setError("");
  };

  const saveCategoria = (nuevaCategoria) => {
    const nombreTrimmed = nuevaCategoria.nombre.trim();
  
    // Validar que no esté vacío
    if (!nombreTrimmed) {
      const mensaje = "El nombre es obligatorio.";
      setError(mensaje);
      alert(mensaje);
      return;
    }
  
    // Validar que el nombre sea único (ignorando si es edición y no cambió el nombre)
    const nombreDuplicado = categorias.some(
      (c) =>
        c.nombre.toLowerCase() === nombreTrimmed.toLowerCase() &&
        (modal.type === "agregar" || c.nombre !== modal.categoria.nombre)
    );
  
    if (nombreDuplicado) {
      const mensaje = "Ya existe una categoría con ese nombre.";
      setError(mensaje);
      alert(mensaje);
      return;
    }
  
    if (modal.type === "agregar") {
      setCategorias([...categorias, { ...nuevaCategoria, nombre: nombreTrimmed }]);
    } else {
      setCategorias(
        categorias.map((c) =>
          c.nombre === modal.categoria.nombre ? { ...nuevaCategoria, nombre: nombreTrimmed } : c
        )
      );
    }
  
    closeModal();
  };


  const confirmDeleteCategoria = (nombre) => setConfirmDelete(nombre);

  const deleteCategoria = () => {
    setCategorias(categorias.filter((c) => c.nombre !== confirmDelete));
    setConfirmDelete(null);
  };

  const toggleEstado = (nombre) => {
    setCategorias(
      categorias.map((c) =>
        c.nombre === nombre ? { ...c, estado: c.estado === "Activo" ? "Inactivo" : "Activo" } : c
      )
    );
  };

  return (
    <div className="categorias-container">
      <Navbar />
      <div className="categorias-content">
        <h2 className="title-h2">Gestión de Categorías de Insumos</h2>

        <div className="top-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar categoría..."
            value={search}
            onChange={handleSearch}
          />
          <button className="btnAgregarcategoria" onClick={() => openModal("agregar")}>
            Agregar Categoría
          </button>
        </div>

        <div className="categorias-table">
          <table>
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
                <tr key={categoria.nombre}>
                  <td>{categoria.nombre}</td>
                  <td>{categoria.descripcion || "Sin descripción"}</td>
                  <td>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={categoria.estado === "Activo"}
                        onChange={() => toggleEstado(categoria.nombre)}
                      />
                      <span className="slider"></span>
                    </label>
                  </td>
                  <td className="acciones">
                    <button className="btn info" onClick={() => openModal("ver", categoria)}>
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button className="btn info" onClick={() => openModal("editar", categoria)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className="btn danger" onClick={() => confirmDeleteCategoria(categoria.nombre)}>
                      <FontAwesomeIcon icon={faTrash} />
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
                  <p><strong>Nombre:</strong> {modal.categoria.nombre}</p>
                  <p><strong>Descripción:</strong> {modal.categoria.descripcion || "Sin descripción"}</p>
                  <p><strong>Estado:</strong> {modal.categoria.estado}</p>
                  <button className="btn close" onClick={closeModal}>Cerrar</button>
                </>
              ) : (
                <>
                  <h3>{modal.type === "agregar" ? "Agregar Categoría" : "Editar Categoría"}</h3>
                  <input
                    type="text"
                    placeholder="Nombre *"
                    value={modal.categoria.nombre}
                    onChange={(e) =>
                      setModal({ ...modal, categoria: { ...modal.categoria, nombre: e.target.value } })
                    }
                  />
                  <label>Descripción (Opcional)</label>
                  <textarea
                    placeholder="Descripción"
                    value={modal.categoria.descripcion}
                    onChange={(e) =>
                      setModal({ ...modal, categoria: { ...modal.categoria, descripcion: e.target.value } })
                    }
                  />
                  <div className="button-group">
                    <button className="btn success" onClick={() => saveCategoria(modal.categoria)}>Guardar</button>
                    <button className="btn close" onClick={closeModal}>Cancelar</button>
                  </div>
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
              <button className="btn danger" onClick={deleteCategoria}>Eliminar</button>
              <button className="btn close" onClick={() => setConfirmDelete(null)}>Cancelar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriaInsumos;
