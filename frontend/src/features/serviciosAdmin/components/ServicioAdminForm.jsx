// src/features/serviciosAdmin/components/ServicioAdminForm.jsx
import React from "react";

// MAX_FILE_SIZE_MB podría definirse aquí o importarse de constantes si se usa en más lugares
// const MAX_FILE_SIZE_MB = 2;

const ServicioAdminForm = ({
  formData,
  onFormChange,
  onFileChange, // Prop para manejar el cambio de archivo de imagen
  categoriasDisponibles,
  isEditing,
  formErrors,
}) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Para el switch de estado, el valor es booleano (checked)
    // y lo convertimos a "Activo" / "Inactivo" en el modal padre o aquí si es necesario.
    // El modal padre ya lo maneja así: onFormChange('estado', e.target.checked ? "Activo" : "Inactivo")
    onFormChange(
      name,
      type === "checkbox" ? (checked ? "Activo" : "Inactivo") : value
    );
  };

  // El onFileChange se pasa directamente al input de tipo file

  return (
    <>
      {/* Utilizamos las clases de ServiciosAdmin.css */}
      <div className="CamposAgregarServicio">
        <label className="asteriscoCamposServicio" htmlFor="nombre-servicio">
          Nombre <span className="requiredServicio">*</span>
        </label>
        <input
          id="nombre-servicio"
          className="input" // Clase de ServiciosAdmin.css
          type="text"
          name="nombre"
          value={formData.nombre || ""}
          onChange={handleChange}
          placeholder="Nombre del servicio"
          required
        />
        {formErrors?.nombre && (
          <span className="error">{formErrors.nombre}</span>
        )}
      </div>

      <div className="CamposAgregarServicio">
        <label className="asteriscoCamposServicio" htmlFor="precio-servicio">
          Precio <span className="requiredServicio">*</span>
        </label>
        <input
          id="precio-servicio"
          className="input" // Clase de ServiciosAdmin.css
          type="number"
          name="precio"
          value={formData.precio || ""}
          onChange={handleChange}
          placeholder="Precio del servicio"
          min="0"
          step="0.01" // O el que prefieras para decimales
          required
        />
        {formErrors?.precio && (
          <span className="error">{formErrors.precio}</span>
        )}
      </div>

      <div className="CamposAgregarServicio">
        <label htmlFor="categoria-servicio">Categoría</label>{" "}
        {/* La categoría puede ser opcional */}
        <select
          id="categoria-servicio"
          className="input" // Clase de ServiciosAdmin.css
          name="categoria"
          value={formData.categoria || ""}
          onChange={handleChange}
        >
          <option value="">Seleccione una categoría</option>
          {(categoriasDisponibles || []).map((catNombre, index) => (
            <option key={index} value={catNombre}>
              {catNombre}
            </option>
          ))}
        </select>
        {/* Si la categoría fuera obligatoria:
        {formErrors?.categoria && <span className="error">{formErrors.categoria}</span>}
        */}
      </div>

      <div className="CamposAgregarServicio">
        <label htmlFor="descripcion-servicio">Descripción</label>
        <textarea
          id="descripcion-servicio"
          className="input" // Asume que .input aplica bien a textarea o define .textarea en CSS
          name="descripcion"
          value={formData.descripcion || ""}
          onChange={handleChange}
          placeholder="Descripción del servicio (opcional)"
          rows="3"
        />
        {/* No suele haber errores de validación para descripción opcional */}
      </div>

      <div className="CamposAgregarServicio">
        <label htmlFor="imagen-servicio">Imagen</label>
        <input
          id="imagen-servicio"
          className="input" // Clase de ServiciosAdmin.css
          type="file"
          name="imagenFile" // El nombre es para el input, el manejo se hace con onFileChange
          accept="image/*" // Aceptar solo imágenes
          onChange={onFileChange} // Esta prop viene del modal padre
        />
        {formErrors?.imagen && (
          <span className="error">{formErrors.imagen}</span>
        )}
        {formData.imagenURL && ( // Muestra la imagen actual (URL existente o previsualización base64)
          <img
            src={formData.imagenURL}
            alt="Vista previa"
            style={{
              maxWidth: "120px",
              maxHeight: "120px",
              marginTop: "10px",
              objectFit: "cover",
              borderRadius: "4px",
            }}
          />
        )}
      </div>

      {isEditing && ( // Mostrar el switch de estado solo en modo edición
        <div className="CamposAgregarServicio">
          <label>Estado:</label>{" "}
          {/* No necesita htmlFor si el input está dentro de su propio <label> */}
          <label className="switch">
            <input
              type="checkbox"
              name="estado" // El nombre es 'estado'
              checked={formData.estado === "Activo"}
              onChange={handleChange} // Usa el handleChange general que llama a onFormChange
            />
            <span className="slider round"></span>
          </label>
          {/* No suele haber errores de validación para un switch */}
        </div>
      )}
    </>
  );
};

export default ServicioAdminForm;
