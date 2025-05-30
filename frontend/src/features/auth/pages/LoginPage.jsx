// src/features/auth/pages/LoginPage.jsx
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { AuthContext } from "../../../shared/contexts/AuthContext";
import { loginUser } from "../services/authService";
import "../css/Auth.css"; // Importa los estilos CSS

function LoginPage() {
  const navigate = useNavigate();
  const { login: loginContext } = useContext(AuthContext); // Renombrar 'login' del contexto para evitar colisión
  const [errorApi, setErrorApi] = useState("");

  const handleLoginSubmit = async (credentials) => {
    setErrorApi("");
    try {
      const response = await loginUser(credentials);

      if (response.success) {
        loginContext({
          token: response.token,
          role: response.role,
          name: response.name,
        }); // Llama a la función login del AuthContext
        if (response.role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      } else {
        setErrorApi(response.message || "Error de autenticación.");
        // alert(response.message || "Error de autenticación."); // Manteniendo la alerta por ahora
      }
    } catch (err) {
      setErrorApi("Ocurrió un error de conexión. Inténtalo de nuevo.");
      // alert('Ocurrió un error de conexión. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="auth-page-container">
      {" "}
      {/* Contenedor de página */}
      <div className="auth-form-box">
        <img src="/logo.png" alt="SteticSoft Logo" className="auth-form-logo" />{" "}
        {/* Asegúrate que logo.png esté en public/ */}
        <h2 className="auth-form-title">Iniciar Sesión</h2>
        <LoginForm onSubmit={handleLoginSubmit} error={errorApi} />
        <div className="auth-form-actions">
          <button
            className="auth-secondary-button"
            onClick={() => navigate("/")}
          >
            Regresar
          </button>
          <Link to="/register" className="auth-secondary-button">
            {" "}
            {/* Usar Link para navegación semántica */}
            Registrarse
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
