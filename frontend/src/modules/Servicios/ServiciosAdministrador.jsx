import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../components/NavbarAdmin";
import "./servicios.css";

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
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          imagen: file,
          imagenURL: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const saveServicio = () => {
    const errors = {};
    if (!formData.nombre.trim()) errors.nombre = "El nombre es obligatorio";
    if (!formData.precio || isNaN(formData.precio)) errors.precio = "Precio inválido";

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
      <Navbar />
      <div className="servicios-content">
        <h2>Gestión de Servicios</h2>
        <div className="acciones-barra">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar servicio..."
              value={search}
              onChange={handleSearch}
            />
          </div>
          <button className="btn-agregar" onClick={() => openModal("agregar")}>
            Agregar Servicio
          </button>
        </div>

        <div className="servicios-table">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Categoría</th>
                <th>Imagen</th>
                <th>Estado</th>
                <th>Acciones</th>
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
                    <button className="btn info btn-blue" onClick={() => openModal("ver", index)}>
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button className="btn info btn-blue" onClick={() => openModal("editar", index)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className="btn danger btn-red" onClick={() => setConfirmDelete(index)}>
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
                  <h3>Detalles del Servicio</h3>
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
                  <button className="btn close" onClick={closeModal}>Cerrar</button>
                </>
              ) : (
                <>
                  <h3>{modal.type === "agregar" ? "Agregar Servicio" : "Editar Servicio"}</h3>
                  <form className="modal-form-grid">
                    <div className="full-width">
                      <label className="asterisco">
                        Nombre <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.nombre}
                        onChange={(e) => {
                          setFormData({ ...formData, nombre: e.target.value });
                          setFormErrors({ ...formErrors, nombre: "" });
                        }}
                      />
                      {formErrors.nombre && <span className="error">{formErrors.nombre}</span>}
                    </div>
                    
                    <div className="full-width">
                      <label className="asterisco">
                        Precio <span className="required">*</span>
                      </label>
                      <input
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
                    
                    <div className="full-width">
                      <label>Categoría</label>
                      <select
                        value={formData.categoria}
                        onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                      >
                        <option value="">Seleccione una categoría</option>
                        {categorias.filter(c => c.estado === "Activo").map((cat, index) => (
                          <option key={index} value={cat.nombre}>{cat.nombre}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="full-width">
                      <label>Imagen</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      {formData.imagenURL && (
                        <img 
                          src={formData.imagenURL} 
                          alt="Vista previa" 
                          style={{ maxWidth: '100px', marginTop: '10px' }}
                        />
                      )}
                    </div>
                    
                    <div className="full-width">
                      <button className="btn success" type="button" onClick={saveServicio}>
                        Guardar
                      </button>
                      <button className="btn close" type="button" onClick={closeModal}>
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
          <div className="modal">
            <div className="modal-confirm">
              <h3>Confirmar eliminación</h3>
              <p>¿Está seguro de que desea eliminar este servicio?</p>
              <div className="modal-confirm-buttons">
                <button className="btn-blue" onClick={deleteServicio}>Sí, eliminar</button>
                <button className="btn-red" onClick={() => setConfirmDelete(null)}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Servicios;