// Ubicación: src/features/dashboard/hooks/useDashboard.js
import { useState, useEffect, useCallback } from "react";
import {
  getProductosMasVendidos,
  getServiciosMasVendidos,
  getEvolucionVentas,
  getSubtotalIva,
  getIngresosPorCategoria,
} from "../services/dashboardService";

// Paleta de colores mejorada para las gráficas
const colorPalettes = {
  primary: [
    "rgba(99, 102, 241, 0.9)", // Indigo - Productos
    "rgba(16, 185, 129, 0.9)", // Emerald - Servicios
    "rgba(245, 158, 11, 0.9)", // Amber - Ventas
    "rgba(239, 68, 68, 0.9)", // Red - IVA
    "rgba(139, 92, 246, 0.9)", // Violet - Subtotal
    "rgba(34, 197, 94, 0.9)", // Green - Ingresos
    "rgba(251, 146, 60, 0.9)", // Orange
    "rgba(236, 72, 153, 0.9)", // Pink
  ],
  borders: [
    "rgba(99, 102, 241, 1)", // Indigo
    "rgba(16, 185, 129, 1)", // Emerald
    "rgba(245, 158, 11, 1)", // Amber
    "rgba(239, 68, 68, 1)", // Red
    "rgba(139, 92, 246, 1)", // Violet
    "rgba(34, 197, 94, 1)", // Green
    "rgba(251, 146, 60, 1)", // Orange
    "rgba(236, 72, 153, 1)", // Pink
  ],
  hover: [
    "rgba(99, 102, 241, 0.7)", // Indigo
    "rgba(16, 185, 129, 0.7)", // Emerald
    "rgba(245, 158, 11, 0.7)", // Amber
    "rgba(239, 68, 68, 0.7)", // Red
    "rgba(139, 92, 246, 0.7)", // Violet
    "rgba(34, 197, 94, 0.7)", // Green
    "rgba(251, 146, 60, 0.7)", // Orange
    "rgba(236, 72, 153, 0.7)", // Pink
  ],
  gradients: [
    "linear-gradient(135deg, rgba(99, 102, 241, 0.9), rgba(99, 102, 241, 0.6))",
    "linear-gradient(135deg, rgba(16, 185, 129, 0.9), rgba(16, 185, 129, 0.6))",
    "linear-gradient(135deg, rgba(245, 158, 11, 0.9), rgba(245, 158, 11, 0.6))",
    "linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(239, 68, 68, 0.6))",
    "linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(139, 92, 246, 0.6))",
  ],
};

const safeDefaultChartData = {
  labels: ["Cargando..."],
  datasets: [
    {
      label: "Cargando datos...",
      data: [],
      backgroundColor: colorPalettes.primary[0],
      borderColor: colorPalettes.primary[0].replace("0.8", "1"),
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false,
    },
  ],
};

