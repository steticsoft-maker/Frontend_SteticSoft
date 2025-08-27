// src/features/auth/pages/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";
import { useAuth } from "../../../shared/contexts/authHooks";
import { registerAPI } from "../services/authService";
import "../css/Auth.css";

function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // INICIO DE MODIFICACIÓN: Cambiar el estado de error a un objeto para errores de campo.
  const [errors, setErrors] = useState({});
  // FIN DE MODIFICACIÓN

  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegisterSubmit = async (userData) => {
    // INICIO DE MODIFICACIÓN: Limpiar el objeto de errores.
    setErrors({});
    // FIN DE MODIFICACIÓN
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const response = await registerAPI(userData);

      if (response.success) {
        setSuccessMessage("¡Registro exitoso! Iniciando sesión...");
        await login({ correo: userData.correo, contrasena: userData.contrasena }, false);
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (err) {
      // INICIO DE MODIFICACIÓN: Procesar errores de validación del backend.
      if (err.response && err.response.data && Array.isArray(err.response.data.errors)) {
        const backendErrors = err.response.data.errors.reduce((acc, error) => {
          // El backend puede devolver 'param' o 'path' para el nombre del campo
          const fieldName = error.param || error.path;
          acc[fieldName] = error.msg;
          return acc;
        }, {});
        setErrors(backendErrors);
      } else {
        // Error genérico si la respuesta no tiene el formato esperado
        setErrors({ general: err.message || "Ocurrió un error de conexión o registro. Inténtalo de nuevo." });
      }
      // FIN DE MODIFICACIÓN
    } finally {
      // Solo detener la carga si hubo un error. En caso de éxito, la página redirigirá.
      // Se usa un timeout para que el usuario pueda ver el mensaje de error antes de que se reactive el botón.
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1000);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-form-box">
        <img src="/logo.png" alt="SteticSoft Logo" className="auth-form-logo" />
        <h2 className="auth-form-title">Crear Cuenta</h2>
        {/* INICIO DE MODIFICACIÓN: Pasar el objeto de errores al formulario. */}
        <RegisterForm
          onSubmit={handleRegisterSubmit}
          errors={errors} // Se pasa el objeto de errores
          successMessage={successMessage}
          isLoading={isSubmitting}
        />
        {/* FIN DE MODIFICACIÓN */}
        <div className="auth-form-actions">
          <button
            className="auth-secondary-button"
            onClick={() => navigate("/login")}
            disabled={isSubmitting}
          >
            ¿Ya tienes cuenta? Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;