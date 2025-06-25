// src/features/dashboard/pages/DashboardPage.jsx
import React, { useState } from 'react'; // useEffect removido
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
import useDashboard from '../hooks/useDashboard'; // Importar el custom hook
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

// Estructura de datos segura por defecto para los gráficos ya no es necesaria aquí,
// el hook la maneja internamente.

function DashboardPage() {
  // Usar el custom hook para obtener datos y estados
  const {
    productDayData,
    productWeekData,
    productMonthData,
    serviceDayData,
    serviceWeekData,
    serviceMonthData,
    ivaSubtotalData,
    comboData,
    stackedAreaData,
    isLoading, // Estado de carga del hook
    error,     // Estado de error del hook
  } = useDashboard();

  // Estados locales para los selectores de período de tiempo (se mantienen en la página)
  const [productTimePeriod, setProductTimePeriod] = useState("day");
  const [serviceTimePeriod, setServiceTimePeriod] = useState("day");

  // El useEffect para simular la carga de datos se ha movido al hook useDashboard.

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
    <div className="time-period-buttons">
      <button className={productTimePeriod === "day" ? "active" : ""} onClick={() => setProductTimePeriod("day")}>Día</button>
      <button className={productTimePeriod === "week" ? "active" : ""} onClick={() => setProductTimePeriod("week")}>Semana</button>
      <button className={productTimePeriod === "month" ? "active" : ""} onClick={() => setProductTimePeriod("month")}>Mes</button>
    </div>
  );

  const serviceTimePeriodButtons = (
    <div className="time-period-buttons">
      <button className={serviceTimePeriod === "day" ? "active" : ""} onClick={() => setServiceTimePeriod("day")}>Día</button>
      <button className={serviceTimePeriod === "week" ? "active" : ""} onClick={() => setServiceTimePeriod("week")}>Semana</button>
      <button className={serviceTimePeriod === "month" ? "active" : ""} onClick={() => setServiceTimePeriod("month")}>Mes</button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="dashboard-main-content-page">
        <h1 className="dashboard-header">Dashboard de Administración</h1>
        <p style={{ textAlign: 'center', fontSize: '1.2rem', marginTop: '40px' }}>Cargando datos del dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-main-content-page">
        <h1 className="dashboard-header">Dashboard de Administración</h1>
        <p style={{ textAlign: 'center', fontSize: '1.2rem', marginTop: '40px', color: 'red' }}>Error: {error}</p>
      </div>
    );
  }

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