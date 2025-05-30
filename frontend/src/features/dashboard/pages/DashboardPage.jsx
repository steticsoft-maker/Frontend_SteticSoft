// src/features/dashboard/pages/DashboardPage.jsx
import React, { useState } from 'react';
import NavbarAdmin from '../../../shared/components/layout/NavbarAdmin'; // Ruta actualizada
import { Bar, Line } from 'react-chartjs-2'; // Doughnut no se usa en el return actual, la omito por ahora
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement,
} from 'chart.js';
import ChartCard from '../components/ChartCard'; // Componente opcional
import '../css/Dashboard.css'; // Nueva ruta CSS

ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement
);

function DashboardPage() {
  // ... (TODA la lógica de datos y estados (productDayData, productTimePeriod, etc.) se mantiene aquí por ahora) ...
  // Datos de ventas de producto por día
  const productDayData = {
    labels: ["Producto 1", "Producto 2", "Producto 3"],
    datasets: [{ label: "Ventas por día", data: [50, 120, 80], backgroundColor: "rgba(54, 162, 235, 0.6)", borderColor: "rgba(54, 162, 235, 1)", borderWidth: 1, },],
  };
  const productWeekData = {
    labels: ["Producto A", "Producto B", "Producto C"],
    datasets: [{ label: "Ventas por semana", data: [300, 450, 600], backgroundColor: "rgba(255, 206, 86, 0.6)", borderColor: "rgba(255, 206, 86, 1)", borderWidth: 1, },],
  };
  const productMonthData = {
    labels: ["Producto X", "Producto Y", "Producto Z"],
    datasets: [{ label: "Ventas por mes", data: [800, 1200, 1500], backgroundColor: "rgba(153, 102, 255, 0.6)", borderColor: "rgba(153, 102, 255, 1)", borderWidth: 1, },],
  };
  const serviceData = { // Datos base para servicio, getServiceChartData lo refina
    labels: ["Día", "Semana", "Mes"],
    datasets: [ { label: "Servicio más vendido", data: [450, 600, 800], backgroundColor: "rgba(255, 99, 132, 0.6)", borderColor: "rgba(255, 99, 132, 1)", borderWidth: 1, },],
  };
  const DataIVASubtotal = {
    labels: ["Totales"],
    datasets: [ { label: "Subtotal", data: [800], backgroundColor: "rgba(75, 192, 192, 0.6)", borderColor: "rgba(75, 192, 192, 1)", borderWidth: 1, }, { label: "IVA", data: [450], backgroundColor: "rgba(255, 206, 86, 0.6)", borderColor: "rgba(255, 206, 86, 1)", borderWidth: 1, },],
  };
  const comboDataExample = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul"],
    datasets: [ { type: "bar", label: "Ventas (Ejemplo)", data: [100, 120, 150, 130, 160, 180, 200], backgroundColor: "rgba(75, 192, 192, 0.6)", borderColor: "rgba(75, 192, 192, 1)", borderWidth: 1, }, { type: "line", label: "Cantidad (Ejemplo)", data: [50, 60, 70, 65, 80, 90, 100], fill: false, borderColor: "rgb(255, 99, 132)", tension: 0.3, },],
  };
  const stackedAreaDataExample = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul"],
    datasets: [ { label: "Categoría A (Ejemplo)", data: [100, 120, 150, 180, 200, 220, 250], backgroundColor: "rgba(255, 99, 132, 0.6)", borderColor: "rgba(255, 99, 132, 1)", fill: true, stack: "Stack 1", }, { label: "Categoría B (Ejemplo)", data: [80, 90, 110, 130, 150, 170, 190], backgroundColor: "rgba(54, 162, 235, 0.6)", borderColor: "rgba(54, 162, 235, 1)", fill: true, stack: "Stack 1", }, { label: "Categoría C (Ejemplo)", data: [50, 60, 70, 80, 90, 100, 110], backgroundColor: "rgba(255, 206, 86, 0.6)", borderColor: "rgba(255, 206, 86, 1)", fill: true, stack: "Stack 1", },],
  };

  const [productTimePeriod, setProductTimePeriod] = useState("day");
  const [serviceTimePeriod, setServiceTimePeriod] = useState("day");

  const getProductChartData = () => { /* ...misma lógica... */ 
    switch (productTimePeriod) {
      case "day": return productDayData;
      case "week": return productWeekData;
      case "month": return productMonthData;
      default: return productDayData;
    }
  };
  const getServiceChartData = () => { /* ...misma lógica... */ 
    switch (serviceTimePeriod) {
      case "day": return { labels: ["Servicio X", "Servicio Y", "Servicio Z"], datasets: [ { label: "Ventas por día", data: [150, 80, 120], backgroundColor: "rgba(255, 99, 132, 0.6)", borderColor: "rgba(255, 99, 132, 1)", borderWidth: 1, }, ], };
      case "week": return { labels: ["Servicio A", "Servicio B", "Servicio C"], datasets: [ { label: "Ventas por semana", data: [400, 350, 500], backgroundColor: "rgba(255, 99, 132, 0.6)", borderColor: "rgba(255, 99, 132, 1)", borderWidth: 1, }, ], };
      case "month": return { labels: ["Servicio M", "Servicio N", "Servicio P"], datasets: [ { label: "Ventas por mes", data: [900, 700, 1100], backgroundColor: "rgba(255, 99, 132, 0.6)", borderColor: "rgba(255, 99, 132, 1)", borderWidth: 1, }, ], };
      default: return serviceData;
    }
  };

  const chartOptions = { /* ...mismas opciones... */ 
    responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: "top" }, title: { display: false }, }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true, grid: { drawBorder: false } }, },
  };
  // const doughnutOptions = { /* ...mismas opciones... */ }; // No se usa Doughnut en el return actual

  const productTimePeriodButtons = (
    <>
      <button className={productTimePeriod === "day" ? "active" : ""} onClick={() => setProductTimePeriod("day")}>Día</button>
      <button className={productTimePeriod === "week" ? "active" : ""} onClick={() => setProductTimePeriod("week")}>Semana</button>
      <button className={productTimePeriod === "month" ? "active" : ""} onClick={() => setProductTimePeriod("month")}>Mes</button>
    </>
  );

  const serviceTimePeriodButtons = (
    <>
      <button className={serviceTimePeriod === "day" ? "active" : ""} onClick={() => setServiceTimePeriod("day")}>Día</button>
      <button className={serviceTimePeriod === "week" ? "active" : ""} onClick={() => setServiceTimePeriod("week")}>Semana</button>
      <button className={serviceTimePeriod === "month" ? "active" : ""} onClick={() => setServiceTimePeriod("month")}>Mes</button>
    </>
  );

  return (
    <div className="dashboard-layout"> {/* Nuevo contenedor para layout de página admin */}
      <NavbarAdmin />
      <main className="dashboard-main-content"> {/* Renombrado para evitar colisión con .dashboard-main de CSS */}
        <h1 className="dashboard-header">Dashboard de Administración</h1>
        <div className="charts-container">
          <div className="rowDashboard">
            <ChartCard title="Producto Más Vendido" timePeriodComponent={productTimePeriodButtons}>
              <Bar data={getProductChartData()} options={chartOptions} />
            </ChartCard>
            <ChartCard title="Servicio Más Vendido" timePeriodComponent={serviceTimePeriodButtons}>
              <Bar data={getServiceChartData()} options={chartOptions} />
            </ChartCard>
          </div>
          <div className="rowDashboard">
            <ChartCard title="Ejemplo Combo (Bar/Line)">
              <Bar data={comboDataExample} options={chartOptions} />
            </ChartCard>
            {/* Para mantener 2 por fila, el siguiente iría en otra fila o ajustar el CSS de .rowDashboard y .chart */}
          </div>
          <div className="rowDashboard">
            <ChartCard title="Ejemplo Stacked Area">
              <Line data={stackedAreaDataExample} options={chartOptions} />
            </ChartCard>
            <ChartCard title="Subtotal y IVA (Bar)">
              <Bar data={DataIVASubtotal} options={chartOptions} />
            </ChartCard>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;