import nodemailer from 'nodemailer';
import { renderChangeHoursEmailBody, xlsxToHtmlTable } from './templates/change-hours-email';

export interface SendChangeHoursEmailParams {
  toName: string;
  toEmail: string;
  xlsxBuffer?: Buffer;
}

function getTransporter() {
  const user = process.env.MAIL_USER;
  const pass = process.env.MAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error('Faltan variables de entorno MAIL_USER / MAIL_APP_PASSWORD');
  }

  // Gmail SMTP con App Password
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  return transporter;
}

export async function sendChangeHoursEmail(params: SendChangeHoursEmailParams) {
  const { toName, toEmail, xlsxBuffer } = params;
  const transporter = getTransporter();

  let tableHtml: string | undefined;
  if (xlsxBuffer && xlsxBuffer.length > 0) {
    try {
      tableHtml = xlsxToHtmlTable(xlsxBuffer);
    } catch (err) {
      console.warn('No se pudo convertir el XLSX a HTML, se enviará solo adjunto:', err);
    }
  }

  const html = renderChangeHoursEmailBody({ name: toName, tableHtml });

  const attachments: Array<{ filename: string; content: Buffer }> = [];
  if (xlsxBuffer && xlsxBuffer.length > 0) {
    attachments.push({ filename: 'cambio_horas.xlsx', content: xlsxBuffer });
  }

  const info = await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: toEmail,
    subject: 'Solicitud de cambio de horas',
    html,
    attachments,
  });

  return { messageId: info.messageId, accepted: info.accepted, rejected: info.rejected };
}
