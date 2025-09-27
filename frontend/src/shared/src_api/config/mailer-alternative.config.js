// src/config/mailer-alternative.config.js
// Configuración alternativa para Gmail SMTP con mejor compatibilidad

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

// Configuración alternativa más simple y robusta
const alternativeMailerConfig = {
  host: EMAIL_HOST || DEFAULT_EMAIL_HOST,
  port: EMAIL_PORT || DEFAULT_EMAIL_PORT,
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
  // Configuración TLS simplificada
  tls: {
    rejectUnauthorized: false,
    ciphers: "SSLv3",
  },
  // Timeouts optimizados para Render
  connectionTimeout: 12000, // 12 segundos (más conservador para Render)
  greetingTimeout: 8000, // 8 segundos
  socketTimeout: 15000, // 15 segundos
  // Sin pool para evitar problemas
  pool: false,
  maxConnections: 1,
  maxMessages: 5,
  // Configuraciones de red básicas
  requireTLS: true,
  ignoreTLS: false,
};

// Crear transporter alternativo
const alternativeTransporter = nodemailer.createTransport(
  alternativeMailerConfig
);

// Solo verificar automáticamente si NO estamos en Render
if (!process.env.RENDER) {
  alternativeTransporter.verify((error, success) => {
    if (error) {
      console.error(
        "❌ Error al verificar la configuración alternativa de Nodemailer:",
        error.message
      );
      console.warn(
        "⚠️ El servicio de correo alternativo podría no estar operativo."
      );
    } else {
      console.log(
        "📨 Servidor de correo alternativo listo para enviar mensajes."
      );
    }
  });
} else {
  console.log(
    "📨 Servidor de correo alternativo configurado (verificación diferida para Render)."
  );
}

module.exports = alternativeTransporter;
