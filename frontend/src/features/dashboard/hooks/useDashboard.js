import { useState, useEffect, useCallback } from 'react';
import {
  getProductosMasVendidos,
  getServiciosMasVendidos,
  getEvolucionVentas,
  getSubtotalIva,
  getIngresosPorCategoria,
} from '../services/dashboardService';

// Estado inicial seguro para los gráficos para evitar errores de renderizado
const safeDefaultChartData = {
  labels: ['Cargando...'],
  datasets: [{
    label: 'Cargando datos...',
    data: [],
    backgroundColor: 'rgba(200, 200, 200, 0.6)',
  }],
};

const useDashboard = () => {
  const [productChartData, setProductChartData] = useState(safeDefaultChartData);
  const [serviceChartData, setServiceChartData] = useState(safeDefaultChartData);
  const [salesEvolutionData, setSalesEvolutionData] = useState(safeDefaultChartData);
  const [ivaSubtotalData, setIvaSubtotalData] = useState(safeDefaultChartData);
  const [incomeByCategoryData, setIncomeByCategoryData] = useState(safeDefaultChartData);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función genérica para formatear datos para gráficos de barras/torta
  const formatSimpleChartData = (apiData, label, valueKey, nameKey) => {
    if (!apiData || apiData.length === 0) {
      return {
        labels: ['No hay datos'],
        datasets: [{ label, data: [0], backgroundColor: 'rgba(200, 200, 200, 0.6)' }],
      };
    }
    const labels = apiData.map(item => item[nameKey]);
    const data = apiData.map(item => item[valueKey]);
    return {
      labels,
      datasets: [{
        label,
        data,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      }],
    };
  };

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Hacemos todas las llamadas a la API en paralelo para mayor eficiencia
      const [
        productos,
        servicios,
        evolucionVentas,
        subtotalIva,
        ingresosCategoria,
      ] = await Promise.all([
        getProductosMasVendidos(),
        getServiciosMasVendidos(),
        getEvolucionVentas(),
        getSubtotalIva(),
        getIngresosPorCategoria(),
      ]);

      // Formateamos y actualizamos el estado para cada gráfico
      setProductChartData(formatSimpleChartData(productos, 'Top 5 Productos', 'totalVendido', 'nombre'));
      setServiceChartData(formatSimpleChartData(servicios, 'Top 5 Servicios', 'totalVendido', 'nombre'));
      setIncomeByCategoryData(formatSimpleChartData(ingresosCategoria, 'Ingresos por Categoría', 'total', 'categoria'));
      
      setSalesEvolutionData({
        labels: evolucionVentas.map(item => item.mes),
        datasets: [
          {
            type: 'bar',
            label: 'Total de Ventas ($)',
            data: evolucionVentas.map(item => item.totalVentas),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
          },
          {
            type: 'line',
            label: 'Nº de Transacciones',
            data: evolucionVentas.map(item => item.transacciones),
            borderColor: 'rgba(255, 99, 132, 1)',
            fill: false,
          },
        ],
      });

      setIvaSubtotalData({
        labels: ['Subtotal ($)', 'IVA ($)'],
        datasets: [{
          data: [subtotalIva.subtotal, subtotalIva.iva],
          backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 206, 86, 0.6)'],
        }],
      });

    } catch (err) {
      console.error("Error al cargar datos del dashboard:", err);
      setError("No se pudieron cargar los datos. " + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    productChartData,
    serviceChartData,
    salesEvolutionData,
    ivaSubtotalData,
    incomeByCategoryData,
    isLoading,
    error,
  };
};

export default useDashboard;