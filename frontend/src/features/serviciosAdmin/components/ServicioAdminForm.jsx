// src/features/serviciosAdmin/components/ServicioAdminForm.jsx
import React from "react";

const ServicioAdminForm = ({
  formData,
  onFormChange,
  onFileChange, // Prop para manejar el cambio de archivo de imagen
  onRemoveImage, // Nueva prop para quitar la imagen
  categoriasDisponibles, // Ahora serán objetos {id, nombre}
  especialidadesDisponibles, // Nueva prop, también objetos {id, nombre}
  isEditing,
  formErrors,
  currentImageUrl, // Nueva prop para mostrar la imagen actual en edición
}) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Para el estado, el backend espera un booleano, no "Activo" / "Inactivo"
    // onFormChange enviará el valor directamente al estado del formData del padre.
    if (type === "checkbox") {
      onFormChange(name, checked); // Enviar directamente true/false
    } else if (name === "idCategoriaServicio" || name === "idEspecialidad") {
      // Convertir a número si es un ID, o null si es vacío
      onFormChange(name, value === "" ? null : Number(value));
    } else if (name === "precio" || name === "duracionEstimada") {
      // Convertir a número o null/vacío para los campos numéricos
      onFormChange(name, value === "" ? "" : value); // Mantener como string si es vacío para el input
    }
    else {
      onFormChange(name, value);
    }
  };

  return (
    <>
      {/* Nombre */}
      <div className="CamposAgregarServicio">
        <label className="asteriscoCamposServicio" htmlFor="nombre-servicio">
          Nombre <span className="requiredServicio">*</span>
        </label>
        <input
          id="nombre-servicio"
          className="input"
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

      {/* Precio */}
      <div className="CamposAgregarServicio">
        <label className="asteriscoCamposServicio" htmlFor="precio-servicio">
          Precio <span className="requiredServicio">*</span>
        </label>
        <input
          id="precio-servicio"
          className="input"
          type="number"
          name="precio"
          value={formData.precio === null ? "" : formData.precio}
          onChange={handleChange}
          placeholder="Precio del servicio"
          min="0"
          step="0.01"
          required
        />
        {formErrors?.precio && (
          <span className="error">{formErrors.precio}</span>
        )}
      </div>

      {/* Duración Estimada */}
      <div className="CamposAgregarServicio">
        <label className="asteriscoCamposServicio" htmlFor="duracion-estimada">
          Duración Estimada (minutos) (Opcional)
        </label>
        <input
          id="duracion-estimada"
          className="input"
          type="number"
          name="duracionEstimada" // Coincide con la prop del backend
          value={formData.duracionEstimada === null ? "" : formData.duracionEstimada} 
          onChange={handleChange}
          placeholder="Ej: 60"
          min="0"
        />
        {formErrors?.duracionEstimada && (
          <span className="error">{formErrors.duracionEstimada}</span>
        )}
      </div>

      {/* Categoría de Servicio */}
      <div className="CamposAgregarServicio">
        <label className="asteriscoCamposServicio" htmlFor="id-categoria-servicio">
          Categoría <span className="requiredServicio">*</span>
        </label>
        <select
          id="id-categoria-servicio"
          className="input"
          name="idCategoriaServicio" // Coincide con la prop del backend
          value={formData.idCategoriaServicio === null ? "" : formData.idCategoriaServicio}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione una categoría</option>
          {(categoriasDisponibles || []).map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>
        {formErrors?.idCategoriaServicio && (
          <span className="error">{formErrors.idCategoriaServicio}</span>
        )}
      </div>

      {/* Especialidad */}
      <div className="CamposAgregarServicio">
        <label className="asteriscoCamposServicio" htmlFor="id-especialidad">
          Especialidad (Opcional)
        </label>
        <select
          id="id-especialidad"
          className="input"
          name="idEspecialidad" // Coincide con la prop del backend
          value={formData.idEspecialidad === null ? "" : formData.idEspecialidad}
          onChange={handleChange}
        >
          <option value="">Ninguna</option>
          {(especialidadesDisponibles || []).map((esp) => (
            <option key={esp.id} value={esp.id}>
              {esp.nombre}
            </option>
          ))}
        </select>
        {formErrors?.idEspecialidad && (
          <span className="error">{formErrors.idEspecialidad}</span>
        )}
      </div>

      {/* Descripción */}
      <div className="CamposAgregarServicio full-width">
        <label className="asteriscoCamposServicio" htmlFor="descripcion-servicio">
          Descripción (Opcional)
        </label>
        <textarea
          id="descripcion-servicio"
          className="input"
          name="descripcion"
          value={formData.descripcion || ""}
          onChange={handleChange}
          placeholder="Descripción del servicio (opcional)"
          rows="3"
        />
        {formErrors?.descripcion && (
          <span className="error">{formErrors.descripcion}</span>
        )}
      </div>

      {/* Campo de Imagen */}
      <div className="CamposAgregarServicio full-width">
        <label className="asteriscoCamposServicio" htmlFor="imagen-servicio">
          Imagen (Opcional)
        </label>
        <input
          id="imagen-servicio"
          className="input"
          type="file"
          name="imagen" // Nombre que espera el backend en FormData
          accept="image/*"
          onChange={onFileChange} // Esta prop viene del modal padre (ServicioAdminFormModal)
        />
        {formErrors?.imagen && (
          <span className="error">{formErrors.imagen}</span>
        )}
        {(currentImageUrl && !formData.imagenFile) && (
          <div className="current-image-preview">
            <p>Imagen actual:</p>
            <img
              src={currentImageUrl}
              alt="Servicio actual"
              style={{
                maxWidth: "120px",
                maxHeight: "120px",
                marginTop: "10px",
                objectFit: "cover",
                borderRadius: "4px",
              }}
            />
            <button type="button" onClick={onRemoveImage} className="remove-image-button">Quitar Imagen</button>
          </div>
        )}
        {formData.imagenFile && ( // Muestra el nombre del nuevo archivo seleccionado
          <p className="selected-file-name">Archivo seleccionado: {formData.imagenFile.name} <button type="button" onClick={onRemoveImage}>X</button></p>
        )}
      </div>

      {isEditing && (
        <div className="CamposAgregarServicio">
          <label>Estado:</label>{" "}
          <label className="switch">
            <input
              type="checkbox"
              name="estado"
              checked={formData.estado === true} // 'true' si el estado es Activo
              onChange={handleChange}
            />
            <span className="slider round"></span>
          </label>
        </div>
      )}
    </>
  );
};

export default ServicioAdminForm;