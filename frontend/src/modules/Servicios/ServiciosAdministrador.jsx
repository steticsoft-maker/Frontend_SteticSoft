import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import NavbarAdmin from "../../components/NavbarAdmin";
import "./servicios.css";

const Servicios = () => {
  const [servicios, setServicios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [currentServicio, setCurrentServicio] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("servicios");
    if (stored) setServicios(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("servicios", JSON.stringify(servicios));
  }, [servicios]);

  const handleSave = (servicio) => {
    if (modalType === "create") {
      setServicios([...servicios, { ...servicio, id: Date.now() }]);
    } else {
      const updated = servicios.map((s) =>
        s.id === currentServicio.id ? { ...currentServicio, ...servicio } : s
      );
      setServicios(updated);
    }
    closeModal();
  };

  const openModal = (type, servicio = null) => {
    setModalType(type);
    setCurrentServicio(servicio);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType("");
    setCurrentServicio(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de eliminar este servicio?")) {
      setServicios(servicios.filter((s) => s.id !== id));
    }
  };

  const toggleEstado = (id) => {
    const updated = servicios.map((s) =>
      s.id === id ? { ...s, estado: !s.estado } : s
    );
    setServicios(updated);
  };

  const handleFileUpload = (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setCurrentServicio((prev) => ({ ...prev, foto: reader.result }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const filteredServicios = servicios.filter((s) =>
    s.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="productos-container">
      <NavbarAdmin />
      <div className="main-content">
        <h1>Gestión de Servicios</h1>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Buscar servicio..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="search-input"
          />
          <button className="action-button" onClick={() => openModal("create")}>Agregar Servicio</button>
        </div>
        <table className="productos-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredServicios.map((servicio) => (
              <tr key={servicio.id}>
                <td>{servicio.nombre}</td>
                <td>{servicio.precio}</td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={servicio.estado}
                      onChange={() => toggleEstado(servicio.id)}
                    />
                    <span className="slider"></span>
                  </label>
                </td>
                <td>
                  <button className="table-button" onClick={() => openModal("details", servicio)} title="Ver">
                    <FaEye />
                  </button>
                  <button className="table-button" onClick={() => openModal("edit", servicio)} title="Editar">
                    <FaEdit />
                  </button>
                  <button className="table-button delete-button" onClick={() => handleDelete(servicio.id)} title="Eliminar">
                    <FaTrash />
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
            {modalType === "details" && currentServicio ? (
              <>
                <h2>Detalles del Servicio</h2>
                <p><strong>Nombre:</strong> {currentServicio.nombre}</p>
                <p><strong>Precio:</strong> {currentServicio.precio}</p>
                <p><strong>Descripción:</strong> {currentServicio.descripcion}</p>
                {currentServicio.foto && <img src={currentServicio.foto} alt="Servicio" width="200" />}
                <button className="close-button" onClick={closeModal}>Cerrar</button>
              </>
            ) : (
              <>
                <h2>{modalType === "create" ? "Agregar Servicio" : "Editar Servicio"}</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const servicio = {
                      nombre: formData.get("nombre"),
                      precio: parseFloat(formData.get("precio")),
                      descripcion: formData.get("descripcion"),
                      estado: modalType === "create" ? true : currentServicio.estado,
                      foto: currentServicio?.foto || null,
                    };
                    handleSave(servicio);
                  }}
                >
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre del servicio *"
                    defaultValue={currentServicio?.nombre || ""}
                    required
                  />
                  <input
                    type="number"
                    name="precio"
                    placeholder="Precio *"
                    defaultValue={currentServicio?.precio || ""}
                    required
                  />
                  <textarea
                    name="descripcion"
                    placeholder="Descripción (opcional)"
                    defaultValue={currentServicio?.descripcion || ""}
                  ></textarea>
                  <label>
                    <input type="file" accept="image/*" onChange={handleFileUpload} />
                  </label>
                  {currentServicio?.foto && (
                    <img src={currentServicio.foto} alt="Vista previa" width="100" />
                  )}
                  <div className="form-buttons">
                    <button type="submit" className="save-button">Guardar</button>
                    <button type="button" className="delete-button" onClick={closeModal}>Cancelar</button>
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

export default Servicios;
