// src/features/usuarios/components/UsuarioForm.jsx
import React from 'react';

const RequiredAsterisk = () => <span style={{ color: "red", marginLeft: "2px" }}>*</span>;

const UsuarioForm = ({
  formData,
  onFormChange,
  availableRoles,
  isEditing,
  isUserAdmin,
  formErrors
}) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onFormChange(name, type === 'checkbox' ? checked : value);
  };

  const errors = formErrors || {};

  // Determina si el rol seleccionado requiere campos de perfil
  const selectedRole = availableRoles.find(rol => rol.idRol === parseInt(formData.idRol));
  const requiresProfileFields = selectedRole && (selectedRole.nombre === 'Cliente' || selectedRole.nombre === 'Empleado');

  return (
    <div className="usuarios-form-grid-container">
      {/* --- Campos de la Cuenta (Siempre visibles) --- */}
      <div className="usuarios-form-grid-item">
        <label htmlFor="correo" className="usuarios-form-label">Correo Electrónico <RequiredAsterisk /></label>
        <input
          type="email"
          id="correo"
          name="correo"
          placeholder="ejemplo@correo.com"
          value={formData.correo || ""}
          onChange={handleChange}
          required
          className={`usuarios-form-input ${errors.correo ? 'input-error' : ''}`}
          disabled={isUserAdmin && isEditing} // El correo del admin no debería poder cambiarse desde aquí
        />
        {errors.correo && <span className="error-message">{errors.correo}</span>}
      </div>

      <div className="usuarios-form-grid-item">
        <label htmlFor="idRol" className="usuarios-form-label">Rol <RequiredAsterisk /></label>
        <select
          id="idRol"
          name="idRol"
          value={formData.idRol || ""}
          onChange={handleChange}
          required
          className={`usuarios-form-select ${errors.idRol ? 'input-error' : ''}`}
          disabled={isUserAdmin && isEditing} // El rol del admin no debería poder cambiarse desde aquí
        >
          <option value="" disabled>Seleccionar rol</option>
          {availableRoles.map((rol) => (
            <option key={rol.idRol} value={rol.idRol}>
              {rol.nombre}
            </option>
          ))}
        </select>
        {errors.idRol && <span className="error-message">{errors.idRol}</span>}
      </div>

      {!isEditing && (
        <>
          <div className="usuarios-form-grid-item">
            <label htmlFor="contrasena" className="usuarios-form-label">Contraseña <RequiredAsterisk /></label>
            <input type="password" id="contrasena" name="contrasena" placeholder="Mínimo 8 caracteres" value={formData.contrasena || ""} onChange={handleChange} required className={`usuarios-form-input ${errors.contrasena ? 'input-error' : ''}`} />
            {errors.contrasena && <span className="error-message">{errors.contrasena}</span>}
          </div>

          <div className="usuarios-form-grid-item">
            <label htmlFor="confirmarContrasena" className="usuarios-form-label">Confirmar Contraseña <RequiredAsterisk /></label>
            <input type="password" id="confirmarContrasena" name="confirmarContrasena" placeholder="Repetir contraseña" value={formData.confirmarContrasena || ""} onChange={handleChange} required className={`usuarios-form-input ${errors.confirmarContrasena ? 'input-error' : ''}`} />
            {errors.confirmarContrasena && <span className="error-message">{errors.confirmarContrasena}</span>}
          </div>
        </>
      )}

      {/* --- Campos de Perfil (Visibles condicionalmente) --- */}
      {requiresProfileFields && (
        <>
          <div className="usuarios-form-grid-item-full-width">
            <hr />
            <h3 style={{ textAlign: 'center', color: '#6d0b58', margin: '10px 0' }}>Datos del Perfil de {selectedRole.nombre}</h3>
          </div>

          <div className="usuarios-form-grid-item">
            <label htmlFor="nombre" className="usuarios-form-label">Nombres <RequiredAsterisk /></label>
            <input type="text" id="nombre" name="nombre" placeholder="Nombres del usuario" value={formData.nombre || ""} onChange={handleChange} required className={`usuarios-form-input ${errors.nombre ? 'input-error' : ''}`} disabled={isUserAdmin && isEditing} />
            {errors.nombre && <span className="error-message">{errors.nombre}</span>}
          </div>

          <div className="usuarios-form-grid-item">
            <label htmlFor="apellido" className="usuarios-form-label">Apellidos <RequiredAsterisk /></label>
            <input type="text" id="apellido" name="apellido" placeholder="Apellidos del usuario" value={formData.apellido || ""} onChange={handleChange} required className={`usuarios-form-input ${errors.apellido ? 'input-error' : ''}`} disabled={isUserAdmin && isEditing} />
            {errors.apellido && <span className="error-message">{errors.apellido}</span>}
          </div>

          <div className="usuarios-form-grid-item">
            <label htmlFor="tipoDocumento" className="usuarios-form-label">Tipo de Documento <RequiredAsterisk /></label>
            <select id="tipoDocumento" name="tipoDocumento" value={formData.tipoDocumento || ""} onChange={handleChange} required className={`usuarios-form-select ${errors.tipoDocumento ? 'input-error' : ''}`} disabled={isUserAdmin && isEditing}>
              <option value="Cédula de Ciudadanía">Cédula de Ciudadanía</option>
              <option value="Cédula de Extranjería">Cédula de Extranjería</option>
              <option value="Tarjeta de Identidad">Tarjeta de Identidad</option>
              <option value="Pasaporte">Pasaporte</option>
            </select>
            {errors.tipoDocumento && <span className="error-message">{errors.tipoDocumento}</span>}
          </div>

          <div className="usuarios-form-grid-item">
            <label htmlFor="numeroDocumento" className="usuarios-form-label">Número de Documento <RequiredAsterisk /></label>
            <input type="text" id="numeroDocumento" name="numeroDocumento" placeholder="Número de documento" value={formData.numeroDocumento || ""} onChange={handleChange} required className={`usuarios-form-input ${errors.numeroDocumento ? 'input-error' : ''}`} disabled={isUserAdmin && isEditing} />
            {errors.numeroDocumento && <span className="error-message">{errors.numeroDocumento}</span>}
          </div>
          
           <div className="usuarios-form-grid-item">
            <label htmlFor="telefono" className="usuarios-form-label">Teléfono <RequiredAsterisk /></label>
            <input type="tel" id="telefono" name="telefono" placeholder="Número de teléfono" value={formData.telefono || ""} onChange={handleChange} required className={`usuarios-form-input ${errors.telefono ? 'input-error' : ''}`} disabled={isUserAdmin && isEditing} />
            {errors.telefono && <span className="error-message">{errors.telefono}</span>}
          </div>

          <div className="usuarios-form-grid-item">
            <label htmlFor="fechaNacimiento" className="usuarios-form-label">Fecha de Nacimiento <RequiredAsterisk /></label>
            <input type="date" id="fechaNacimiento" name="fechaNacimiento" value={formData.fechaNacimiento || ""} onChange={handleChange} required className={`usuarios-form-input ${errors.fechaNacimiento ? 'input-error' : ''}`} disabled={isUserAdmin && isEditing} />
            {errors.fechaNacimiento && <span className="error-message">{errors.fechaNacimiento}</span>}
          </div>
        </>
      )}

      {/* --- Switch de Estado (Solo para edición) --- */}
      {isEditing && !isUserAdmin && (
        <div className="usuarios-form-grid-item usuarios-form-group-estado">
          <label htmlFor="estado" className="usuarios-form-label">Estado (Activo):</label>
          <label className="switch">
            <input type="checkbox" id="estado" name="estado" checked={formData.estado} onChange={handleChange} />
            <span className="slider"></span>
          </label>
        </div>
      )}
    </div>
  );
};

export default UsuarioForm;