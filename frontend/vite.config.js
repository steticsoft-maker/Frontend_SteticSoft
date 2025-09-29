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
          // Vendor chunks - Disable manual chunking to avoid circular dependencies
          if (id.includes("node_modules")) {
            // Put everything in a single vendor chunk to avoid initialization issues
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
    // Add sourcemap for better debugging in production
    sourcemap: false,
    // Use default minifier to avoid terser dependency issues
    minify: true,
  },
});
