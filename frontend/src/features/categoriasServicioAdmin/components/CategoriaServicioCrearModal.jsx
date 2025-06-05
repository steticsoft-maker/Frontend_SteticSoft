import React, { useState } from "react";

const CategoriaServicioCrearModal = ({ isOpen, onClose, onSubmit }) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [activo, setActivo] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    
    // Llamar a onSubmit con los datos
    onSubmit({ nombre, descripcion, activo });
    
    // Limpiar el formulario después de enviar
    setNombre("");
    setDescripcion("");
    setActivo(true);
    setError("");
    
    // Cerrar el modal
    onClose();
  };

  const handleClose = () => {
    // Limpiar el formulario al cerrar
    setNombre("");
    setDescripcion("");
    setActivo(true);
    setError("");
    onClose();
  };

  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;

  return (
    <div className="modal-Categoria">
      <div className="modal-content-Categoria formulario">
        <h3>Agregar Categoría</h3>
        <form className="modal-Categoria-form-grid" onSubmit={handleSubmit}>
          <div className="camposAgregarCategoria">
            <label>
              Nombre <span className="requiredCategoria">*</span>
            </label>
            <input
              className="campoAgregarCategoria"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ingrese el nombre de la categoría"
              required
            />
          </div>
          <div className="camposAgregarCategoria">
            <label>Descripción</label>
            <textarea
              className="campoAgregarCategoria"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ingrese una descripción (opcional)"
              rows="3"
            />
          </div>
          {error && <div className="error">{error}</div>}
          <div className="containerBotonesAgregarCategoria">
            <button
              type="submit"
              className="botonGuardarEditarProveedor botonEditarCategoria"
            >
              Agregar
            </button>
            <button
              type="button"
              className="botonCancelarEditarProveedor"
              onClick={handleClose}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoriaServicioCrearModal;