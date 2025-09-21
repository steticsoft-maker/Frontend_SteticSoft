// src/features/auth/hooks/useAuthNotifications.js
import { useState, useCallback } from "react";

/**
 * Hook para manejo de notificaciones en el sistema de autenticación
 * Centraliza el manejo de mensajes de éxito, error, advertencia e información
 */
export const useAuthNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  /**
   * Añade una nueva notificación
   * @param {object} notification - Objeto de notificación
   */
  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: "info",
      duration: 5000,
      persistent: false,
      ...notification,
    };

    setNotifications((prev) => [...prev, newNotification]);

    // Si no es persistente, programar eliminación automática
    if (!newNotification.persistent && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, []);

  /**
   * Elimina una notificación por ID
   * @param {string|number} id - ID de la notificación
   */
  const removeNotification = useCallback((id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  /**
   * Limpia todas las notificaciones
   */
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  /**
   * Métodos específicos para diferentes tipos de notificaciones
   */
  const showSuccess = useCallback(
    (title, message, options = {}) => {
      return addNotification({
        type: "success",
        title,
        message,
        ...options,
      });
    },
    [addNotification]
  );

  const showError = useCallback(
    (title, message, options = {}) => {
      return addNotification({
        type: "error",
        title,
        message,
        duration: 7000, // Errores se muestran más tiempo
        ...options,
      });
    },
    [addNotification]
  );

  const showWarning = useCallback(
    (title, message, options = {}) => {
      return addNotification({
        type: "warning",
        title,
        message,
        duration: 6000,
        ...options,
      });
    },
    [addNotification]
  );

  const showInfo = useCallback(
    (title, message, options = {}) => {
      return addNotification({
        type: "info",
        title,
        message,
        ...options,
      });
    },
    [addNotification]
  );

  /**
   * Métodos específicos para casos de uso comunes en autenticación
   */
  const authNotifications = {
    // Login
    loginSuccess: (userRole) => {
      return showSuccess(
        "Inicio de sesión exitoso",
        `Bienvenido${userRole ? ` como ${userRole}` : ""}`,
        { duration: 3000 }
      );
    },

    loginError: (error) => {
      return showError(
        "Error de inicio de sesión",
        error || "Credenciales inválidas. Verifica tu correo y contraseña.",
        { persistent: false }
      );
    },

    // Registro
    registerSuccess: () => {
      return showSuccess(
        "Registro exitoso",
        "Tu cuenta ha sido creada correctamente. Iniciando sesión...",
        { duration: 4000 }
      );
    },

    registerError: (error) => {
      return showError(
        "Error en el registro",
        error || "No se pudo crear la cuenta. Inténtalo de nuevo.",
        { persistent: false }
      );
    },

    // Recuperación de contraseña
    passwordRecoverySent: (email) => {
      return showInfo(
        "Código enviado",
        `Hemos enviado un código de 6 dígitos a ${email}`,
        { duration: 6000 }
      );
    },

    passwordRecoveryError: (error) => {
      return showError(
        "Error en recuperación",
        error || "No se pudo enviar el código. Verifica tu correo.",
        { persistent: false }
      );
    },

    passwordResetSuccess: () => {
      return showSuccess(
        "Contraseña actualizada",
        "Tu contraseña ha sido restablecida exitosamente.",
        { duration: 4000 }
      );
    },

    // Rate limiting
    rateLimitWarning: (timeRemaining) => {
      return showWarning(
        "Demasiados intentos",
        `Espera ${timeRemaining} antes de intentar nuevamente.`,
        { persistent: true }
      );
    },

    rateLimitBlocked: (timeRemaining) => {
      return showError(
        "Acceso bloqueado",
        `Has excedido el límite de intentos. Espera ${timeRemaining} para continuar.`,
        { persistent: true }
      );
    },

    // Validación
    validationErrors: (errorCount) => {
      return showWarning(
        "Errores de validación",
        `Por favor corrige los ${errorCount} errores en el formulario.`,
        { duration: 5000 }
      );
    },

    // Token expirado
    tokenExpired: () => {
      return showWarning(
        "Sesión expirada",
        "Tu sesión ha expirado. Por favor inicia sesión nuevamente.",
        { persistent: false }
      );
    },

    // Logout
    logoutSuccess: () => {
      return showInfo("Sesión cerrada", "Has cerrado sesión exitosamente.", {
        duration: 3000,
      });
    },
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    auth: authNotifications,
  };
};

export default useAuthNotifications;
