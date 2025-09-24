import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  DoughnutController,
  LineController,
  BarController,
  Filler, // <--- 1. Importa el plugin Filler
} from "chart.js";

// Registra todos los componentes que necesitas para tus gráficas
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  DoughnutController,
  LineController,
  BarController,
  Filler // <--- 2. Añádelo aquí al registro
);
