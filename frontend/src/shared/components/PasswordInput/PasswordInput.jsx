import React, { useState } from 'react';
import './PasswordInput.css'; // CSS específico para este componente

// El ícono se puede mantener aquí o mover a un archivo de íconos compartidos si se usa en más lugares.
// Por ahora, lo mantenemos aquí para que el componente sea autocontenido.
const EyeIcon = ({ closed }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  className = "", // Permite pasar clases adicionales para personalizar
  required = false
}) => {
  const [showPassword, setShowPassword] = useState(false);

  // Combinamos las clases que vienen de props con las de error si es necesario
  const inputClassName = `password-input ${className}`.trim();

  return (
    <div className="password-input-wrapper">
      <input
        type={showPassword ? "text" : "password"}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
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
        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
      >
        <EyeIcon closed={showPassword} />
      </button>
    </div>
  );
};

export default PasswordInput;
