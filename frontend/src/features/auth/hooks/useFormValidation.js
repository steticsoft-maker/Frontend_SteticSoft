// src/features/auth/hooks/useFormValidation.js
import { useState, useCallback } from "react";
import {
  validateField,
  validateForm,
  VALIDATION_SCHEMAS,
} from "../utils/validationSchemas";

/**
 * Hook para manejo de validación de formularios de autenticación
 * Proporciona validación en tiempo real y validación completa
 */
export const useFormValidation = (schemaName) => {
  const [fieldErrors, setFieldErrors] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [isValidating, setIsValidating] = useState(false);

  /**
   * Valida un campo individual en tiempo real
   * @param {string} fieldName - Nombre del campo
   * @param {any} value - Valor del campo
   * @param {object} formData - Datos completos del formulario
   */
  const validateFieldRealTime = useCallback(
    (fieldName, value, formData = {}) => {
      const schema = VALIDATION_SCHEMAS[schemaName];
      if (!schema || !schema[fieldName]) return;

      const fieldRules = { ...schema[fieldName], fieldName };
      const error = validateField(value, fieldRules, formData);

      setFieldErrors((prev) => ({
        ...prev,
        [fieldName]: error,
      }));

      return error;
    },
    [schemaName]
  );

  /**
   * Valida todo el formulario
   * @param {object} formData - Datos del formulario
   */
  const validateFullForm = useCallback(
    (formData) => {
      setIsValidating(true);

      try {
        const result = validateForm(formData, schemaName);
        setFormErrors(result.errors);

        // Actualizar errores de campos también
        setFieldErrors(result.errors);

        return result;
      } catch (error) {
        console.error("Error validating form:", error);
        return { isValid: false, errors: { general: "Error de validación" } };
      } finally {
        setIsValidating(false);
      }
    },
    [schemaName]
  );

  /**
   * Limpia errores de un campo específico
   * @param {string} fieldName - Nombre del campo
   */
  const clearFieldError = useCallback((fieldName) => {
    setFieldErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  /**
   * Limpia todos los errores
   */
  const clearAllErrors = useCallback(() => {
    setFieldErrors({});
    setFormErrors({});
  }, []);

  /**
   * Obtiene el error de un campo específico
   * @param {string} fieldName - Nombre del campo
   * @returns {string|null} - Error del campo o null
   */
  const getFieldError = useCallback(
    (fieldName) => {
      return fieldErrors[fieldName] || null;
    },
    [fieldErrors]
  );

  /**
   * Verifica si un campo tiene error
   * @param {string} fieldName - Nombre del campo
   * @returns {boolean} - True si tiene error
   */
  const hasFieldError = useCallback(
    (fieldName) => {
      return Boolean(fieldErrors[fieldName]);
    },
    [fieldErrors]
  );

  /**
   * Verifica si el formulario tiene errores
   * @returns {boolean} - True si tiene errores
   */
  const hasFormErrors = useCallback(() => {
    return (
      Object.keys(fieldErrors).length > 0 || Object.keys(formErrors).length > 0
    );
  }, [fieldErrors, formErrors]);

  /**
   * Obtiene todos los errores como un objeto
   * @returns {object} - Objeto con todos los errores
   */
  const getAllErrors = useCallback(() => {
    return {
      fieldErrors,
      formErrors,
      hasErrors: hasFormErrors(),
    };
  }, [fieldErrors, formErrors, hasFormErrors]);

  /**
   * Valida múltiples campos a la vez
   * @param {object} fieldsToValidate - Objeto con { fieldName: value }
   * @param {object} formData - Datos completos del formulario
   */
  const validateMultipleFields = useCallback(
    (fieldsToValidate, formData = {}) => {
      const errors = {};

      Object.entries(fieldsToValidate).forEach(([fieldName, value]) => {
        const error = validateFieldRealTime(fieldName, value, formData);
        if (error) {
          errors[fieldName] = error;
        }
      });

      setFieldErrors((prev) => ({ ...prev, ...errors }));
      return errors;
    },
    [validateFieldRealTime]
  );

  return {
    // Estado
    fieldErrors,
    formErrors,
    isValidating,

    // Métodos de validación
    validateFieldRealTime,
    validateFullForm,
    validateMultipleFields,

    // Métodos de limpieza
    clearFieldError,
    clearAllErrors,

    // Métodos de consulta
    getFieldError,
    hasFieldError,
    hasFormErrors,
    getAllErrors,
  };
};

export default useFormValidation;
