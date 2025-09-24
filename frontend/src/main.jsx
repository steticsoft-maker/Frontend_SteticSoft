// src/main.jsx

import "./bootstrap-init.js"; // ¡IMPORTANTE! Esta debe ser la primera línea para evitar conflictos.

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { registerLocale, setDefaultLocale } from "react-datepicker";
import es from "date-fns/locale/es";

registerLocale("es", es);
setDefaultLocale("es");

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
