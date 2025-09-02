import { useState, useEffect, useCallback } from 'react';
import {
  getProductosMasVendidos,
  getServiciosMasVendidos,
  getEvolucionVentas,
  getSubtotalIva,
  getIngresosPorCategoria,
} from '../services/dashboardService';

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
  const [productChartData, setProductChartData] = useState(safeDefaultChartData);
  const [serviceChartData, setServiceChartData] = useState(safeDefaultChartData);
  const [salesEvolutionData, setSalesEvolutionData] = useState(safeDefaultChartData);
  const [ivaSubtotalData, setIvaSubtotalData] = useState(safeDefaultChartData);
  const [incomeByCategoryData, setIncomeByCategoryData] = useState(safeDefaultChartData);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatChartData = (apiData, label, type = 'bar') => {
    if (!apiData || apiData.length === 0) {
      return {
        labels: ['No hay datos'],
        datasets: [{
          label: 'Sin datos',
          data: [0],
          backgroundColor: 'rgba(200, 200, 200, 0.6)',
        }],
      };
    }

    const labels = apiData.map(item => item.nombre || item.mes || item.categoria);
    const data = apiData.map(item => item.totalVendido || item.totalVentas || item.total);
    
    return {
      labels,
      datasets: [{
        label,
        data,
        backgroundColor: type === 'bar' ? 'rgba(54, 162, 235, 0.6)' : 'rgba(255, 99, 132, 0.2)',
        borderColor: type === 'bar' ? 'rgba(54, 162, 235, 1)' : 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        fill: type === 'line',
      }],
    };
  };

  const fetchDashboardData = useCallback(async (productPeriod = 'day', servicePeriod = 'day', subtotalPeriod = 'day') => {
    setIsLoading(true);
    setError(null);
    try {
      const [
        productos,
        servicios,
        evolucionVentas,
        subtotalIva,
        ingresosCategoria,
      ] = await Promise.all([
        getProductosMasVendidos(productPeriod),
        getServiciosMasVendidos(servicePeriod),
        getEvolucionVentas(),
        getSubtotalIva(subtotalPeriod),
        getIngresosPorCategoria(),
      ]);

      setProductChartData(formatChartData(productos, `Top 5 Productos Más Vendidos (${productPeriod})`));
      setServiceChartData(formatChartData(servicios, `Top 5 Servicios Más Vendidos (${servicePeriod})`));
      
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
            label: 'Número de Transacciones',
            data: evolucionVentas.map(item => item.transacciones),
            borderColor: 'rgba(255, 99, 132, 1)',
            fill: false,
          },
        ],
      });

      setIvaSubtotalData({
        labels: ['Subtotal', 'IVA'],
        datasets: [{
          label: 'Monto Acumulado',
          data: [subtotalIva.subtotal, subtotalIva.iva],
          backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 206, 86, 0.6)'],
        }],
      });

      setIncomeByCategoryData({
        labels: ingresosCategoria.map(item => item.categoria),
        datasets: [{
          label: 'Ingresos',
          data: ingresosCategoria.map(item => item.total),
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
        }],
      });

    } catch (err) {
      console.error("Error al cargar datos del dashboard:", err);
      setError("No se pudieron cargar los datos del dashboard. " + (err.response?.data?.message || err.message));
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
    fetchDashboardData,
  };
};

export default useDashboard;
