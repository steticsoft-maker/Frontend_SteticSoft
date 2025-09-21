// src/features/auth/utils/validationSchemas.js

/**
 * Esquemas de validación centralizados para formularios de autenticación
 */

// Expresiones regulares reutilizables
export const REGEX_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.,;?¡¿"'(){}[\]\-_+=|\\/°¬~`´¨´`+*çÇªº]).{8,}$/,
  name: /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/,
  phone: /^\d+$/,
  document: /^[a-zA-Z0-9]+$/,
  address: /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s.,#\-_]+$/,
};

// Esquemas de validación para cada formulario
export const VALIDATION_SCHEMAS = {
  login: {
    email: {
      required: true,
      type: "email",
      maxLength: 254,
      pattern: REGEX_PATTERNS.email,
      message: "Debe proporcionar un correo electrónico válido",
    },
    password: {
      required: true,
      minLength: 1,
      message: "La contraseña es obligatoria",
    },
  },

  register: {
    nombre: {
      required: true,
      type: "string",
      minLength: 2,
      maxLength: 100,
      pattern: REGEX_PATTERNS.name,
      message:
        "El nombre debe tener entre 2 y 100 caracteres y solo contener letras",
    },
    apellido: {
      required: true,
      type: "string",
      minLength: 2,
      maxLength: 100,
      pattern: REGEX_PATTERNS.name,
      message:
        "El apellido debe tener entre 2 y 100 caracteres y solo contener letras",
    },
    correo: {
      required: true,
      type: "email",
      maxLength: 254,
      pattern: REGEX_PATTERNS.email,
      message: "Debe proporcionar un correo electrónico válido",
    },
    contrasena: {
      required: true,
      minLength: 8,
      pattern: REGEX_PATTERNS.password,
      message:
        "La contraseña debe tener al menos 8 caracteres, incluyendo mayúscula, minúscula, número y carácter especial",
    },
    telefono: {
      required: true,
      pattern: REGEX_PATTERNS.phone,
      minLength: 7,
      maxLength: 15,
      message: "El teléfono debe tener entre 7 y 15 dígitos",
    },
    tipoDocumento: {
      required: true,
      allowedValues: [
        "Cédula de Ciudadanía",
        "Cédula de Extranjería",
        "Pasaporte",
        "Tarjeta de Identidad",
      ],
      message: "Debe seleccionar un tipo de documento válido",
    },
    numeroDocumento: {
      required: true,
      minLength: 5,
      maxLength: 20,
      message: "El número de documento debe tener entre 5 y 20 caracteres",
    },
    fechaNacimiento: {
      required: true,
      type: "date",
      message: "Debe proporcionar una fecha de nacimiento válida",
    },
    direccion: {
      required: true,
      minLength: 5,
      maxLength: 255,
      pattern: REGEX_PATTERNS.address,
      message: "La dirección debe tener entre 5 y 255 caracteres",
    },
  },

  passwordRecovery: {
    email: {
      required: true,
      type: "email",
      pattern: REGEX_PATTERNS.email,
      message: "Debe proporcionar un correo electrónico válido",
    },
    token: {
      required: true,
      minLength: 6,
      maxLength: 6,
      pattern: /^\d{6}$/,
      message: "El código debe tener exactamente 6 dígitos",
    },
    nuevaContrasena: {
      required: true,
      minLength: 8,
      pattern: REGEX_PATTERNS.password,
      message:
        "La nueva contraseña debe tener al menos 8 caracteres, incluyendo mayúscula, minúscula, número y carácter especial",
    },
    confirmarNuevaContrasena: {
      required: true,
      message: "Debe confirmar la nueva contraseña",
    },
  },
};

/**
 * Valida un campo individual según su esquema
 * @param {any} value - Valor a validar
 * @param {object} rules - Reglas de validación
 * @param {object} formData - Datos completos del formulario (para validaciones cruzadas)
 * @returns {string|null} - Mensaje de error o null si es válido
 */
export const validateField = (value, rules, formData = {}) => {
  // Verificar campo requerido
  if (rules.required && (!value || value.toString().trim() === "")) {
    return rules.message || "Este campo es obligatorio";
  }

  // Si no hay valor y no es requerido, es válido
  if (!value || value.toString().trim() === "") {
    return null;
  }

  const stringValue = value.toString().trim();

  // Validar longitud mínima
  if (rules.minLength && stringValue.length < rules.minLength) {
    return rules.message || `Debe tener al menos ${rules.minLength} caracteres`;
  }

  // Validar longitud máxima
  if (rules.maxLength && stringValue.length > rules.maxLength) {
    return (
      rules.message || `No puede tener más de ${rules.maxLength} caracteres`
    );
  }

  // Validar patrón regex
  if (rules.pattern && !rules.pattern.test(stringValue)) {
    return rules.message || "Formato inválido";
  }

  // Validar valores permitidos
  if (rules.allowedValues && !rules.allowedValues.includes(stringValue)) {
    return rules.message || "Valor no permitido";
  }

  // Validación especial para fecha de nacimiento
  if (rules.type === "date") {
    const birthDate = new Date(stringValue + "T00:00:00");
    const today = new Date();

    if (isNaN(birthDate.getTime())) {
      return "Fecha inválida";
    }

    if (birthDate > today) {
      return "La fecha de nacimiento no puede ser futura";
    }

    // Calcular edad
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (age < 18) {
      return "El usuario debe ser mayor de 18 años";
    }
  }

  // Validación especial para número de documento
  if (rules.fieldName === "numeroDocumento") {
    const docType = formData.tipoDocumento;
    if (
      docType === "Cédula de Ciudadanía" ||
      docType === "Cédula de Extranjería"
    ) {
      if (!REGEX_PATTERNS.phone.test(stringValue)) {
        return "Para este tipo de documento, ingrese solo números";
      }
    } else if (docType === "Pasaporte") {
      if (!REGEX_PATTERNS.document.test(stringValue)) {
        return "Para Pasaporte, ingrese solo letras y números";
      }
    }
  }

  return null;
};

/**
 * Valida un formulario completo según su esquema
 * @param {object} formData - Datos del formulario
 * @param {string} schemaName - Nombre del esquema a usar
 * @returns {object} - { isValid: boolean, errors: object }
 */
export const validateForm = (formData, schemaName) => {
  const schema = VALIDATION_SCHEMAS[schemaName];
  if (!schema) {
    throw new Error(`Schema ${schemaName} not found`);
  }

  const errors = {};

  // Validar cada campo del esquema
  Object.keys(schema).forEach((fieldName) => {
    const fieldValue = formData[fieldName];
    const fieldRules = { ...schema[fieldName], fieldName };
    const error = validateField(fieldValue, fieldRules, formData);

    if (error) {
      errors[fieldName] = error;
    }
  });

  // Validaciones cruzadas específicas
  if (
    schemaName === "register" &&
    formData.contrasena &&
    formData.confirmPassword
  ) {
    if (formData.contrasena !== formData.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden";
    }
  }

  if (
    schemaName === "passwordRecovery" &&
    formData.nuevaContrasena &&
    formData.confirmarNuevaContrasena
  ) {
    if (formData.nuevaContrasena !== formData.confirmarNuevaContrasena) {
      errors.confirmarNuevaContrasena = "Las contraseñas no coinciden";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  VALIDATION_SCHEMAS,
  REGEX_PATTERNS,
  validateField,
  validateForm,
};
