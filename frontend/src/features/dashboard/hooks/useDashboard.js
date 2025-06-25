// src/features/dashboard/hooks/useDashboard.js
import { useState, useEffect } from 'react';
// En el futuro, importaríamos desde: import { getDashboardDataAPI } from '../services/dashboardService';

// Estructura de datos segura por defecto para los gráficos
const safeDefaultChartData = {
  labels: [],
  datasets: [{
    label: 'Cargando datos...',
    data: [],
    backgroundColor: 'rgba(200, 200, 200, 0.6)',
    borderColor: 'rgba(200, 200, 200, 1)',
    borderWidth: 1,
  }],
};

const useDashboard = () => {
  const [productDayData, setProductDayData] = useState(safeDefaultChartData);
  const [productWeekData, setProductWeekData] = useState(safeDefaultChartData);
  const [productMonthData, setProductMonthData] = useState(safeDefaultChartData);

  const [serviceDayData, setServiceDayData] = useState(safeDefaultChartData);
  const [serviceWeekData, setServiceWeekData] = useState(safeDefaultChartData);
  const [serviceMonthData, setServiceMonthData] = useState(safeDefaultChartData);

  const [ivaSubtotalData, setIvaSubtotalData] = useState(safeDefaultChartData);
  const [comboData, setComboData] = useState(safeDefaultChartData);
  const [stackedAreaData, setStackedAreaData] = useState(safeDefaultChartData);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Simulación de llamada a la API con un pequeño retraso
        await new Promise(resolve => setTimeout(resolve, 500));

        // Aquí iría la llamada real a la API, ej:
        // const apiData = await getDashboardDataAPI();
        // Y luego procesar apiData para establecer los diferentes estados de los gráficos.

        // Por ahora, usamos los datos simulados:
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

      } catch (err) {
        console.error("Error al cargar datos del dashboard (simulado):", err);
        setError("No se pudieron cargar los datos del dashboard.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []); // Se ejecuta solo una vez al montar el componente

  return {
    productDayData,
    productWeekData,
    productMonthData,
    serviceDayData,
    serviceWeekData,
    serviceMonthData,
    ivaSubtotalData,
    comboData,
    stackedAreaData,
    isLoading,
    error,
  };
};

export default useDashboard;
