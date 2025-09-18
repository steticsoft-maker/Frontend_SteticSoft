// src/features/usuarios/components/UsuarioForm.jsx
import React from 'react';
import PasswordInput from '../../../shared/components/PasswordInput/PasswordInput'; // Importar el componente reutilizable

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
  isUserAdmin
}) => {
  const errors = formErrors || {};

  return (
    <div className="usuarios-form-grid-container">
      {/* --- Campos de la Cuenta --- */}
      <div className="usuarios-form-grid-item">
        <label htmlFor="correo" className="usuarios-form-label">Correo Electrónico <RequiredAsterisk /></label>
        <input
          type="email"
          id="correo"
          name="correo"
          autoComplete="email"
          value={formData.correo || ""}
          onChange={onInputChange}
          onBlur={onInputBlur}
          required
          className={`usuarios-form-input ${errors.correo ? "input-error" : ""}`}
          disabled={isUserAdmin || isVerifyingEmail}
        />
        {isVerifyingEmail && <span className="verifying-email-message">Verificando...</span>}
        {errors.correo && <span className="error-message">{errors.correo}</span>}
      </div>

      <div className="usuarios-form-grid-item">
        <label htmlFor="idRol" className="usuarios-form-label">Rol <RequiredAsterisk /></label>
        <select
          id="idRol"
          name="idRol"
          value={formData.idRol || ""}
          onChange={onInputChange}
          onBlur={onInputBlur}
          required
          className={`usuarios-form-select ${errors.idRol ? "input-error" : ""}`}
          disabled={isUserAdmin}
        >
          <option value="" disabled>Seleccionar rol</option>
          {availableRoles.map((rol) => (
            <option key={rol.idRol} value={rol.idRol}>{rol.nombre}</option>
          ))}
        </select>
        {errors.idRol && <span className="error-message">{errors.idRol}</span>}
      </div>

      {!isEditing && (
        <>
          {/* --- INICIO DE REFACTORIZACIÓN: Campo de contraseña con componente reutilizable --- */}
          <div className="usuarios-form-grid-item">
            <label htmlFor="contrasena" className="usuarios-form-label">Contraseña <RequiredAsterisk /></label>
            <PasswordInput
              name="contrasena"
              value={formData.contrasena || ""}
              onChange={onInputChange}
              onBlur={onInputBlur}
              placeholder="Contraseña"
              required
              className={`usuarios-form-input ${errors.contrasena ? "input-error" : ""}`}
              helpText="Mín 8 caract, 1 Mayús, 1 minús, 1 núm, 1 símb"
            />
            {errors.contrasena && <span className="error-message">{errors.contrasena}</span>}
          </div>

          <div className="usuarios-form-grid-item">
            <label htmlFor="confirmarContrasena" className="usuarios-form-label">Confirmar Contraseña <RequiredAsterisk /></label>
            <PasswordInput
              name="confirmarContrasena"
              value={formData.confirmarContrasena || ""}
              onChange={onInputChange}
              onBlur={onInputBlur}
              placeholder="Confirmar Contraseña"
              required
              className={`usuarios-form-input ${errors.confirmarContrasena ? "input-error" : ""}`}
            />
            {errors.confirmarContrasena && <span className="error-message">{errors.confirmarContrasena}</span>}
          </div>
          {/* --- FIN DE REFACTORIZACIÓN --- */}
        </>
      )}

      {/* --- Campos de Perfil (Sin cambios) --- */}
      {requiresProfile && (
        <>
          <div className="usuarios-form-grid-item-full-width">
            <h3 className="profile-data-header">Datos del Perfil</h3>
          </div>
          <div className="usuarios-form-grid-item">
            <label htmlFor="nombre" className="usuarios-form-label">Nombres <RequiredAsterisk /></label>
            <input type="text" id="nombre" name="nombre" value={formData.nombre || ""}
              onChange={onInputChange} onBlur={onInputBlur} required
              className={`usuarios-form-input ${errors.nombre ? "input-error" : ""}`}
            />
            {errors.nombre && <span className="error-message">{errors.nombre}</span>}
          </div>

          <div className="usuarios-form-grid-item">
            <label htmlFor="apellido" className="usuarios-form-label">Apellidos <RequiredAsterisk /></label>
            <input type="text" id="apellido" name="apellido" value={formData.apellido || ""}
              onChange={onInputChange} onBlur={onInputBlur} required
              className={`usuarios-form-input ${errors.apellido ? "input-error" : ""}`}
            />
            {errors.apellido && <span className="error-message">{errors.apellido}</span>}
          </div>
          
          <div className="usuarios-form-grid-item">
            <label htmlFor="tipoDocumento" className="usuarios-form-label">Tipo de Documento <RequiredAsterisk /></label>
            <select id="tipoDocumento" name="tipoDocumento" value={formData.tipoDocumento || ""}
              onChange={onInputChange} onBlur={onInputBlur} required
              className={`usuarios-form-select ${errors.tipoDocumento ? "input-error" : ""}`}>
              <option value="Cédula de Ciudadanía">Cédula de Ciudadanía</option>
              <option value="Cédula de Extranjería">Cédula de Extranjería</option>
            </select>
            {errors.tipoDocumento && <span className="error-message">{errors.tipoDocumento}</span>}
          </div>

          <div className="usuarios-form-grid-item">
            <label htmlFor="numeroDocumento" className="usuarios-form-label">Número de Documento <RequiredAsterisk /></label>
            <input type="text" id="numeroDocumento" name="numeroDocumento" value={formData.numeroDocumento || ""}
              onChange={onInputChange} onBlur={onInputBlur} required
              className={`usuarios-form-input ${errors.numeroDocumento ? "input-error" : ""}`}
            />
            {errors.numeroDocumento && <span className="error-message">{errors.numeroDocumento}</span>}
          </div>

          <div className="usuarios-form-grid-item">
            <label htmlFor="telefono" className="usuarios-form-label">Teléfono <RequiredAsterisk /></label>
            <input type="tel" id="telefono" name="telefono" value={formData.telefono || ""}
              onChange={onInputChange} onBlur={onInputBlur} required
              className={`usuarios-form-input ${errors.telefono ? "input-error" : ""}`}
            />
            {errors.telefono && <span className="error-message">{errors.telefono}</span>}
          </div>

          {isCliente && (
            <div className="usuarios-form-grid-item">
              <label htmlFor="direccion" className="usuarios-form-label">Dirección <RequiredAsterisk /></label>
              <input type="text" id="direccion" name="direccion" value={formData.direccion || ""}
                onChange={onInputChange} onBlur={onInputBlur} required
                className={`usuarios-form-input ${errors.direccion ? "input-error" : ""}`}
              />
              {errors.direccion && <span className="error-message">{errors.direccion}</span>}
            </div>
          )}

          <div className="usuarios-form-grid-item">
            <label htmlFor="fechaNacimiento" className="usuarios-form-label">Fecha de Nacimiento <RequiredAsterisk /></label>
            <input type="date" id="fechaNacimiento" name="fechaNacimiento" value={formData.fechaNacimiento || ""}
              onChange={onInputChange} onBlur={onInputBlur} required
              className={`usuarios-form-input ${errors.fechaNacimiento ? "input-error" : ""}`}
            />
            {errors.fechaNacimiento && <span className="error-message">{errors.fechaNacimiento}</span>}
          </div>
        </>
      )}

      {isEditing && !isUserAdmin && (
        <div className="usuarios-form-grid-item usuarios-form-group-estado">
          <label htmlFor="estado" className="usuarios-form-label">Estado (Activo):</label>
          <label className="switch">
            <input type="checkbox" id="estado" name="estado" checked={!!formData.estado} onChange={onInputChange} />
            <span className="slider"></span>
          </label>
        </div>
      )}
    </div>
  );
};

export default UsuarioForm;