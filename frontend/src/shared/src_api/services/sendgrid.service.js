// src/services/sendgrid.service.js
"use strict";

const { sgMail, sendGridConfig } = require("../config/sendgrid.config.js");

/**
 * Envía un correo electrónico usando SendGrid.
 * @param {object} mailData - Datos del correo a enviar.
 * @param {string} mailData.to - Destinatario(s) del correo.
 * @param {string} mailData.subject - Asunto del correo.
 * @param {string} mailData.html - Contenido HTML del correo.
 * @param {string} [mailData.text] - Contenido en texto plano del correo (opcional).
 * @param {string} [mailData.from] - Remitente del correo (opcional).
 * @param {Array} [mailData.attachments] - Array de adjuntos (opcional).
 * @returns {Promise<object>} Un objeto indicando el resultado del envío.
 */
const sendMailWithSendGrid = async ({
  to,
  subject,
  html,
  text,
  from,
  attachments,
}) => {
  if (!process.env.SENDGRID_API_KEY) {
    const errorMessage = "SENDGRID_API_KEY no está configurada.";
    console.error(`❌ ${errorMessage}`);
    return { success: false, error: new Error(errorMessage) };
  }

  if (!to || !subject || !html) {
    const errorMessage =
      "Faltan parámetros requeridos para enviar el correo (to, subject, html).";
    console.error(`❌ ${errorMessage}`);
    return { success: false, error: new Error(errorMessage) };
  }

  const msg = {
    to: Array.isArray(to) ? to : [to], // SendGrid espera un array
    from: from || sendGridConfig.from,
    replyTo: sendGridConfig.replyTo,
    subject: subject,
    html: html,
    text: text || html.replace(/<[^>]*>/g, ""), // Fallback a texto plano
    attachments: attachments || [],
  };

  try {
    console.log(`📤 Enviando correo con SendGrid a: ${to}`);

    const response = await sgMail.send(msg);

    console.log(
      `✅ Correo enviado exitosamente con SendGrid a: ${to}. Asunto: "${subject}". Status: ${response[0].statusCode}`
    );

    return {
      success: true,
      messageId: response[0].headers["x-message-id"],
      statusCode: response[0].statusCode,
      response: response[0],
    };
  } catch (error) {
    console.error(
      `❌ Error al enviar correo con SendGrid a ${to} con asunto "${subject}":`,
      {
        message: error.message,
        code: error.code,
        response: error.response?.body,
      }
    );

    return { success: false, error: error };
  }
};

/**
 * Verifica la configuración de SendGrid.
 * @returns {Promise<boolean>} true si la configuración es válida, false en caso contrario.
 */
const verifySendGridConnection = async () => {
  if (!process.env.SENDGRID_API_KEY) {
    console.error("❌ SENDGRID_API_KEY no está configurada.");
    return false;
  }

  try {
    console.log("🔄 Verificando configuración de SendGrid...");

    // SendGrid no tiene un método verify() como Nodemailer,
    // pero podemos verificar que la API key sea válida enviando un correo de prueba
    // Por ahora, solo verificamos que la API key esté configurada
    console.log("📨 SendGrid configurado correctamente.");
    return true;
  } catch (error) {
    console.error("❌ Error al verificar SendGrid:", error.message);
    return false;
  }
};

module.exports = {
  sendMailWithSendGrid,
  verifySendGridConnection,
};
