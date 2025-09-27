// src/utils/emailTemplates.utils.js
const { APP_NAME, FRONTEND_URL } = require("../config/env.config.js");

/**
 * Genera el template HTML para el correo de bienvenida
 * @param {string} nombre - Nombre del usuario
 * @returns {string} HTML del correo de bienvenida
 */
const generarTemplateBienvenida = (nombre) => {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; border-radius: 15px;">
      <div style="background: white; padding: 40px 30px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2c3e50; font-size: 28px; margin: 0; font-weight: 600;">¡Bienvenido/a ${
            APP_NAME || "La fuente del peluquero"
          }!</h1>
          <div style="width: 60px; height: 4px; background: linear-gradient(135deg, #667eea, #764ba2); margin: 15px auto; border-radius: 2px;"></div>
        </div>
        
        <div style="text-align: center; margin-bottom: 25px;">
          <h2 style="color: #34495e; font-size: 22px; margin: 0; font-weight: 500;">Hola ${nombre} 👋</h2>
        </div>
        
        <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #667eea;">
          <p style="color: #495057; font-size: 16px; line-height: 1.6; margin: 0; text-align: center;">
            <strong>¡Tu cuenta ha sido creada exitosamente!</strong><br>
            Estamos emocionados de tenerte como parte de nuestra familia de belleza y cuidado personal.
          </p>
        </div>
        
        <div style="margin: 25px 0;">
          <h3 style="color: #2c3e50; font-size: 18px; margin-bottom: 15px; font-weight: 600;">✨ ¿Qué puedes hacer ahora?</h3>
          <ul style="color: #495057; font-size: 15px; line-height: 1.8; padding-left: 20px;">
            <li>📅 <strong>Agendar citas</strong> con nuestros especialistas</li>
            <li>🛍️ <strong>Explorar servicios</strong> y productos de calidad</li>
            <li>👤 <strong>Gestionar tu perfil</strong> y preferencias</li>
            <li>📱 <strong>Recibir notificaciones</strong> sobre tus citas</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="${
              FRONTEND_URL || "https://lafuentedelpeluquero.onrender.com"
            }" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; display: inline-block; box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;">
            🚀 Comenzar ahora
          </a>
        </div>
        
        <div style="border-top: 1px solid #e9ecef; padding-top: 25px; margin-top: 30px; text-align: center;">
          <p style="color: #6c757d; font-size: 14px; line-height: 1.5; margin: 0;">
            Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.<br>
            <strong>Estamos aquí para ti 💙</strong>
          </p>
          <p style="color: #495057; font-size: 15px; margin: 15px 0 0 0; font-weight: 500;">
            Con cariño,<br>
            <span style="color: #667eea; font-weight: 600;">El equipo de ${
              APP_NAME || "La fuente del peluquero"
            }</span>
          </p>
        </div>
      </div>
    </div>`;
};

/**
 * Genera el template HTML para el correo de recuperación de contraseña
 * @param {string} nombreUsuario - Nombre del usuario
 * @param {string} correo - Correo del usuario
 * @param {string} tokenRecuperacion - Código OTP de 6 dígitos
 * @param {number} TOKEN_RECUPERACION_EXPIRATION_MINUTES - Minutos de expiración del token
 * @returns {string} HTML del correo de recuperación
 */
const generarTemplateRecuperacion = (
  nombreUsuario,
  correo,
  tokenRecuperacion,
  TOKEN_RECUPERACION_EXPIRATION_MINUTES
) => {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; border-radius: 15px;">
      <div style="background: white; padding: 40px 30px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="background: linear-gradient(135deg, #ff6b6b, #ee5a24); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 32px;">
            🔐
          </div>
          <h1 style="color: #2c3e50; font-size: 24px; margin: 0; font-weight: 600;">Recuperación de Contraseña</h1>
          <div style="width: 60px; height: 4px; background: linear-gradient(135deg, #667eea, #764ba2); margin: 15px auto; border-radius: 2px;"></div>
        </div>
        
        <div style="text-align: center; margin-bottom: 25px;">
          <h2 style="color: #34495e; font-size: 18px; margin: 0; font-weight: 500;">Hola ${nombreUsuario} 👋</h2>
          <p style="color: #6c757d; font-size: 14px; margin: 5px 0 0 0;">${correo}</p>
        </div>
        
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #f39c12;">
          <p style="color: #856404; font-size: 15px; line-height: 1.6; margin: 0; text-align: center;">
            <strong>¡Hemos recibido tu solicitud!</strong><br>
            Has solicitado restablecer tu contraseña para tu cuenta en <strong>${
              APP_NAME || "La fuente del peluquero"
            }</strong>.
          </p>
        </div>
        
        <div style="margin: 30px 0;">
          <h3 style="color: #2c3e50; font-size: 16px; margin-bottom: 15px; font-weight: 600; text-align: center;">🔑 Tu Código de Verificación</h3>
          <p style="color: #495057; font-size: 14px; text-align: center; margin-bottom: 20px;">
            Usa el siguiente código de 6 dígitos para completar el proceso. Este código es confidencial y no lo compartas con nadie.
          </p>
          
          <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 25px; border-radius: 15px; text-align: center; margin: 25px 0; box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);">
            <div style="font-size: 42px; font-weight: bold; color: white; letter-spacing: 8px; font-family: 'Courier New', monospace; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
              ${tokenRecuperacion}
            </div>
          </div>
          
          <div style="background: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #17a2b8;">
            <p style="color: #0c5460; font-size: 14px; margin: 0; text-align: center;">
              ⏰ <strong>Importante:</strong> Este código expirará en <strong>${TOKEN_RECUPERACION_EXPIRATION_MINUTES} minutos</strong> por seguridad.
            </p>
          </div>
        </div>
        
        <div style="background: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #dc3545;">
          <p style="color: #721c24; font-size: 14px; margin: 0; text-align: center;">
            🛡️ <strong>¿No solicitaste este cambio?</strong><br>
            Si no fuiste tú quien solicitó restablecer la contraseña, por favor ignora este correo. Tu cuenta está segura.
          </p>
        </div>
        
        <div style="border-top: 1px solid #e9ecef; padding-top: 25px; margin-top: 30px; text-align: center;">
          <p style="color: #6c757d; font-size: 14px; line-height: 1.5; margin: 0;">
            Si tienes problemas con el código o necesitas ayuda, contáctanos.<br>
            <strong>Estamos aquí para ayudarte 💙</strong>
          </p>
          <p style="color: #495057; font-size: 15px; margin: 15px 0 0 0; font-weight: 500;">
            Con cariño,<br>
            <span style="color: #667eea; font-weight: 600;">El equipo de ${
              APP_NAME || "La fuente del peluquero"
            }</span>
          </p>
        </div>
      </div>
    </div>`;
};

/**
 * Genera el template HTML para el correo de confirmación de cambio de contraseña
 * @param {string} correo - Correo del usuario
 * @returns {string} HTML del correo de confirmación
 */
const generarTemplateConfirmacionCambio = (correo) => {
  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
        <p>Hola ${correo},</p>
        <p>Tu contraseña para ${
          APP_NAME || "La fuente del peluquero"
        } ha sido actualizada exitosamente.</p>
        <p>Si no realizaste este cambio, por favor contacta a soporte inmediatamente.</p>
    </div>`;
};

module.exports = {
  generarTemplateBienvenida,
  generarTemplateRecuperacion,
  generarTemplateConfirmacionCambio,
};
