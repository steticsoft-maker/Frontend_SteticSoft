import React, { useState, useEffect } from "react";
import NavbarAdmin from "../../components/NavbarAdmin/NavbarAdmin";
import { FaEye, FaTrash, FaEdit } from "react-icons/fa";
import "./Abastecimiento.css";

const Abastecimiento = () => {
  // Define the new categories
  const nuevasCategorias = [
    "Cejas",
    "Pestañas",
    "Cabello",
    "Uñas",
    "Facial",
    "Corporal",
  ];

  // Define available products with new categories and lifetime (in days)
  const productosDisponibles = [
    { nombre: "Sérum para Cejas", category: "Cejas", lifetimeDays: 365 },
    {
      nombre: "Extensiones de Pestañas",
      category: "Pestañas",
      lifetimeDays: 730,
    },
    { nombre: "Shampoo Profesional", category: "Cabello", lifetimeDays: 365 },
    { nombre: "Tijeras de Corte", category: "Cabello", lifetimeDays: 1825 }, // ~5 years
    { nombre: "Esmalte Permanente", category: "Uñas", lifetimeDays: 730 },
    { nombre: "Mascarilla Facial", category: "Facial", lifetimeDays: 365 },
    { nombre: "Aceite de Masaje", category: "Corporal", lifetimeDays: 730 },
    { nombre: "Secadora", category: "Cabello", lifetimeDays: 2555 }, // ~7 years
    { nombre: "Peine", category: "Cabello", lifetimeDays: 730 }, // ~2 years
  ];

  // Load initial data from Local Storage or use defaults with updated categories
  const initialProductos = JSON.parse(
    localStorage.getItem("abastecimiento")
  ) || [
    {
      id: 1,
      nombre: "Shampoo Profesional",
      cantidad: 50,
      fechaIngreso: "2025-04-01",
      empleado: "Carlos López",
      category: "Cabello", // Updated category
      isDepleted: false,
      depletionReason: "",
    },
    {
      id: 2,
      nombre: "Tijeras de Corte",
      cantidad: 20,
      fechaIngreso: "2025-04-02",
      empleado: "Ana Pérez",
      category: "Cabello", // Updated category
      isDepleted: false,
      depletionReason: "",
    },
    {
      id: 3,
      nombre: "Sérum para Cejas",
      cantidad: 15,
      fechaIngreso: "2025-04-03",
      empleado: "Luis Torres",
      category: "Cejas", // Updated category
      isDepleted: false,
      depletionReason: "",
    },
  ];

  const [productos, setProductos] = useState(initialProductos);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "create", "edit", "details", "selection", "deplete", "confirmDelete"
  const [currentProducto, setCurrentProducto] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const [showProductModal, setShowProductModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false); // Modal for category selection

  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null); // State for selected category

  const [busquedaProductoModal, setBusquedaProductoModal] = useState("");
  const [busquedaEmpleadoModal, setBusquedaEmpleadoModal] = useState("");
  const [busquedaCategoryModal, setBusquedaCategoryModal] = useState(""); // Search for categories

  const [confirmDelete, setConfirmDelete] = useState(null);
  const [depleteProduct, setDepleteProduct] = useState(null); // State for depletion confirmation
  const [depletionReasonInput, setDepletionReasonInput] = useState(""); // Input for depletion reason

  // State to hold the quantity input value for resetting
  const [cantidadInput, setCantidadInput] = useState("");

  // Save to Local Storage whenever products change
  useEffect(() => {
    localStorage.setItem("abastecimiento", JSON.stringify(productos));
  }, [productos]);

  const categoriasDisponibles = nuevasCategorias; // Use the new categories
  const empleados = [
    "Carlos López",
    "Ana Pérez",
    "Luis Torres",
    "Sofía Rodríguez",
  ];

  // Filter products in the main table based on search input
  const filteredProductos = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.empleado.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.fechaIngreso.includes(busqueda) || // Basic date search
      p.category.toLowerCase().includes(busqueda.toLowerCase()) // Also search by category
  );

  // Filter products in the selection modal based on search and selected category
  const filteredProductosModal = productosDisponibles.filter(
    (prod) =>
      prod.nombre.toLowerCase().includes(busquedaProductoModal.toLowerCase()) &&
      (categoriaSeleccionada === null ||
        prod.category === categoriaSeleccionada) // Filter by selected category
  );

  // Filter employees in the selection modal based on search
  const filteredEmpleadosModal = empleados.filter((emp) =>
    emp.toLowerCase().includes(busquedaEmpleadoModal.toLowerCase())
  );

  // Filter categories in the selection modal based on search
  const filteredCategoriesModal = categoriasDisponibles.filter((cat) =>
    cat.toLowerCase().includes(busquedaCategoryModal.toLowerCase())
  );

  // --- Modal Open/Close Handlers ---

  const openProductModal = () => {
    console.log("openProductModal called");
    setBusquedaProductoModal("");
    // Require category selection first in create mode
    if (!categoriaSeleccionada && modalType !== "edit") {
      alert("Por favor, selecciona una categoría primero.");
      return;
    }
    // Set modalType to selection before showing the specific modal
    setModalType("selection");
    setShowProductModal(true);
  };

  const closeProductModal = () => {
    console.log("closeProductModal called");
    setShowProductModal(false);
    // If no other selection modals are open, return to the main modal type if it was open
    if (!showEmployeeModal && !showCategoryModal) {
      console.log(
        "No other selection modals open, attempting to return to main modal type"
      );
      // Check if the main modal was active before opening selection
      if (showModal) {
        setModalType(currentProducto ? "edit" : "create");
      } else {
        setModalType(""); // Close completely if main modal wasn't open
      }
    }
  };

  const openEmployeeModal = () => {
    console.log("openEmployeeModal called");
    setBusquedaEmpleadoModal("");
    // Set modalType to selection before showing the specific modal
    setModalType("selection");
    setShowEmployeeModal(true);
  };

  const closeEmployeeModal = () => {
    console.log("closeEmployeeModal called");
    setShowEmployeeModal(false);
    // If no other selection modals are open, return to the main modal type if it was open
    if (!showProductModal && !showCategoryModal) {
      console.log(
        "No other selection modals open, attempting to return to main modal type"
      );
      // Check if the main modal was active before opening selection
      if (showModal) {
        setModalType(currentProducto ? "edit" : "create");
      } else {
        setModalType(""); // Close completely if main modal wasn't open
      }
    }
  };

  const openCategoryModal = () => {
    console.log("openCategoryModal called");
    setBusquedaCategoryModal("");
    // Set modalType to selection before showing the specific modal
    setModalType("selection");
    setShowCategoryModal(true);
  };

  const closeCategoryModal = () => {
    console.log("closeCategoryModal called");
    setShowCategoryModal(false);
    // If no other selection modals are open, return to the main modal type if it was open
    if (!showProductModal && !showEmployeeModal) {
      console.log(
        "No other selection modals open, attempting to return to main modal type"
      );
      // Check if the main modal was active before opening selection
      if (showModal) {
        setModalType(currentProducto ? "edit" : "create");
      } else {
        setModalType(""); // Close completely if main modal wasn't open
      }
    }
  };

  // --- Main Modal Handlers (Create/Edit/Details) ---

  // Unified save handler with option to save and add another
  const handleSave = (producto, saveAndAddAnother = false) => {
    // Basic Validation
    if (
      !producto.nombre ||
      !producto.cantidad ||
      !producto.empleado ||
      !producto.category
    ) {
      alert(
        "Por favor, completa todos los campos obligatorios (Categoría, Producto, Cantidad, Empleado)."
      );
      return;
    }

    // Find the product definition to get lifetime (though lifetime is not saved per entry here)
    const productDefinition = productosDisponibles.find(
      (p) => p.nombre === producto.nombre
    );
    if (!productDefinition) {
      alert("Producto no encontrado en la lista de productos disponibles.");
      return;
    }

    if (modalType === "create") {
      setProductos([
        ...productos,
        {
          ...producto,
          id: Date.now(), // Generate a unique ID for each entry
          fechaIngreso: new Date().toISOString().split("T")[0], // Set current date on creation
          isDepleted: false,
          depletionReason: "",
        },
      ]);

      if (saveAndAddAnother) {
        // Reset form fields for new entry, keep modal open
        setProductoSeleccionado(null);
        setEmpleadoSeleccionado(null);
        setCantidadInput(""); // Clear quantity input
        // Keep category selected if desired, or reset: setCategoriaSeleccionada(null);
        // setModalType("create"); // Already create mode
        setCurrentProducto(null); // Ensure no product is selected for editing the next entry
        // No need to change modalType or showModal, stay in create mode with main modal visible
      } else {
        closeModal(); // Save and close
      }
    } else if (modalType === "edit" && currentProducto) {
      const updatedProductos = productos.map(
        (p) =>
          p.id === currentProducto.id
            ? {
                ...currentProducto,
                ...producto,
                category: categoriaSeleccionada,
                empleado: empleadoSeleccionado,
                nombre: productoSeleccionado,
                cantidad: producto.cantidad,
              }
            : p // Ensure updated selections and quantity are saved
      );
      setProductos(updatedProductos);
      closeModal();
    }
  };

  const openModal = (type, producto = null) => {
    console.log(`openModal called with type: ${type}`);
    setModalType(type);
    setCurrentProducto(producto);
    setCantidadInput(producto?.cantidad || ""); // Set quantity input value

    // Reset selections or load existing for edit
    if (type === "create") {
      setProductoSeleccionado(null);
      setEmpleadoSeleccionado(null);
      setCategoriaSeleccionada(null); // Reset category for new entry
      setDepletionReasonInput(""); // Clear depletion reason input
    } else if (type === "edit" && producto) {
      // Load data of the product for editing
      setProductoSeleccionado(producto.nombre);
      setEmpleadoSeleccionado(producto.empleado);
      setCategoriaSeleccionada(producto.category); // Load existing category
      setDepletionReasonInput(producto.depletionReason || ""); // Load depletion reason
    } else if (type === "details" && producto) {
      // Load data for details view
      setCurrentProducto(producto);
    }
    setShowModal(true); // Control the main modal (form/details)
  };

  const closeModal = () => {
    console.log("closeModal called");
    setShowModal(false);
    setModalType(""); // Clear modal type when main modal is closed
    setCurrentProducto(null);
    setProductoSeleccionado(null);
    setEmpleadoSeleccionado(null);
    setCategoriaSeleccionada(null);
    setCantidadInput(""); // Clear quantity input
    setShowProductModal(false); // Ensure all selection modals are hidden
    setShowEmployeeModal(false);
    setShowCategoryModal(false);
    setConfirmDelete(null); // Close delete confirmation if open
    setDepleteProduct(null); // Close depletion confirmation if open
    setDepletionReasonInput(""); // Clear input
  };

  // --- Delete Handlers ---

  const handleDelete = (id) => {
    const prod = productos.find((p) => p.id === id);
    setConfirmDelete(prod);
    setModalType("confirmDelete"); // Set modal type for confirmation
    // Keep showModal as true to show the confirmation modal over the main content
    setShowModal(true); // Ensure overlay is shown
  };

  const deleteProducto = () => {
    setProductos(productos.filter((p) => p.id !== confirmDelete.id));
    setConfirmDelete(null);
    closeModal(); // Close the modal after deleting
  };

  // --- Depletion Handlers ---

  const handleMarkAsDepleted = (producto) => {
    setDepleteProduct(producto);
    setDepletionReasonInput(producto.depletionReason || ""); // Load existing reason
    setModalType("deplete"); // Set modal type for depletion
    // Keep showModal as true to show the depletion modal over the main content
    setShowModal(true); // Ensure overlay is shown
  };

  const confirmDepletion = () => {
    const updatedProductos = productos.map((p) =>
      p.id === depleteProduct.id
        ? {
            ...p,
            isDepleted: true,
            depletionReason: depletionReasonInput,
            depletionDate: new Date().toISOString().split("T")[0],
          }
        : p
    );
    setProductos(updatedProductos);
    setDepleteProduct(null);
    setDepletionReasonInput("");
    closeModal(); // Close the modal after confirming depletion
  };

  // --- Helper to calculate remaining lifetime ---
  const calculateRemainingLifetime = (producto) => {
    const productDefinition = productosDisponibles.find(
      (p) => p.nombre === producto.nombre
    );
    if (!productDefinition || !producto.fechaIngreso) {
      return "N/A";
    }

    const ingressDate = new Date(producto.fechaIngreso);
    const currentDate = new Date();
    const lifetimeDays = productDefinition.lifetimeDays;

    if (isNaN(ingressDate.getTime())) {
      return "Fecha Inválida";
    }

    const timeDiff =
      ingressDate.getTime() +
      lifetimeDays * 24 * 60 * 60 * 1000 -
      currentDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (daysDiff < 0) {
      return "Expirado";
    } else if (daysDiff === 0) {
      return "Expira hoy";
    } else {
      return `${daysDiff} días restantes`;
    }
  };

  return (
    <div className="abastecimiento-container">
      <NavbarAdmin />
      <div className="main-content-area">
        <div className="abastecimiento-content-wrapper">
          <h1>Gestión de Abastecimiento</h1>
          <div className="containerAgregarBuscarAbastecimiento">
            <input
              type="text"
              placeholder="Buscar producto, empleado, fecha o categoría..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="inputBuscarAbastecimiento"
            />
            <button
              className="botonAgregarAbastecimiento"
              onClick={() => openModal("create")}
            >
              Agregar Producto
            </button>
          </div>

          <table className="tabla-abastecimiento">
            {" "}
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Categoría</th> {/* Added Category column */}
                <th>Cantidad</th>
                <th>Empleado Asignado</th>
                <th>Fecha de Ingreso</th>
                <th>Tiempo de Vida Restante</th> {/* Added Lifetime column */}
                <th>Estado</th> {/* Added Status column */}
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProductos.map((producto) => (
                <tr
                  key={producto.id}
                  className={producto.isDepleted ? "depleted-row" : ""}
                >
                  {" "}
                  {/* Add class for depleted */}
                  <td data-label="Nombre:">{producto.nombre}</td>{" "}
                  {/* Added data-label */}
                  <td data-label="Categoría:">
                    {producto.category || "N/A"}
                  </td>{" "}
                  {/* Added data-label */}
                  <td data-label="Cantidad:">{producto.cantidad}</td>{" "}
                  {/* Added data-label */}
                  <td data-label="Empleado Asignado:">
                    {producto.empleado}
                  </td>{" "}
                  {/* Added data-label */}
                  <td data-label="Fecha de Ingreso:">
                    {producto.fechaIngreso}
                  </td>{" "}
                  {/* Added data-label */}
                  <td data-label="Vida Restante:">
                    {calculateRemainingLifetime(producto)}
                  </td>{" "}
                  {/* Added data-label */}
                  <td data-label="Estado:">
                    {" "}
                    {/* Added data-label */}
                    {producto.isDepleted
                      ? `Agotado: ${
                          producto.depletionReason || "Sin especificar"
                        }`
                      : "Disponible"}{" "}
                    {/* Display status */}
                  </td>
                  <td data-label="Acciones:">
                    {" "}
                    {/* Added data-label */}
                    <div className="icon-actions-abastecimiento">
                      <button
                        className="table-icons-abastecimiento"
                        onClick={() => openModal("details", producto)}
                        title="Ver Detalles"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="table-icons-abastecimiento"
                        onClick={() => openModal("edit", producto)}
                        title="Editar Producto"
                        disabled={producto.isDepleted} // Disable edit if depleted
                      >
                        <FaEdit />
                      </button>
                      {!producto.isDepleted && ( // Only show deplete button if not depleted
                        <button
                          className="table-icons-abastecimiento deplete-button-abastecimiento"
                          onClick={() => handleMarkAsDepleted(producto)}
                          title="Marcar como Agotado"
                        >
                          Agotar
                        </button>
                      )}

                      <button
                        className="table-icons-abastecimiento delete-button-abastecimiento"
                        onClick={() => handleDelete(producto.id)}
                        title="Eliminar Producto"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>{" "}
      </div>{" "}
      {/* Main Modal (Create/Edit/Details) */}
      {showModal &&
        modalType !== "selection" &&
        modalType !== "confirmDelete" &&
        modalType !== "deplete" && (
          <div className="modal-abastecimiento-overlay">
            <div className="modal-abastecimiento-content">
              {modalType === "details" && currentProducto ? (
                <div className="abastecimiento-details-text">
                  <h2>Detalles del Producto</h2>
                  <p>
                    <strong>Nombre:</strong> {currentProducto.nombre}
                  </p>
                  <p>
                    <strong>Categoría:</strong>{" "}
                    {currentProducto.category || "N/A"}
                  </p>
                  <p>
                    <strong>Cantidad:</strong> {currentProducto.cantidad}
                  </p>
                  <p>
                    <strong>Empleado:</strong> {currentProducto.empleado}
                  </p>
                  <p>
                    <strong>Fecha de Ingreso:</strong>
                    {currentProducto.fechaIngreso}
                  </p>
                  <p>
                    <strong>Tiempo de Vida Restante:</strong>{" "}
                    {calculateRemainingLifetime(currentProducto)}
                  </p>
                  {currentProducto.isDepleted && (
                    <p className="depleted-text">
                      <strong>Estado:</strong> Agotado
                      {currentProducto.depletionReason &&
                        `: ${currentProducto.depletionReason}`}
                    </p>
                  )}
                  <button
                    className="modal-abastecimiento-button-cerrar"
                    onClick={closeModal}
                  >
                    Cerrar
                  </button>
                </div>
              ) : (
                <>
                  <h2>
                    {modalType === "create"
                      ? "Agregar Producto"
                      : "Editar Producto"}
                  </h2>
                  <form
                    className="formularioModalAbastecimiento"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const producto = {
                        nombre: productoSeleccionado,
                        cantidad: Number(cantidadInput), // Use state variable
                        empleado: empleadoSeleccionado,
                        category: categoriaSeleccionada,
                      };
                      // Default save behavior is save and close
                      handleSave(producto, false); // Pass false to indicate not to save and add another
                    }}
                  >
                    {/* Category Selection */}
                    <div className="form-group-abastecimiento">
                      <label className="form-label-abastecimiento">
                        Categoría:
                        <span className="required-asterisk">*</span>{" "}
                      </label>
                      <button
                        type="button"
                        className="form-button-select-abastecimiento"
                        onClick={openCategoryModal}
                      >
                        Seleccionar Categoría
                      </button>
                      <p>
                        <strong>Categoría Seleccionada:</strong>{" "}
                        {categoriaSeleccionada || "Ninguna"}
                      </p>
                    </div>

                    {/* Product Selection (Filtered by Category) */}
                    <div className="form-group-abastecimiento">
                      <label className="form-label-abastecimiento">
                        Producto:
                        <span className="required-asterisk">*</span>{" "}
                      </label>
                      <button
                        type="button"
                        className="form-button-select-abastecimiento"
                        onClick={openProductModal}
                        disabled={
                          !categoriaSeleccionada && modalType !== "edit"
                        } // Disable if no category selected for create
                      >
                        Seleccionar Producto
                      </button>
                      <p>
                        <strong>Producto Seleccionado:</strong>{" "}
                        {productoSeleccionado || "Ninguno"}
                      </p>
                    </div>

                    {/* Employee Selection */}
                    <div className="form-group-abastecimiento">
                      <label className="form-label-abastecimiento">
                        Empleado:
                        <span className="required-asterisk">*</span>{" "}
                      </label>
                      <button
                        type="button"
                        className="form-button-select-abastecimiento"
                        onClick={openEmployeeModal}
                      >
                        Seleccionar Empleado
                      </button>
                      <p>
                        <strong>Empleado Seleccionado:</strong>{" "}
                        {empleadoSeleccionado || "Ninguno"}
                      </p>
                    </div>

                    {/* Quantity Input */}
                    <div className="form-group-abastecimiento">
                      <label
                        htmlFor="cantidad"
                        className="form-label-abastecimiento"
                      >
                        Cantidad:
                        <span className="required-asterisk">*</span>{" "}
                      </label>
                      <input
                        id="cantidad"
                        className="form-input-abastecimiento"
                        type="number"
                        name="cantidad"
                        placeholder="Cantidad"
                        value={cantidadInput} // Use state variable for controlled input
                        onChange={(e) => setCantidadInput(e.target.value)}
                        required
                        min="1" // Quantity should be at least 1
                      />
                    </div>

                    <div className="form-actions-abastecimiento">
                      {modalType === "create" && (
                        <button
                          type="button" // Use type="button" so it doesn't submit the form by default
                          className="form-button-guardar-abastecimiento"
                          onClick={() => {
                            const producto = {
                              nombre: productoSeleccionado,
                              cantidad: Number(cantidadInput), // Use state variable
                              empleado: empleadoSeleccionado,
                              category: categoriaSeleccionada,
                            };
                            handleSave(producto, true); // Pass true to save and add another
                          }}
                          disabled={
                            !productoSeleccionado ||
                            !empleadoSeleccionado ||
                            !categoriaSeleccionada ||
                            Number(cantidadInput) <= 0
                          } // Disable if required fields are not selected or quantity is invalid
                        >
                          Guardar y Agregar Otro
                        </button>
                      )}
                      <button
                        type="submit" // This button will submit the form
                        className="form-button-guardar-abastecimiento"
                        disabled={
                          !productoSeleccionado ||
                          !empleadoSeleccionado ||
                          !categoriaSeleccionada ||
                          Number(cantidadInput) <= 0
                        } // Disable if required fields are not selected or quantity is invalid
                      >
                        {modalType === "create" ? "Guardar" : "Guardar Cambios"}{" "}
                        {/* Change text based on modal type */}
                      </button>
                      <button
                        type="button"
                        className="form-button-cancelar-abastecimiento"
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
      {/* Selection Modals (Product, Employee, Category) */}
      {/* Use modalType === 'selection' to control the overlay for all selection modals */}
      {modalType === "selection" &&
        (showEmployeeModal || showProductModal || showCategoryModal) && (
          <div className="modal-abastecimiento-overlay">
            <div className="modal-abastecimiento-selection-container">
              {/* Employee Selection Modal */}
              {showEmployeeModal && (
                <>
                  <h2>Seleccionar Empleado</h2>
                  <input
                    className="modal-selection-input-abastecimiento"
                    type="text"
                    placeholder="Buscar empleado..."
                    value={busquedaEmpleadoModal}
                    onChange={(e) => setBusquedaEmpleadoModal(e.target.value)}
                  />
                  <ul className="modal-selection-list-abastecimiento">
                    {filteredEmpleadosModal.map((emp) => (
                      <li key={emp}>
                        <button
                          onClick={() => {
                            setEmpleadoSeleccionado(emp);
                            closeEmployeeModal();
                          }}
                        >
                          {emp}
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button
                    className="modal-abastecimiento-button-cerrar"
                    onClick={closeEmployeeModal}
                  >
                    Cerrar
                  </button>
                </>
              )}

              {/* Product Selection Modal */}
              {showProductModal && (
                <>
                  <h2>
                    Seleccionar Producto (Categoría:{" "}
                    {categoriaSeleccionada || "Todas"})
                  </h2>{" "}
                  {/* Indicate current category filter */}
                  <input
                    className="modal-selection-input-abastecimiento"
                    type="text"
                    placeholder="Buscar producto..."
                    value={busquedaProductoModal}
                    onChange={(e) => setBusquedaProductoModal(e.target.value)}
                  />
                  <ul className="modal-selection-list-abastecimiento">
                    {filteredProductosModal.length > 0 ? (
                      filteredProductosModal.map((prod) => (
                        <li key={prod.nombre}>
                          {" "}
                          {/* Use product name as key, assuming names are unique */}
                          <button
                            onClick={() => {
                              setProductoSeleccionado(prod.nombre);
                              closeProductModal();
                            }}
                          >
                            {prod.nombre} ({prod.category})
                          </button>
                        </li>
                      ))
                    ) : (
                      <li>No se encontraron productos en esta categoría.</li>
                    )}
                  </ul>
                  <button
                    className="modal-abastecimiento-button-cerrar"
                    onClick={closeProductModal}
                  >
                    Cerrar
                  </button>
                </>
              )}

              {/* Category Selection Modal */}
              {showCategoryModal && (
                <>
                  <h2>Seleccionar Categoría</h2>
                  <input
                    className="modal-selection-input-abastecimiento"
                    type="text"
                    placeholder="Buscar categoría..."
                    value={busquedaCategoryModal}
                    onChange={(e) => setBusquedaCategoryModal(e.target.value)}
                  />
                  <ul className="modal-selection-list-abastecimiento">
                    {filteredCategoriesModal.map((cat) => (
                      <li key={cat}>
                        <button
                          onClick={() => {
                            setCategoriaSeleccionada(cat);
                            // If editing and changing category, reset product selection
                            if (
                              modalType === "edit" &&
                              currentProducto?.category !== cat
                            ) {
                              setProductoSeleccionado(null);
                            } else if (modalType === "create") {
                              setProductoSeleccionado(null); // Reset product on category change in create
                            }

                            closeCategoryModal();
                          }}
                        >
                          {cat}
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button
                    className="modal-abastecimiento-button-cerrar"
                    onClick={closeCategoryModal}
                  >
                    Cerrar
                  </button>
                </>
              )}
            </div>{" "}
          </div>
        )}
      {/* Modal de confirmación para eliminar un producto */}
      {confirmDelete && modalType === "confirmDelete" && (
        <div className="modal-abastecimiento-overlay">
          <div className="modal-abastecimiento-content modal-abastecimiento-confirm">
            <h3>¿Eliminar producto?</h3>
            <p>
              ¿Estás seguro de que deseas eliminar el producto
              <strong> {confirmDelete.nombre}</strong>?
            </p>
            <div className="form-actions-abastecimiento">
              <button
                className="form-button-guardar-abastecimiento delete-button-abastecimiento" // Use delete button styles
                onClick={deleteProducto}
              >
                Eliminar
              </button>
              <button
                className="form-button-cancelar-abastecimiento"
                onClick={() => setConfirmDelete(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal de confirmación para agotar un producto */}
      {depleteProduct && modalType === "deplete" && (
        <div className="modal-abastecimiento-overlay">
          <div className="modal-abastecimiento-content modal-abastecimiento-confirm">
            <h3>¿Marcar producto como Agotado?</h3>
            <p>
              ¿Estás seguro de que deseas marcar el producto
              <strong> {depleteProduct.nombre}</strong> como agotado?
            </p>
            <div className="form-group-abastecimiento">
              <label
                htmlFor="depletionReason"
                className="form-label-abastecimiento"
              >
                Motivo:
                <span className="required-asterisk">*</span>{" "}
              </label>
              <input
                id="depletionReason"
                className="form-input-abastecimiento"
                type="text"
                value={depletionReasonInput}
                onChange={(e) => setDepletionReasonInput(e.target.value)}
                placeholder="Por ejemplo: Se terminó antes, dañado, etc."
              />
            </div>
            <div className="form-actions-abastecimiento">
              <button
                className="form-button-guardar-abastecimiento deplete-button-abastecimiento" // Use deplete button styles
                onClick={confirmDepletion}
              >
                Confirmar Agotado
              </button>
              <button
                className="form-button-cancelar-abastecimiento"
                onClick={() => setDepleteProduct(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Abastecimiento;
