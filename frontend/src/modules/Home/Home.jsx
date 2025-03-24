import React from "react";
import Navbar from "../../components/Navbar";
import "./Home.css";

function Home() {
  return (
    <div>
      <Navbar /> 
      <div className="home-container">
        <header className="home-header">
          <h1>Bienvenido a Nuestra Plataforma</h1>
          <p>Explora herramientas increíbles y gestiona tus necesidades con nuestro sistema.</p>
        </header>
        <section className="home-content">
          <div className="home-card">
            <h2>Gestión Inteligente</h2>
            <p>Controla tus productos, clientes y más en un solo lugar.</p>
          </div>
          <div className="home-card">
            <h2>Seguridad de Datos</h2>
            <p>Protege tu información con nuestras herramientas de última generación.</p>
          </div>
          <div className="home-card">
            <h2>Fácil Acceso</h2>
            <p>Accede desde cualquier dispositivo con una interfaz optimizada.</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
