// src/utils/CitaEmailTemplate.js
"use strict";

const mailerService = require("../services/mailer.service.js");
const { formatDateTime } = require("./dateHelpers.js");

const generarTemplateCita = ({ nombreCliente, citaInfo }) => {
  const serviciosHTML =
    citaInfo.servicios && citaInfo.servicios.length > 0
      ? citaInfo.servicios
          .map(
            (s) => `
            <li style="margin-bottom: 10px;">
              <div style="background: #f8f9fa; padding: 15px; margin-bottom: 10px; border-radius: 8px; border-left: 3px solid #667eea;">
                <strong style="color: #2c3e50; font-size: 16px;">${s.nombre}</strong>
                <span style="color: #667eea; font-weight: bold; font-size: 16px; float: right;">$${Number(s.precio || 0).toFixed(2)}</span>
                ${
                  s.descripcion
                    ? `<div style="margin-top: 8px; color: #6c757d; font-size: 14px; font-style: italic;">${s.descripcion}</div>`
                    : ""
                }
              </div>
            </li>`
          )
          .join("")
      : "<li>No hay servicios especificados para esta cita.</li>";

  let tituloCorreo = "Notificación de Cita";
  let parrafoPrincipal = `Tu cita ha sido <strong>${citaInfo.accion}</strong> con éxito.`;

  if (citaInfo.accion.toLowerCase().includes("recordatorio")) {
    tituloCorreo = "Recordatorio de tu Próxima Cita";
    parrafoPrincipal = `Te recordamos tu próxima cita en La fuente del peluquero.`;
  }

  let duracionFormateadaHTML = "";

  const styles = {
    container:
      "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; border-radius: 15px;",
    innerContainer:
      "background: white; padding: 40px 30px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);",
    header:
      "color: #2c3e50; font-size: 26px; margin-bottom: 20px; text-align: center; font-weight: 600;",
    headerAccent:
      "width: 60px; height: 4px; background: linear-gradient(135deg, #667eea, #764ba2); margin: 15px auto; border-radius: 2px;",
    greeting:
      "font-size: 20px; color: #34495e; margin-bottom: 15px; text-align: center; font-weight: 500;",
    paragraph:
      "font-size: 16px; line-height: 1.6; color: #495057; margin-bottom: 20px; text-align: center;",
    detailsBox:
      "background: linear-gradient(135deg, #f8f9fa, #e9ecef); padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid #dee2e6; border-left: 4px solid #667eea;",
    detailItem:
      "font-size: 16px; margin-bottom: 12px; color: #2c3e50; display: flex; align-items: center;",
    detailIcon: "margin-right: 10px; font-size: 18px;",
    strong: "font-weight: 600; color: #2c3e50;",
    serviceList: "list-style-type: none; padding-left: 0; margin-top: 10px;",
    serviceItem:
      "background: #f8f9fa; padding: 15px; margin-bottom: 10px; border-radius: 8px; border-left: 3px solid #667eea;",
    total:
      "font-size: 20px; text-align: right; margin-top: 25px; font-weight: bold; color: #667eea; background: #f8f9fa; padding: 15px; border-radius: 8px;",
    additionalMessage:
      "background: linear-gradient(135deg, #d1ecf1, #bee5eb); padding: 20px; border-radius: 10px; margin: 25px 0; border: 1px solid #17a2b8; border-left: 4px solid #17a2b8; color: #0c5460;",
    button:
      "display: inline-block; padding: 15px 25px; margin: 10px 5px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; text-decoration: none; border-radius: 25px; font-size: 15px; font-weight: 600; box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;",
    buttonCancel:
      "display: inline-block; padding: 15px 25px; margin: 10px 5px; background: linear-gradient(135deg, #ff6b6b, #ee5a24); color: white; text-decoration: none; border-radius: 25px; font-size: 15px; font-weight: 600; box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4); transition: all 0.3s ease;",
    footer:
      "color: #6c757d; font-size: 14px; margin-top: 30px; text-align: center; border-top: 1px solid #e9ecef; padding-top: 20px;",
  };

  return `
    <div style="${styles.container}">
      <div style="${styles.innerContainer}">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="background: linear-gradient(135deg, #667eea, #764ba2); width: 70px; height: 70px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 28px;">
            📅
          </div>
          <h2 style="${styles.header}">${tituloCorreo}</h2>
          <div style="${styles.headerAccent}"></div>
        </div>
        
        <p style="${styles.greeting}">¡Hola ${nombreCliente}! 👋</p>
        <p style="${styles.paragraph}">${parrafoPrincipal}</p>
        
        <div style="${styles.detailsBox}">
          <p style="${styles.detailItem}"><span style="${styles.detailIcon}">📅</span><strong style="${styles.strong}">Fecha y Hora:</strong> ${citaInfo.fechaHora}</p>
          <p style="${styles.detailItem}"><span style="${styles.detailIcon}">👨‍⚕️</span><strong style="${styles.strong}">Especialista:</strong> ${citaInfo.empleado || "Por confirmar"}</p>
          <p style="${styles.detailItem}"><span style="${styles.detailIcon}">📊</span><strong style="${styles.strong}">Estado de la Cita:</strong> ${citaInfo.estado}</p>
        </div>

        <h3 style="color: #2c3e50; margin-top: 30px; margin-bottom: 15px; font-size: 18px; font-weight: 600; text-align: center;">✨ Servicios Agendados</h3>
        <ul style="${styles.serviceList}">${serviciosHTML}</ul>
        
        ${
          citaInfo.total > 0
            ? `<div style="${styles.total}">💰 Total Estimado: $${Number(citaInfo.total).toFixed(2)}</div>`
            : ""
        }
        
        ${
          citaInfo.mensajeAdicional
            ? `<div style="${styles.additionalMessage}"><p style="margin: 0; font-weight: 500;">💬 ${citaInfo.mensajeAdicional}</p></div>`
            : ""
        }
        
        <div style="text-align: center; margin: 30px 0;">
          ${
            citaInfo.enlaceConfirmacion
              ? `<a href="${citaInfo.enlaceConfirmacion}" style="${styles.button}">✅ Confirmar Cita</a>`
              : ""
          }
          ${
            citaInfo.enlaceCancelacion
              ? `<a href="${citaInfo.enlaceCancelacion}" style="${styles.buttonCancel}">❌ Cancelar/Modificar</a>`
              : ""
          }
        </div>

        <div style="${styles.footer}">
          <p style="margin: 0 0 10px 0;">Gracias por confiar en <strong style="color: #667eea;">La fuente del peluquero</strong> 💙</p>
          <p style="margin: 0; font-size: 13px;">Si tienes alguna pregunta, no dudes en contactarnos. Estamos aquí para ti.</p>
        </div>
      </div>
    </div>
  `;
};

const enviarCorreoCita = async ({ correo, nombreCliente, citaInfo }) => {
  if (
    !correo ||
    !nombreCliente ||
    !citaInfo ||
    !citaInfo.accion ||
    !citaInfo.fechaHora ||
    !citaInfo.estado ||
    !citaInfo.servicios
  ) {
    console.error("Datos incompletos para enviar correo de cita:", {
      correo,
      nombreCliente,
      citaInfo,
    });
    throw new Error(
      "Datos incompletos para generar y enviar el correo de cita."
    );
  }

  const htmlContent = generarTemplateCita({ nombreCliente, citaInfo });
  const subject = `📅 Notificación de Cita ${citaInfo.accion} en La fuente del peluquero`;

  try {
    const resultadoEnvio = await mailerService({
      to: correo,
      subject,
      html: htmlContent,
    });
    return resultadoEnvio;
  } catch (error) {
    console.error(
      `Fallo al intentar enviar correo de cita (${citaInfo.accion}) a ${correo}:`,
      error.message
    );
    return { success: false, error: error };
  }
};

module.exports = {
  generarTemplateCita,
  enviarCorreoCita,
};
