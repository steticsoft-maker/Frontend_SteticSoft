// src/features/auth/hooks/useRateLimit.js
import { useState, useEffect, useCallback } from "react";

/**
 * Hook para implementar rate limiting en el frontend
 * Previene ataques de fuerza bruta limitando intentos por tiempo
 */
export const useRateLimit = (maxAttempts = 5, timeWindow = 300000) => {
  // 5 intentos en 5 minutos
  const [attempts, setAttempts] = useState(() => {
    // Cargar intentos previos del localStorage
    const stored = localStorage.getItem("authAttempts");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [isBlocked, setIsBlocked] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Guardar intentos en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem("authAttempts", JSON.stringify(attempts));
  }, [attempts]);

  // Verificar si el usuario está bloqueado
  useEffect(() => {
    const now = Date.now();
    const recentAttempts = attempts.filter((time) => now - time < timeWindow);

    if (recentAttempts.length >= maxAttempts) {
      setIsBlocked(true);

      // Calcular tiempo restante hasta que expire el bloqueo
      const oldestAttempt = Math.min(...recentAttempts);
      const blockExpiry = oldestAttempt + timeWindow;
      const remaining = blockExpiry - now;

      if (remaining > 0) {
        setTimeRemaining(remaining);

        // Actualizar el tiempo restante cada segundo
        const interval = setInterval(() => {
          const newRemaining = blockExpiry - Date.now();
          if (newRemaining <= 0) {
            setIsBlocked(false);
            setTimeRemaining(0);
            clearInterval(interval);
          } else {
            setTimeRemaining(newRemaining);
          }
        }, 1000);

        return () => clearInterval(interval);
      }
    } else {
      setIsBlocked(false);
      setTimeRemaining(0);
    }
  }, [attempts, maxAttempts, timeWindow]);

  /**
   * Registra un nuevo intento
   */
  const recordAttempt = useCallback(() => {
    const now = Date.now();
    setAttempts((prev) => [...prev, now]);
  }, []);

  /**
   * Verifica si se puede realizar un intento
   */
  const canAttempt = useCallback(() => {
    const now = Date.now();
    const recentAttempts = attempts.filter((time) => now - time < timeWindow);
    return recentAttempts.length < maxAttempts;
  }, [attempts, maxAttempts, timeWindow]);

  /**
   * Limpia todos los intentos (útil para logout exitoso)
   */
  const clearAttempts = useCallback(() => {
    setAttempts([]);
    localStorage.removeItem("authAttempts");
  }, []);

  /**
   * Obtiene el número de intentos restantes
   */
  const getRemainingAttempts = useCallback(() => {
    const now = Date.now();
    const recentAttempts = attempts.filter((time) => now - time < timeWindow);
    return Math.max(0, maxAttempts - recentAttempts.length);
  }, [attempts, maxAttempts, timeWindow]);

  /**
   * Formatea el tiempo restante en formato legible
   */
  const getFormattedTimeRemaining = useCallback(() => {
    if (timeRemaining <= 0) return "";

    const minutes = Math.floor(timeRemaining / 60000);
    const seconds = Math.floor((timeRemaining % 60000) / 1000);

    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  }, [timeRemaining]);

  return {
    isBlocked,
    timeRemaining: getFormattedTimeRemaining(),
    canAttempt,
    recordAttempt,
    clearAttempts,
    remainingAttempts: getRemainingAttempts(),
    totalAttempts: attempts.length,
  };
};

export default useRateLimit;
