import React, { useState, useEffect, useCallback } from 'react';
import { Bar } from 'react-chartjs-2';
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
import useDashboard from '../hooks/useDashboard';
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

function DashboardPage() {
  const {
    productChartData,
    serviceChartData,
    salesEvolutionData,
    ivaSubtotalData,
    incomeByCategoryData,
    isLoading,
    error,
    fetchDashboardData,
  } = useDashboard();

  const [productTimePeriod, setProductTimePeriod] = useState("day");
  const [serviceTimePeriod, setServiceTimePeriod] = useState("day");
  const [subtotalTimePeriod, setSubtotalTimePeriod] = useState("day");

  // useCallback para evitar recrear la función en cada render
  const handleFetchDashboardData = useCallback(() => {
    fetchDashboardData(productTimePeriod, serviceTimePeriod, subtotalTimePeriod);
  }, [productTimePeriod, serviceTimePeriod, subtotalTimePeriod, fetchDashboardData]);

  useEffect(() => {
    handleFetchDashboardData();
  }, [handleFetchDashboardData]);

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

  const timePeriodButtons = (period, setPeriod) => (
    <div className="time-period-buttons">
      <button className={period === "day" ? "active" : ""} onClick={() => setPeriod("day")}>Día</button>
      <button className={period === "week" ? "active" : ""} onClick={() => setPeriod("week")}>Semana</button>
      <button className={period === "month" ? "active" : ""} onClick={() => setPeriod("month")}>Mes</button>
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
          <ChartCard title="Producto Más Vendido" timePeriodComponent={timePeriodButtons(productTimePeriod, setProductTimePeriod)}>
            {productChartData && <Bar data={productChartData} options={chartOptions} />}
          </ChartCard>
          <ChartCard title="Servicio Más Vendido" timePeriodComponent={timePeriodButtons(serviceTimePeriod, setServiceTimePeriod)}>
            {serviceChartData && <Bar data={serviceChartData} options={chartOptions} />}
          </ChartCard>
        </div>
        <div className="rowDashboard">
          <ChartCard title="Evolución de Ventas Mensuales">
            {salesEvolutionData && <Bar data={salesEvolutionData} options={chartOptions} />}
          </ChartCard>
          <ChartCard title="Subtotal y IVA" timePeriodComponent={timePeriodButtons(subtotalTimePeriod, setSubtotalTimePeriod)}>
            {ivaSubtotalData && <Bar data={ivaSubtotalData} options={chartOptions} />}
          </ChartCard>
        </div>
        <div className="rowDashboard">
          <ChartCard title="Ingresos por Categoría">
            {incomeByCategoryData && <Bar data={incomeByCategoryData} options={chartOptions} />}
          </ChartCard>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;