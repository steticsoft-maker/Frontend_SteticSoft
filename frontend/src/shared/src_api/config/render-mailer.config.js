// src/config/render-mailer.config.js
// Configuración específica para Render.com

const nodemailer = require("nodemailer");
const {
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_SECURE,
  EMAIL_USER,
  EMAIL_PASS,
} = require("./env.config");

if (!EMAIL_USER || !EMAIL_PASS) {
  console.warn(
    "⚠️ Advertencia: Credenciales de email no configuradas para Render."
  );
}

// Configuración ultra-conservadora para Render
const renderMailerConfig = {
  host: EMAIL_HOST || "smtp.gmail.com",
  port: EMAIL_PORT || 587,
  secure: false, // Siempre false para puerto 587
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
  // Configuración TLS mínima para Render
  tls: {
    rejectUnauthorized: false,
  },
  // Timeouts ultra-conservadores para Render
  connectionTimeout: 10000, // 10 segundos
  greetingTimeout: 8000,    // 8 segundos
  socketTimeout: 12000,     // 12 segundos
  // Sin pool ni configuraciones avanzadas
  pool: false,
  maxConnections: 1,
  maxMessages: 3,
  // Configuraciones básicas de red
  requireTLS: true,
  ignoreTLS: false,
};

// Crear transporter específico para Render
const renderTransporter = nodemailer.createTransport(renderMailerConfig);

// No verificar automáticamente en Render - solo configurar
console.log("📨 Transporter de Render configurado (sin verificación automática).");

module.exports = renderTransporter;
