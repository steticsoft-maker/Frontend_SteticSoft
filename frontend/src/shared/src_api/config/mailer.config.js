// src/config/mailer.config.js
const nodemailer = require("nodemailer");
const {
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_SECURE,
  EMAIL_USER,
  EMAIL_PASS,
  IS_DEVELOPMENT,
} = require("./env.config");

if (!EMAIL_USER || !EMAIL_PASS) {
  console.warn(
    "⚠️ Advertencia: Credenciales de email no configuradas. El envío de correos podría fallar."
  );
}

const DEFAULT_EMAIL_HOST = "smtp.gmail.com";
const DEFAULT_EMAIL_PORT = 587;

const mailerConfig = {
  host: EMAIL_HOST || DEFAULT_EMAIL_HOST,
  port: EMAIL_PORT || DEFAULT_EMAIL_PORT,
  secure: EMAIL_SECURE || false,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
  // Configuración mejorada para Gmail SMTP
  tls: {
    rejectUnauthorized: false, // Permitir certificados no verificados
    ciphers: "SSLv3",
    minVersion: "TLSv1.2", // Versión mínima de TLS
    maxVersion: "TLSv1.3", // Versión máxima de TLS
  },
  // Timeouts optimizados para Render
  connectionTimeout: 15000, // 15 segundos (Render tiene límites)
  greetingTimeout: 10000, // 10 segundos
  socketTimeout: 20000, // 20 segundos
  // Configuraciones adicionales para mejorar la estabilidad
  pool: false, // Deshabilitar pool para evitar problemas de conexión
  maxConnections: 1, // Una sola conexión por vez
  maxMessages: 10, // Máximo 10 mensajes por conexión
  rateDelta: 2000, // 2 segundos entre reintentos
  rateLimit: 2, // Máximo 2 mensajes por segundo
  // Configuraciones adicionales de red
  requireTLS: true,
  ignoreTLS: false,
  // Configuración de DNS
  dnsTimeout: 10000, // 10 segundos para resolución DNS
};

const transporter = nodemailer.createTransport(mailerConfig);

// Solo verificar automáticamente si NO estamos en Render
if (!process.env.RENDER) {
  transporter.verify((error, success) => {
    if (error) {
      console.error(
        "❌ Error al verificar la configuración de Nodemailer:",
        error.message
      );
      console.warn("⚠️ El servicio de correo podría no estar operativo.");
    } else {
      console.log("📨 Servidor de correo listo para enviar mensajes.");
    }
  });
} else {
  console.log("📨 Servidor de correo configurado (verificación diferida para Render).");
}

module.exports = transporter;
