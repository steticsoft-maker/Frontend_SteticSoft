import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import NavbarAdmin from "../../components/NavbarAdmin/NavbarAdmin";
import "./servicios.css";

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB (tamaño estándar permitido)
const MAX_FILE_SIZE_MB = MAX_FILE_SIZE_BYTES / (1024 * 1024);

const Servicios = () => {
  const [servicios, setServicios] = useState(() => {
    const stored = localStorage.getItem("servicios");
    return stored ? JSON.parse(stored) : [];
  });

  const [categorias, setCategorias] = useState(() => {
    const stored = localStorage.getItem("categoriasServicios");
    return stored ? JSON.parse(stored) : [];
  });

  const [search, setSearch] = useState("");
  const [modal, setModal] = useState({ open: false, type: "", index: null });
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    categoria: "",
    imagen: null,
    imagenURL: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Guardar servicios en localStorage
  useEffect(() => {
    localStorage.setItem("servicios", JSON.stringify(servicios));
  }, [servicios]);

  // Cargar categorías al montar el componente
  useEffect(() => {
    const stored = localStorage.getItem("categoriasServicios");
    if (stored) {
      setCategorias(JSON.parse(stored));
    }
  }, []);

  const handleSearch = (e) => setSearch(e.target.value);

  const filteredServicios = servicios.filter(s =>
    s.nombre.toLowerCase().includes(search.toLowerCase()) ||
    (s.categoria && s.categoria.toLowerCase().includes(search.toLowerCase()))
  );

  const openModal = (type, index = null) => {
    setModal({ open: true, type, index });
    setFormErrors({});
    if (type === "editar" && index !== null) {
      setFormData(servicios[index]);
    } else if (type === "agregar") {
      setFormData({
        nombre: "",
        precio: "",
        categoria: "",
        imagen: null,
        imagenURL: ""
      });
    } else if (type === "ver" && index !== null) {
      setFormData(servicios[index]);
    }
  };

  const closeModal = () => {
    setModal({ open: false, type: "", index: null });
    setFormErrors({});
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setFormErrors({ ...formErrors, imagen: `La imagen debe ser menor a ${MAX_FILE_SIZE_MB}MB` });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          imagen: file,
          imagenURL: reader.result
        });
        setFormErrors({ ...formErrors, imagen: "" }); // Limpiar error si existe
      };
      reader.readAsDataURL(file);
    }
  };

  const saveServicio = () => {
    const errors = {};
    if (!formData.nombre.trim()) errors.nombre = "El nombre es obligatorio";
    if (!formData.precio || isNaN(formData.precio)) errors.precio = "Precio inválido";
    if (formErrors.imagen) errors.imagen = formErrors.imagen; // Mantener el error de la imagen

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const servicioData = {
      nombre: formData.nombre,
      precio: parseFloat(formData.precio),
      categoria: formData.categoria,
      estado: "Activo",
      imagenURL: formData.imagenURL
    };

    if (modal.type === "agregar") {
      setServicios(prev => [...prev, servicioData]);
    } else if (modal.type === "editar" && modal.index !== null) {
      setServicios(prev =>
        prev.map((s, idx) => (idx === modal.index ? {
          ...servicioData,
          estado: s.estado
        } : s))
      );
    }

    closeModal();
  };

  const toggleEstado = (index) => {
    setServicios(prev =>
      prev.map((s, idx) =>
        idx === index ? { ...s, estado: s.estado === "Activo" ? "Inactivo" : "Activo" } : s
      )
    );
  };

  const deleteServicio = () => {
    setServicios(prev => prev.filter((_, idx) => idx !== confirmDelete));
    setConfirmDelete(null);
  };

  return (
    <div className="servicios-container">
      <NavbarAdmin />
      <div className="servicios-content">
        <h2 className="tituloServicios">Gestión de Servicios</h2>
        <div className="barraBusqueda-BotonSuperiorAgregarServicio">
          <div className="BarraBusquedaServicio">
            <input
              type="text"
              placeholder="Buscar servicio..."
              value={search}
              onChange={handleSearch}
            />
          </div>
          <button className="botonAgregarServicio" onClick={() => openModal("agregar")}>
            Agregar Servicio
          </button>
        </div>

        <div className="tablaServicios">
          <table className="tablaServicio">
            <thead>
              <tr>
                <th className="thServicios">Nombre</th>
                <th className="thServicios">Precio</th>
                <th className="thServicios">Categoría</th>
                <th className="thServicios">Imagen</th>
                <th className="thServicios">Estado</th>
                <th className="thServicios">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredServicios.map((serv, index) => (
                <tr key={index}>
                  <td>{serv.nombre}</td>
                  <td>${serv.precio.toFixed(2)}</td>
                  <td>{serv.categoria || "—"}</td>
                  <td>
                    {serv.imagenURL ? (
                      <img
                        src={serv.imagenURL}
                        alt={serv.nombre}
                        className="servicio-imagen"
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      />
                    ) : "—"}
                  </td>
                  <td>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={serv.estado === "Activo"}
                        onChange={() => toggleEstado(index)}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td>
                    <button className="botonVerDetallesServicios" onClick={() => openModal("ver", index)}>
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button className="botonEditarServicios" onClick={() => openModal("editar", index)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className="botonEliminarServicios" onClick={() => setConfirmDelete(index)}>
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
          <div className="modalServicio">
            <div className="modal-content-Servicio">
              {modal.type === "ver" ? (
                <>
                  <h3 className="tituloModalDetalleServicio">Detalles del Servicio</h3>
                  <p><strong>Nombre:</strong> {formData.nombre}</p>
                  <p><strong>Precio:</strong> ${formData.precio?.toFixed(2)}</p>
                  <p><strong>Categoría:</strong> {formData.categoria || "—"}</p>
                  {formData.imagenURL && (
                    <div>
                      <strong>Imagen:</strong>
                      <img
                        src={formData.imagenURL}
                        alt={formData.nombre}
                        style={{ maxWidth: '200px', marginTop: '10px' }}
                      />
                    </div>
                  )}
                  <button className="botonEliminarServicios" onClick={closeModal}>Cerrar</button>
                </>
              ) : (
                <>
                  <h3>{modal.type === "agregar" ? "Agregar Servicio" : "Editar Servicio"}</h3>
                  <form className="modal-Servicio-form-grid">
                    <div className="CamposAgregarServicio">
                      <label className="asteriscoCamposServicio">
                        Nombre <span className="requiredServicio">*</span>
                      </label>
                      <input className="input"
                        type="text"
                        value={formData.nombre}
                        onChange={(e) => {
                          setFormData({ ...formData, nombre: e.target.value });
                          setFormErrors({ ...formErrors, nombre: "" });
                        }}
                      />
                      {formErrors.nombre && <span className="error">{formErrors.nombre}</span>}
                    </div>

                    <div className="CamposAgregarServicio">
                      <label className="asterisco">
                        Precio <span className="required">*</span>
                      </label>
                      <input className="input"
                        type="number"
                        value={formData.precio}
                        onChange={(e) => {
                          setFormData({ ...formData, precio: e.target.value });
                          setFormErrors({ ...formErrors, precio: "" });
                        }}
                        min="0"
                        step="0.01"
                      />
                      {formErrors.precio && <span className="error">{formErrors.precio}</span>}
                    </div>

                    <div className="CamposAgregarServicio">
                      <label>Categoría</label>
                      <select className="input"
                        value={formData.categoria}
                        onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                      >
                        <option value="" className="opcion">Seleccione una categoría</option>
                        {categorias.filter(c => c.estado === "Activo").map((cat, index) => (
                          <option key={index} value={cat.nombre}>{cat.nombre}</option>
                        ))}
                      </select>
                    </div>

                    <div className="CamposAgregarServicio">
                      <label>Imagen</label>
                      <input className="input"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      {formErrors.imagen && <span className="error">{formErrors.imagen}</span>}
                      {formData.imagenURL && (
                        <img
                          src={formData.imagenURL}
                          alt="Vista previa"
                          style={{ maxWidth: '100px', marginTop: '10px' }}
                        />
                      )}
                    </div>

                    <div className="CamposAgregarServicio">
                      <button className="botonEditarServicios" type="button" onClick={saveServicio}>
                        Guardar
                      </button>
                      <button className="botonEliminarServicios" type="button" onClick={closeModal}>
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
          <div className="modalServicio">
            <div className="modal-Servicio-confirm">
              <h3>Confirmar eliminación</h3>
              <p>¿Está seguro de que desea eliminar este servicio?</p>
              <div className="modalConfirmacionEliminar">
                <button className="botonEditarServicios" onClick={deleteServicio}>Sí, eliminar</button>
                <button className="botonEliminarServicios" onClick={() => setConfirmDelete(null)}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Servicios;