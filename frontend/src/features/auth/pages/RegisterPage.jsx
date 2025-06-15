// src/features/auth/pages/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";
import { useAuth } from "../../../shared/contexts/authHooks"; // Path updated
import { registerAPI } from "../services/authService";
import "../css/Auth.css";

function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth(); // Obtenemos la función login para usarla después del registro
  const [errorApi, setErrorApi] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegisterSubmit = async (userData) => {
    setErrorApi("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const response = await registerAPI(userData);

      if (response.success) {
        setSuccessMessage("¡Registro exitoso! Iniciando sesión...");
        
        // Opcional: Iniciar sesión automáticamente después del registro exitoso
        await login({ email: userData.correo, password: userData.contrasena }, false);

        // Espera un momento para que el usuario vea el mensaje y luego redirige
        setTimeout(() => {
          navigate("/"); // Redirigir a la página principal
        }, 1500);
      }
    } catch (err) {
      const errorMessage = err.message || "Ocurrió un error de conexión o registro. Inténtalo de nuevo.";
      setErrorApi(errorMessage);
    } finally {
      // No cambiar isSubmitting a false inmediatamente si hay éxito,
      // para mantener el botón deshabilitado hasta la redirección.
      if (errorApi) {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-form-box">
        <img src="/logo.png" alt="SteticSoft Logo" className="auth-form-logo" />
        <h2 className="auth-form-title">Crear Cuenta</h2>
        <RegisterForm
          onSubmit={handleRegisterSubmit}
          error={errorApi}
          successMessage={successMessage}
          isLoading={isSubmitting}
        />
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