// INICIO DE MODIFICACIÓN
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";
import { useAuth } from "../../../shared/contexts/authHooks";
import { registerAPI } from "../services/authService";
import "../css/Auth.css";

function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegisterSubmit = async (userData) => {
    setErrors({});
    setSuccessMessage("");
    setLoading(true);

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
      if (err.response && err.response.status === 400) {
        const backendErrors = err.response.data.errors.reduce((acc, error) => {
          acc[error.param] = error.msg;
          return acc;
        }, {});
        setErrors(backendErrors);
      } else {
        setErrors({ general: err.message || "Ocurrió un error de conexión o registro. Inténtalo de nuevo." });
      }
    } finally {
      // Solo detenemos la carga si hubo un error. En caso de éxito,
      // el botón permanecerá deshabilitado hasta la redirección.
      if (Object.keys(errors).length > 0 || (err && (!err.response || err.response.status !== 400))) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-form-box">
        <img src="/logo.png" alt="SteticSoft Logo" className="auth-form-logo" />
        <h2 className="auth-form-title">Crear Cuenta</h2>
        <RegisterForm
          onSubmit={handleRegisterSubmit}
          errors={errors}
          setErrors={setErrors}
          successMessage={successMessage}
          loading={loading}
        />
        <div className="auth-form-actions">
          <button
            className="auth-secondary-button"
            onClick={() => navigate("/login")}
            disabled={loading}
          >
            ¿Ya tienes cuenta? Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}
// FIN DE MODIFICACIÓN

export default RegisterPage;