// src/services/mailer.service.js
"use strict";

const { sendMailWithSendGrid } = require("./sendgrid.service.js");
const { EMAIL_FROM } = require("../config/env.config.js");

/**
 * Envía un correo electrónico usando SendGrid.
 * @param {object} mailData - Datos del correo a enviar.
 * @param {string} mailData.to - Destinatario(s) del correo, separados por coma si son varios.
 * @param {string} mailData.subject - Asunto del correo.
 * @param {string} mailData.html - Contenido HTML del correo.
 * @param {string} [mailData.text] - Contenido en texto plano del correo (opcional, fallback).
 * @param {string} [mailData.from] - Remitente del correo (opcional, por defecto usa EMAIL_FROM).
 * @param {Array} [mailData.attachments] - Array de adjuntos (opcional).
 * @returns {Promise<object>} Un objeto indicando el resultado del envío.
 * Ej: { success: true, messageId: '...', response: '...' }
 * o  { success: false, error: Error }
 */
const sendMail = async ({ to, subject, html, text, from, attachments }) => {
  if (!to || !subject || !html) {
    const errorMessage =
      "Faltan parámetros requeridos para enviar el correo (to, subject, html).";
    console.error(`❌ ${errorMessage}`);
    return { success: false, error: new Error(errorMessage) };
  }

  const mailOptions = {
    from:
      from ||
      EMAIL_FROM ||
      '"SteticSoft - Notificaciones" <noreply@steticsoft.com>',
    to: to,
    subject: subject,
    html: html,
    text: text || html.replace(/<[^>]*>/g, ""),
    attachments: attachments || [],
  };

  try {
    console.log(`📤 Enviando correo con SendGrid a: ${to}`);

    const result = await sendMailWithSendGrid(mailOptions);

    if (result.success) {
      console.log(
        `✅ Correo enviado exitosamente a: ${to}. Asunto: "${subject}". Message ID: ${result.messageId}`
      );
      return {
        success: true,
        messageId: result.messageId,
        response: result.response,
        statusCode: result.statusCode,
      };
    } else {
      throw result.error;
    }
  } catch (error) {
    console.error(
      `❌ Error al enviar correo a ${to} con asunto "${subject}":`,
      error.message
    );
    return { success: false, error: error };
  }
};

/**
 * Verifica la configuración de SendGrid.
 * @returns {Promise<boolean>} true si la configuración es válida, false en caso contrario.
 */
const verifyMailerConnection = async () => {
  if (!process.env.SENDGRID_API_KEY) {
    console.error("❌ SENDGRID_API_KEY no está configurada.");
    return false;
  }

  console.log("📨 SendGrid está configurado correctamente.");
  return true;
};

// Exportar tanto la función sendMail como verifyMailerConnection
module.exports = sendMail;
module.exports.verifyMailerConnection = verifyMailerConnection;
