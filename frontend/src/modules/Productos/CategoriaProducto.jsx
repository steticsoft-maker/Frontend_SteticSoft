import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa"; // Importar íconos
import NavbarAdmin from "../../components/NavbarAdmin/NavbarAdmin";
import "./CategoriaProducto.css";

const Categorias = () => {
  // Datos iniciales con los campos "tipoUso" y "vidaUtil"
  const initialCategorias = [
    {
      id: 1,
      nombre: "Electrónica",
      descripcion: "Productos electrónicos como celulares y laptops",
      estado: true,
      productos: ["Celular", "Laptop", "Televisión"],
      tipoUso: "Externo(Venta)",
      vidaUtil: 365, // ADD: Campo Tiempo de Vida Útil (en días)
    },
    {
      id: 2,
      nombre: "Hogar",
      descripcion: "Muebles y utensilios para el hogar",
      estado: true,
      productos: ["Sofá", "Mesa", "Lámpara"],
      tipoUso: "Interno(Uso)",
      vidaUtil: 730, // ADD: Campo Tiempo de Vida Útil (en días)
    },
    {
      id: 3,
      nombre: "Belleza",
      descripcion: "Productos para el cuidado personal",
      estado: false,
      productos: ["Shampoo", "Acondicionador", "Jabón"],
      tipoUso: "Externo(Venta)",
      vidaUtil: 180, // ADD: Campo Tiempo de Vida Útil (en días)
    },
  ];

  const [categorias, setCategorias] = useState(initialCategorias);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "create", "edit", "details"
  const [currentCategoria, setCurrentCategoria] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  // Estados para los campos del formulario (Nombre, Descripción, Tipo de Uso, Vida Util)
  const [nombreCategoria, setNombreCategoria] = useState("");
  const [descripcionCategoria, setDescripcionCategoria] = useState("");
  const [tipoUsoCategoria, setTipoUsoCategoria] = useState("");
  const [vidaUtilCategoria, setVidaUtilCategoria] = useState(""); // ADD: Nuevo estado para Vida Util

  useEffect(() => {
    // Cargar desde localStorage al inicio
    const savedCategorias = localStorage.getItem("categorias");
    if (savedCategorias) {
      setCategorias(JSON.parse(savedCategorias));
    }
  }, []);

  useEffect(() => {
    // Guardar en localStorage cada vez que 'categorias' cambie
    localStorage.setItem("categorias", JSON.stringify(categorias));
  }, [categorias]);

  // Cargar estado del formulario al abrir modal de edición o resetear al crear
  useEffect(() => {
    if (modalType === "edit" && currentCategoria) {
      setNombreCategoria(currentCategoria.nombre);
      setDescripcionCategoria(currentCategoria.descripcion);
      setTipoUsoCategoria(currentCategoria.tipoUso || "");
      setVidaUtilCategoria(currentCategoria.vidaUtil || ""); // ADD: Cargar vidaUtil existente
    } else if (modalType === "create") {
      // Resetear campos al abrir modal de creación
      setNombreCategoria("");
      setDescripcionCategoria("");
      setTipoUsoCategoria("");
      setVidaUtilCategoria(""); // ADD: Resetear vidaUtil
    } else {
      // Resetear si se cierra o es modal de detalles
      setNombreCategoria("");
      setDescripcionCategoria("");
      setTipoUsoCategoria("");
      setVidaUtilCategoria(""); // ADD: Resetear vidaUtil
    }
  }, [modalType, currentCategoria]); // Depende de modalType y currentCategoria

  const openModal = (type, categoria = null) => {
    setModalType(type);
    setShowModal(true);
    setCurrentCategoria(categoria);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType("");
    setCurrentCategoria(null);
  };

  // Función para guardar (agregar o editar) categoría
  const handleSave = (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    // Obtener valores de los estados controlados
    const nombre = nombreCategoria;
    const descripcion = descripcionCategoria;
    const tipoUso = tipoUsoCategoria;
    const vidaUtil = parseInt(vidaUtilCategoria, 10); // ADD: Obtener y parsear vidaUtil como entero

    // Validación simple
    if (
      !nombre ||
      !descripcion ||
      !tipoUso ||
      isNaN(vidaUtil) ||
      vidaUtil <= 0
    ) {
      // ADD: Validar vidaUtil
      alert(
        "Por favor, completa todos los campos obligatorios (Nombre, Descripción, Tipo de Uso, Vida Útil válida)."
      );
      return;
    }

    // Construir el objeto categoría a guardar
    const categoriaToSave = {
      id: currentCategoria ? currentCategoria.id : Date.now(), // Usar ID existente si es edición
      nombre: nombre,
      descripcion: descripcion,
      estado: currentCategoria ? currentCategoria.estado : true, // Mantener estado si es edición, por defecto activa si es creación
      productos: currentCategoria ? currentCategoria.productos : [], // Mantener productos si es edición, por defecto vacío si es creación
      tipoUso: tipoUso, // Incluir el tipo de uso
      vidaUtil: vidaUtil, // ADD: Incluir la vida útil
    };

    if (modalType === "create") {
      setCategorias([...categorias, categoriaToSave]);
    } else if (modalType === "edit" && currentCategoria) {
      const updatedCategorias = categorias.map((cat) =>
        cat.id === currentCategoria.id ? categoriaToSave : cat
      );
      setCategorias(updatedCategorias);
    }
    closeModal(); // Cerrar modal después de guardar
  };

  const handleDelete = (id) => {
    if (
      window.confirm("¿Estás seguro de que deseas eliminar esta categoría?")
    ) {
      setCategorias(categorias.filter((cat) => cat.id !== id));
    }
  };

  const toggleEstado = (id) => {
    const updatedCategorias = categorias.map((cat) =>
      cat.id === id ? { ...cat, estado: !cat.estado } : cat
    );
    setCategorias(updatedCategorias);
  };

  // Filtro de búsqueda por Nombre, Descripción, Tipo de Uso o Vida Útil
  const filteredCategorias = categorias.filter(
    (cat) =>
      cat.nombre.toLowerCase().includes(busqueda.toLowerCase()) || // Buscar por nombre
      cat.descripcion.toLowerCase().includes(busqueda.toLowerCase()) || // Buscar por descripción
      (cat.tipoUso &&
        cat.tipoUso.toLowerCase().includes(busqueda.toLowerCase())) || // Buscar por tipo de uso
      (cat.vidaUtil != null && cat.vidaUtil.toString().includes(busqueda)) // ADD: Buscar por vida útil (convertir a string)
  );

  return (
    <div className="categorias-container">
      <NavbarAdmin />
      <div className="CategoriaProductoContent">
        <h1>Gestión Categorías de Productos</h1>
        <div className="BarraBusquedaBotonAgregarCategoriaProductos">
          <input
            type="text"
            placeholder="Buscar categoría (Nombre, Descripción, Tipo Uso, Vida Útil)..." // ADD: Actualizar placeholder
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="inputBarraBusquedaCategoriaProductos"
          />
          <button
            className="botonAgregarCategoriaProducto"
            onClick={() => openModal("create")}
          >
            Agregar Categoría
          </button>
        </div>
        <table className="tablaCategoriaProductos">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Vida Útil</th> {/* ADD: Nueva columna en la tabla */}
              <th>Tipo de Uso</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategorias.map((categoria) => (
              <tr key={categoria.id}>
                <td>{categoria.nombre}</td>
                <td>{categoria.descripcion}</td>
                <td>{categoria.vidaUtil} días</td>{" "}
                {/* ADD: Mostrar vida útil */}
                <td>{categoria.tipoUso}</td>
                <td>
                  {/* Switch de estado */}
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
                  {/* Botones de acción */}
                  <button
                    className="iconBotonVerDetallesCategoriaProductos table-action-button-categoria"
                    onClick={() => openModal("details", categoria)}
                    title="Ver"
                  >
                    <FaEye />
                  </button>
                  <button
                    className="iconBotonEditarCategoriaProductos table-action-button-categoria"
                    onClick={() => openModal("edit", categoria)}
                    title="Editar"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="iconBotonEliminarCategoriaProductos botonEliminarCategoriaProductos table-action-button-categoria"
                    onClick={() => handleDelete(categoria.id)}
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

      {/* Modal Principal */}
      {showModal && (
        <div className="modalCategoriaProductos">
          <div className="modal-content-CategoriaProductos">
            {/* Contenido del modal de Creación */}
            {modalType === "create" && (
              <>
                <h2>Agregar Categoría</h2>
                <form onSubmit={handleSave}>
                  {/* Grupo para Nombre */}
                  <div className="form-group-categoria">
                    <label htmlFor="nombre" className="form-label-categoria">
                      Nombre: <span className="required-asterisk">*</span>
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      placeholder="Nombre de la categoría"
                      value={nombreCategoria}
                      onChange={(e) => setNombreCategoria(e.target.value)}
                      className="form-input-categoria"
                      required
                    />
                  </div>

                  {/* Grupo para Descripción */}
                  <div className="form-group-categoria">
                    <label
                      htmlFor="descripcion"
                      className="form-label-categoria"
                    >
                      Descripción: <span className="required-asterisk">*</span>
                    </label>
                    <textarea
                      id="descripcion"
                      name="descripcion"
                      placeholder="Descripción de la categoría"
                      value={descripcionCategoria}
                      onChange={(e) => setDescripcionCategoria(e.target.value)}
                      className="form-textarea-categoria"
                      required
                    />
                  </div>

                  {/* ADD: Grupo para Tiempo de Vida Útil */}
                  <div className="form-group-categoria">
                    <label htmlFor="vidaUtil" className="form-label-categoria">
                      Vida Útil (días):{" "}
                      <span className="required-asterisk">*</span>
                    </label>
                    <input
                      type="number" // Input de tipo número
                      id="vidaUtil"
                      name="vidaUtil"
                      placeholder="Ej: 365"
                      value={vidaUtilCategoria}
                      onChange={(e) => setVidaUtilCategoria(e.target.value)}
                      className="form-input-categoria" // Reutilizar estilos de input
                      required
                      min="1" // Valor mínimo 1
                    />
                  </div>

                  {/* Grupo para Tipo de Uso */}
                  <div className="form-group-categoria">
                    <label htmlFor="tipoUso" className="form-label-categoria">
                      Tipo de Uso: <span className="required-asterisk">*</span>
                    </label>
                    <select
                      id="tipoUso"
                      name="tipoUso"
                      value={tipoUsoCategoria}
                      onChange={(e) => setTipoUsoCategoria(e.target.value)}
                      className="form-select-categoria"
                      required
                    >
                      <option value="">Seleccione el tipo de uso</option>
                      <option value="Interno(Uso)">Interno (Uso)</option>
                      <option value="Externo(Venta)">Externo (Venta)</option>
                    </select>
                  </div>

                  <div className="form-actions-categoria">
                    <button
                      type="submit"
                      className="form-button-guardar-categoria"
                    >
                      Guardar
                    </button>
                    <button
                      type="button"
                      className="form-button-cancelar-categoria"
                      onClick={closeModal}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Contenido del modal de Detalles */}
            {modalType === "details" && currentCategoria && (
              <div className="details-content-categoria">
                <h2>Detalles de la Categoría</h2>
                <p>
                  <strong>Nombre:</strong> {currentCategoria.nombre}
                </p>
                <p>
                  <strong>Descripción:</strong> {currentCategoria.descripcion}
                </p>
                {/* ADD: Mostrar Vida Útil */}
                <p>
                  <strong>Vida Útil:</strong> {currentCategoria.vidaUtil} días
                </p>
                {/* Mostrar Tipo de Uso */}
                <p>
                  <strong>Tipo de Uso:</strong> {currentCategoria.tipoUso}
                </p>
                <p>
                  <strong>Estado:</strong>{" "}
                  {currentCategoria.estado ? "Activa" : "Inactiva"}
                </p>
                <p>
                  <strong>Productos:</strong>{" "}
                  {currentCategoria.productos.join(", ")}
                </p>
                <button
                  className="modal-button-cerrar-categoria"
                  onClick={closeModal}
                >
                  Cerrar
                </button>
              </div>
            )}

            {/* Contenido del modal de Edición */}
            {modalType === "edit" && currentCategoria && (
              <>
                <h2>Editar Categoría</h2>
                <form onSubmit={handleSave}>
                  {/* Grupo para Nombre */}
                  <div className="form-group-categoria">
                    <label
                      htmlFor="nombreEdit"
                      className="form-label-categoria"
                    >
                      Nombre: <span className="required-asterisk">*</span>
                    </label>
                    <input
                      type="text"
                      id="nombreEdit"
                      name="nombre"
                      placeholder="Nombre de la categoría"
                      value={nombreCategoria}
                      onChange={(e) => setNombreCategoria(e.target.value)}
                      className="form-input-categoria"
                      required
                    />
                  </div>

                  {/* Grupo para Descripción */}
                  <div className="form-group-categoria">
                    <label
                      htmlFor="descripcionEdit"
                      className="form-label-categoria"
                    >
                      Descripción: <span className="required-asterisk">*</span>
                    </label>
                    <textarea
                      id="descripcionEdit"
                      name="descripcion"
                      placeholder="Descripción de la categoría"
                      value={descripcionCategoria}
                      onChange={(e) => setDescripcionCategoria(e.target.value)}
                      className="form-textarea-categoria"
                      required
                    />
                  </div>

                  {/* ADD: Grupo para Tiempo de Vida Útil en Edición */}
                  <div className="form-group-categoria">
                    <label
                      htmlFor="vidaUtilEdit"
                      className="form-label-categoria"
                    >
                      Vida Útil (días):{" "}
                      <span className="required-asterisk">*</span>
                    </label>
                    <input
                      type="number" // Input de tipo número
                      id="vidaUtilEdit"
                      name="vidaUtil"
                      placeholder="Ej: 365"
                      value={vidaUtilCategoria}
                      onChange={(e) => setVidaUtilCategoria(e.target.value)}
                      className="form-input-categoria" // Reutilizar estilos de input
                      required
                      min="1" // Valor mínimo 1
                    />
                  </div>

                  {/* Grupo para Tipo de Uso en Edición */}
                  <div className="form-group-categoria">
                    <label
                      htmlFor="tipoUsoEdit"
                      className="form-label-categoria"
                    >
                      Tipo de Uso: <span className="required-asterisk">*</span>
                    </label>
                    <select
                      id="tipoUsoEdit"
                      name="tipoUso"
                      value={tipoUsoCategoria}
                      onChange={(e) => setTipoUsoCategoria(e.target.value)}
                      className="form-select-categoria"
                      required
                    >
                      <option value="">Seleccione el tipo de uso</option>
                      <option value="Interno(Uso)">Interno (Uso)</option>
                      <option value="Externo(Venta)">Externo (Venta)</option>
                    </select>
                  </div>

                  <div className="form-actions-categoria">
                    <button
                      type="submit"
                      className="form-button-guardar-categoria"
                    >
                      Guardar Cambios
                    </button>
                    <button
                      type="button"
                      className="form-button-cancelar-categoria"
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
