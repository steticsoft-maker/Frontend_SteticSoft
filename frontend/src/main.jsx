// src/main.jsx

import "./bootstrap-init.js"; // Para el conflicto con Bootstrap
import "./chart-init.js"; // Para asegurar que Chart.js esté listo

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { registerLocale, setDefaultLocale } from "react-datepicker";
import es from "date-fns/locale/es";

// Initialize date picker locale
try {
  registerLocale("es", es);
  setDefaultLocale("es");
} catch (error) {
  console.warn("Error initializing date picker locale:", error);
}

// Initialize React app with error boundary
try {
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Error initializing React app:", error);
  // Fallback rendering
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML =
      '<div style="padding: 20px; color: red;">Error loading application. Please refresh the page.</div>';
  }
}
