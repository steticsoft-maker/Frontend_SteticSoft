import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import NavbarAdmin from "../../components/NavbarAdmin";
import "./categoria.css";

const CategoriaServicios = () => {
  // Cargar datos iniciales desde localStorage o usar los predeterminados
  const loadInitialData = () => {
    const savedServicios = localStorage.getItem("servicios");
    return savedServicios ? JSON.parse(savedServicios) : [
      { 
        id: 1, 
        nombre: " Categoría  A", 
        descripcion: "Descripción del servicio A", 
        estado: true, 
        foto: null 
      },
      { 
        id: 2, 
        nombre: "Categoría B", 
        descripcion: "", 
        estado: false, 
        foto: null 
      },
    ];
  };

  const [servicios, setServicios] = useState(loadInitialData());
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "create", "edit", "details"
  const [currentServicio, setCurrentServicio] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  // Guardar en localStorage cada vez que cambien los servicios
  useEffect(() => {
    localStorage.setItem("servicios", JSON.stringify(servicios));
  }, [servicios]);

  const handleSave = (servicio) => {
    if (modalType === "create") {
      // Generar un ID único para el nuevo servicio
      const newId = servicios.length > 0 ? Math.max(...servicios.map(s => s.id)) + 1 : 1;
      setServicios([...servicios, { ...servicio, id: newId }]);
    } else {
      const updatedServicios = servicios.map((s) =>
        s.id === currentServicio.id ? { ...currentServicio, ...servicio } : s
      );
      setServicios(updatedServicios);
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
    if (window.confirm("¿Estás seguro de que deseas eliminar este servicio?")) {
      setServicios(servicios.filter((s) => s.id !== id));
    }
  };

  const toggleEstado = (id) => {
    const updatedServicios = servicios.map((s) =>
      s.id === id ? { ...s, estado: !s.estado } : s
    );
    setServicios(updatedServicios);
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
    <div className="servicios-container">
      <NavbarAdmin />
      <div className="main-content">
        <h1>Categorías de Servicios</h1>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Buscar categoría servicio..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="search-input"
          />
          <button className="action-button" onClick={() => openModal("create")}>
            Agregar Servicio
          </button>
        </div>
        <table className="servicios-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredServicios.map((servicio) => (
              <tr key={servicio.id}>
                <td>{servicio.nombre}</td>
                <td>{servicio.descripcion || "Sin descripción"}</td>
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
                  <button
                    className="table-button"
                    onClick={() => openModal("details", servicio)}
                    title="Ver"
                  >
                    <FaEye />
                  </button>
                  <button
                    className="table-button"
                    onClick={() => openModal("edit", servicio)}
                    title="Editar"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="table-button delete-button"
                    onClick={() => handleDelete(servicio.id)}
                    title="Eliminar"
                  >
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
                <div className="form-group">
                  <label>Nombre:</label>
                  <p>{currentServicio.nombre}</p>
                </div>
                <div className="form-group">
                  <label>Descripción:</label>
                  <p>{currentServicio.descripcion || "No especificada"}</p>
                </div>
                <div className="form-group">
                  <label>Estado:</label>
                  <p>{currentServicio.estado ? "Activo" : "Inactivo"}</p>
                </div>
                {currentServicio.foto && (
                  <div className="form-group">
                    <label>Imagen:</label>
                    <img src={currentServicio.foto} alt="Servicio" width="200" />
                  </div>
                )}
                <div className="form-buttons">
                  <button className="close-button" onClick={closeModal}>
                    Cerrar
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2>
                  {modalType === "create" ? "Agregar Servicio" : "Editar Servicio"}
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const servicio = {
                      nombre: formData.get("nombre"),
                      descripcion: formData.get("descripcion"),
                      estado: modalType === "create" ? true : currentServicio.estado,
                      foto: currentServicio?.foto || null,
                    };
                    handleSave(servicio);
                  }}
                >
                  <div className="form-group">
                    <label>
                      Nombre<span className="required">*</span>
                      <input
                        type="text"
                        name="nombre"
                        placeholder="Nombre del servicio"
                        defaultValue={currentServicio?.nombre || ""}
                        required
                      />
                    </label>
                  </div>
                  
                  <div className="form-group">
                    <label>
                      Descripción
                      <textarea
                        name="descripcion"
                        placeholder="Descripción del servicio"
                        defaultValue={currentServicio?.descripcion || ""}
                        rows="3"
                      />
                    </label>
                  </div>
                  
                  <div className="form-group">
                    <label>
                      Imagen
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                      />
                    </label>
                    {currentServicio?.foto && (
                      <div className="image-preview">
                        <img
                          src={currentServicio.foto}
                          alt="Vista previa"
                          width="100"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="form-buttons">
                  <button type="submit" className="save-button">
                      Guardar
                    </button>
                    <button type="button" className="cancel-button" onClick={closeModal}>
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

export default CategoriaServicios;
