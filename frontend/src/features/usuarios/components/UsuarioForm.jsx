// src/features/usuarios/components/UsuarioForm.jsx
import React from "react";
import PasswordInput from "../../../shared/components/PasswordInput/PasswordInput"; // Importar el componente reutilizable

const RequiredAsterisk = () => <span className="required-asterisk">*</span>;

const UsuarioForm = ({
  formData,
  formErrors,
  onInputChange,
  onInputBlur,
  availableRoles,
  isEditing,
  isVerifyingEmail,
  requiresProfile,
  isCliente,
  isUserAdmin,
}) => {
  const errors = formErrors || {};

  return (
    <>
      <div className="admin-form-section">
        <h3 className="admin-form-section-title">Datos de la Cuenta</h3>
        <div className="admin-form-row-2">
          <div className="admin-form-group">
            <label htmlFor="correo" className="admin-form-label">
              Correo Electrónico <RequiredAsterisk />
            </label>
            <input
              type="email"
              id="correo"
              name="correo"
              autoComplete="email"
              value={formData.correo || ""}
              onChange={onInputChange}
              onBlur={onInputBlur}
              required
              className={`admin-form-input ${errors.correo ? "error" : ""}`}
              disabled={isUserAdmin || isVerifyingEmail}
            />
            {isVerifyingEmail && (
              <span className="verifying-email-message">Verificando...</span>
            )}
            {errors.correo && (
              <span className="admin-form-error">{errors.correo}</span>
            )}
          </div>

          <div className="admin-form-group">
            <label htmlFor="idRol" className="admin-form-label">
              Rol <RequiredAsterisk />
            </label>
            <select
              id="idRol"
              name="idRol"
              value={formData.idRol || ""}
              onChange={onInputChange}
              onBlur={onInputBlur}
              required
              className={`admin-form-select ${errors.idRol ? "error" : ""}`}
              disabled={isUserAdmin}
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
            {errors.idRol && (
              <span className="admin-form-error">{errors.idRol}</span>
            )}
          </div>
        </div>
      </div>

      {!isEditing && (
        <div className="admin-form-section">
          <h3 className="admin-form-section-title">Contraseñas</h3>
          <div className="admin-form-row-2">
            <div className="admin-form-group">
              <label htmlFor="contrasena" className="admin-form-label">
                Contraseña <RequiredAsterisk />
              </label>
              <PasswordInput
                name="contrasena"
                value={formData.contrasena || ""}
                onChange={onInputChange}
                onBlur={onInputBlur}
                placeholder="Contraseña"
                required
                className={`admin-form-input ${
                  errors.contrasena ? "error" : ""
                }`}
                helpText="Mín 8 caract, 1 Mayús, 1 minús, 1 núm, 1 símb"
              />
              {errors.contrasena && (
                <span className="admin-form-error">{errors.contrasena}</span>
              )}
            </div>

            <div className="admin-form-group">
              <label htmlFor="confirmarContrasena" className="admin-form-label">
                Confirmar Contraseña <RequiredAsterisk />
              </label>
              <PasswordInput
                name="confirmarContrasena"
                value={formData.confirmarContrasena || ""}
                onChange={onInputChange}
                onBlur={onInputBlur}
                placeholder="Confirmar Contraseña"
                required
                className={`admin-form-input ${
                  errors.confirmarContrasena ? "error" : ""
                }`}
              />
              {errors.confirmarContrasena && (
                <span className="admin-form-error">
                  {errors.confirmarContrasena}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {requiresProfile && (
        <div className="admin-form-section">
          <h3 className="admin-form-section-title">Datos del Perfil</h3>
          <div className="admin-form-row-2">
            <div className="admin-form-group">
              <label htmlFor="nombre" className="admin-form-label">
                Nombres <RequiredAsterisk />
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre || ""}
                onChange={onInputChange}
                onBlur={onInputBlur}
                required
                className={`admin-form-input ${errors.nombre ? "error" : ""}`}
              />
              {errors.nombre && (
                <span className="admin-form-error">{errors.nombre}</span>
              )}
            </div>

            <div className="admin-form-group">
              <label htmlFor="apellido" className="admin-form-label">
                Apellidos <RequiredAsterisk />
              </label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={formData.apellido || ""}
                onChange={onInputChange}
                onBlur={onInputBlur}
                required
                className={`admin-form-input ${errors.apellido ? "error" : ""}`}
              />
              {errors.apellido && (
                <span className="admin-form-error">{errors.apellido}</span>
              )}
            </div>
          </div>

          <div className="admin-form-row-2">
            <div className="admin-form-group">
              <label htmlFor="tipoDocumento" className="admin-form-label">
                Tipo de Documento <RequiredAsterisk />
              </label>
              <select
                id="tipoDocumento"
                name="tipoDocumento"
                value={formData.tipoDocumento || ""}
                onChange={onInputChange}
                onBlur={onInputBlur}
                required
                className={`admin-form-select ${
                  errors.tipoDocumento ? "error" : ""
                }`}
              >
                <option value="Cédula de Ciudadanía">
                  Cédula de Ciudadanía
                </option>
                <option value="Cédula de Extranjería">
                  Cédula de Extranjería
                </option>
              </select>
              {errors.tipoDocumento && (
                <span className="admin-form-error">{errors.tipoDocumento}</span>
              )}
            </div>

            <div className="admin-form-group">
              <label htmlFor="numeroDocumento" className="admin-form-label">
                Número de Documento <RequiredAsterisk />
              </label>
              <input
                type="text"
                id="numeroDocumento"
                name="numeroDocumento"
                value={formData.numeroDocumento || ""}
                onChange={onInputChange}
                onBlur={onInputBlur}
                required
                className={`admin-form-input ${
                  errors.numeroDocumento ? "error" : ""
                }`}
              />
              {errors.numeroDocumento && (
                <span className="admin-form-error">
                  {errors.numeroDocumento}
                </span>
              )}
            </div>
          </div>

          <div className="admin-form-row-2">
            <div className="admin-form-group">
              <label htmlFor="telefono" className="admin-form-label">
                Teléfono <RequiredAsterisk />
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono || ""}
                onChange={onInputChange}
                onBlur={onInputBlur}
                required
                className={`admin-form-input ${errors.telefono ? "error" : ""}`}
              />
              {errors.telefono && (
                <span className="admin-form-error">{errors.telefono}</span>
              )}
            </div>

            <div className="admin-form-group">
              <label htmlFor="fechaNacimiento" className="admin-form-label">
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
                max={new Date().toISOString().split("T")[0]}
                className={`admin-form-input ${
                  errors.fechaNacimiento ? "error" : ""
                }`}
              />
              {errors.fechaNacimiento && (
                <span className="admin-form-error">
                  {errors.fechaNacimiento}
                </span>
              )}
            </div>
          </div>

          {isCliente && (
            <div className="admin-form-group">
              <label htmlFor="direccion" className="admin-form-label">
                Dirección <RequiredAsterisk />
              </label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={formData.direccion || ""}
                onChange={onInputChange}
                onBlur={onInputBlur}
                required
                className={`admin-form-input ${
                  errors.direccion ? "error" : ""
                }`}
              />
              {errors.direccion && (
                <span className="admin-form-error">{errors.direccion}</span>
              )}
            </div>
          )}
        </div>
      )}

      {isEditing && !isUserAdmin && (
        <div className="admin-form-section">
          <div className="admin-form-group">
            <label htmlFor="estado" className="admin-form-label">
              Estado:
            </label>
            <label className="switch">
              <input
                type="checkbox"
                id="estado"
                name="estado"
                checked={!!formData.estado}
                onChange={onInputChange}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      )}
    </>
  );
};

export default UsuarioForm;
