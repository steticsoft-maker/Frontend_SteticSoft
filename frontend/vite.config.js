import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes("node_modules")) {
            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("react-router")
            ) {
              return "react-vendor";
            }
            if (
              id.includes("@mui") ||
              id.includes("react-bootstrap") ||
              id.includes("bootstrap")
            ) {
              return "ui-vendor";
            }
            if (id.includes("chart.js") || id.includes("react-chartjs")) {
              return "chart-vendor";
            }
            if (
              id.includes("axios") ||
              id.includes("moment") ||
              id.includes("date-fns") ||
              id.includes("jwt-decode")
            ) {
              return "utils-vendor";
            }
            if (id.includes("jspdf") || id.includes("dompurify")) {
              return "pdf-vendor";
            }
            if (id.includes("sweetalert2")) {
              return "sweet-vendor";
            }
            if (id.includes("@fortawesome") || id.includes("react-icons")) {
              return "icons-vendor";
            }
            if (
              id.includes("react-hook-form") ||
              id.includes("react-select") ||
              id.includes("react-datepicker") ||
              id.includes("react-calendar")
            ) {
              return "forms-vendor";
            }
            if (id.includes("react-modal") || id.includes("react-toastify")) {
              return "modal-vendor";
            }
            if (id.includes("html2canvas")) {
              return "html2canvas-vendor";
            }
            return "vendor";
          }
          // Feature chunks
          if (id.includes("/src/features/auth/")) {
            return "auth";
          }
          if (id.includes("/src/features/usuarios/")) {
            return "usuarios";
          }
          if (id.includes("/src/features/dashboard/")) {
            return "dashboard";
          }
          if (
            id.includes("/src/features/productosAdmin/") ||
            id.includes("/src/features/categoriasProductoAdmin/")
          ) {
            return "productos";
          }
          if (
            id.includes("/src/features/serviciosAdmin/") ||
            id.includes("/src/features/categoriasServicioAdmin/")
          ) {
            return "servicios";
          }
          if (id.includes("/src/features/clientes/")) {
            return "clientes";
          }
          if (id.includes("/src/features/citas/")) {
            return "citas";
          }
          if (id.includes("/src/features/ventas/")) {
            return "ventas";
          }
          if (id.includes("/src/features/compras/")) {
            return "compras";
          }
          if (id.includes("/src/features/proveedores/")) {
            return "proveedores";
          }
          if (id.includes("/src/features/abastecimiento/")) {
            return "abastecimiento";
          }
          if (id.includes("/src/features/novedades/")) {
            return "novedades";
          }
          if (id.includes("/src/features/roles/")) {
            return "roles";
          }
          if (id.includes("/src/features/home/")) {
            return "home";
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
