// src/utils/VentaEmailTemplate.js
"use strict";

const mailerService = require("../services/mailer.service.js");
const { formatDate } = require("./dateHelpers.js");

/**
 * Genera el template HTML para el correo de notificación de una venta.
 * @param {object} datosCorreo
 * @param {string} datosCorreo.nombreCliente
 * @param {object} datosCorreo.ventaInfo
 * @param {number} datosCorreo.ventaInfo.idVenta
 * @param {string} datosCorreo.ventaInfo.accion
 * @param {string} datosCorreo.ventaInfo.fecha - Ya formateada
 * @param {string} datosCorreo.ventaInfo.estado - Estado del proceso de la venta
 * @param {Array<object>} datosCorreo.ventaInfo.productos - [{ nombre, cantidad, valorUnitario, descripcion? }]
 * @param {Array<object>} datosCorreo.ventaInfo.servicios - [{ nombre, valorServicio, descripcion? }]
 * @param {number} datosCorreo.ventaInfo.subtotal
 * @param {number} datosCorreo.ventaInfo.iva
 * @param {number} datosCorreo.ventaInfo.total
 * @param {number} datosCorreo.ventaInfo.tasaIvaAplicada - La tasa de IVA usada (ej. 0.19 para 19%)
 * @param {string} [datosCorreo.ventaInfo.mensajeAdicional]
 * @returns {string} El contenido HTML generado.
 */
const generarTemplateVenta = ({ nombreCliente, ventaInfo }) => {
  const productosHTML =
    ventaInfo.productos && ventaInfo.productos.length > 0
      ? ventaInfo.productos
          .map(
            (p) => `
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #e9ecef; color: #2c3e50; font-weight: 500;">${
                p.nombre
              } ${
                p.descripcion
                  ? `<br><small style="color: #6c757d; font-weight: normal;">${p.descripcion}</small>`
                  : ""
              }</td>
              <td style="padding: 12px; border-bottom: 1px solid #e9ecef; text-align: center; color: #495057;">${
                p.cantidad
              }</td>
              <td style="padding: 12px; border-bottom: 1px solid #e9ecef; text-align: right; color: #495057; font-weight: 500;">$${Number(
                p.valorUnitario || 0
              ).toFixed(2)}</td>
              <td style="padding: 12px; border-bottom: 1px solid #e9ecef; text-align: right; color: #667eea; font-weight: bold;">$${(
                Number(p.cantidad) * Number(p.valorUnitario || 0)
              ).toFixed(2)}</td>
            </tr>`
          )
          .join("")
      : "";

  const serviciosHTML =
    ventaInfo.servicios && ventaInfo.servicios.length > 0
      ? ventaInfo.servicios
          .map(
            (s) => `
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #e9ecef; color: #2c3e50; font-weight: 500;" colspan="3">${
                s.nombre
              } ${
                s.descripcion
                  ? `<br><small style="color: #6c757d; font-weight: normal;">${s.descripcion}</small>`
                  : ""
              }</td>
              <td style="padding: 12px; border-bottom: 1px solid #e9ecef; text-align: right; color: #667eea; font-weight: bold;">$${Number(
                s.valorServicio || 0
              ).toFixed(2)}</td>
            </tr>`
          )
          .join("")
      : "";

  const tieneProductos = ventaInfo.productos && ventaInfo.productos.length > 0;
  const tieneServicios = ventaInfo.servicios && ventaInfo.servicios.length > 0;

  const tasaIvaParaMostrar =
    ventaInfo.tasaIvaAplicada !== undefined ? ventaInfo.tasaIvaAplicada : 0.19; // Fallback si no se pasa

  const styles = {
    container:
      "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 700px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; border-radius: 15px;",
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
    table:
      "width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 20px; font-size: 15px; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);",
    th: "background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 15px 12px; text-align: left; font-weight: 600; font-size: 14px;",
    td: "padding: 12px; border-bottom: 1px solid #e9ecef; color: #2c3e50;",
    totalsSection:
      "margin-top: 25px; padding: 20px; background: linear-gradient(135deg, #f8f9fa, #e9ecef); border-radius: 12px; text-align: right; border: 1px solid #dee2e6;",
    totalItem: "font-size: 16px; margin-bottom: 8px; color: #495057;",
    grandTotal:
      "font-size: 20px; font-weight: bold; color: #667eea; margin-top: 15px; padding-top: 15px; border-top: 2px solid #667eea;",
    footer:
      "color: #6c757d; font-size: 14px; margin-top: 30px; text-align: center; border-top: 1px solid #e9ecef; padding-top: 20px;",
  };

  return `
    <div style="${styles.container}">
      <div style="${styles.innerContainer}">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="background: linear-gradient(135deg, #28a745, #20c997); width: 70px; height: 70px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 28px;">
            🛍️
          </div>
          <h2 style="${styles.header}">Confirmación de Venta #${ventaInfo.idVenta}</h2>
          <div style="${styles.headerAccent}"></div>
        </div>
        
        <p style="${styles.greeting}">¡Hola ${nombreCliente}! 👋</p>
        <p style="${styles.paragraph}">Tu venta ha sido <strong>${ventaInfo.accion}</strong>. A continuación, encontrarás los detalles de tu compra:</p>
        
        <div style="${styles.detailsBox}">
          <p style="${styles.detailItem}"><span style="${styles.detailIcon}">📅</span><strong style="${styles.strong}">Fecha:</strong> ${ventaInfo.fecha}</p>
          <p style="${styles.detailItem}"><span style="${styles.detailIcon}">📊</span><strong style="${styles.strong}">Estado de la Venta:</strong> ${ventaInfo.estado}</p>
        </div>

        ${
          tieneProductos
            ? `
          <h3 style="color: #2c3e50; margin-top: 30px; margin-bottom: 15px; font-size: 18px; font-weight: 600; text-align: center;">🛒 Productos Adquiridos</h3>
          <table style="${styles.table}">
            <thead>
              <tr>
                <th style="${styles.th}">Producto</th>
                <th style="${styles.th} text-align: center;">Cantidad</th>
                <th style="${styles.th} text-align: right;">P. Unit.</th>
                <th style="${styles.th} text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${productosHTML}
            </tbody>
          </table>`
            : ""
        }

        ${
          tieneServicios
            ? `
          <h3 style="color: #2c3e50; margin-top: 30px; margin-bottom: 15px; font-size: 18px; font-weight: 600; text-align: center;">✨ Servicios Adquiridos</h3>
          <table style="${styles.table}">
            <thead>
              <tr>
                <th style="${styles.th}" colspan="3">Servicio</th>
                <th style="${styles.th} text-align: right;">Valor</th>
              </tr>
            </thead>
            <tbody>
              ${serviciosHTML}
            </tbody>
          </table>`
            : ""
        }
        
        <div style="${styles.totalsSection}">
          <h3 style="color: #2c3e50; margin-bottom: 15px; font-size: 18px; font-weight: 600; text-align: center;">💰 Resumen de Facturación</h3>
          <p style="${styles.totalItem}"><strong style="${styles.strong}">Subtotal:</strong> $${Number(ventaInfo.subtotal || 0).toFixed(2)}</p>
          <p style="${styles.totalItem}"><strong style="${styles.strong}">IVA (${(tasaIvaParaMostrar * 100).toFixed(0)}%):</strong> $${Number(ventaInfo.iva || 0).toFixed(2)}</p>
          <p style="${styles.grandTotal}">💎 Total General: $${Number(ventaInfo.total || 0).toFixed(2)}</p>
        </div>

        ${
          ventaInfo.mensajeAdicional
            ? `<div style="background: linear-gradient(135deg, #d1ecf1, #bee5eb); padding: 20px; border-radius: 10px; margin: 25px 0; border: 1px solid #17a2b8; border-left: 4px solid #17a2b8;"><p style="color: #0c5460; margin: 0; font-weight: 500; text-align: center;">💬 ${ventaInfo.mensajeAdicional}</p></div>`
            : ""
        }

        <div style="${styles.footer}">
          <p style="margin: 0 0 10px 0;">Gracias por tu compra en <strong style="color: #667eea;">La fuente del peluquero</strong> 💙</p>
          <p style="margin: 0; font-size: 13px;">Si tienes alguna pregunta, no dudes en contactarnos. Estamos aquí para ti.</p>
        </div>
      </div>
    </div>
  `;
};

