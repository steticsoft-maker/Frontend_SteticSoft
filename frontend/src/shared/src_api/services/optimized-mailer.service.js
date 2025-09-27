// src/services/optimized-mailer.service.js
"use strict";

const { sendMailWithSendGrid } = require("./sendgrid.service.js");

/**
 * Servicio de correo optimizado - SendGrid como método principal
 * Tiempo de respuesta objetivo: < 2 segundos
 */
class OptimizedMailerService {
  constructor() {
    this.sendGridAvailable = !!process.env.SENDGRID_API_KEY;
    
    if (this.sendGridAvailable) {
      console.log("📨 Servicio de correo optimizado: SendGrid como método principal");
    } else {
      console.warn("⚠️ SendGrid no disponible. El envío de correos podría fallar.");
    }
  }

  /**
   * Envía un correo de forma rápida y eficiente
   * @param {Object} mailOptions - Opciones del correo
   * @param {string} mailOptions.to - Destinatario
   * @param {string} mailOptions.subject - Asunto
   * @param {string} mailOptions.html - Contenido HTML
   * @param {string} [mailOptions.text] - Contenido texto plano
   * @param {string} [mailOptions.from] - Remitente
   * @param {Array} [mailOptions.attachments] - Adjuntos
   * @returns {Promise<Object>} Resultado del envío
   */
  async sendMail(mailOptions) {
    const startTime = Date.now();
    
    try {
      console.log(`📤 Enviando correo optimizado a: ${mailOptions.to}`);
      console.log(`📋 Asunto: ${mailOptions.subject}`);

      // Validación básica
      if (!mailOptions.to || !mailOptions.subject || !mailOptions.html) {
        throw new Error("Faltan parámetros requeridos: to, subject, html");
      }

      // Envío directo con SendGrid (método principal)
      if (this.sendGridAvailable) {
        console.log("🚀 Usando SendGrid (método optimizado)");
        
        const result = await sendMailWithSendGrid({
          to: mailOptions.to,
          subject: mailOptions.subject,
          html: mailOptions.html,
          text: mailOptions.text,
          from: mailOptions.from,
          attachments: mailOptions.attachments
        });

        const duration = Date.now() - startTime;
        
        if (result.success) {
          console.log(`✅ Correo enviado exitosamente en ${duration}ms`);
          return {
            success: true,
            messageId: result.messageId,
            method: "SendGrid",
            duration: duration,
            response: result.response
          };
        } else {
          throw new Error(`SendGrid falló: ${result.error.message}`);
        }
      } else {
        throw new Error("SendGrid no está disponible y no hay método de fallback configurado");
      }

    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`❌ Error al enviar correo en ${duration}ms:`, error.message);
      
      return {
        success: false,
        error: error.message,
        method: this.sendGridAvailable ? "SendGrid" : "None",
        duration: duration
      };
    }
  }

  /**
   * Verifica si el servicio está disponible
   * @returns {boolean} true si está disponible
   */
  isAvailable() {
    return this.sendGridAvailable;
  }

  /**
   * Obtiene información del servicio
   * @returns {Object} Información del servicio
   */
  getServiceInfo() {
    return {
      primary: "SendGrid",
      available: this.sendGridAvailable,
      fallback: "None",
      optimized: true
    };
  }
}

// Crear instancia única del servicio
const optimizedMailerService = new OptimizedMailerService();

module.exports = optimizedMailerService;
