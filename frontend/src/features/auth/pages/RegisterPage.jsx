// src/features/auth/pages/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";
import { registerUser } from "../services/authService";
import "../css/Auth.css";

function RegisterPage() {
  const navigate = useNavigate();
  const [errorApi, setErrorApi] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleRegisterSubmit = async (userData) => {
    setErrorApi("");
    setSuccessMessage("");
    try {
      const response = await registerUser(userData);
      if (response.success) {
        setSuccessMessage(
          response.message + " Redirigiendo a Iniciar Sesión..."
        );
        // alert(response.message); // Manteniendo alerta por ahora
        setTimeout(() => {
          navigate("/login");
        }, 2000); // Espera 2 segundos antes de redirigir
      } else {
        setErrorApi(response.message || "Error en el registro.");
        // alert(response.message || "Error en el registro.");
      }
    } catch (err) {
      setErrorApi("Ocurrió un error de conexión. Inténtalo de nuevo.");
      // alert('Ocurrió un error de conexión. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-form-box">
        <img src="/logo.png" alt="SteticSoft Logo" className="auth-form-logo" />
        <h2 className="auth-form-title">Registro</h2>
        <RegisterForm
          onSubmit={handleRegisterSubmit}
          error={errorApi}
          successMessage={successMessage}
        />
        <div className="auth-form-actions">
          <button
            className="auth-secondary-button"
            onClick={() => navigate("/login")}
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
