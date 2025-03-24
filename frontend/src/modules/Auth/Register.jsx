import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Form.css";

function Register() {
  const [user, setUser] = useState({ email: "", password: "" });
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    if (!user.email || !user.password || !confirmPassword) {
      alert("Por favor, completa todos los campos.");
      return;
    }
    if (user.password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
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
          <button type="submit" className="primary-button">Registrarse</button>
        </form>
        <div className="form-actions">
          <button className="secondary-button" onClick={() => navigate("/")}>Regresar</button>
          <button className="secondary-button" onClick={() => navigate("/login")}>Iniciar Sesión</button>
        </div>
      </div>
    </div>
  );
}

export default Register;
