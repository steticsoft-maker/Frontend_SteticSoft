import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Form.css";

function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false); // Estado para el checkbox
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!credentials.email || !credentials.password) {
      alert("Por favor, completa todos los campos.");
      return;
    }
    if (!isCheckboxChecked) {
      alert("Recordar usuario");
      return;
    }

    const admin = {
      email: "admin@gmail.com",
      password: "admin123",
      token: "admin-token",
    };

    if (
      credentials.email === admin.email &&
      credentials.password === admin.password
    ) {
      localStorage.setItem("authToken", admin.token);
      localStorage.setItem("userRole", "admin");
      navigate("/dashboard");
    } else {
      localStorage.setItem("authToken", "user-token");
      localStorage.setItem("userRole", "client");
      alert("Has iniciado sesión como cliente.");
      navigate("/");
    }
  };

  return (
    <div className="form-container">
      <div className="form-box">
        <h2 className="form-title">Iniciar Sesión</h2>
        <form className="form-content" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={credentials.email}
            onChange={(e) =>
              setCredentials({ ...credentials, email: e.target.value })
            }
            className="form-input"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            className="form-input"
          />
          <div className="form-checkbox">
            <input
              type="checkbox"
              id="sql-check"
              checked={isCheckboxChecked}
              onChange={(e) => setIsCheckboxChecked(e.target.checked)}
            />
            <label htmlFor="sql-check">
              Confirmo que no estoy ingresando datos maliciosos o scripts.
            </label>
          </div>
          <button type="submit" className="primary-button">
            Entrar
          </button>
        </form>
        <div className="form-actions">
          <button className="secondary-button" onClick={() => navigate("/")}>
            Regresar
          </button>
          <button
            className="secondary-button"
            onClick={() => navigate("/register")}
          >
            Registrarse
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
