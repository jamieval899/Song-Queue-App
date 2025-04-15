import { NextRequest, NextResponse } from 'next/server';
import { sessions } from '@/lib/data';

// GET /api/sessions/:sessionId -> return one session
// DELETE /api/sessions/:sessionId -> end session (remove or mark ended)

export async function GET(
  _req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const { sessionId } = params;
  const session = sessions[sessionId];
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }
  return NextResponse.json(session);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const { sessionId } = params;
  const session = sessions[sessionId];
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  // Option A: Mark ended
  session.status = 'ENDED';

  // Option B: Or remove it from memory entirely
  // delete sessions[sessionId];

  return NextResponse.json({ message: `Session ${sessionId} ended.` });
}
