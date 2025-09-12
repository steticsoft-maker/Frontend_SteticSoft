// src/features/auth/pages/ResetPasswordPage.jsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ResetPasswordForm from "../components/ResetPasswordForm";
import authService from "../services/authService";
import "../css/Auth.css";
import Stetic2 from "/Stetic2.svg";

function ResetPasswordPage() {
  const { token } = useParams();
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (passwords) => {
    setIsLoading(true);
    setError("");
    setSuccessMessage("");
    try {
      const response = await authService.resetearContrasenaAPI(
        token,
        passwords.newPassword,
        passwords.confirmPassword
      );
      setSuccessMessage(response.message);
    } catch (err) {
      setError(err.message || "Ocurrió un error al restablecer la contraseña.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-form-box">
        <img src={Stetic2} alt="Logo" className="auth-form-logo" />
        <h2 className="auth-form-title">Restablecer Contraseña</h2>
        <ResetPasswordForm
          onSubmit={handleSubmit}
          error={error}
          successMessage={successMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default ResetPasswordPage;
