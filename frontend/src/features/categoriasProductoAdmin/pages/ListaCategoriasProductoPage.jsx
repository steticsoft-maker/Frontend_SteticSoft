// src/features/categoriasProductoAdmin/pages/ListaCategoriasProductoPage.jsx
import React, { useState, useEffect } from "react";
import NavbarAdmin from "../../../shared/components/layout/NavbarAdmin";
import CategoriasProductoTable from "../components/CategoriasProductoTable";
import CategoriaProductoCrearModal from "../components/CategoriaProductoCrearModal";
import CategoriaProductoEditarModal from "../components/CategoriaProductoEditarModal";
import CategoriaProductoDetalleModal from "../components/CategoriaProductoDetalleModal";
import ConfirmModal from "../../../shared/components/common/ConfirmModal";
import ValidationModal from "../../../shared/components/common/ValidationModal";
import {
  fetchCategoriasProducto,
  saveCategoriaProducto,
  deleteCategoriaProductoById,
  toggleCategoriaProductoEstado,
} from "../services/categoriasProductoService";
import "../css/CategoriasProducto.css";

function ListaCategoriasProductoPage() {
  // Inicializamos categorias como un array vacío para evitar errores de .filter
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true); // Nuevo estado de carga
  const [error, setError] = useState(null); // Nuevo estado para errores de API

  // Estados para modales
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);

  const [currentCategoria, setCurrentCategoria] = useState(null);
  const [validationMessage, setValidationMessage] = useState("");

  // CAMBIO CLAVE: Cargar datos de la API de forma asíncrona
  useEffect(() => {
    const loadCategorias = async () => {
      try {
        setLoading(true); // Inicia carga
        const data = await fetchCategoriasProducto(); // Llama a la API
        setCategorias(data);
      } catch (err) {
        console.error("Error al cargar las categorías:", err);
        setError("No se pudieron cargar las categorías. Inténtalo de nuevo."); // Mensaje amigable
        setValidationMessage("No se pudieron cargar las categorías. Por favor, intente recargar la página.");
        setIsValidationModalOpen(true);
      } finally {
        setLoading(false); // Finaliza carga
      }
    };

    loadCategorias();
  }, []); // El array vacío asegura que se ejecuta solo una vez al montar

  const handleOpenModal = (type, categoria = null) => {
    setCurrentCategoria(categoria);
    if (type === "details") {
      setIsDetailsModalOpen(true);
    } else if (type === "delete") {
      setIsConfirmDeleteOpen(true);
    } else if (type === "create") {
      setIsCrearModalOpen(true);
    } else if (type === "edit") {
      if (categoria) {
        setIsEditarModalOpen(true);
      } else {
        console.error(
          "Intento de abrir modal de edición sin datos de categoría de producto."
        );
      }
    }
  };

  const handleCrearModalClose = () => {
    setIsCrearModalOpen(false);
    // Vuelve a cargar las categorías para reflejar los cambios
    // Podríamos optimizar esto para solo añadir la nueva categoría a la lista,
    // pero una recarga completa es más segura para garantizar la consistencia.
    // También, podríamos pasar la nueva categoría desde el servicio y añadirla.
    loadCategorias(); 
  };

  const handleEditarModalClose = () => {
    setIsEditarModalOpen(false);
    setCurrentCategoria(null);
    // Vuelve a cargar las categorías para reflejar los cambios
    loadCategorias(); 
  };

  const closeOtherModals = () => {
    setIsDetailsModalOpen(false);
    setIsConfirmDeleteOpen(false);
    setIsValidationModalOpen(false);
    setValidationMessage("");
    // Solo resetea currentCategoria si ningún modal de edición/creación está abierto
    if (!isCrearModalOpen && !isEditarModalOpen) {
      setCurrentCategoria(null);
    }
    // Después de cerrar el modal de confirmación/validación, volvemos a cargar las categorías para asegurar la consistencia.
    loadCategorias();
  };

  const loadCategorias = async () => { // Función para recargar categorías
    try {
      setLoading(true);
      const data = await fetchCategoriasProducto();
      setCategorias(data);
    } catch (err) {
      console.error("Error al recargar las categorías:", err);
      setError("No se pudieron recargar las categorías.");
      setValidationMessage("Hubo un problema al recargar las categorías.");
      setIsValidationModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // CAMBIO: La función handleSave ahora es asíncrona
  const handleSave = async (categoriaData) => {
    try {
      // CAMBIO: Usar idCategoriaProducto para determinar si es edición
      const isEditing = !!categoriaData.idCategoriaProducto; 
      await saveCategoriaProducto(categoriaData); // Llama al servicio API
      
      // Si la operación fue exitosa, cerramos el modal y recargamos las categorías.
      if (isEditing) {
        handleEditarModalClose();
      } else {
        handleCrearModalClose();
      }
      setValidationMessage(`Categoría ${isEditing ? "actualizada" : "creada"} exitosamente.`);
      setIsValidationModalOpen(true);

    } catch (error) {
      console.error("Error al guardar categoría:", error);
      // Muestra el mensaje de error del backend si existe, o un mensaje genérico.
      const errorMessage = error.response?.data?.message || "Error al guardar la categoría. Por favor, revise los datos.";
      setValidationMessage(errorMessage);
      setIsValidationModalOpen(true);
    }
  };

  // CAMBIO: La función handleDelete ahora es asíncrona
  const handleDelete = async () => {
    if (currentCategoria && currentCategoria.idCategoriaProducto) { // CAMBIO: Usar idCategoriaProducto
      try {
        await deleteCategoriaProductoById(currentCategoria.idCategoriaProducto); // Llama al servicio API
        closeOtherModals();
        setValidationMessage("Categoría eliminada exitosamente.");
        setIsValidationModalOpen(true);
      } catch (error) {
        console.error("Error al eliminar categoría:", error);
        const errorMessage = error.response?.data?.message || "Error al eliminar la categoría.";
        setValidationMessage(errorMessage);
        setIsValidationModalOpen(true);
      }
    }
  };

  // CAMBIO: La función handleToggleEstado ahora es asíncrona
  const handleToggleEstado = async (idCategoriaProducto) => { // CAMBIO: Recibe idCategoriaProducto
    try {
      // Obtenemos la categoría actual para saber su estado anterior
      const categoriaToToggle = categorias.find(cat => cat.idCategoriaProducto === idCategoriaProducto);
      if (!categoriaToToggle) {
        throw new Error("Categoría no encontrada para cambiar estado.");
      }
      // Llamamos al servicio para cambiar el estado.
      // El servicio maneja si es anular o habilitar, pasándole el ID y el nuevo estado.
      await toggleCategoriaProductoEstado(idCategoriaProducto, !categoriaToToggle.estado);
      
      // Si todo va bien, recargamos la lista para ver el cambio reflejado.
      setValidationMessage("Estado de la categoría actualizado exitosamente.");
      setIsValidationModalOpen(true);
      loadCategorias();

    } catch (error) {
      console.error("Error al cambiar estado de categoría:", error);
      const errorMessage = error.response?.data?.message || "Error al cambiar el estado de la categoría.";
      setValidationMessage(errorMessage);
      setIsValidationModalOpen(true);
    }
  };

  // Filtrado de categorías (asumiendo que los datos ya están en el estado 'categorias')
  const filteredCategorias = categorias.filter(
    (cat) =>
      (cat.nombre && cat.nombre.toLowerCase().includes(busqueda.toLowerCase())) ||
      (cat.descripcion && cat.descripcion.toLowerCase().includes(busqueda.toLowerCase())) ||
      (cat.tipoUso && cat.tipoUso.toLowerCase().includes(busqueda.toLowerCase()))
  );

  // Renderizado condicional para carga y errores
  if (loading) {
    return (
      <div className="categorias-producto-admin-page-container">
        <NavbarAdmin />
        <div className="categorias-producto-admin-main-content">
          <div className="categorias-producto-admin-content-wrapper">
            <h1>Gestión Categorías de Productos</h1>
            <p>Cargando categorías...</p>
          </div>
        </div>
      </div>
    );
  }

  // Comentario: El manejo de 'error' podría redirigir o mostrar un mensaje permanente
  // si el error es grave y no se soluciona recargando.
  // Por ahora, el ValidationModal ya muestra el mensaje.

  return (
    <div className="categorias-producto-admin-page-container">
      <NavbarAdmin />
      <div className="categorias-producto-admin-main-content">
        <div className="categorias-producto-admin-content-wrapper">
          <h1>Gestión Categorías de Productos</h1>
          <div className="categorias-producto-admin-actions-bar">
            <div className="categorias-producto-admin-search-bar">
              <input
                type="text"
                placeholder="Buscar categoría..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <button
              className="categorias-producto-admin-add-button"
              onClick={() => handleOpenModal("create")}
            >
              Agregar Categoría
            </button>
          </div>
          <CategoriasProductoTable
            categorias={filteredCategorias}
            onView={(cat) => handleOpenModal("details", cat)}
            onEdit={(cat) => handleOpenModal("edit", cat)}
            onDeleteConfirm={(cat) => handleOpenModal("delete", cat)}
            onToggleEstado={handleToggleEstado}
          />
        </div>
      </div>

      <CategoriaProductoCrearModal
        isOpen={isCrearModalOpen}
        onClose={handleCrearModalClose}
        onSubmit={handleSave}
      />
      <CategoriaProductoEditarModal
        isOpen={isEditarModalOpen}
        onClose={handleEditarModalClose}
        onSubmit={handleSave}
        initialData={currentCategoria}
      />
      <CategoriaProductoDetalleModal
        isOpen={isDetailsModalOpen}
        onClose={closeOtherModals}
        categoria={currentCategoria}
      />
      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={closeOtherModals}
        onConfirm={handleDelete}
        title="Confirmar Eliminación"
        message={`¿Está seguro de que desea eliminar la categoría "${
          currentCategoria?.nombre || ""
        }"?`}
      />
      <ValidationModal
        isOpen={isValidationModalOpen}
        onClose={closeOtherModals}
        title="Aviso de Categorías de Producto"
        message={validationMessage}
      />
    </div>
  );
}
export default ListaCategoriasProductoPage;