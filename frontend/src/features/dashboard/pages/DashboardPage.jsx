import React, { useState, useEffect, useCallback } from "react";
import { Bar, Pie } from "react-chartjs-2";
import ChartCard from "../components/ChartCard";
import StatsCard from "../components/StatsCard";
import useDashboard from "../hooks/useDashboard";
import { useTheme } from "../../../shared/contexts/ThemeContext";
import "../css/Dashboard.css";

// La inicialización de ChartJS ya no es necesaria aquí.
// Se maneja de forma centralizada en `src/chart-init.js`.

function DashboardPage() {
  const { isDarkMode } = useTheme();
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
    fetchDashboardData(
      productTimePeriod,
      serviceTimePeriod,
      subtotalTimePeriod
    );
  }, [
    productTimePeriod,
    serviceTimePeriod,
    subtotalTimePeriod,
    fetchDashboardData,
  ]);

  useEffect(() => {
    handleFetchDashboardData();
  }, [handleFetchDashboardData]);

  // Función para generar opciones de gráfico basadas en el tema
  const getChartOptions = () => {
    const textColor = isDarkMode ? "#f0e6f2" : "#1e293b";
    const gridColor = isDarkMode
      ? "rgba(77, 59, 80, 0.3)"
      : "rgba(226, 232, 240, 0.5)";
    const tooltipBg = isDarkMode
      ? "rgba(45, 27, 48, 0.95)"
      : "rgba(15, 23, 42, 0.95)";
    const tooltipText = isDarkMode ? "#f0e6f2" : "#f8fafc";
    const borderColor = isDarkMode
      ? "rgba(139, 90, 143, 0.3)"
      : "rgba(99, 102, 241, 0.3)";

    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 2500,
        easing: "easeOutQuart",
        delay: (context) => {
          let delay = 0;
          if (context.type === "data" && context.mode === "default") {
            delay = context.dataIndex * 150 + context.datasetIndex * 200;
          }
          return delay;
        },
        onComplete: () => {
          // Animación adicional cuando se completa la carga
          const canvas = document.querySelector("canvas");
          if (canvas) {
            canvas.style.transform = "scale(1)";
            canvas.style.transition = "transform 0.3s ease";
          }
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
          labels: {
            usePointStyle: true,
            padding: 25,
            font: {
              size: 13,
              weight: "600",
              family: "'Inter', sans-serif",
            },
            color: textColor,
            boxWidth: 12,
            boxHeight: 12,
          },
        },
        title: {
          display: false,
        },
        tooltip: {
          backgroundColor: tooltipBg,
          titleColor: tooltipText,
          bodyColor: tooltipText,
          borderColor: borderColor,
          borderWidth: 1,
          cornerRadius: 12,
          displayColors: true,
          padding: 16,
          titleFont: {
            size: 14,
            weight: "bold",
            family: "'Inter', sans-serif",
          },
          bodyFont: {
            size: 13,
            weight: "500",
            family: "'Inter', sans-serif",
          },
          titleSpacing: 8,
          bodySpacing: 6,
          callbacks: {
            label: function (context) {
              const value = context.parsed.y || context.parsed;
              const formattedValue =
                typeof value === "number"
                  ? value.toLocaleString("es-ES", {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 0,
                    })
                  : value.toLocaleString("es-ES");
              return `${context.dataset.label}: ${formattedValue}`;
            },
          },
        },
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: 12,
              weight: "600",
              family: "'Inter', sans-serif",
            },
            color: isDarkMode ? "#b8a8bb" : "#64748b",
            maxRotation: 45,
            minRotation: 0,
          },
          border: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            drawBorder: false,
            color: gridColor,
            lineWidth: 1,
          },
          ticks: {
            font: {
              size: 12,
              weight: "600",
              family: "'Inter', sans-serif",
            },
            color: isDarkMode ? "#b8a8bb" : "#64748b",
            padding: 8,
            callback: function (value) {
              if (value >= 1000000) {
                return (value / 1000000).toFixed(1) + "M";
              } else if (value >= 1000) {
                return (value / 1000).toFixed(1) + "K";
              }
              return value.toLocaleString("es-ES");
            },
          },
          border: {
            display: false,
          },
        },
      },
      elements: {
        bar: {
          borderRadius: {
            topLeft: 8,
            topRight: 8,
            bottomLeft: 0,
            bottomRight: 0,
          },
          borderSkipped: false,
        },
        point: {
          radius: 6,
          hoverRadius: 8,
          borderWidth: 3,
          hoverBorderWidth: 4,
        },
        line: {
          tension: 0.4,
          borderWidth: 3,
        },
      },
    };
  };

  // Función para generar opciones de gráfico circular basadas en el tema
  const getPieChartOptions = () => {
    const textColor = isDarkMode ? "#f0e6f2" : "#1e293b";
    const tooltipBg = isDarkMode
      ? "rgba(45, 27, 48, 0.95)"
      : "rgba(15, 23, 42, 0.95)";
    const tooltipText = isDarkMode ? "#f0e6f2" : "#f8fafc";
    const borderColor = isDarkMode
      ? "rgba(139, 90, 143, 0.3)"
      : "rgba(99, 102, 241, 0.3)";
    const arcBorderColor = isDarkMode ? "#2d1b30" : "#ffffff";

    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 2500,
        easing: "easeOutQuart",
        animateRotate: true,
        animateScale: true,
      },
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 12,
              weight: "600",
              family: "'Inter', sans-serif",
            },
            color: textColor,
            boxWidth: 12,
            boxHeight: 12,
          },
        },
        title: {
          display: false,
        },
        tooltip: {
          backgroundColor: tooltipBg,
          titleColor: tooltipText,
          bodyColor: tooltipText,
          borderColor: borderColor,
          borderWidth: 1,
          cornerRadius: 12,
          displayColors: true,
          padding: 16,
          titleFont: {
            size: 14,
            weight: "bold",
            family: "'Inter', sans-serif",
          },
          bodyFont: {
            size: 13,
            weight: "500",
            family: "'Inter', sans-serif",
          },
          titleSpacing: 8,
          bodySpacing: 6,
          callbacks: {
            label: function (context) {
              const value = context.parsed;
              const total = context.dataset.data.reduce(
                (sum, val) => sum + val,
                0
              );
              const percentage = ((value / total) * 100).toFixed(1);
              const formattedValue =
                typeof value === "number"
                  ? value.toLocaleString("es-ES", {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 0,
                    })
                  : value.toLocaleString("es-ES");
              return `${context.label}: ${formattedValue} (${percentage}%)`;
            },
          },
        },
      },
      interaction: {
        intersect: false,
      },
      elements: {
        arc: {
          borderWidth: 2,
          borderColor: arcBorderColor,
          hoverBorderWidth: 3,
          hoverBorderColor: arcBorderColor,
        },
      },
    };
  };

  const timePeriodButtons = (period, setPeriod) => (
    <div className="time-period-buttons">
      <button
        className={period === "day" ? "active" : ""}
        onClick={() => setPeriod("day")}
      >
        Día
      </button>
      <button
        className={period === "week" ? "active" : ""}
        onClick={() => setPeriod("week")}
      >
        Semana
      </button>
      <button
        className={period === "month" ? "active" : ""}
        onClick={() => setPeriod("month")}
      >
        Mes
      </button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="dashboard-main-content-page">
        <h1 className="dashboard-header">Dashboard de Administración</h1>
        <p
          style={{ textAlign: "center", fontSize: "1.2rem", marginTop: "40px" }}
        >
          Cargando datos del dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-main-content-page">
        <h1 className="dashboard-header">Dashboard de Administración</h1>
        <p
          style={{
            textAlign: "center",
            fontSize: "1.2rem",
            marginTop: "40px",
            color: "red",
          }}
        >
          Error: {error}
        </p>
      </div>
    );
  }

  // Calcular estadísticas adicionales
  const calculateStats = () => {
    if (
      !productChartData ||
      !serviceChartData ||
      !salesEvolutionData ||
      !ivaSubtotalData
    ) {
      return {
        totalProducts: 0,
        totalServices: 0,
        monthlyGrowth: 0,
        ivaPercentage: 0,
      };
    }

    const totalProducts =
      productChartData.datasets[0]?.data?.reduce((sum, val) => sum + val, 0) ||
      0;
    const totalServices =
      serviceChartData.datasets[0]?.data?.reduce((sum, val) => sum + val, 0) ||
      0;

    // Calcular crecimiento mensual
    const monthlyData = salesEvolutionData.datasets[0]?.data || [];
    const monthlyGrowth =
      monthlyData.length > 1
        ? ((monthlyData[monthlyData.length - 1] -
            monthlyData[monthlyData.length - 2]) /
            monthlyData[monthlyData.length - 2]) *
          100
        : 0;

    // Calcular porcentaje de IVA
    const ivaData = ivaSubtotalData.datasets[0]?.data || [];
    const ivaPercentage =
      ivaData.length >= 2 ? (ivaData[1] / (ivaData[0] + ivaData[1])) * 100 : 0;

    return {
      totalProducts,
      totalServices,
      monthlyGrowth,
      ivaPercentage,
    };
  };

  const stats = calculateStats();

  return (
    <div className="dashboard-main-content-page">
      <h1 className="dashboard-header">Dashboard de Administración</h1>

      {/* Sección de Estadísticas */}
      <div className="stats-section">
        <div className="stats-grid">
          <StatsCard
            title="Productos Vendidos"
            value={stats.totalProducts.toLocaleString("es-ES")}
            percentage={Math.min((stats.totalProducts / 1000) * 100, 100)}
            trend={
              stats.monthlyGrowth > 0
                ? stats.monthlyGrowth
                : -Math.abs(stats.monthlyGrowth)
            }
            icon="📦"
            color="primary"
            isLoading={isLoading}
          />
          <StatsCard
            title="Servicios Realizados"
            value={stats.totalServices.toLocaleString("es-ES")}
            percentage={Math.min((stats.totalServices / 500) * 100, 100)}
            trend={
              stats.monthlyGrowth > 0
                ? stats.monthlyGrowth
                : -Math.abs(stats.monthlyGrowth)
            }
            icon="🛠️"
            color="success"
            isLoading={isLoading}
          />
          <StatsCard
            title="Crecimiento Mensual"
            value={`${stats.monthlyGrowth.toFixed(1)}%`}
            percentage={Math.min(Math.abs(stats.monthlyGrowth), 100)}
            trend={stats.monthlyGrowth}
            icon="📈"
            color={stats.monthlyGrowth >= 0 ? "success" : "danger"}
            isLoading={isLoading}
          />
          <StatsCard
            title="Porcentaje IVA"
            value={`${stats.ivaPercentage.toFixed(1)}%`}
            percentage={stats.ivaPercentage}
            icon="💰"
            color="warning"
            isLoading={isLoading}
          />
        </div>
      </div>

      <div className="charts-container">
        <div className="rowDashboard">
          <ChartCard
            title="Productos Más Vendidos"
            timePeriodComponent={timePeriodButtons(
              productTimePeriod,
              setProductTimePeriod
            )}
            isLoading={isLoading}
          >
            {productChartData && (
              <Bar data={productChartData} options={getChartOptions()} />
            )}
          </ChartCard>
          <ChartCard
            title="Servicios Más Vendidos"
            timePeriodComponent={timePeriodButtons(
              serviceTimePeriod,
              setServiceTimePeriod
            )}
            isLoading={isLoading}
          >
            {serviceChartData && (
              <Bar data={serviceChartData} options={getChartOptions()} />
            )}
          </ChartCard>
        </div>
        <div className="rowDashboard">
          <ChartCard
            title="Evolución de Ventas Mensuales"
            isLoading={isLoading}
          >
            {salesEvolutionData && (
              <Bar data={salesEvolutionData} options={getChartOptions()} />
            )}
          </ChartCard>
          <ChartCard
            title="Subtotal e IVA"
            timePeriodComponent={timePeriodButtons(
              subtotalTimePeriod,
              setSubtotalTimePeriod
            )}
            isLoading={isLoading}
          >
            {ivaSubtotalData && (
              <Bar data={ivaSubtotalData} options={getChartOptions()} />
            )}
          </ChartCard>
        </div>
        <div className="rowDashboard">
          <ChartCard title="Ingresos por Categoría" isLoading={isLoading}>
            {incomeByCategoryData && (
              <Pie data={incomeByCategoryData} options={getPieChartOptions()} />
            )}
          </ChartCard>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
