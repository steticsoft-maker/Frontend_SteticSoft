// src/services/mailer.service.js
"use strict";

const transporter = require("../config/mailer.config.js"); // Importa el transporter configurado
const alternativeTransporter = require("../config/mailer-alternative.config.js"); // Importa el transporter alternativo
const renderTransporter = require("../config/render-mailer.config.js"); // Importa el transporter para Render
const { sendMailWithSendGrid } = require("./sendgrid.service.js"); // Importa el servicio de SendGrid
const { EMAIL_FROM, NODE_ENV } = require("../config/env.config.js"); // Para el remitente por defecto

/**
 * Verifica la conexión y configuración del transporter de Nodemailer.
 * Es útil llamarla al iniciar la aplicación para un diagnóstico temprano.
 * @returns {Promise<boolean>} true si la verificación es exitosa, false en caso contrario.
 */
const verifyMailerConnection = async () => {
  if (!transporter) {
    console.error(
      "❌ Transporter de Nodemailer no está configurado/importado correctamente."
    );
    return false;
  }

  // En Render, no verificar automáticamente para evitar timeouts de inicio
  if (process.env.RENDER) {
    console.log(
      "📨 Render detectado - omitiendo verificación automática de conexión."
    );
    console.log("💡 La verificación se realizará al enviar el primer correo.");
    return true; // Asumir que está bien configurado
  }

  try {
    console.log("🔄 Verificando conexión con el servidor de correo...");

    // Usar timeout personalizado para la verificación
    const verifyWithTimeout = () => {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(
            new Error(
              "Timeout: La verificación de conexión tardó más de 30 segundos"
            )
          );
        }, 30000);

        transporter
          .verify()
          .then(() => {
            clearTimeout(timeout);
            resolve();
          })
          .catch((error) => {
            clearTimeout(timeout);
            reject(error);
          });
      });
    };

    await verifyWithTimeout();
    console.log(
      "📨 Servidor de correo (Nodemailer) está listo para enviar mensajes."
    );
    return true;
  } catch (error) {
    console.error(
      "❌ Error al verificar la configuración del servidor de correo (Nodemailer):",
      {
        message: error.message,
        code: error.code,
        command: error.command,
        response: error.response,
      }
    );

    if (error.code === "ETIMEDOUT" || error.message.includes("Timeout")) {
      console.warn(
        "💡 Sugerencia: Verifica la conectividad de red y configuración SMTP"
      );
    }

    console.warn("⚠️ El servicio de correo podría no estar operativo.");
    return false;
  }
};

/**
 * Envía un correo electrónico usando el transporter configurado.
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
  if (!transporter) {
    const errorMessage =
      "El servicio de correo (transporter) no está inicializado.";
    console.error(`❌ ${errorMessage}`);
    return { success: false, error: new Error(errorMessage) };
  }

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
      '"La fuente del peluquero - Notificaciones" <no-reply@lafuentedelpeluquero.com>', // Remitente
    to: Array.isArray(to) ? to.join(", ") : to, // Destinatario(s)
    subject: subject, // Asunto
    html: html, // Cuerpo HTML
    text: text || html.replace(/<[^>]*>/g, ""), // Cuerpo en texto plano (opcional, fallback)
    attachments: attachments || [], // Adjuntos (opcional)
  };

  try {
    // Función para enviar con reintentos y fallback
    const sendMailWithRetries = async (maxRetries = 4) => {
      let lastError;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(
            `📤 Intento ${attempt}/${maxRetries} de envío de correo...`
          );

          // En el último intento, usar SendGrid si está disponible
          if (attempt === maxRetries && process.env.SENDGRID_API_KEY) {
            console.log(`🔧 Usando SendGrid como último recurso...`);
            const sendGridResult = await sendMailWithSendGrid(mailOptions);
            if (sendGridResult.success) {
              console.log(
                `✅ Correo enviado exitosamente con SendGrid en el intento ${attempt}`
              );
              return sendGridResult.response;
            } else {
              throw new Error(
                `SendGrid falló: ${sendGridResult.error.message}`
              );
            }
          }

          // Elegir transporter según entorno y intento
          let currentTransporter, transporterName;

          if (NODE_ENV === "production" && process.env.RENDER) {
            // En Render, usar transporter específico para Render
            currentTransporter =
              attempt === 1 ? renderTransporter : alternativeTransporter;
            transporterName = attempt === 1 ? "render" : "alternativo";
          } else {
            // En desarrollo, usar lógica original
            currentTransporter =
              attempt <= 2 ? transporter : alternativeTransporter;
            transporterName = attempt <= 2 ? "principal" : "alternativo";
          }

          console.log(`🔧 Usando transporter ${transporterName}...`);

          // Timeout optimizado para Render
          const timeoutDuration = attempt === 1 ? 15000 : 20000; // 15s primer intento, 20s siguientes

          const sendMailWithTimeout = () => {
            return new Promise((resolve, reject) => {
              const timeout = setTimeout(() => {
                reject(
                  new Error(
                    `Timeout: Intento ${attempt} con transporter ${transporterName} tardó más de ${timeoutDuration / 1000} segundos`
                  )
                );
              }, timeoutDuration);

              currentTransporter
                .sendMail(mailOptions)
                .then((info) => {
                  clearTimeout(timeout);
                  resolve(info);
                })
                .catch((error) => {
                  clearTimeout(timeout);
                  reject(error);
                });
            });
          };

          const info = await sendMailWithTimeout();

          if (attempt > 1) {
            console.log(
              `✅ Correo enviado exitosamente en el intento ${attempt} usando transporter ${transporterName}`
            );
          }

          return info;
        } catch (error) {
          lastError = error;
          console.warn(`⚠️ Intento ${attempt} falló:`, error.message);

          if (attempt < maxRetries) {
            const waitTime = Math.pow(2, attempt) * 1000; // Backoff exponencial: 2s, 4s
            console.log(
              `⏳ Esperando ${waitTime / 1000}s antes del siguiente intento...`
            );
            await new Promise((resolve) => setTimeout(resolve, waitTime));
          }
        }
      }

      throw lastError;
    };

    const info = await sendMailWithRetries();
    console.log(
      `✅ Correo enviado exitosamente a: ${mailOptions.to}. Asunto: "${subject}". Message ID: ${info.messageId}`
    );
    return {
      success: true,
      messageId: info.messageId,
      response: info.response,
      envelope: info.envelope,
    };
  } catch (error) {
    // Log más detallado del error
    const errorDetails = {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
    };

    console.error(
      `❌ Error detallado al enviar correo a ${mailOptions.to} con asunto "${subject}":`,
      errorDetails
    );

    // Si es un error de timeout, sugerir soluciones
    if (error.code === "ETIMEDOUT" || error.message.includes("Timeout")) {
      console.warn(
        "💡 Sugerencia: Verifica la conectividad de red y configuración SMTP"
      );
    }

    return { success: false, error: error };
  }
};

// Verificar la conexión al iniciar el módulo (opcional pero recomendado)
// verifyMailerConnection(); // Puedes llamar a esto en server.js o aquí si lo prefieres.

// Exportar tanto la función sendMail como verifyMailerConnection
module.exports = sendMail;
module.exports.verifyMailerConnection = verifyMailerConnection;
