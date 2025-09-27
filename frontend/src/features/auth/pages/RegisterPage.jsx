// src/features/auth/pages/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";
import RequirementsChecklist from "../components/RequirementsChecklist";
import { useAuth } from "../../../shared/contexts/authHooks"; // Path updated
import { registerAPI } from "../services/authService";
import ThemeToggle from "../../../shared/components/common/ThemeToggle";
import "../css/Auth.css";

function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth(); // Obtenemos la función login para usarla después del registro
  const [errorApi, setErrorApi] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});

  const handleRegisterSubmit = async (userData) => {
    setErrorApi("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const response = await registerAPI(userData);

      if (response.success) {
        setSuccessMessage("¡Registro exitoso! Iniciando sesión...");

        // Opcional: Iniciar sesión automáticamente después del registro exitoso
        await login(
          { email: userData.correo, password: userData.contrasena },
          false
        );

        // Espera un momento para que el usuario vea el mensaje y luego redirige
        setTimeout(() => {
          navigate("/"); // Redirigir a la página principal
        }, 1500);
      }
    } catch (err) {
      console.error("Error en registro:", err);

      // Manejar errores de validación del backend
      if (err.errors && typeof err.errors === "object") {
        // Si hay errores específicos por campo, mostrarlos
        const errorMessages = Object.values(err.errors).flat();
        setErrorApi(errorMessages.join(", "));

        // También actualizar los errores de campo específicos
        const fieldErrors = {};
        Object.keys(err.errors).forEach((field) => {
          fieldErrors[field] = err.errors[field][0]; // Tomar el primer error de cada campo
        });
        setFieldErrors(fieldErrors);
      } else {
        // Error general
        const errorMessage =
          err.message ||
          "Ocurrió un error de conexión o registro. Inténtalo de nuevo.";
        setErrorApi(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-register-container">
        <div className="auth-form-box">
          <img
            src="/la-fuente-logo.png"
            alt="La Fuente del Peluquero Logo"
            className="auth-form-logo"
          />
          <h2 className="auth-form-title">Crear Cuenta</h2>
          <div className="auth-theme-toggle-container">
            <ThemeToggle />
          </div>
          <RegisterForm
            onSubmit={handleRegisterSubmit}
            error={errorApi}
            successMessage={successMessage}
            isLoading={isSubmitting}
            onFormDataChange={setFormData}
            onFieldErrorsChange={setFieldErrors}
          />
          <div className="auth-form-links">
            <button
              className="auth-form-link"
              onClick={() => navigate("/login")}
              disabled={isSubmitting}
              style={{ background: "none", border: "none", padding: 0 }}
            >
              ¿Ya tienes cuenta? Iniciar Sesión
            </button>
          </div>
        </div>
        <RequirementsChecklist formData={formData} fieldErrors={fieldErrors} />
      </div>
    </div>
  );
}

export default RegisterPage;
