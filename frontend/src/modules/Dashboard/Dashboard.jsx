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
  // Datos ficticios de productos más vendidos por día
  const productDayData = {
    labels: ["Producto 1", "Producto 2", "Producto 3"],
    datasets: [
      {
        label: "Ventas por día",
        data: [50, 120, 80],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Datos ficticios de productos más vendidos por semana
  const productWeekData = {
    labels: ["Producto A", "Producto B", "Producto C"],
    datasets: [
      {
        label: "Ventas por semana",
        data: [300, 450, 600],
        backgroundColor: "rgba(255, 206, 86, 0.6)",
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Datos ficticios de productos más vendidos por mes
  const productMonthData = {
    labels: ["Producto X", "Producto Y", "Producto Z"],
    datasets: [
      {
        label: "Ventas por mes",
        data: [800, 1200, 1500],
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Datos ficticios de productos más vendidos globalmente
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

  // Datos ficticios de servicios más vendidos globalmente
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
      <NavbarAdmin />
      <main className="dashboard-main">
        <h1 className="dashboard-header">Dashboard de Administración</h1>
        <div className="charts-container">
          {/* Primera fila */}
          <div className="row">
            <div className="chart">
              <h2>Producto Más Vendido</h2>
              <Bar data={productData} options={chartOptions} />
            </div>
            <div className="chart">
              <h2>Servicio Más Vendido</h2>
              <Bar data={serviceData} options={chartOptions} />
            </div>
          </div>

          {/* Segunda fila */}
          <div className="row">
            <div className="chart">
              <h2>Producto Más Vendido por Día</h2>
              <Bar data={productDayData} options={chartOptions} />
            </div>
            <div className="chart">
              <h2>Producto Más Vendido por Semana</h2>
              <Bar data={productWeekData} options={chartOptions} />
            </div>
          </div>

          {/* Fila independiente */}
          <div className="chart-full-width">
            <h2>Producto Más Vendido por Mes</h2>
            <Bar data={productMonthData} options={chartOptions} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
