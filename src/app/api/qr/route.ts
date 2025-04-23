import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function GET(req: NextRequest) {
  // e.g. GET /api/qr?sessionId=abc123
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('sessionId');
  if (!sessionId) {
    return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
  }

  const url = `https://YOUR_DOMAIN/session/${sessionId}/request`;

  try {
    // Generate QR code as a data URL (base64)
    const qrDataUrl = await QRCode.toDataURL(url);

    // Convert the data URL into a standard PNG response
    const base64 = qrDataUrl.split(';base64,')[1];
    const buffer = Buffer.from(base64, 'base64');

    // Return the PNG as an image
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to generate QR' }, { status: 500 });
  }
}
