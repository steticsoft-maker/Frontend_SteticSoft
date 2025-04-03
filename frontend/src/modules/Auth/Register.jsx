import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Form.css";

function Register() {
  const [user, setUser] = useState({ name: "", email: "", password: "" }); // Se agregó el campo "name"
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false); // Estado para el checkbox
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    if (!user.name || !user.email || !user.password || !confirmPassword) {
      alert("Por favor, completa todos los campos.");
      return;
    }
    if (user.password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    if (!isCheckboxChecked) {
      alert("Por favor, confirma que no estás ingresando contenido malicioso.");
      return;
    }

    localStorage.setItem("registeredUser", JSON.stringify(user));
    alert("Registro exitoso. Ahora puedes iniciar sesión.");
    navigate("/login");
  };

  return (
    <div className="form-container">
      <div className="form-box">
        <h2 className="form-title">Registro</h2>
        <form className="form-content" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Nombre completo"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            className="form-input"
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="form-input"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            className="form-input"
          />
          <input
            type="password"
            placeholder="Confirmar Contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            Registrarse
          </button>
        </form>
        <div className="form-actions">
          <button className="secondary-button" onClick={() => navigate("/")}>
            Regresar
          </button>
          <button
            className="secondary-button"
            onClick={() => navigate("/login")}
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