const enviarCorreoVenta = async ({
  correoCliente,
  nombreCliente,
  ventaInfo,
}) => {
  // ... (la validación de datos de entrada que tenías está bien)
  if (
    !correoCliente ||
    !nombreCliente ||
    !ventaInfo ||
    !ventaInfo.accion ||
    !ventaInfo.fecha ||
    !ventaInfo.estado ||
    !ventaInfo.idVenta ||
    ventaInfo.tasaIvaAplicada === undefined
  ) {
    // Añadida validación para tasaIvaAplicada
    console.error(
      "Datos incompletos para enviar correo de venta (incluyendo tasaIvaAplicada):",
      { correoCliente, nombreCliente, ventaInfo }
    );
    throw new Error(
      "Datos incompletos para generar y enviar el correo de venta."
    );
  }
  if (
    (!ventaInfo.productos || ventaInfo.productos.length === 0) &&
    (!ventaInfo.servicios || ventaInfo.servicios.length === 0)
  ) {
    console.error("Correo de venta sin productos ni servicios:", ventaInfo);
    throw new Error(
      "Una venta debe tener productos o servicios para notificar."
    );
  }

  const htmlContent = generarTemplateVenta({ nombreCliente, ventaInfo });
  const subject = `🛍️ Detalles de tu Venta #${ventaInfo.idVenta} ${ventaInfo.accion} en La fuente del peluquero`;

  try {
    const resultadoEnvio = await mailerService({
      to: correoCliente,
      subject,
      html: htmlContent,
    });
    return resultadoEnvio;
  } catch (error) {
    console.error(
      `Fallo al intentar enviar correo de venta (${ventaInfo.accion}) #${ventaInfo.idVenta} a ${correoCliente}:`,
      error.message
    );
    return { success: false, error: error };
  }
};

module.exports = {
  generarTemplateVenta,
  enviarCorreoVenta,
};
