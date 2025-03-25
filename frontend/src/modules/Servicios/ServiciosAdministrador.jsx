import React, { useState, useEffect } from "react";
import NavbarAdmin from "../../components/NavbarAdmin";
import "./Servicios.css";

const Servicios = () => {
  // Servicios pre-registrados
  const initialServicios = [
    {
      id: 1,
      nombre: "Corte de cabello",
      categoria: "Belleza",
      precio: 150.00,
      anulado: false,
    },
    {
      id: 2,
      nombre: "Limpieza facial",
      categoria: "Belleza",
      precio: 250.00,
      anulado: false,
    },
    {
      id: 3,
      nombre: "Masaje relajante",
      categoria: "Bienestar",
      precio: 350.00,
      anulado: false,
    },
  ];

  // Categorías disponibles
  const categoriasDisponibles = [
    "Belleza",
    "Bienestar",
    "Salud",
    "Hogar",
    "Otros"
  ];

  const [servicios, setServicios] = useState(initialServicios);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "create", "edit", "details"
  const [currentServicio, setCurrentServicio] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  // Guardar servicios en LocalStorage cuando cambie el estado
  useEffect(() => {
    localStorage.setItem("servicios", JSON.stringify(servicios));
  }, [servicios]);

  // Manejar creación/edición de servicios
  const handleSave = (servicio) => {
    if (modalType === "create") {
      setServicios([...servicios, servicio]);
    } else if (modalType === "edit" && currentServicio) {
      const updatedServicios = servicios.map((s) =>
        s.id === currentServicio.id ? { ...currentServicio, ...servicio } : s
      );
      setServicios(updatedServicios);
    }
    closeModal();
  };

  // Abrir modal
  const openModal = (type, servicio = null) => {
    setModalType(type);
    setCurrentServicio(servicio || {
      nombre: "",
      categoria: categoriasDisponibles[0],
      precio: 0,
      anulado: false
    });
    setShowModal(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setShowModal(false);
    setModalType("");
    setCurrentServicio(null);
  };

  // Eliminar un servicio
  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este servicio?")) {
      setServicios(servicios.filter((s) => s.id !== id));
    }
  };

  // Cambiar estado del servicio (anulado/activo)
  const toggleAnular = (id) => {
    const updatedServicios = servicios.map((s) =>
      s.id === id ? { ...s, anulado: !s.anulado } : s
    );
    setServicios(updatedServicios);
  };

  // Filtrar servicios por búsqueda
  const filteredServicios = servicios.filter((s) =>
    s.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    s.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="servicios-container">
      <NavbarAdmin />
      <div className="main-content">
        <h1>Gestión de Servicios</h1>
        
        {/* Buscador */}
        <input
          type="text"
          placeholder="Buscar servicio..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="search-input"
        />

        {/* Botón para crear servicio */}
        <button className="action-button" onClick={() => openModal("create")}>
          Crear Servicio
        </button>

        {/* Tabla de servicios */}
        <table className="servicios-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredServicios.map((servicio) => (
              <tr key={servicio.id}>
                <td>{servicio.nombre}</td>
                <td>{servicio.categoria}</td>
                <td>${servicio.precio.toFixed(2)}</td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={servicio.anulado || false}
                      onChange={() => toggleAnular(servicio.id)}
                    />
                    <span className="slider"></span>
                  </label>
                  <span className="status-text">
                    {servicio.anulado ? "Inactivo" : "Activo"}
                  </span>
                </td>
                <td>
                  <button
                    className="table-button"
                    onClick={() => openModal("details", servicio)}
                  >
                    Ver
                  </button>
                  <button
                    className="table-button"
                    onClick={() => openModal("edit", servicio)}
                  >
                    Editar
                  </button>
                  <button
                    className="table-button delete-button"
                    onClick={() => handleDelete(servicio.id)}
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
            {modalType === "details" && currentServicio ? (
              <>
                <h2>Detalles del Servicio</h2>
                <p>
                  <strong>Nombre:</strong> {currentServicio.nombre}
                </p>
                <p>
                  <strong>Categoría:</strong> {currentServicio.categoria}
                </p>
                <p>
                  <strong>Precio:</strong> ${currentServicio.precio.toFixed(2)}
                </p>
                <p>
                  <strong>Estado:</strong> {currentServicio.anulado ? "Inactivo" : "Activo"}
                </p>
                <button className="close-button" onClick={closeModal}>
                  Cerrar
                </button>
              </>
            ) : (
              <>
                <h2>{modalType === "create" ? "Crear Servicio" : "Editar Servicio"}</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const servicio = {
                      id: currentServicio ? currentServicio.id : Date.now(),
                      nombre: formData.get("nombre"),
                      categoria: formData.get("categoria"),
                      precio: parseFloat(formData.get("precio")),
                      anulado: currentServicio?.anulado || false,
                    };
                    handleSave(servicio);
                  }}
                >
                  <div className="form-group">
                    <label htmlFor="nombre">Nombre:</label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      placeholder="Nombre del servicio"
                      defaultValue={currentServicio?.nombre || ""}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="categoria">Categoría:</label>
                    <select
                      id="categoria"
                      name="categoria"
                      defaultValue={currentServicio?.categoria || categoriasDisponibles[0]}
                      required
                    >
                      {categoriasDisponibles.map((categoria) => (
                        <option key={categoria} value={categoria}>
                          {categoria}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="precio">Precio ($):</label>
                    <input
                      type="number"
                      id="precio"
                      name="precio"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      defaultValue={currentServicio?.precio || ""}
                      required
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="action-button">
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

export default Servicios;