const useDashboard = () => {
  const [productChartData, setProductChartData] =
    useState(safeDefaultChartData);
  const [serviceChartData, setServiceChartData] =
    useState(safeDefaultChartData);
  const [salesEvolutionData, setSalesEvolutionData] =
    useState(safeDefaultChartData);
  const [ivaSubtotalData, setIvaSubtotalData] = useState(safeDefaultChartData);
  const [incomeByCategoryData, setIncomeByCategoryData] =
    useState(safeDefaultChartData);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatSimpleChartData = (
    apiData,
    label,
    valueKey,
    nameKey,
    colorIndex = 0
  ) => {
    if (!apiData || apiData.length === 0) {
      return {
        labels: ["No hay datos disponibles"],
        datasets: [
          {
            label,
            data: [0],
            backgroundColor: colorPalettes.primary[colorIndex],
            borderColor: colorPalettes.borders[colorIndex],
            borderWidth: 2,
            borderRadius: {
              topLeft: 8,
              topRight: 8,
              bottomLeft: 0,
              bottomRight: 0,
            },
            borderSkipped: false,
            hoverBackgroundColor: colorPalettes.hover[colorIndex],
            hoverBorderColor: colorPalettes.borders[colorIndex],
            hoverBorderWidth: 3,
          },
        ],
      };
    }

    const labels = apiData.map((item) => item[nameKey]);
    const data = apiData.map((item) => Number(item[valueKey]));

    // Crear colores con gradiente basado en el índice de color
    const backgroundColor = data.map((_, index) => {
      const baseColorIndex =
        (colorIndex + index) % colorPalettes.primary.length;
      return colorPalettes.primary[baseColorIndex];
    });

    const borderColor = data.map((_, index) => {
      const baseColorIndex =
        (colorIndex + index) % colorPalettes.borders.length;
      return colorPalettes.borders[baseColorIndex];
    });

    const hoverBackgroundColor = data.map((_, index) => {
      const baseColorIndex = (colorIndex + index) % colorPalettes.hover.length;
      return colorPalettes.hover[baseColorIndex];
    });

    return {
      labels,
      datasets: [
        {
          label,
          data,
          backgroundColor,
          borderColor,
          borderWidth: 2,
          borderRadius: {
            topLeft: 8,
            topRight: 8,
            bottomLeft: 0,
            bottomRight: 0,
          },
          borderSkipped: false,
          hoverBackgroundColor,
          hoverBorderColor: borderColor,
          hoverBorderWidth: 3,
          // Agregar animación de entrada
          animation: {
            duration: 2000,
            easing: "easeOutQuart",
          },
        },
      ],
    };
  };

  const fetchDashboardData = useCallback(
    async (productTimePeriod, serviceTimePeriod, subtotalTimePeriod) => {
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
          getProductosMasVendidos(productTimePeriod),
          getServiciosMasVendidos(serviceTimePeriod),
          getEvolucionVentas(),
          getSubtotalIva(subtotalTimePeriod),
          getIngresosPorCategoria(),
        ]);

        setProductChartData(
          formatSimpleChartData(
            productos,
            "Top 5 Productos",
            "totalVendido",
            "nombre",
            0
          )
        );
        setServiceChartData(
          formatSimpleChartData(
            servicios,
            "Top 5 Servicios",
            "totalVendido",
            "nombre",
            1
          )
        );
        setIncomeByCategoryData(
          formatSimpleChartData(
            ingresosCategoria,
            "Ingresos por Categoría",
            "total",
            "categoria",
            2
          )
        );

        setSalesEvolutionData({
          labels: evolucionVentas.map((item) => item.mes),
          datasets: [
            {
              type: "bar",
              label: "Total de Ventas",
              data: evolucionVentas.map((item) => Number(item.totalVentas)),
              backgroundColor: colorPalettes.primary[2], // Amber para ventas
              borderColor: colorPalettes.borders[2],
              borderWidth: 2,
              borderRadius: {
                topLeft: 8,
                topRight: 8,
                bottomLeft: 0,
                bottomRight: 0,
              },
              borderSkipped: false,
              hoverBackgroundColor: colorPalettes.hover[2],
              hoverBorderColor: colorPalettes.borders[2],
              hoverBorderWidth: 3,
            },
            {
              type: "line",
              label: "Nº de Transacciones",
              data: evolucionVentas.map((item) => Number(item.transacciones)),
              borderColor: colorPalettes.borders[1], // Emerald para transacciones
              backgroundColor: colorPalettes.primary[1].replace("0.9", "0.1"),
              fill: true,
              borderWidth: 3,
              pointBackgroundColor: colorPalettes.borders[1],
              pointBorderColor: "#ffffff",
              pointBorderWidth: 3,
              pointRadius: 6,
              pointHoverRadius: 10,
              pointHoverBorderWidth: 4,
              tension: 0.4,
            },
          ],
        });

        setIvaSubtotalData({
          labels: ["Subtotal", "IVA"],
          datasets: [
            {
              label: "Desglose Financiero",
              data: [Number(subtotalIva.subtotal), Number(subtotalIva.iva)],
              backgroundColor: [
                colorPalettes.primary[4], // Violet para Subtotal
                colorPalettes.primary[3], // Red para IVA
              ],
              borderColor: [colorPalettes.borders[4], colorPalettes.borders[3]],
              borderWidth: 2,
              borderRadius: {
                topLeft: 8,
                topRight: 8,
                bottomLeft: 0,
                bottomRight: 0,
              },
              borderSkipped: false,
              hoverBackgroundColor: [
                colorPalettes.hover[4],
                colorPalettes.hover[3],
              ],
              hoverBorderColor: [
                colorPalettes.borders[4],
                colorPalettes.borders[3],
              ],
              hoverBorderWidth: 3,
            },
          ],
        });
      } catch (err) {
        console.error("Error al cargar datos del dashboard:", err);
        setError(
          "No se pudieron cargar los datos. " +
            (err.response?.data?.message || err.message)
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // ✅ CORRECCIÓN: Se añade fetchDashboardData al objeto que se retorna.
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
