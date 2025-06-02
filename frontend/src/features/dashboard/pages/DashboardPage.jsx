// src/features/dashboard/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
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
  Filler
} from 'chart.js';
import ChartCard from '../components/ChartCard';
import '../css/Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
  Filler
);

// Estructura de datos segura por defecto para los gráficos
const safeDefaultChartData = {
  labels: [],
  datasets: [{
    label: 'No hay datos disponibles',
    data: [],
    backgroundColor: 'rgba(200, 200, 200, 0.6)',
    borderColor: 'rgba(200, 200, 200, 1)',
    borderWidth: 1,
  }],
};

function DashboardPage() {
  // Estados para los datos de los gráficos (inicializar con estructura segura)
  const [productDayData, setProductDayData] = useState(safeDefaultChartData);
  const [productWeekData, setProductWeekData] = useState(safeDefaultChartData);
  const [productMonthData, setProductMonthData] = useState(safeDefaultChartData);
  
  const [serviceDayData, setServiceDayData] = useState(safeDefaultChartData);
  const [serviceWeekData, setServiceWeekData] = useState(safeDefaultChartData);
  const [serviceMonthData, setServiceMonthData] = useState(safeDefaultChartData);

  const [ivaSubtotalData, setIvaSubtotalData] = useState(safeDefaultChartData);
  const [comboData, setComboData] = useState(safeDefaultChartData);
  const [stackedAreaData, setStackedAreaData] = useState(safeDefaultChartData);

  // *** IMPORTANTE: Definición de los estados para los selectores de período de tiempo ***
  const [productTimePeriod, setProductTimePeriod] = useState("day");
  const [serviceTimePeriod, setServiceTimePeriod] = useState("day");
  // *** ----------------------------------------------------------------------------- ***

  useEffect(() => {
    // Simulación de carga para productDayData
    setProductDayData({
      labels: ["Producto 1", "Producto 2", "Producto 3"],
      datasets: [{ label: "Ventas por día", data: [50, 120, 80], backgroundColor: "rgba(54, 162, 235, 0.6)", borderColor: "rgba(54, 162, 235, 1)", borderWidth: 1 }],
    });
    setProductWeekData({
      labels: ["Producto A", "Producto B", "Producto C"],
      datasets: [{ label: "Ventas por semana", data: [300, 450, 600], backgroundColor: "rgba(255, 206, 86, 0.6)", borderColor: "rgba(255, 206, 86, 1)", borderWidth: 1 }],
    });
    setProductMonthData({
      labels: ["Producto X", "Producto Y", "Producto Z"],
      datasets: [{ label: "Ventas por mes", data: [800, 1200, 1500], backgroundColor: "rgba(153, 102, 255, 0.6)", borderColor: "rgba(153, 102, 255, 1)", borderWidth: 1 }],
    });

    // Simular carga para serviceData
    setServiceDayData({
      labels: ["Servicio X", "Servicio Y", "Servicio Z"],
      datasets: [{ label: "Ventas por día", data: [150, 80, 120], backgroundColor: "rgba(255, 99, 132, 0.6)", borderColor: "rgba(255, 99, 132, 1)", borderWidth: 1 }],
    });
     setServiceWeekData({
      labels: ["Servicio A", "Servicio B", "Servicio C"],
      datasets: [{ label: "Ventas por semana", data: [400, 350, 500], backgroundColor: "rgba(255, 99, 132, 0.6)", borderColor: "rgba(255, 99, 132, 1)", borderWidth: 1 }],
    });
    setServiceMonthData({
      labels: ["Servicio M", "Servicio N", "Servicio P"],
      datasets: [{ label: "Ventas por mes", data: [900, 700, 1100], backgroundColor: "rgba(255, 99, 132, 0.6)", borderColor: "rgba(255, 99, 132, 1)", borderWidth: 1 }],
    });
    
    setIvaSubtotalData({
      labels: ["Totales"],
      datasets: [
        { label: "Subtotal", data: [800], backgroundColor: "rgba(75, 192, 192, 0.6)", borderColor: "rgba(75, 192, 192, 1)", borderWidth: 1 },
        { label: "IVA", data: [450], backgroundColor: "rgba(255, 206, 86, 0.6)", borderColor: "rgba(255, 206, 86, 1)", borderWidth: 1 },
      ],
    });
    setComboData({
      labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul"],
      datasets: [
        { type: "bar", label: "Ventas (Ejemplo)", data: [100, 120, 150, 130, 160, 180, 200], backgroundColor: "rgba(75, 192, 192, 0.6)", borderColor: "rgba(75, 192, 192, 1)", borderWidth: 1 },
        { type: "line", label: "Cantidad (Ejemplo)", data: [50, 60, 70, 65, 80, 90, 100], fill: false, borderColor: "rgb(255, 99, 132)", tension: 0.3 },
      ],
    });
    setStackedAreaData({
      labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul"],
      datasets: [
        { label: "Categoría A (Ejemplo)", data: [100, 120, 150, 180, 200, 220, 250], backgroundColor: "rgba(255, 99, 132, 0.2)", borderColor: "rgba(255, 99, 132, 1)", fill: true, stack: "Stack 1" },
        { label: "Categoría B (Ejemplo)", data: [80, 90, 110, 130, 150, 170, 190], backgroundColor: "rgba(54, 162, 235, 0.2)", borderColor: "rgba(54, 162, 235, 1)", fill: true, stack: "Stack 1" },
        { label: "Categoría C (Ejemplo)", data: [50, 60, 70, 80, 90, 100, 110], backgroundColor: "rgba(255, 206, 86, 0.2)", borderColor: "rgba(255, 206, 86, 1)", fill: true, stack: "Stack 1" },
      ],
    });
  }, []);


  const getProductChartData = () => {
    switch (productTimePeriod) {
      case "day": return productDayData;
      case "week": return productWeekData;
      case "month": return productMonthData;
      default: return productDayData;
    }
  };

  const getServiceChartData = () => {
    switch (serviceTimePeriod) {
      case "day": return serviceDayData;
      case "week": return serviceWeekData;
      case "month": return serviceMonthData;
      default: return serviceDayData;
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "top" },
      title: { display: false },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    scales: {
      x: { grid: { display: false } },
      // stacked: true en y-axis se aplicará solo si es necesario, como en stackedAreaOptions
      y: { beginAtZero: true, grid: { drawBorder: false } }, 
    },
  };

  const stackedAreaOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      y: {
        ...chartOptions.scales.y,
        stacked: true, 
      },
    },
  };

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
    <div className="dashboard-main-content-page">
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
            <Bar data={comboData} options={chartOptions} />
          </ChartCard>
          <ChartCard title="Subtotal y IVA (Bar)">
            <Bar data={ivaSubtotalData} options={chartOptions} />
          </ChartCard>
        </div>
        <div className="rowDashboard">
           <ChartCard title="Ejemplo Stacked Area">
            <Line data={stackedAreaData} options={stackedAreaOptions} />
          </ChartCard>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;