// Ubicación: src/features/dashboard/hooks/useDashboard.js
import { useState, useEffect, useCallback } from 'react';
import {
  getProductosMasVendidos,
  getServiciosMasVendidos,
  getEvolucionVentas,
  getSubtotalIva,
  getIngresosPorCategoria,
} from '../services/dashboardService';

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

  const formatSimpleChartData = (apiData, label, valueKey, nameKey) => {
    if (!apiData || apiData.length === 0) {
      return {
        labels: ['No hay datos'],
        datasets: [{ label, data: [0], backgroundColor: 'rgba(200, 200, 200, 0.6)' }],
      };
    }
    const labels = apiData.map(item => item[nameKey]);
    const data = apiData.map(item => Number(item[valueKey])); // ✅ Ensure data is numeric
    return {
      labels,
      datasets: [{
        label, data, backgroundColor: 'rgba(54, 162, 235, 0.6)',
      }],
    };
  };

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [
        productos, servicios, evolucionVentas, subtotalIva, ingresosCategoria,
      ] = await Promise.all([
        getProductosMasVendidos(), getServiciosMasVendidos(), getEvolucionVentas(),
        getSubtotalIva(), getIngresosPorCategoria(),
      ]);

      setProductChartData(formatSimpleChartData(productos, 'Top 5 Productos', 'totalVendido', 'nombre'));
      setServiceChartData(formatSimpleChartData(servicios, 'Top 5 Servicios', 'totalVendido', 'nombre'));
      setIncomeByCategoryData(formatSimpleChartData(ingresosCategoria, 'Ingresos por Categoría', 'total', 'categoria'));
      
      setSalesEvolutionData({
        labels: evolucionVentas.map(item => item.mes),
        datasets: [{
          type: 'bar', label: 'Total de Ventas ($)',
          data: evolucionVentas.map(item => Number(item.totalVentas)), // ✅ Ensure data is numeric
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
        }, {
          type: 'line', label: 'Nº de Transacciones',
          data: evolucionVentas.map(item => Number(item.transacciones)), // ✅ Ensure data is numeric
          borderColor: 'rgba(255, 99, 132, 1)',
          fill: false,
        }],
      });

      setIvaSubtotalData({
        labels: ['Subtotal ($)', 'IVA ($)'],
        datasets: [{
          data: [Number(subtotalIva.subtotal), Number(subtotalIva.iva)], // ✅ Ensure data is numeric
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

  // ✅ CORRECCIÓN: Se añade fetchDashboardData al objeto que se retorna.
  return {
    productChartData, serviceChartData, salesEvolutionData,
    ivaSubtotalData, incomeByCategoryData, isLoading, error,
    fetchDashboardData,
  };
};

export default useDashboard;