// src/lib/data.ts

// The shape of each individual request in a queue
export interface SongRequest {
    id: number;             // or string if you prefer
    userName: string;
    albumName: string;
    trackName?: string;
    status: 'pending' | 'playing' | 'played';
  }
  
  // The shape of a Session, which includes its own array of requests
  export interface Session {
    sessionId: string;           // unique ID for this session
    createdAt: string;           // e.g., ISO date string
    status: 'ACTIVE' | 'ENDED';  // session status
    requests: SongRequest[];     // the queue of requests for this session
  }
  
  // Our in-memory "sessions" store
  // Key = sessionId, Value = the Session object
  export const sessions: Record<string, Session> = {};
  