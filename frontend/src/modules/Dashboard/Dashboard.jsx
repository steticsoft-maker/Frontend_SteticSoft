import React from "react";
import NavbarAdmin from "../../components/NavbarAdmin";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
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

  const productData = {
    labels: ["Día", "Semana", "Mes"],
    datasets: [
      {
        label: "Producto más vendido",
        data: [400, 750, 900],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const serviceData = {
    labels: ["Día", "Semana", "Mes"],
    datasets: [
      {
        label: "Servicio más vendido",
        data: [450, 600, 800],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  
  const DataIVASubtotal = {
    labels: ["Totales"],
    datasets: [
      {
        label: "Subtotal",
        data: [800],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "IVA",
        data: [450],
        backgroundColor: "rgba(255, 206, 86, 0.6)",
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 1,
      },
    ],
  };


  // Ajustes de tamaño
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        grid: { drawBorder: false },
      },
    },
  };

  return (
    <div className="dashboard-container">
      <NavbarAdmin />
      <main className="dashboard-main">
        <h1 className="dashboard-header">Dashboard de Administración</h1>
        <div className="charts-container">
          <div className="row">
            <div className="chart">
              <h2>Producto Más Vendido</h2>
              <div className="chart-wrapper">
                <Bar data={productData} options={chartOptions} />
              </div>
            </div>
            <div className="chart">
              <h2>Servicio Más Vendido</h2>
              <div className="chart-wrapper">
                <Bar data={serviceData} options={chartOptions} />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="chart">
              <h2>Producto Más Vendido por Día</h2>
              <div className="chart-wrapper">
                <Bar data={productDayData} options={chartOptions} />
              </div>
            </div>
            <div className="chart">
              <h2>Producto Más Vendido por Semana</h2>
              <div className="chart-wrapper">
                <Bar data={productWeekData} options={chartOptions} />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="chart-full-width">
              <h2>Producto Más Vendido por Mes</h2>
              <div className="chart-wrapper">
                <Bar data={productMonthData} options={chartOptions} />
              </div>
            </div>
            <div className="chart-full-width">
              <h2>Subtotal y IVA</h2>
              <div className="chart-wrapper">
                <Bar data={DataIVASubtotal} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
