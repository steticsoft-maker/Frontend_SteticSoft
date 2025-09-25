// src/features/clientes/components/ClienteForm.jsx
import React from "react";
import "../../../shared/styles/admin-layout.css";
import PasswordInput from "../../../shared/components/PasswordInput/PasswordInput"; // Importar el componente reutilizable

const TIPOS_DOCUMENTO = ["Cédula de Ciudadanía", "Cédula de Extranjería"];

const ClienteForm = ({
  formData,
  onFormChange,
  onFormBlur,
  isEditing,
  formErrors,
}) => {
  return (
    <>
      <div className="admin-form-section">
        <h3 className="admin-form-section-title">Información Personal</h3>
        <div className="admin-form-row-2">
          <div className="admin-form-group">
            <label htmlFor="nombre" className="admin-form-label">
              Nombre: <span className="required-asterisk">*</span>
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre || ""}
              onChange={onFormChange}
              onBlur={onFormBlur}
              placeholder="Nombre"
              autoComplete="given-name"
              required
              className={`admin-form-input ${formErrors.nombre ? "error" : ""}`}
            />
            {formErrors.nombre && (
              <span className="admin-form-error">{formErrors.nombre}</span>
            )}
          </div>

          <div className="admin-form-group">
            <label htmlFor="apellido" className="admin-form-label">
              Apellido: <span className="required-asterisk">*</span>
            </label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido || ""}
              onChange={onFormChange}
              onBlur={onFormBlur}
              placeholder="Apellido"
              autoComplete="family-name"
              required
              className={`admin-form-input ${
                formErrors.apellido ? "error" : ""
              }`}
            />
            {formErrors.apellido && (
              <span className="admin-form-error">{formErrors.apellido}</span>
            )}
          </div>
        </div>

        <div className="admin-form-group">
          <label htmlFor="correo" className="admin-form-label">
            Correo: <span className="required-asterisk">*</span>
          </label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={formData.correo || ""}
            onChange={onFormChange}
            onBlur={onFormBlur}
            placeholder="Correo electrónico"
            autoComplete="email"
            required
            className={`admin-form-input ${formErrors.correo ? "error" : ""}`}
          />
          {formErrors.correo && (
            <span className="admin-form-error">{formErrors.correo}</span>
          )}
        </div>

        <div className="admin-form-group">
          <label htmlFor="direccion" className="admin-form-label">
            Dirección:
          </label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            value={formData.direccion || ""}
            onChange={onFormChange}
            onBlur={onFormBlur}
            placeholder="Dirección"
            autoComplete="street-address"
            className={`admin-form-input ${
              formErrors.direccion ? "error" : ""
            }`}
          />
          {formErrors.direccion && (
            <span className="admin-form-error">{formErrors.direccion}</span>
          )}
        </div>
      </div>

      <div className="admin-form-section">
        <h3 className="admin-form-section-title">Información de Contacto</h3>
        <div className="admin-form-row-2">
          <div className="admin-form-group">
            <label htmlFor="telefono" className="admin-form-label">
              Teléfono: <span className="required-asterisk">*</span>
            </label>
            <input
              type="text"
              id="telefono"
              name="telefono"
              value={formData.telefono || ""}
              onChange={onFormChange}
              onBlur={onFormBlur}
              placeholder="Teléfono"
              autoComplete="tel"
              required
              className={`admin-form-input ${
                formErrors.telefono ? "error" : ""
              }`}
            />
            {formErrors.telefono && (
              <span className="admin-form-error">{formErrors.telefono}</span>
            )}
          </div>

          <div className="admin-form-group">
            <label htmlFor="fechaNacimiento" className="admin-form-label">
              Fecha de Nacimiento: <span className="required-asterisk">*</span>
            </label>
            <input
              type="date"
              id="fechaNacimiento"
              name="fechaNacimiento"
              value={formData.fechaNacimiento || ""}
              onChange={onFormChange}
              onBlur={onFormBlur}
              autoComplete="bday"
              required
              className={`admin-form-input ${
                formErrors.fechaNacimiento ? "error" : ""
              }`}
            />
            {formErrors.fechaNacimiento && (
              <span className="admin-form-error">
                {formErrors.fechaNacimiento}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="admin-form-section">
        <h3 className="admin-form-section-title">Documento de Identidad</h3>
        <div className="admin-form-row-2">
          <div className="admin-form-group">
            <label htmlFor="tipoDocumento" className="admin-form-label">
              Tipo de Documento: <span className="required-asterisk">*</span>
            </label>
            <select
              id="tipoDocumento"
              name="tipoDocumento"
              value={formData.tipoDocumento || ""}
              onChange={onFormChange}
              onBlur={onFormBlur}
              required
              className={`admin-form-select ${
                formErrors.tipoDocumento ? "error" : ""
              }`}
            >
              <option value="" disabled>
                Seleccione un tipo
              </option>
              {TIPOS_DOCUMENTO.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
            {formErrors.tipoDocumento && (
              <span className="admin-form-error">
                {formErrors.tipoDocumento}
              </span>
            )}
          </div>

          <div className="admin-form-group">
            <label htmlFor="numeroDocumento" className="admin-form-label">
              Número de Documento: <span className="required-asterisk">*</span>
            </label>
            <input
              type="text"
              id="numeroDocumento"
              name="numeroDocumento"
              value={formData.numeroDocumento || ""}
              onChange={onFormChange}
              onBlur={onFormBlur}
              placeholder="Número de Documento"
              autoComplete="off"
              required
              className={`admin-form-input ${
                formErrors.numeroDocumento ? "error" : ""
              }`}
            />
            {formErrors.numeroDocumento && (
              <span className="admin-form-error">
                {formErrors.numeroDocumento}
              </span>
            )}
          </div>
        </div>
      </div>

      {!isEditing && (
        <div className="admin-form-section">
          <h3 className="admin-form-section-title">Credenciales de Acceso</h3>
          <div className="admin-form-row-2">
            <div className="admin-form-group">
              <label htmlFor="contrasena" className="admin-form-label">
                Contraseña: <span className="required-asterisk">*</span>
              </label>
              <PasswordInput
                name="contrasena"
                value={formData.contrasena || ""}
                onChange={onFormChange}
                onBlur={onFormBlur}
                placeholder="Contraseña"
                required
                className={`admin-form-input ${
                  formErrors.contrasena ? "error" : ""
                }`}
              />
              {formErrors.contrasena && (
                <span className="admin-form-error">
                  {formErrors.contrasena}
                </span>
              )}
            </div>

            <div className="admin-form-group">
              <label htmlFor="confirmarContrasena" className="admin-form-label">
                Confirmar Contraseña:{" "}
                <span className="required-asterisk">*</span>
              </label>
              <PasswordInput
                name="confirmarContrasena"
                value={formData.confirmarContrasena || ""}
                onChange={onFormChange}
                onBlur={onFormBlur}
                placeholder="Confirmar Contraseña"
                required
                className={`admin-form-input ${
                  formErrors.confirmarContrasena ? "error" : ""
                }`}
              />
              {formErrors.confirmarContrasena && (
                <span className="admin-form-error">
                  {formErrors.confirmarContrasena}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {isEditing && (
        <div className="admin-form-section">
          <h3 className="admin-form-section-title">Estado</h3>
          <div className="admin-form-group">
            <label className="admin-form-label">Estado:</label>
            <label className="switch">
              <input
                type="checkbox"
                name="estado"
                checked={formData.estado || false}
                onChange={onFormChange}
              />
              <span className="slider"></span>
            </label>
            {formErrors.estado && (
              <span className="admin-form-error">{formErrors.estado}</span>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ClienteForm;
