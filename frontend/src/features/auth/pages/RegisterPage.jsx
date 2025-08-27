// src/features/auth/pages/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";
import { useAuth } from "../../../shared/contexts/authHooks"; // Path updated
import { registerAPI } from "../services/authService";
import "../css/Auth.css";

function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegisterSubmit = async (userData) => {
    setErrors({});
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const response = await registerAPI(userData);

      if (response.success) {
        setSuccessMessage("¡Registro exitoso! Iniciando sesión...");
        await login({ email: userData.correo, password: userData.contrasena }, false);
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (err) {
      if (err.response && (err.response.status === 400 || err.response.status === 422) && err.response.data.errors) {
        const backendErrors = err.response.data.errors;
        const newErrors = {};
        backendErrors.forEach(error => {
          newErrors[error.param] = error.msg;
        });
        setErrors(newErrors);
      } else {
        setErrors({ general: err.message || "Ocurrió un error de conexión o registro. Inténtalo de nuevo." });
      }
      setIsSubmitting(false);
    }
    // No establecer isSubmitting a false aquí en caso de éxito, para que el botón permanezca deshabilitado.
  };

  return (
    <div className="auth-page-container">
      <div className="auth-form-box">
        <img src="/logo.png" alt="SteticSoft Logo" className="auth-form-logo" />
        <h2 className="auth-form-title">Crear Cuenta</h2>
        <RegisterForm
          onSubmit={handleRegisterSubmit}
          errors={errors}
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