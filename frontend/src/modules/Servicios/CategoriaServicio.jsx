import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import NavbarAdmin from "../../components/NavbarAdmin/NavbarAdmin";
import "./categoria.css";

const CategoriasServicios = () => {
  const [categorias, setCategorias] = useState(() => {
    const stored = localStorage.getItem("categoriasServicios");
    return stored ? JSON.parse(stored) : [];
  });
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState({ open: false, type: "", index: null });
  const [formData, setFormData] = useState({ nombre: "", descripcion: "" });
  const [formErrors, setFormErrors] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Guardar cada vez que cambia
  useEffect(() => {
      localStorage.setItem("categoriasServicios", JSON.stringify(categorias));
  }, [categorias]);

  const handleSearch = (e) => setSearch(e.target.value);

  const filteredCategorias = categorias.filter(c =>
      c.nombre.toLowerCase().includes(search.toLowerCase()) ||
      c.descripcion.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = (type, index = null) => {
      setModal({ open: true, type, index });
      setFormErrors({});
      if (type === "editar" && index !== null) {
          setFormData(categorias[index]);
      } else if (type === "agregar") {
          setFormData({ nombre: "", descripcion: "" });
      }
  };

  const closeModal = () => {
      setModal({ open: false, type: "", index: null });
      setFormErrors({});
  };

  const saveCategoria = () => {
      const errors = {};
      if (!formData.nombre.trim()) errors.nombre = "El nombre es obligatorio";

      if (Object.keys(errors).length > 0) {
          setFormErrors(errors);
          return;
      }

      if (modal.type === "agregar") {
          setCategorias(prev => [...prev, { ...formData, estado: "Activo" }]);
      } else if (modal.type === "editar" && modal.index !== null) {
          setCategorias(prev =>
              prev.map((c, idx) => (idx === modal.index ? { ...formData, estado: c.estado } : c))
          );
      }

      closeModal();
  };

  const toggleEstado = (index) => {
      setCategorias(prev =>
          prev.map((c, idx) =>
              idx === index ? { ...c, estado: c.estado === "Activo" ? "Inactivo" : "Activo" } : c
          )
      );
  };

  const deleteCategoria = () => {
      setCategorias(prev => prev.filter((_, idx) => idx !== confirmDelete));
      setConfirmDelete(null);
  };

  return (
      <div className="Categoria-container">
          <NavbarAdmin />
          <div className="Categoria-content">
              <h2>Categorías de Servicios</h2>
              <div className="ContainerBotonAgregarCategoria">
                  <div className="BusquedaBotonCategoria">
                      <input
                          type="text"
                          placeholder="Buscar categoría..."
                          value={search}
                          onChange={handleSearch}
                      />
                  </div>
                  <button className="botonAgregarCategoria" onClick={() => openModal("agregar")}>
                      Agregar Categoría
                  </button>
              </div>
                  <table className="tablaCategoria">
                      <thead>
                          <tr>
                              <th>Nombre</th>
                              <th>Descripción</th>
                              <th>Estado</th>
                              <th>Acciones</th>
                          </tr>
                      </thead>
                      <tbody>
                          {filteredCategorias.map((cat, index) => (
                              <tr key={index}>
                                  <td>{cat.nombre}</td>
                                  <td>{cat.descripcion || "—"}</td>
                                  <td>
                                      <label className="switch">
                                          <input
                                              type="checkbox"
                                              checked={cat.estado === "Activo"}
                                              onChange={() => toggleEstado(index)}
                                          />
                                          <span className="slider round"></span>
                                      </label>
                                  </td>
                                  <td>
                                      <button className="botonVerDetallesCategoria" onClick={() => openModal("ver", index)}>
                                          <FontAwesomeIcon icon={faEye} />
                                      </button>
                                      <button className="botonEditarCategoria" onClick={() => openModal("editar", index)}>
                                          <FontAwesomeIcon icon={faEdit} />
                                      </button>
                                      <button className="botonEliminarCategoria" onClick={() => setConfirmDelete(index)}>
                                          <FontAwesomeIcon icon={faTrash} />
                                      </button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>

              {/* Modal */}
              {modal.open && (
                  <div className="modal-Categoria">
                      <div className="modal-content-Categoria">
                          {modal.type === "ver" ? (
                              <>
                                  <h3>Detalles de la Categoría</h3>
                                  <p><strong>Nombre:</strong> {categorias[modal.index]?.nombre}</p>
                                  <p><strong>Descripción:</strong> {categorias[modal.index]?.descripcion || "—"}</p>
                                  <p><strong>Estado:</strong> {categorias[modal.index]?.estado}</p>
                                  <button className="btn-danger" onClick={closeModal}>Cerrar</button>
                              </>
                          ) : (
                              <>
                                  <h3>{modal.type === "agregar" ? "Agregar Categoría" : "Editar Categoría"}</h3>
                                  <form className="modal-Categoria-form-grid">
                                      <div className="camposAgregarCategoria">
                                          <label className="asteriscoCampoObligatorioCategoria">
                                              Nombre <span className="requiredCategoria">*</span>
                                          </label>
                                          <input className="campoAgregarCategoria"
                                              type="text"
                                              value={formData.nombre}
                                              onChange={(e) => {
                                                  setFormData({ ...formData, nombre: e.target.value });
                                                  setFormErrors({ ...formErrors, nombre: "" });
                                              }}
                                          />
                                          {formErrors.nombre && <span className="error">{formErrors.nombre}</span>}
                                      </div>
                                      <div className="camposAgregarCategoria">
                                          <label>Descripción</label>
                                          <input className="campoAgregarCategoria"
                                              type="text"
                                              value={formData.descripcion}
                                              onChange={(e) =>
                                                  setFormData({ ...formData, descripcion: e.target.value })
                                              }
                                          />
                                      </div>
                                      <div className="containerBotonesAgregarCategoria">
                                          <button className="botonEditarCategoria" type="button" onClick={saveCategoria}>
                                              Guardar
                                          </button>
                                          <button className="botonEliminarCategoria" type="button" onClick={closeModal}>
                                              Cancelar
                                          </button>
                                      </div>
                                  </form>
                              </>
                          )}
                      </div>
                  </div>
              )}

              {/* Confirmación de eliminación */}
              {confirmDelete !== null && (
                  <div className="modal-Categoria">
                      <div className="modal-Categoria-confirm">
                          <h3>Confirmar eliminación</h3>
                          <p>¿Está seguro de que desea eliminar esta categoría?</p>
                          <div className="modal-Categoria-confirm-buttons">
                              <button className="botonEditarCategoria" onClick={deleteCategoria}>Sí, eliminar</button>
                              <button className="botonEliminarCategoria" onClick={() => setConfirmDelete(null)}>Cancelar</button>
                          </div>
                      </div>
                  </div>
              )}
          </div>
      </div>
  );
};

export default CategoriasServicios;
