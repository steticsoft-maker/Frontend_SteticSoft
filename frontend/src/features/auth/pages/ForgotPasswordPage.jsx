// src/features/auth/pages/ForgotPasswordPage.jsx
import React, { useState }from "react";
import ForgotPasswordForm from "../components/ForgotPasswordForm";
import authService from "../services/authService";
import "../css/Auth.css";
import Stetic2 from "/Stetic2.svg";

function ForgotPasswordPage() {
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (email) => {
    setIsLoading(true);
    setError("");
    setSuccessMessage("");
    try {
      const response = await authService.solicitarRecuperacionAPI(email);
      setSuccessMessage(response.message);
    } catch (err) {
      setError(err.message || "Ocurrió un error al solicitar la recuperación.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-form-box">
        <img src={Stetic2} alt="Logo" className="auth-form-logo" />
        <h2 className="auth-form-title">Recuperar Contraseña</h2>
        <ForgotPasswordForm
          onSubmit={handleSubmit}
          error={error}
          successMessage={successMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
