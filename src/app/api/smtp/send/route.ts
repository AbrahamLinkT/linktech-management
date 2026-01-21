import { NextRequest, NextResponse } from 'next/server';
import { sendChangeHoursEmail } from '@/services/smtp/mailer';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Content-Type debe ser multipart/form-data' }, { status: 400 });
    }

    const form = await req.formData();
    const name = String(form.get('name') || '').trim();
    const email = String(form.get('email') || '').trim();
    const file = form.get('file') as File | null;

    if (!name || !email) {
      return NextResponse.json({ error: 'Campos requeridos: name, email' }, { status: 400 });
    }

    let xlsxBuffer: Buffer | undefined;
    if (file) {
      const arrBuf = await file.arrayBuffer();
      xlsxBuffer = Buffer.from(arrBuf);
    }

    const result = await sendChangeHoursEmail({ toName: name, toEmail: email, xlsxBuffer });
    return NextResponse.json({ ok: true, result });
  } catch (err: any) {
    console.error('SMTP send error:', err);
    return NextResponse.json({ error: err?.message || 'Error enviando correo' }, { status: 500 });
  }
}
