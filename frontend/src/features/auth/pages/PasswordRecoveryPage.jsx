// src/features/auth/pages/PasswordRecoveryPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import PasswordRecoveryForm from "../components/PasswordRecoveryForm";
import * as authService from "../services/authService";
import ThemeToggle from "../../../shared/components/common/ThemeToggle";
import "../css/Auth.css";

function PasswordRecoveryPage() {
  const [view, setView] = useState("request"); // 'request', 'verify', 'reset'
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValidated, setIsTokenValidated] = useState(false);
  const [tokenValidationError, setTokenValidationError] = useState("");
  const navigate = useNavigate();

  // Resetear estado de validación del token cuando cambia la vista
  useEffect(() => {
    if (view === "verify") {
      setIsTokenValidated(false);
      setTokenValidationError("");
    } else if (view === "reset") {
      setIsTokenValidated(true);
      setTokenValidationError("");
    }
  }, [view]);

  const handleRequestSubmit = async (formData) => {
    setIsLoading(true);
    setError("");
    try {
      await authService.solicitarRecuperacionAPI(formData.email);
      setEmail(formData.email);
      setView("verify");
      Swal.fire({
        title: "¡Revisa tu correo!",
        text: "Hemos enviado un código de 6 dígitos a tu correo electrónico.",
        icon: "success",
        confirmButtonText: "Entendido",
      });
    } catch (err) {
      setError(err.message || "Ocurrió un error al solicitar la recuperación.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySubmit = async (formData) => {
    setIsLoading(true);
    setError("");
    setTokenValidationError("");
    setIsTokenValidated(false);

    console.log("🚀 Iniciando verificación de token");
    console.log("📝 Datos del formulario:", formData);
    console.log("🔑 Token a verificar:", formData.token);
    console.log("📧 Email asociado:", email);

    try {
      await authService.verificarTokenAPI(formData.token);
      setToken(formData.token);
      setIsTokenValidated(true);
      setTokenValidationError("");
      setView("reset");
      Swal.fire({
        title: "¡Token verificado!",
        text: "Ahora puedes ingresar tu nueva contraseña.",
        icon: "success",
        confirmButtonText: "Continuar",
      });
    } catch (err) {
      console.error("Error verificando token:", err);
      setIsTokenValidated(false);

      if (err.status === 500) {
        setTokenValidationError(
          "Error del servidor. Por favor, intenta nuevamente más tarde."
        );
      } else if (err.status === 404) {
        setTokenValidationError(
          "Token no encontrado. Verifica que el token sea correcto."
        );
      } else if (err.status === 400) {
        setTokenValidationError("Token inválido o malformado.");
      } else {
        setTokenValidationError(
          err.message || "El token es inválido o ha expirado."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (formData) => {
    setIsLoading(true);
    setError("");
    try {
      await authService.resetearContrasenaAPI({
        correo: email,
        token: token,
        nuevaContrasena: formData.nuevaContrasena,
        confirmarNuevaContrasena: formData.confirmarNuevaContrasena,
      });
      Swal.fire({
        title: "¡Contraseña actualizada!",
        text: "Tu contraseña ha sido actualizada exitosamente.",
        icon: "success",
        confirmButtonText: "Ir a Iniciar Sesión",
      }).then(() => {
        navigate("/login");
      });
    } catch (err) {
      const errorMessages = err.errors
        ? Object.values(err.errors)
            .map((e) => e.msg)
            .join(" ")
        : err.message || "Ocurrió un error al restablecer la contraseña.";
      setError(errorMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = () => {
    switch (view) {
      case "request":
        return "Recuperar Contraseña";
      case "verify":
        return "Verificar Código";
      case "reset":
        return "Restablecer Contraseña";
      default:
        return "Recuperar Contraseña";
    }
  };

  // Función de depuración temporal
  const debugTokenValidation = async () => {
    console.log("🔧 Iniciando depuración de validación de tokens...");

    const testTokens = ["958914", "123456", "390577"];

    for (const token of testTokens) {
      console.log(`\n🧪 Probando token: ${token}`);
      console.log(`📏 Longitud: ${token.length}`);
      console.log(`🔢 Solo números: ${/^\d+$/.test(token)}`);

      try {
        const result = await authService.verificarTokenAPI(token);
        console.log(`✅ Token ${token} VÁLIDO:`, result);
      } catch (error) {
        console.log(`❌ Token ${token} INVÁLIDO:`, error);
      }
    }
  };

  const handleSubmit = (formData) => {
    if (view === "request") {
      handleRequestSubmit(formData);
    } else if (view === "verify") {
      handleVerifySubmit(formData);
    } else {
      handleResetSubmit(formData);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-form-box">
        <img
          src="/la-fuente-logo.png"
          alt="La Fuente del Peluquero Logo"
          className="auth-form-logo"
        />
        <h2 className="auth-form-title">{getTitle()}</h2>
        <div className="auth-theme-toggle-container">
          <ThemeToggle />
          {import.meta.env.DEV && view === "verify" && (
            <button
              type="button"
              onClick={debugTokenValidation}
              style={{
                marginLeft: "10px",
                padding: "5px 10px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              🔧 Debug Tokens
            </button>
          )}
        </div>
        <PasswordRecoveryForm
          view={view}
          onSubmit={handleSubmit}
          error={error}
          isLoading={isLoading}
          email={email}
          tokenValidationError={tokenValidationError}
          isTokenValidated={isTokenValidated}
        />
      </div>
    </div>
  );
}

export default PasswordRecoveryPage;
