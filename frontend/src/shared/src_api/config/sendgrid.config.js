// src/config/sendgrid.config.js
// Configuración de SendGrid para Render.com

const sgMail = require("@sendgrid/mail");
const { EMAIL_FROM } = require("./env.config");

// Configurar API Key de SendGrid
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

if (!SENDGRID_API_KEY) {
  console.warn(
    "⚠️ Advertencia: SENDGRID_API_KEY no configurada. El envío de correos con SendGrid podría fallar."
  );
} else {
  sgMail.setApiKey(SENDGRID_API_KEY);
  console.log("📨 SendGrid configurado correctamente.");
}

// Configuración por defecto para SendGrid
const sendGridConfig = {
  from:
    EMAIL_FROM ||
    '"La fuente del peluquero" <noreply@lafuentedelpeluquero.com>',
  replyTo: process.env.EMAIL_FROM || "lafuentedelpeluquero@gmail.com",
};

module.exports = {
  sgMail,
  sendGridConfig,
};
