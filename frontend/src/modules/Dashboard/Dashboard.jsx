import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBox,
  FaUserFriends,
  FaShoppingCart,
  FaBuilding,
  FaClipboardList,
  FaUsers,
  FaTags,
  FaTasks,
  FaUserCircle,
} from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./Dashboard.css";

// Registrar los módulos de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const navigate = useNavigate();

  // Datos ficticios de productos más vendidos
  const productData = {
    labels: ["Día", "Semana", "Mes"],
    datasets: [
      {
        label: "Producto más vendido",
        data: [400, 750, 900], // Valores ajustados al mínimo de 400
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Datos ficticios de servicios más vendidos
  const serviceData = {
    labels: ["Día", "Semana", "Mes"],
    datasets: [
      {
        label: "Servicio más vendido",
        data: [450, 600, 800], // Valores ajustados al mínimo de 400
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Opciones para gráficos ajustadas
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        enabled: true,
      },
    },
    layout: {
      padding: 20, // Padding interno para evitar que las barras se salgan del área visible
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: false, // Elimina las líneas del fondo para mayor claridad
        },
        ticks: {
          maxRotation: 0, // Mantén las etiquetas horizontales
        },
      },
      y: {
        beginAtZero: true,
        max: 1000, // Establece un límite máximo de 1000 en el eje Y
        grid: {
          drawBorder: false, // Elimina el borde en el eje Y
        },
        ticks: {
          stepSize: 100, // Define pasos más pequeños para mayor claridad
          precision: 0, // Ajusta la visualización de números enteros
        },
      },
    },
  };

  return (
    <div className="dashboard-container">
      {/* Navbar lateral */}
      <aside className="dashboard-sidebar">
        <div className="admin-section">
          <FaUserCircle className="admin-icon" />
          <p className="admin-label">Admin</p>
        </div>
        <nav className="dashboard-links">
          <button
            onClick={() => navigate("/abastecimiento")}
            className="dashboard-link"
          >
            <FaBox className="dashboard-icon" /> Abastecimiento
          </button>
          <button
            onClick={() => navigate("/clientes")}
            className="dashboard-link"
          >
            <FaUserFriends className="dashboard-icon" /> Clientes
          </button>
          <button
            onClick={() => navigate("/compras")}
            className="dashboard-link"
          >
            <FaShoppingCart className="dashboard-icon" /> Compras
          </button>
          <button
            onClick={() => navigate("/empleados")}
            className="dashboard-link"
          >
            <FaUsers className="dashboard-icon" /> Empleados
          </button>
          <button
            onClick={() => navigate("/insumos")}
            className="dashboard-link"
          >
            <FaTags className="dashboard-icon" /> Insumos
          </button>
          <button
            onClick={() => navigate("/proveedores")}
            className="dashboard-link"
          >
            <FaBuilding className="dashboard-icon" /> Proveedores
          </button>
          <button
            onClick={() => navigate("/ventas")}
            className="dashboard-link"
          >
            <FaClipboardList className="dashboard-icon" /> Ventas
          </button>
          <button
            onClick={() => navigate("/productoadministrador")}
            className="dashboard-link"
          >
            <FaTasks className="dashboard-icon" /> Productos
          </button>
          <button
            onClick={() => navigate("/serviciosadministrador")}
            className="dashboard-link"
          >
            <FaTasks className="dashboard-icon" /> Servicios
          </button>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="dashboard-main">
        <h1 className="dashboard-header">Dashboard de Administración</h1>
        <div className="charts-container">
          <div className="chart">
            <h2>Producto Más Vendido</h2>
            <Bar data={productData} options={chartOptions} />
          </div>
          <div className="chart">
            <h2>Servicio Más Vendido</h2>
            <Bar data={serviceData} options={chartOptions} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
