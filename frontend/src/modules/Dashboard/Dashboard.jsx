import React from "react";
import NavbarAdmin from "../../components/NavbarAdmin"; // Importando el Navbar desde components
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
  // Datos ficticios de productos más vendidos
  const productData = {
    labels: ["Día", "Semana", "Mes"],
    datasets: [
      {
        label: "Producto más vendido",
        data: [400, 750, 900], // Valores ajustados
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
        data: [450, 600, 800], // Valores ajustados
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
      padding: 20,
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 0,
        },
      },
      y: {
        beginAtZero: true,
        max: 1000,
        grid: {
          drawBorder: false,
        },
        ticks: {
          stepSize: 100,
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="dashboard-container">
      {/* Navbar lateral reutilizado */}
      <NavbarAdmin />
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
