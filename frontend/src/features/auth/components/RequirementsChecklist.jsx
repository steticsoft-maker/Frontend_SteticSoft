// src/features/auth/components/RequirementsChecklist.jsx
import React from "react";
import "../css/RequirementsChecklist.css";

function RequirementsChecklist({ formData, fieldErrors }) {
  // Función para determinar el estado de cada requisito
  const getRequirementStatus = (fieldName, validator) => {
    const value = formData[fieldName] || "";
    const hasError = fieldErrors[fieldName];

    // Si no hay valor, estado neutral
    if (!value.trim()) {
      return "neutral";
    }

    // Si hay error, estado inválido
    if (hasError) {
      return "invalid";
    }

    // Si no hay error y hay valor, estado válido
    return "valid";
  };

  // Lista de requisitos con sus validadores
  const requirements = [
    {
      id: "nombre",
      text: "Nombre debe tener entre 2 y 100 caracteres",
      validator: (value) => value.length >= 2 && value.length <= 100,
    },
    {
      id: "apellido",
      text: "Apellido debe tener entre 2 y 100 caracteres",
      validator: (value) => value.length >= 2 && value.length <= 100,
    },
    {
      id: "correo",
      text: "Debe proporcionar un correo electrónico válido",
      validator: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      },
    },
    {
      id: "contrasena",
      text: "Contraseña debe tener entre 8 y 100 caracteres",
      validator: (value) => value.length >= 8 && value.length <= 100,
    },
    {
      id: "confirmPassword",
      text: "Las contraseñas deben coincidir",
      validator: (value) => value === formData.contrasena,
    },
    {
      id: "telefono",
      text: "Teléfono debe tener entre 7 y 15 dígitos",
      validator: (value) => /^\d{7,15}$/.test(value),
    },
    {
      id: "tipoDocumento",
      text: "Debe seleccionar un tipo de documento",
      validator: (value) => value && value.trim() !== "",
    },
    {
      id: "numeroDocumento",
      text: "Número de documento debe tener entre 5 y 20 caracteres",
      validator: (value) => value.length >= 5 && value.length <= 20,
    },
    {
      id: "fechaNacimiento",
      text: "Debe proporcionar una fecha de nacimiento válida",
      validator: (value) => {
        if (!value) return false;
        const date = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - date.getFullYear();
        return date <= today && age >= 13;
      },
    },
    {
      id: "direccion",
      text: "Dirección debe tener entre 5 y 200 caracteres",
      validator: (value) => value.length >= 5 && value.length <= 200,
    },
  ];

  return (
    <div className="requirements-checklist">
      <h3 className="requirements-title">Requisitos Mínimos</h3>
      <ul className="requirements-list">
        {requirements.map((requirement) => {
          const status = getRequirementStatus(
            requirement.id,
            requirement.validator
          );

          return (
            <li key={requirement.id} className={`requirement-item ${status}`}>
              <div className="requirement-icon">
                {status === "neutral" && (
                  <span className="neutral-icon">○</span>
                )}
                {status === "invalid" && (
                  <span className="invalid-icon">✗</span>
                )}
                {status === "valid" && <span className="valid-icon">✓</span>}
              </div>
              <span className="requirement-text">{requirement.text}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default RequirementsChecklist;
