import { NextRequest, NextResponse } from 'next/server';
import { sessions, SongRequest } from '@/lib/data'; // or wherever your in-memory/data code lives

export async function POST(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const { sessionId } = params;

  // 1) Check if the session exists
  if (!sessions[sessionId]) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  // 2) Parse the request body
  try {
    const { userName, albumName, trackName } = await request.json();
    if (!userName || !albumName) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // 3) Create a new request object
    const newRequest: SongRequest = {
      id: Date.now(),
      userName,
      albumName,
      trackName: trackName || '',
      status: 'pending',
    };

    // 4) Push it onto the session’s queue
    sessions[sessionId].requests.push(newRequest);

    // 5) Return success
    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.error('Error parsing request body:', error);
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const { sessionId } = params;
  const session = sessions[sessionId];
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }
  return NextResponse.json(session.requests);
}

