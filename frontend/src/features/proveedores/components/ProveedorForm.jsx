import React from "react";

const ProveedorForm = ({
  formData,
  onFormChange,
  onBlur,
  isEditing,
  errors = {},
}) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onFormChange(name, type === "checkbox" ? checked : value);
  };

  const handleTipoProveedorChange = (e) => {
    onFormChange("tipo", e.target.value);
  };

  return (
    <>
      {/* Columna 1 */}
      <div className="proveedores-form-group">
        <label htmlFor="tipo">
          Tipo de Proveedor: <span className="required-asterisk">*</span>
        </label>
        <select
          id="tipo"
          name="tipo"
          value={formData.tipo || "Natural"}
          onChange={handleTipoProveedorChange}
          onBlur={(e) => onBlur(e.target.name)} // Asegurar que onBlur se llame con el nombre del campo
          required
        >
          <option value="Natural">Natural</option>
          <option value="Juridico">Jurídico</option>
        </select>
        {errors.tipo && <p className="error-proveedores">{errors.tipo}</p>}
      </div>

      {/* --- Título de la Segunda Columna (se posicionará con grid) --- */}
      <div className="form-section-title-container">
        <h4>Datos de la Persona Encargada</h4>
      </div>

      {/* Columna 1 */}
      {formData.tipo === "Natural" ? (
        <div className="proveedores-form-group">
          <label htmlFor="nombre">
            Nombre Completo: <span className="required-asterisk">*</span>
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre || ""}
            onChange={handleChange}
            onBlur={(e) => onBlur(e.target.name)}
            required
            className={errors.nombre ? "is-invalid" : ""}
          />
          {errors.nombre && (
            <p className="error-proveedores">{errors.nombre}</p>
          )}
        </div>
      ) : (
        <div className="proveedores-form-group">
          <label htmlFor="nombre">
            Razón Social: <span className="required-asterisk">*</span>
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre || ""}
            onChange={handleChange}
            onBlur={(e) => onBlur(e.target.name)}
            required
            className={errors.nombre ? "is-invalid" : ""}
          />
          {errors.nombre && (
            <p className="error-proveedores">{errors.nombre}</p>
          )}
        </div>
      )}

      {/* Columna 2 */}
      <div className="proveedores-form-group">
        <label htmlFor="nombrePersonaEncargada">
          Nombre Encargado: <span className="required-asterisk">*</span>
        </label>
        <input
          type="text"
          id="nombrePersonaEncargada"
          name="nombrePersonaEncargada"
          value={formData.nombrePersonaEncargada || ""}
          onChange={handleChange}
          onBlur={(e) => onBlur(e.target.name)}
          required
          className={errors.nombrePersonaEncargada ? "is-invalid" : ""}
        />
        {errors.nombrePersonaEncargada && (
          <p className="error-proveedores">{errors.nombrePersonaEncargada}</p>
        )}
      </div>

      {/* Columna 1 */}
      {formData.tipo === "Natural" ? (
        <div className="proveedores-form-group">
          <label>
            Documento de Identidad: <span className="required-asterisk">*</span>
          </label>
          <div className="documento-container">
            <select
              name="tipoDocumento"
              value={formData.tipoDocumento || "CC"}
              onChange={handleChange}
              onBlur={(e) => onBlur(e.target.name)} // Asegurar onBlur
              className="select-tipo-documento"
              required
            >
              <option value="CC">CC</option>
              <option value="CE">CE</option>
            </select>
            <input
              type="text"
              name="numeroDocumento"
              value={formData.numeroDocumento || ""}
              onChange={handleChange}
              onBlur={(e) => onBlur(e.target.name)}
              placeholder="Número"
              required
              className={`input-documento ${
                errors.numeroDocumento ? "is-invalid" : ""
              }`}
              pattern="\d{7,10}" // Ejemplo: Documento entre 7 y 10 dígitos
              title="El número de documento debe tener entre 7 y 10 dígitos."
            />
          </div>
          {errors.numeroDocumento && (
            <p className="error-proveedores">{errors.numeroDocumento}</p>
          )}
          {errors.tipoDocumento && (
            <p className="error-proveedores">{errors.tipoDocumento}</p>
          )}
        </div>
      ) : (
        <div className="proveedores-form-group">
          <label htmlFor="nitEmpresa">
            NIT: <span className="required-asterisk">*</span>
          </label>
          <input
            type="text"
            id="nitEmpresa"
            name="nitEmpresa"
            value={formData.nitEmpresa || ""}
            onChange={handleChange}
            onBlur={(e) => onBlur(e.target.name)}
            placeholder="123456789-0"
            required
            className={errors.nitEmpresa ? "is-invalid" : ""}
            pattern="\d{9}-\d{1}" // Formato NIT XXXXXXXXX-Y
            title="El NIT debe tener el formato 123456789-0."
          />
          {errors.nitEmpresa && (
            <p className="error-proveedores">{errors.nitEmpresa}</p>
          )}
        </div>
      )}

      {/* Columna 2 */}
      <div className="proveedores-form-group">
        <label htmlFor="telefonoPersonaEncargada">
          Teléfono Encargado: <span className="required-asterisk">*</span>
        </label>
        <input
          type="tel"
          id="telefonoPersonaEncargada"
          name="telefonoPersonaEncargada"
          value={formData.telefonoPersonaEncargada || ""}
          onChange={handleChange}
          onBlur={(e) => onBlur(e.target.name)}
          required
          className={errors.telefonoPersonaEncargada ? "is-invalid" : ""}
          pattern="\d{7,10}" // Teléfono entre 7 y 10 dígitos
          title="El teléfono debe tener entre 7 y 10 dígitos."
        />
        {errors.telefonoPersonaEncargada && (
          <p className="error-proveedores">{errors.telefonoPersonaEncargada}</p>
        )}
      </div>

      {/* Columna 1 */}
      <div className="proveedores-form-group">
        <label htmlFor="telefono">
          Teléfono Principal: <span className="required-asterisk">*</span>
        </label>
        <input
          type="tel"
          id="telefono"
          name="telefono"
          value={formData.telefono || ""}
          onChange={handleChange}
          onBlur={(e) => onBlur(e.target.name)}
          required
          className={errors.telefono ? "is-invalid" : ""}
          pattern="\d{7,10}" // Teléfono entre 7 y 10 dígitos
          title="El teléfono debe tener entre 7 y 10 dígitos."
        />
        {errors.telefono && (
          <p className="error-proveedores">{errors.telefono}</p>
        )}
      </div>

      {/* Columna 2 */}
      <div className="proveedores-form-group">
        <label htmlFor="emailPersonaEncargada">Email Encargado:</label>
        <input
          type="email"
          id="emailPersonaEncargada"
          name="emailPersonaEncargada"
          value={formData.emailPersonaEncargada || ""}
          onChange={handleChange}
          onBlur={(e) => onBlur(e.target.name)}
          className={errors.emailPersonaEncargada ? "is-invalid" : ""}
          title="Ingrese un correo electrónico válido (ej: usuario@dominio.com)."
        />
        {/* Nota: Email Encargado no es obligatorio, pero si se ingresa, debe ser válido. */}
        {/* La validación de formato email es manejada por el navegador y/o la lógica de validación en el hook/página. */}
        {errors.emailPersonaEncargada && (
          <p className="error-proveedores">{errors.emailPersonaEncargada}</p>
        )}
      </div>

      {/* Columna 1 */}
      <div className="proveedores-form-group">
        <label htmlFor="correo">
          Email Principal: <span className="required-asterisk">*</span>
        </label>
        <input
          type="email"
          id="correo"
          name="correo"
          value={formData.correo || ""}
          onChange={handleChange}
          onBlur={(e) => onBlur(e.target.name)}
          required
          className={errors.correo ? "is-invalid" : ""}
          title="Ingrese un correo electrónico válido (ej: usuario@dominio.com)."
        />
        {errors.correo && <p className="error-proveedores">{errors.correo}</p>}
      </div>

      {/* Columna 2 (Switch de estado) */}
      {isEditing && (
        <div className="proveedores-form-group">
          <label>Estado (Activo):</label>
          <label className="switch">
            <input
              type="checkbox"
              name="estado"
              checked={formData.estado === true}
              onChange={handleChange}
            />
            <span className="slider"></span>
          </label>
          {/* No suele haber un error de "estado" directamente aquí, ya que es un booleano. */}
          {/* La lógica de si es editable o no se maneja con isEditing. */}
        </div>
      )}

      {/* Columna 1 (Dirección ocupa todo el ancho) */}
      <div className="proveedores-form-group form-full-width">
        <label htmlFor="direccion">
          Dirección: <span className="required-asterisk">*</span>
        </label>
        <input
          type="text"
          id="direccion"
          name="direccion"
          value={formData.direccion || ""}
          onChange={handleChange}
          onBlur={(e) => onBlur(e.target.name)}
          required
          className={errors.direccion ? "is-invalid" : ""}
        />
        {errors.direccion && (
          <p className="error-proveedores">{errors.direccion}</p>
        )}
      </div>
    </>
  );
};

export default ProveedorForm;
