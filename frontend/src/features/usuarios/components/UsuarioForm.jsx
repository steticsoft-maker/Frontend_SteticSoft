// src/features/usuarios/components/UsuarioForm.jsx
import React from "react";

const RequiredAsterisk = () => (
  <span style={{ color: "red", marginLeft: "2px" }}>*</span>
);

const UsuarioForm = ({
  formData,
  onInputChange,
  onInputBlur,
  availableRoles,
  isEditing,
  isUserAdmin,
  formErrors = {},
  isVerifyingEmail,
  touchedFields = {},
}) => {

  const touched = touchedFields;

  const selectedRole = availableRoles.find(
    (rol) => rol.idRol === parseInt(formData.idRol)
  );
  const requiresProfileFields =
    selectedRole &&
    (selectedRole.tipoPerfil === "CLIENTE" || selectedRole.tipoPerfil === "EMPLEADO");

  return (
    <div className="usuarios-form-grid-container">
      {/* --- Campos de la Cuenta (Siempre visibles) --- */}
      <div className="usuarios-form-grid-item">
        <label htmlFor="correo" className="usuarios-form-label">
          Correo Electrónico <RequiredAsterisk />
        </label>
        <input
          type="email"
          id="correo"
          name="correo"
          placeholder="ejemplo@correo.com"
          value={formData.correo || ""}
          onChange={onInputChange}
          onBlur={onInputBlur}
          required
          className={`usuarios-form-input ${
            formErrors.correo ? "input-error" : ""
          }`}
          disabled={(isUserAdmin && isEditing) || isVerifyingEmail}
        />
        {isVerifyingEmail && (
          <span className="verifying-email-message">Verificando correo...</span>
        )}
        {touched.correo && formErrors.correo && (
          <span className="error-message">{formErrors.correo}</span>
        )}
      </div>

      <div className="usuarios-form-grid-item">
        <label htmlFor="idRol" className="usuarios-form-label">
          Rol <RequiredAsterisk />
        </label>
        <select
          id="idRol"
          name="idRol"
          value={formData.idRol || ""}
          onChange={onInputChange}
          onBlur={onInputBlur}
          required
          className={`usuarios-form-select ${
            touched.idRol && formErrors.idRol ? "input-error" : ""
          }`}
          disabled={isUserAdmin && isEditing}
        >
          <option value="" disabled>
            Seleccionar rol
          </option>
          {availableRoles.map((rol) => (
            <option key={rol.idRol} value={rol.idRol}>
              {rol.nombre}
            </option>
          ))}
        </select>
        {touched.idRol && formErrors.idRol && (
          <span className="error-message">{formErrors.idRol}</span>
        )}
      </div>

      {!isEditing && (
        <>
          <div className="usuarios-form-grid-item">
            <label htmlFor="contrasena" className="usuarios-form-label">
              Contraseña <RequiredAsterisk />
            </label>
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              placeholder="Mínimo 8 caracteres"
              value={formData.contrasena || ""}
              onChange={onInputChange}
              onBlur={onInputBlur}
              required
              className={`usuarios-form-input ${
                touched.contrasena && formErrors.contrasena ? "input-error" : ""
              }`}
            />
            {touched.contrasena && formErrors.contrasena && (
              <span className="error-message">{formErrors.contrasena}</span>
            )}
          </div>

          <div className="usuarios-form-grid-item">
            <label
              htmlFor="confirmarContrasena"
              className="usuarios-form-label"
            >
              Confirmar Contraseña <RequiredAsterisk />
            </label>
            <input
              type="password"
              id="confirmarContrasena"
              name="confirmarContrasena"
              placeholder="Repetir contraseña"
              value={formData.confirmarContrasena || ""}
              onChange={onInputChange}
              onBlur={onInputBlur}
              required
              className={`usuarios-form-input ${
                touched.confirmarContrasena && formErrors.confirmarContrasena
                  ? "input-error"
                  : ""
              }`}
            />
            {touched.confirmarContrasena && formErrors.confirmarContrasena && (
              <span className="error-message">
                {formErrors.confirmarContrasena}
              </span>
            )}
          </div>
        </>
      )}

      {/* --- Campos de Perfil (Visibles condicionalmente) --- */}
      {requiresProfileFields && (
        <>
          <div className="usuarios-form-grid-item-full-width">
            <hr />
            <h3
              style={{
                textAlign: "center",
                color: "#6d0b58",
                margin: "10px 0",
              }}
            >
              Datos del Perfil de {selectedRole.nombre}
            </h3>
          </div>

          <div className="usuarios-form-grid-item">
            <label htmlFor="nombre" className="usuarios-form-label">
              Nombres <RequiredAsterisk />
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              placeholder="Nombres del usuario"
              value={formData.nombre || ""}
              onChange={onInputChange}
              onBlur={onInputBlur}
              required
              className={`usuarios-form-input ${
                touched.nombre && formErrors.nombre ? "input-error" : ""
              }`}
              disabled={isUserAdmin && isEditing}
            />
            {touched.nombre && formErrors.nombre && (
              <span className="error-message">{formErrors.nombre}</span>
            )}
          </div>

          <div className="usuarios-form-grid-item">
            <label htmlFor="apellido" className="usuarios-form-label">
              Apellidos <RequiredAsterisk />
            </label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              placeholder="Apellidos del usuario"
              value={formData.apellido || ""}
              onChange={onInputChange}
              onBlur={onInputBlur}
              required
              className={`usuarios-form-input ${
                touched.apellido && formErrors.apellido ? "input-error" : ""
              }`}
              disabled={isUserAdmin && isEditing}
            />
            {touched.apellido && formErrors.apellido && (
              <span className="error-message">{formErrors.apellido}</span>
            )}
          </div>

          <div className="usuarios-form-grid-item">
            <label htmlFor="tipoDocumento" className="usuarios-form-label">
              Tipo de Documento <RequiredAsterisk />
            </label>
            <select
              id="tipoDocumento"
              name="tipoDocumento"
              value={formData.tipoDocumento || ""}
              onChange={onInputChange}
              onBlur={onInputBlur}
              required
              className={`usuarios-form-select ${
                touched.tipoDocumento && formErrors.tipoDocumento
                  ? "input-error"
                  : ""
              }`}
              disabled={isUserAdmin && isEditing}
            >
              <option value="Cédula de Ciudadanía">Cédula de Ciudadanía</option>
              <option value="Cédula de Extranjería">
                Cédula de Extranjería
              </option>
              <option value="Tarjeta de Identidad">Tarjeta de Identidad</option>
              <option value="Pasaporte">Pasaporte</option>
            </select>
            {touched.tipoDocumento && formErrors.tipoDocumento && (
              <span className="error-message">{formErrors.tipoDocumento}</span>
            )}
          </div>

          <div className="usuarios-form-grid-item">
            <label htmlFor="numeroDocumento" className="usuarios-form-label">
              Número de Documento <RequiredAsterisk />
            </label>
            <input
              type="text"
              id="numeroDocumento"
              name="numeroDocumento"
              placeholder="Número de documento"
              value={formData.numeroDocumento || ""}
              onChange={onInputChange}
              onBlur={onInputBlur}
              required
              className={`usuarios-form-input ${
                touched.numeroDocumento && formErrors.numeroDocumento
                  ? "input-error"
                  : ""
              }`}
              disabled={isUserAdmin && isEditing}
            />
            {touched.numeroDocumento && formErrors.numeroDocumento && (
              <span className="error-message">{formErrors.numeroDocumento}</span>
            )}
          </div>

          <div className="usuarios-form-grid-item">
            <label htmlFor="telefono" className="usuarios-form-label">
              Teléfono <RequiredAsterisk />
            </label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              placeholder="Número de teléfono"
              value={formData.telefono || ""}
              onChange={onInputChange}
              onBlur={onInputBlur}
              required
              className={`usuarios-form-input ${
                touched.telefono && formErrors.telefono ? "input-error" : ""
              }`}
              disabled={isUserAdmin && isEditing}
            />
            {touched.telefono && formErrors.telefono && (
              <span className="error-message">{formErrors.telefono}</span>
            )}
          </div>

          <div className="usuarios-form-grid-item">
            <label htmlFor="fechaNacimiento" className="usuarios-form-label">
              Fecha de Nacimiento <RequiredAsterisk />
            </label>
            <input
              type="date"
              id="fechaNacimiento"
              name="fechaNacimiento"
              value={formData.fechaNacimiento || ""}
              onChange={onInputChange}
              onBlur={onInputBlur}
              required
              className={`usuarios-form-input ${
                touched.fechaNacimiento && formErrors.fechaNacimiento
                  ? "input-error"
                  : ""
              }`}
              disabled={isUserAdmin && isEditing}
            />
            {touched.fechaNacimiento && formErrors.fechaNacimiento && (
              <span className="error-message">{formErrors.fechaNacimiento}</span>
            )}
          </div>
        </>
      )}

      {/* --- Switch de Estado (Solo para edición) --- */}
      {isEditing && !isUserAdmin && (
        <div className="usuarios-form-grid-item usuarios-form-group-estado">
          <label htmlFor="estado" className="usuarios-form-label">
            Estado (Activo):
          </label>
          <label className="switch">
            <input
              type="checkbox"
              id="estado"
              name="estado"
              checked={formData.estado || false}
              onChange={onInputChange}
            />
            <span className="slider"></span>
          </label>
        </div>
      )}
    </div>
  );
};

export default UsuarioForm;
