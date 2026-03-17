import * as XLSX from 'xlsx';

export function xlsxToHtmlTable(buffer: Buffer): string {
  const wb = XLSX.read(buffer, { type: 'buffer' });
  const firstSheetName = wb.SheetNames[0];
  const ws = wb.Sheets[firstSheetName];
  const rows: any[] = XLSX.utils.sheet_to_json(ws, { header: 1 });

  if (!rows || rows.length === 0) return '';

  const header = rows[0] as string[];
  const bodyRows = rows.slice(1);

  const thead = `<thead><tr>${header.map(h => `<th style="padding:8px;border:1px solid #ddd;background:#f5f5f5">${String(h)}</th>`).join('')}</tr></thead>`;
  const tbody = `<tbody>${bodyRows.map(r => `<tr>${(r as any[]).map(c => `<td style="padding:8px;border:1px solid #ddd">${c ?? ''}</td>`).join('')}</tr>`).join('')}</tbody>`;

  return `<table style="border-collapse:collapse;width:100%">${thead}${tbody}</table>`;
}

export function renderChangeHoursEmailBody({ name, tableHtml, message }: { name: string; tableHtml?: string; message?: string }) {
  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;color:#222">
    <p>Hola ${name},</p>
    <p>Se ha recibido tu solicitud de cambio de horas.</p>
    ${tableHtml
      ? `<div style=\"margin:16px 0\">${tableHtml}</div>`
      : message
        ? `<div style=\"margin:16px 0\"><p>${message}</p></div>`
        : '<p><em>Sin archivo adjunto. Puedes responder a este correo con el detalle en texto o adjuntar el XLSX.</em></p>'}
    <p>Si requieres alguna modificación adicional, por favor responde a este correo.</p>
    <hr style="margin:24px 0;border:none;border-top:1px solid #eee"/>
    <p style="font-size:12px;color:#666">Este correo fue enviado automáticamente por Linktech Management.</p>
  </div>
  `;
}

export function renderHumanResourceRequestEmailBody({ 
  departmentHeadName, 
  workerName, 
  projectName, 
  projectCode,
  tableHtml 
}: { 
  departmentHeadName: string; 
  workerName: string; 
  projectName: string;
  projectCode: string;
  tableHtml?: string;
}) {
  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;color:#222">
    <p>Hola ${departmentHeadName},</p>
    <p style="font-weight:600;color:#0066cc">Se ha solicitado un consultor de tu departamento para un nuevo proyecto</p>
    
    <div style="background:#f0f8ff;padding:16px;border-left:4px solid #0066cc;margin:16px 0">
      <p style="margin:8px 0"><strong>Consultor Solicitado:</strong> ${workerName}</p>
      <p style="margin:8px 0"><strong>Proyecto Destino:</strong> ${projectName}</p>
      <p style="margin:8px 0"><strong>Código de Proyecto:</strong> ${projectCode}</p>
    </div>

    ${tableHtml ? `
    <div style="margin:16px 0">
      <p style="font-weight:600;margin-bottom:12px">Detalles del Consultor:</p>
      ${tableHtml}
    </div>
    ` : ''}

    <p style="margin-top:20px;color:#555">Puedes revisar esta solicitud en tu panel de control de proyectos. Si tienes alguna pregunta o necesitas información adicional, por favor responde a este correo.</p>
    
    <hr style="margin:24px 0;border:none;border-top:1px solid #eee"/>
    <p style="font-size:12px;color:#666">Este correo fue enviado automáticamente por Linktech Management.</p>
  </div>
  `;
}
