import React, { useState, useEffect } from "react";

const CategoriaFormModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
  modoEdicion,
}) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [activo, setActivo] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre || "");
      setDescripcion(initialData.descripcion || "");
      setActivo(initialData.activo ?? true);
    } else {
      setNombre("");
      setDescripcion("");
      setActivo(true);
    }
    setError("");
  }, [initialData, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    onSubmit({ nombre, descripcion, activo });
  };

  if (!open) return null;

  return (
    <div className="modal-Categoria">
      <div className="modal-content-Categoria formulario">
        <h3>{modoEdicion ? "Editar Categoría" : "Agregar Categoría"}</h3>
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
              required
            />
          </div>
          <div className="camposAgregarCategoria">
            <label>Descripción</label>
            <textarea
              className="campoAgregarCategoria"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>
          <div className="camposAgregarCategoria">
            <label>Estado</label>
            <label className="switch">
              <input
                type="checkbox"
                checked={activo}
                onChange={() => setActivo((a) => !a)}
              />
              <span className="slider"></span>
            </label>
          </div>
          {error && <div className="error">{error}</div>}
          <div className="containerBotonesAgregarCategoria">
            <button
              type="submit"
              className="botonGuardarEditarProveedor botonEditarCategoria"
            >
              {modoEdicion ? "Guardar Cambios" : "Agregar"}
            </button>
            <button
              type="button"
              className="botonCancelarEditarProveedor"
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoriaFormModal;