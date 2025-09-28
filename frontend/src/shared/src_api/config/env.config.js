// src/config/env.config.js
require("dotenv").config();

const env = process.env.NODE_ENV || "development";
const isProduction = env === "production";
const isDevelopment = env === "development";

// Orígenes permitidos para CORS
const ALLOWED_ORIGINS = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((url) => url.trim())
  : isProduction
    ? []
    : ["http://localhost:5173"];

/**
 * Lógica para validar el origen en CORS.
 * @param {string} origin
 * @param {function} callback
 */
const getCorsOriginLogic = (origin, callback) => {
  if (!origin || ALLOWED_ORIGINS.includes(origin)) {
    callback(null, true);
  } else {
    callback(new Error("CORS: Origin no permitido → " + origin));
  }
};

/**
 * Valida que las variables obligatorias estén presentes.
 * @param {string[]} keys
 */
function validateRequiredEnv(keys) {
  keys.forEach((key) => {
    if (!process.env[key]) {
      console.warn(
        `[env.config] Advertencia: La variable ${key} no está definida en el entorno.`
      );
    }
  });
}

// Variables obligatorias según el entorno
const requiredInProduction = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "JWT_SECRET",
  "SESSION_SECRET",
  "DATABASE_URL",
  "SENDGRID_API_KEY",
];

const requiredInDevelopment = ["JWT_SECRET", "SESSION_SECRET"];

// Validar variables según el entorno
if (isProduction) {
  validateRequiredEnv(requiredInProduction);
} else {
  validateRequiredEnv(requiredInDevelopment);
}

module.exports = {
  NODE_ENV: env,
  IS_PRODUCTION: isProduction,
  IS_DEVELOPMENT: isDevelopment,

  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  APP_NAME: process.env.APP_NAME || "La fuente del peluquero",
  FRONTEND_URL:
    process.env.FRONTEND_URL || "https://lafuentedelpeluquero.onrender.com",

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  DATABASE_URL: process.env.DATABASE_URL,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  DB_NAME: process.env.DB_NAME,
  DB_DIALECT: process.env.DB_DIALECT || "sqlite",
  DB_STORAGE: process.env.DB_STORAGE || "development.sqlite",
  DB_SSL_REQUIRED: process.env.DB_SSL_REQUIRED === "true",
  DB_REJECT_UNAUTHORIZED: process.env.DB_REJECT_UNAUTHORIZED === "true",

  JWT_SECRET: process.env.JWT_SECRET,
  SESSION_SECRET: process.env.SESSION_SECRET,

  // Configuración de SendGrid
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  EMAIL_FROM:
    process.env.EMAIL_FROM ||
    `"La fuente del peluquero - Notificaciones" <Lafuentedelpeluquero.com>`,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,

  LOG_LEVEL: process.env.LOG_LEVEL || (isProduction ? "short" : "dev"),

  // Configuraciones de seguridad
  ENABLE_DEBUG_LOGS: process.env.ENABLE_DEBUG_LOGS === "true" || isDevelopment,
  ENABLE_CORS_LOGGING:
    process.env.ENABLE_CORS_LOGGING === "true" || isDevelopment,
  API_RATE_LIMIT: process.env.API_RATE_LIMIT || (isProduction ? "100" : "1000"),
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || "24h",

  // Configuraciones de CORS más granulares
  CORS_ORIGIN:
    process.env.CORS_ORIGIN || (isProduction ? "" : "http://localhost:5173"),
  CORS_CREDENTIALS: process.env.CORS_CREDENTIALS !== "false", // Por defecto true
  CORS_MAX_AGE: process.env.CORS_MAX_AGE || "86400", // 24 horas

  // Headers de seguridad
  SECURITY_HEADERS: {
    X_CONTENT_TYPE_OPTIONS: "nosniff",
    X_FRAME_OPTIONS: "DENY",
    X_XSS_PROTECTION: "1; mode=block",
    REFERRER_POLICY: "strict-origin-when-cross-origin",
    PERMISSIONS_POLICY: "geolocation=(), microphone=(), camera=()",
  },
};
