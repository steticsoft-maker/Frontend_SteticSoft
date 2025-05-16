import React, { useState } from "react"; 
import NavbarAdmin from "../../components/NavbarAdmin/NavbarAdmin"; 
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from "chart.js";
import "./Dashboard.css";


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

function Dashboard() {
  // Datos de ventas de producto por día
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

  // Datos de ventas de producto por semana
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

  // Datos de ventas de producto por mes
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

  // Datos de producto más vendido (general)
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

  // Datos de servicio más vendido (general)
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

  // Datos de Subtotal y IVA
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



  // Datos de ejemplo para gráfico Line
  const lineDataExample = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Tendencia A (Ejemplo)",
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "Tendencia B (Ejemplo)",
        data: [30, 40, 45, 50, 60, 70, 80],
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
    ],
  };

  // Datos de ejemplo para gráfico Doughnut
  const doughnutDataExample = {
    labels: ["Red", "Orange", "Yellow", "Green", "Blue"],
    datasets: [
      {
        label: "Distribución (Ejemplo)",
        data: [300, 50, 100, 40, 120],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(255, 205, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(54, 162, 235, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 205, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(54, 162, 235, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Datos de ejemplo para gráfico Combo Bar Line
  const comboDataExample = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul"],
    datasets: [
      {
        type: "bar",
        label: "Ventas (Ejemplo)",
        data: [100, 120, 150, 130, 160, 180, 200],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        type: "line",
        label: "Cantidad (Ejemplo)",
        data: [50, 60, 70, 65, 80, 90, 100],
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.3,
      },
    ],
  };

  // Datos de ejemplo para gráfico Stacked Area Line
  const stackedAreaDataExample = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Categoría A (Ejemplo)",
        data: [100, 120, 150, 180, 200, 220, 250],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        fill: true,
        stack: "Stack 1",
      },
      {
        label: "Categoría B (Ejemplo)",
        data: [80, 90, 110, 130, 150, 170, 190],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        fill: true,
        stack: "Stack 1",
      },
      {
        label: "Categoría C (Ejemplo)",
        data: [50, 60, 70, 80, 90, 100, 110],
        backgroundColor: "rgba(255, 206, 86, 0.6)",
        borderColor: "rgba(255, 206, 86, 1)",
        fill: true,
        stack: "Stack 1",
      },
    ],
  };

  // Estado para período de producto
  const [productTimePeriod, setProductTimePeriod] = useState("day");
  // Estado para período de servicio
  const [serviceTimePeriod, setServiceTimePeriod] = useState("day");

  // Función para datos de producto por período
  const getProductChartData = () => {
    switch (productTimePeriod) {
      case "day":
        return productDayData;
      case "week":
        return productWeekData;
      case "month":
        return productMonthData;
      default:
        return productDayData;
    }
  };

  // Función para datos de servicio por período
  const getServiceChartData = () => {
    switch (serviceTimePeriod) {
      case "day":
        return {
          labels: ["Servicio X", "Servicio Y", "Servicio Z"],
          datasets: [
            {
              label: "Ventas por día",
              data: [150, 80, 120],
              backgroundColor: "rgba(255, 99, 132, 0.6)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
          ],
        };
      case "week":
        return {
          labels: ["Servicio A", "Servicio B", "Servicio C"],
          datasets: [
            {
              label: "Ventas por semana",
              data: [400, 350, 500],
              backgroundColor: "rgba(255, 99, 132, 0.6)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
          ],
        };
      case "month":
        return {
          labels: ["Servicio M", "Servicio N", "Servicio P"],
          datasets: [
            {
              label: "Ventas por mes",
              data: [900, 700, 1100],
              backgroundColor: "rgba(255, 99, 132, 0.6)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
          ],
        };
      default:
        return serviceData;
    }
  };

  // Opciones generales de gráficos
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "top" },
      title: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, grid: { drawBorder: false } },
    },
  };

  // Opciones específicas para gráfico Doughnut
  const doughnutOptions = {
    ...chartOptions,
    plugins: {
      legend: { display: true, position: "bottom" },
    },
    cutout: "70%",
  };

  // Renderizado del Dashboard
  return (
    <div className="dashboard-container">
      {" "}
      {/* Contenedor principal del dashboard */}
      <NavbarAdmin />
      <main className="dashboard-main">
        {" "}
        {/* Contenido principal */}
        <h1 className="dashboard-header">Dashboard de Administración</h1>
        <div className="charts-container">
          {" "}
          {/* Contenedor de todos los gráficos */}
          <div className="rowDashboard">
            {" "}
            {/* Fila de gráficos */}
            <div className="chart">
              {" "}
              {/* Contenedor de gráfico de Producto Interactivo */}
              <h2>Producto Más Vendido</h2>
              <div className="time-period-buttons">
                {" "}
                {/* Botones de período */}
                <button
                  className={productTimePeriod === "day" ? "active" : ""}
                  onClick={() => setProductTimePeriod("day")}
                >
                  Día
                </button>
                <button
                  className={productTimePeriod === "week" ? "active" : ""}
                  onClick={() => setProductTimePeriod("week")}
                >
                  Semana
                </button>
                <button
                  className={productTimePeriod === "month" ? "active" : ""}
                  onClick={() => setProductTimePeriod("month")}
                >
                  Mes
                </button>
              </div>
              <div className="chart-wrapper">
                {" "}
                {/* Contenedor del componente gráfico */}
                <Bar data={getProductChartData()} options={chartOptions} />
              </div>
            </div>
            <div className="chart">
              {" "}
              {/* Contenedor de gráfico de Servicio Interactivo */}
              <h2>Servicio Más Vendido</h2>
              <div className="time-period-buttons">
                {" "}
                {/* Botones de período */}
                <button
                  className={serviceTimePeriod === "day" ? "active" : ""}
                  onClick={() => setServiceTimePeriod("day")}
                >
                  Día
                </button>
                <button
                  className={serviceTimePeriod === "week" ? "active" : ""}
                  onClick={() => setServiceTimePeriod("week")}
                >
                  Semana
                </button>
                <button
                  className={serviceTimePeriod === "month" ? "active" : ""}
                  onClick={() => setServiceTimePeriod("month")}
                >
                  Mes
                </button>
              </div>
              <div className="chart-wrapper">
                {" "}
                {/* Contenedor del componente gráfico */}
                <Bar data={getServiceChartData()} options={chartOptions} />
              </div>
            </div>
          </div>
          <div className="rowDashboard">
            <div className="chart">
              {" "}
              {/* Contenedor de gráfico Combo */}
              <h2>Ejemplo Combo (Bar/Line)</h2>
              <div className="chart-wrapper">
                {" "}
                {/* Contenedor del componente gráfico */}
                <Bar data={comboDataExample} options={chartOptions} />
              </div>
            </div>
          </div>
          <div className="rowDashboard">
            {" "}
            {/* Fila de gráficos */}
            <div className="chart">
              {" "}
              {/* Contenedor de gráfico Stacked Area */}
              <h2>Ejemplo Stacked Area</h2>
              <div className="chart-wrapper">
                {" "}
                {/* Contenedor del componente gráfico */}
                <Line data={stackedAreaDataExample} options={chartOptions} />
              </div>
            </div>
            {/* Contenedor de gráfico Subtotal y IVA */}
            <div className="chart">
              <h2>Subtotal y IVA (Bar)</h2>
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
