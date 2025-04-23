import { NextRequest, NextResponse } from 'next/server';
import { sessions, Session } from '@/lib/data';

// If you want to generate IDs, you can use crypto.randomUUID() (Node 19+) or nanoid
function generateSessionId() {
  return crypto.randomUUID(); // or nanoid(), etc.
}

// GET /api/sessions  -> return all active sessions
export async function GET() {
  // Convert our sessions object to an array
  const allSessions = Object.values(sessions);
  return NextResponse.json(allSessions);
}

// POST /api/sessions -> create a new session
export async function POST(_req: NextRequest) {
    // Create a new session object
    const sessionId = generateSessionId();
    const newSession: Session = {
      sessionId,
      createdAt: new Date().toISOString(),
      status: 'ACTIVE',
      requests: [], // <-- provide an empty array
    };
  
    // Store it in our in-memory record
    sessions[sessionId] = newSession;
  
    // Return the session info
    return NextResponse.json(newSession, { status: 201 });
  }
  
