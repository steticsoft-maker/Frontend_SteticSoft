import React, { useState } from "react";
import "./PasswordInput.css"; // CSS específico para este componente

// El ícono se puede mantener aquí o mover a un archivo de íconos compartidos si se usa en más lugares.
// Por ahora, lo mantenemos aquí para que el componente sea autocontenido.
const EyeIcon = ({ closed }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
    {closed && <line x1="1" y1="1" x2="23" y2="23"></line>}
  </svg>
);

const PasswordInput = ({
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  autoComplete = "new-password",
  className = "",
  required = false,
  helpText, // Nueva prop para el texto de ayuda
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputClassName = `password-input ${className}`.trim();

  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className="password-input-container">
      <div className="password-input-wrapper">
        <input
          type={showPassword ? "text" : "password"}
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className={inputClassName}
        />
        <button
          type="button"
          className="password-toggle-button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={
            showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
          }
        >
          <EyeIcon closed={showPassword} />
        </button>
      </div>
      {helpText && <small className="password-help-text">{helpText}</small>}
    </div>
  );
};

export default PasswordInput;
