// src/features/auth/pages/PasswordRecoveryPage.jsx
import React, { useState } from "react";
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
  const navigate = useNavigate();

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
    try {
      await authService.verificarTokenAPI(formData.token);
      setToken(formData.token);
      setView("reset");
      Swal.fire({
        title: "¡Token verificado!",
        text: "Ahora puedes ingresar tu nueva contraseña.",
        icon: "success",
        confirmButtonText: "Continuar",
      });
    } catch (err) {
      console.error("Error verificando token:", err);
      if (err.status === 500) {
        setError(
          "Error del servidor. Por favor, intenta nuevamente más tarde."
        );
      } else if (err.status === 404) {
        setError("Token no encontrado. Verifica que el token sea correcto.");
      } else if (err.status === 400) {
        setError("Token inválido o malformado.");
      } else {
        setError(err.message || "El token es inválido o ha expirado.");
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
        </div>
        <PasswordRecoveryForm
          view={view}
          onSubmit={handleSubmit}
          error={error}
          isLoading={isLoading}
          email={email}
        />
      </div>
    </div>
  );
}

export default PasswordRecoveryPage;
