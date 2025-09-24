// Chart.js initialization
// This file ensures Chart.js is properly initialized

import { Chart, registerables } from "chart.js";

// Register all Chart.js components
Chart.register(...registerables);

// Set default configuration for Chart.js
Chart.defaults.font.family = "system-ui, -apple-system, sans-serif";
Chart.defaults.responsive = true;
Chart.defaults.maintainAspectRatio = false;
