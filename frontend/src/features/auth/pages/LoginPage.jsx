// src/features/auth/pages/LoginPage.jsx
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { AuthContext } from "../../../shared/contexts/AuthContext";
// Ya no necesitas importar loginUser de authService aquí, se maneja en el AuthContext
import "../css/Auth.css";

function LoginPage() {
  const navigate = useNavigate();
  const { login: loginContext, isLoading: authIsLoading } = useContext(AuthContext); // Obtener login y isLoading del contexto
  const [errorApi, setErrorApi] = useState("");
  // Puedes usar un estado de carga local si prefieres, o el global del AuthContext
  // const [isSubmitting, setIsSubmitting] = useState(false);


  const handleLoginSubmit = async (credentials) => {
    setErrorApi("");
    // setIsSubmitting(true); // Si usas un loader local
    console.log("[LoginPage.jsx] Enviando credenciales para login:", credentials);

    try {
      // loginContext ahora es una función async que interactúa con la API
      const response = await loginContext(credentials);
      console.log("[LoginPage.jsx] Respuesta de loginContext:", response);

      if (response.success) {
        console.log("[LoginPage.jsx] Login exitoso, rol:", response.role);
        // La redirección basada en el rol (el nombre del rol viene en response.role)
        if (response.role === "Administrador") { // Asegúrate que "Administrador" coincide con el nombre del rol en tu BD
          navigate("/admin/dashboard"); // O la ruta de tu dashboard de admin
        } else if (response.role === "Cliente") {
            navigate("/"); // O a la página de perfil del cliente
        } else if (response.role === "Empleado") {
            navigate('/empleado/dashboard');
        }
        else {
          navigate("/"); // Redirección por defecto si el rol no coincide o es otro
        }
      } else {
        // Este 'else' podría no ser necesario si AuthContext siempre lanza un error en caso de fallo.
        // Pero por si acaso la promesa se resuelve sin 'success: true' pero sin lanzar error:
        const message = response.message || "Error de autenticación desconocido.";
        console.error("[LoginPage.jsx] Login no exitoso (sin error lanzado):", message);
        setErrorApi(message);
      }
    } catch (err) {
      // err.message debería contener el mensaje de error propagado desde AuthContext/authService
      const errorMessage = err.message || "Ocurrió un error de conexión o autenticación. Inténtalo de nuevo.";
      console.error("[LoginPage.jsx] Error capturado al intentar login:", err);
      setErrorApi(errorMessage);
    } finally {
      // setIsSubmitting(false); // Si usas un loader local
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-form-box">
        <img src="/logo.png" alt="SteticSoft Logo" className="auth-form-logo" />
        <h2 className="auth-form-title">Iniciar Sesión</h2>
        {/* Pasa el estado de carga al LoginForm si maneja un spinner */}
        <LoginForm onSubmit={handleLoginSubmit} error={errorApi} isLoading={authIsLoading} />
        <div className="auth-form-actions">
          <button
            className="auth-secondary-button"
            onClick={() => navigate("/")}
            disabled={authIsLoading} // Deshabilitar botones durante la carga
          >
            Regresar
          </button>
          <Link to="/register" className={`auth-secondary-button ${authIsLoading ? 'disabled-link' : ''}`}>
            Registrarse
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;