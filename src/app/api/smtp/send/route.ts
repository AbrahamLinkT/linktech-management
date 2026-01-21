import { NextRequest, NextResponse } from 'next/server';
import { sendChangeHoursEmail } from '@/services/smtp/mailer';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    // Feature flag: reserva el endpoint hasta habilitarlo explícitamente
    const enabled = process.env.SMTP_ENABLED === 'true';
    if (!enabled) {
      return NextResponse.json({ error: 'SMTP deshabilitado (SMTP_ENABLED=false)' }, { status: 503 });
    }

    // API Key opcional: si está configurada, es requerida
    const expectedKey = process.env.SMTP_API_KEY;
    if (expectedKey) {
      const providedKey = req.headers.get('x-api-key');
      if (!providedKey || providedKey !== expectedKey) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
      }
    }

    const contentType = req.headers.get('content-type') || '';
    let name = '';
    let email = '';
    let xlsxBuffer: Buffer | undefined;
    let message: string | undefined;

    if (contentType.includes('multipart/form-data')) {
      const form = await req.formData();
      name = String(form.get('name') || '').trim();
      email = String(form.get('email') || '').trim();
      const file = form.get('file') as File | null;
      message = String(form.get('message') || '').trim() || undefined;
      if (file) {
        const arrBuf = await file.arrayBuffer();
        xlsxBuffer = Buffer.from(arrBuf);
      }
    } else if (contentType.includes('application/json')) {
      const body = await req.json();
      name = String(body?.name || '').trim();
      email = String(body?.email || '').trim();
      message = String(body?.message || '').trim() || undefined;
      // opcional: soportar xlsx como base64
      const base64 = body?.xlsxBase64 as string | undefined;
      if (base64) {
        try {
          xlsxBuffer = Buffer.from(base64, 'base64');
        } catch {}
      }
    } else {
      return NextResponse.json({ error: 'Content-Type debe ser multipart/form-data o application/json' }, { status: 400 });
    }

    if (!name || !email) {
      return NextResponse.json({ error: 'Campos requeridos: name, email' }, { status: 400 });
    }

    const result = await sendChangeHoursEmail({ toName: name, toEmail: email, xlsxBuffer, message });
    return NextResponse.json({ ok: true, result });
  } catch (err: any) {
    console.error('SMTP send error:', err);
    return NextResponse.json({ error: err?.message || 'Error enviando correo' }, { status: 500 });
  }
}
