// src/features/auth/pages/RegisterPage.jsx
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";
import { AuthContext } from "../../../shared/contexts/AuthContext"; // Si necesitas algo del contexto
import { registerAPI } from "../services/authService"; // <--- CAMBIO AQUÍ: de registerUser a registerAPI
import "../css/Auth.css";

function RegisterPage() {
  const navigate = useNavigate();
  // const { algunaFuncionDelContextoSiLaNecesitas } = useContext(AuthContext); // Descomenta si usas el contexto
  const [errorApi, setErrorApi] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegisterSubmit = async (userData) => {
    setErrorApi("");
    setSuccessMessage("");
    setIsSubmitting(true);
    console.log("[RegisterPage.jsx] Enviando datos para registro:", userData);

    try {
      // Llamar a la función correcta del servicio
      const response = await registerAPI(userData); // <--- CAMBIO AQUÍ: de registerUser a registerAPI
      console.log("[RegisterPage.jsx] Respuesta de registerAPI:", response);

      if (response.success) {
        setSuccessMessage(response.message || "¡Registro exitoso! Ahora puedes iniciar sesión.");
        // Opcionalmente, redirigir a login después de un breve delay o directamente
        // setTimeout(() => {
        //   navigate("/login");
        // }, 2000); // Espera 2 segundos antes de redirigir
      } else {
        setErrorApi(response.message || "Error en el registro.");
      }
    } catch (err) {
      // err.message debería contener el mensaje de error propagado desde authService
      const errorMessage = err.message || "Ocurrió un error de conexión o registro. Inténtalo de nuevo.";
      console.error("[RegisterPage.jsx] Error capturado al intentar registrar:", err);
      setErrorApi(errorMessage);
    } finally {
      setIsSubmitting(false);
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
          successMessage={successMessage} // Pasa el mensaje de éxito al formulario si lo muestra
          isLoading={isSubmitting}
        />
        {/* Mostrar mensajes de éxito/error directamente en la página si no están en el formulario */}
        {/* {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        {errorApi && !successMessage && <p style={{ color: 'red' }}>{errorApi}</p>} */}
        <div className="auth-form-actions">
          <button
            className="auth-secondary-button"
            onClick={() => navigate("/login")}
            disabled={isSubmitting}
          >
            ¿Ya tienes cuenta? Iniciar Sesión
          </button>
          <button
            className="auth-secondary-button"
            onClick={() => navigate("/")} // O a donde quieras que vaya "Regresar"
            disabled={isSubmitting}
          >
            Regresar
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;