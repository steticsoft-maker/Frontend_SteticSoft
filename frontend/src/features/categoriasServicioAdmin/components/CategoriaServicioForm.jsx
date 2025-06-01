// src/features/categoriasServicioAdmin/components/CategoriaServicioForm.jsx
import React from "react";

const CategoriaServicioForm = ({
  formData,
  onFormChange,
  isEditing,
  formErrors,
}) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // El modal padre (CategoriaServicioFormModal) espera "Activo" o "Inactivo" para el campo 'estado'
    // cuando se maneja a través de onFormChange.
    onFormChange(
      name,
      type === "checkbox" ? (checked ? "Activo" : "Inactivo") : value
    );
  };

  return (
    <>
      <div className="camposAgregarCategoria">
        <label
          className="asteriscoCampoObligatorioCategoria"
          htmlFor="nombre-catServicio-form"
        >
          Nombre <span className="requiredCategoria">*</span>
        </label>
        <input
          id="nombre-catServicio-form" // ID único para el label
          className="campoAgregarCategoria"
          type="text"
          name="nombre" // Debe coincidir con la clave en formData
          value={formData.nombre || ""}
          onChange={handleChange}
          placeholder="Nombre de la categoría"
          required
        />
        {formErrors?.nombre && (
          <span className="error">{formErrors.nombre}</span>
        )}
      </div>

      <div className="camposAgregarCategoria">
        <label htmlFor="descripcion-catServicio-form">Descripción</label>
        <textarea
          id="descripcion-catServicio-form" // ID único
          className="campoAgregarCategoria"
          name="descripcion" // Debe coincidir con la clave en formData
          value={formData.descripcion || ""}
          onChange={handleChange}
          placeholder="Descripción (opcional)"
          rows="3"
        />
        {formErrors?.descripcion && (
          <span className="error">{formErrors.descripcion}</span>
        )}
      </div>

      {isEditing && ( // El switch solo se muestra en modo edición
        <div className="camposAgregarCategoria">
          <label>Estado:</label>{" "}
          {/* No necesita htmlFor si el input está en su propio label.switch */}
          <label className="switch">
            <input
              type="checkbox"
              name="estado" // El 'name' debe coincidir con la clave en formData
              checked={formData.estado === "Activo"} // Compara con "Activo"
              onChange={handleChange} // Usa el handleChange general
            />
            <span className="slider round"></span>
          </label>
        </div>
      )}
    </>
  );
};

export default CategoriaServicioForm;
