// src/app.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

// Importar configuraciones
const { CORS_ORIGIN, NODE_ENV, LOG_LEVEL } = require("./config/env.config.js");

// Importar middlewares
const sessionMiddleware = require("./config/session.config.js");
const apiRoutes = require("./routes/index.js");
const healthRoutes = require("./routes/health.routes.js");
const NotFoundError = require("./errors/NotFoundError.js");
const errorHandler = require("./middlewares/errorHandler.middleware.js");

// Crear la instancia de la aplicación Express
const app = express();

// --- Middlewares Esenciales ---

// 1. Helmet (para headers de seguridad) - Configuración mejorada
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false, // Necesario para algunos recursos
  })
);

// ✅ 2. CORS (CONFIGURACIÓN MEJORADA Y SEGURA)
// Parsear orígenes de la variable de entorno CORS_ORIGIN
const corsOriginsFromEnv = CORS_ORIGIN
  ? CORS_ORIGIN.split(",").map((origin) => origin.trim())
  : [];

const whitelist = [
  ...corsOriginsFromEnv, // Orígenes de la variable de entorno
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:8080", // Flutter web default port
  "http://localhost:3000", // Flutter web alternative port
  "http://localhost:5000", // Flutter web alternative port
  "http://127.0.0.1:8080", // Flutter web localhost
  "http://127.0.0.1:3000", // Flutter web localhost alternative
  "http://127.0.0.1:5000", // Flutter web localhost alternative
  "https://steticsoft-frontend.vercel.app", // Agregar tu dominio de producción
  "https://la-fuente-del-peluquero.onrender.com", // Dominio de producción del frontend
  "https://backend-steticsoft.onrender.com", // Backend en Render
];

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sin origin (ej: Postman, etc.)
    if (!origin) return callback(null, true);

    // Log para debugging en producción
    if (NODE_ENV === "production") {
      console.log(`🌐 CORS: Verificando origen - ${origin}`);
      console.log(`📋 CORS: Whitelist actual -`, whitelist);
    }

    // Verificar si está en la whitelist
    if (whitelist.indexOf(origin) !== -1) {
      console.log(`✅ CORS: Origen permitido - ${origin}`);
      callback(null, true);
    } else {
      // Permitir localhost con cualquier puerto para desarrollo Flutter
      const isLocalhost =
        origin &&
        (origin.startsWith("http://localhost:") ||
          origin.startsWith("http://127.0.0.1:") ||
          origin.startsWith("https://localhost:") ||
          origin.startsWith("https://127.0.0.1:"));

      if (isLocalhost) {
        console.log(`✅ CORS: Permitiendo origen de desarrollo - ${origin}`);
        callback(null, true);
      } else {
        console.warn(`🚫 CORS: Origen bloqueado - ${origin}`);
        console.warn(`📋 CORS: Orígenes permitidos:`, whitelist);
        callback(new Error("Petición bloqueada por políticas de CORS"));
      }
    }
  },
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["X-Total-Count", "X-Page-Count"],
  optionsSuccessStatus: 204,
  maxAge: 86400, // Cache preflight por 24 horas
};

app.use(cors(corsOptions));

// 3. Headers de seguridad adicionales
app.use((req, res, next) => {
  // Headers de seguridad adicionales
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=()"
  );

  // Headers para APIs
  res.setHeader("X-API-Version", "1.0.0");
  res.setHeader("X-Response-Time", Date.now());

  next();
});

// 4. Morgan (para logs de peticiones) - Solo en desarrollo
if (NODE_ENV === "development") {
  app.use(morgan(LOG_LEVEL || "dev"));
} else {
  // En producción, solo logs de errores
  app.use(
    morgan("combined", {
      skip: (req, res) => res.statusCode < 400,
    })
  );
}

// 5. Parseadores de Cuerpo (para leer JSON)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 6. Configuración de Sesiones
app.use(sessionMiddleware);

// --- Rutas ---

// Servir archivos estáticos (si los tienes)
app.use(express.static(path.join(__dirname, "public")));

// Ruta de bienvenida
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "welcome.html"));
});

// Rutas principales de la API
app.use("/api", apiRoutes);

// Rutas de chequeo de salud
app.use("/api/health", healthRoutes);

// --- Manejo de Errores (al final de todo) ---

// Manejador para Rutas No Encontradas (404)
app.use((req, res, next) => {
  next(
    new NotFoundError(
      `El recurso solicitado no fue encontrado: ${req.method} ${req.originalUrl}`
    )
  );
});

// Middleware Global de Manejo de Errores
app.use(errorHandler);

// Exportar la aplicación
module.exports = app;
