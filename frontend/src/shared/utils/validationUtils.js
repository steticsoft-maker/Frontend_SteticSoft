// frontend/src/shared/utils/validationUtils.js

// --- Expresiones Regulares para Validaciones ---

/**
 * @description Expresión regular para validar la fortaleza de una contraseña.
 * Requisitos:
 * - Al menos 8 caracteres de longitud.
 * - Al menos una letra mayúscula (A-Z).
 * - Al menos una letra minúscula (a-z).
 * - Al menos un número (0-9).
 * - Al menos un símbolo especial (ej. !@#$%^&*).
 */
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.,;?¡¿"'(){}[\]\-_+=|\\/°¬~`´¨´`+*çÇªº]).{8,}$/;


/**
 * @description Expresión regular para validar nombres y apellidos.
 * Requisitos:
 * - Solo permite letras (mayúsculas y minúsculas, incluyendo acentos y ñ).
 * - Permite espacios entre nombres/apellidos.
 * - No permite números ni la mayoría de los símbolos especiales.
 */
export const NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;


/**
 * @description Expresión regular para validar un formato de correo electrónico.
 * Es una validación básica del formato `usuario@dominio.extension`.
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


// --- Funciones de Validación ---

/**
 * @description Valida si una contraseña cumple con los requisitos de seguridad.
 * @param {string} password - La contraseña a validar.
 * @returns {boolean} `true` si la contraseña es válida, `false` en caso contrario.
 */
export const validatePassword = (password) => {
  if (!password) return false;
  return PASSWORD_REGEX.test(password);
};

/**
 * @description Valida si un nombre o apellido es válido.
 * @param {string} name - El nombre o apellido a validar.
 * @param {object} options - Opciones de validación.
 * @param {number} options.minLength - Longitud mínima permitida.
 * @param {number} options.maxLength - Longitud máxima permitida.
 * @returns {boolean} `true` si el nombre es válido, `false` en caso contrario.
 */
export const validateName = (name, options = { minLength: 2, maxLength: 100 }) => {
  if (!name) return false;
  const { minLength, maxLength } = options;
  if (name.length < minLength || name.length > maxLength) {
    return false;
  }
  return NAME_REGEX.test(name);
};

/**
 * @description Valida el formato de un correo electrónico.
 * @param {string} email - El correo electrónico a validar.
 * @returns {boolean} `true` si el formato es válido, `false` en caso contrario.
 */
export const validateEmail = (email) => {
    if (!email) return false;
    return EMAIL_REGEX.test(email);
};
