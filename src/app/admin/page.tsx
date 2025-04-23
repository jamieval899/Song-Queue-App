'use client';

import { useEffect, useState } from 'react';

interface Session {
  sessionId: string;
  createdAt: string;
  status: 'ACTIVE' | 'ENDED';
}

export default function AdminOverview() {
  const [sessions, setSessions] = useState<Session[]>([]);

  // Fetch all sessions
  const loadSessions = async () => {
    try {
      const res = await fetch('/api/sessions');
      const data = await res.json();
      setSessions(data);
    } catch (error) {
      console.error(error);
      alert('Failed to load sessions');
    }
  };

  // Create a new session
  const createSession = async () => {
    try {
      const res = await fetch('/api/sessions', { method: 'POST' });
      const newSession = await res.json();
      if (res.ok) {
        alert(`Created session: ${newSession.sessionId}`);
        loadSessions(); // refresh list
      } else {
        alert(`Error creating session: ${newSession.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error(error);
      alert('Error creating session');
    }
  };

  // End a session
  const endSession = async (sessionId: string) => {
    const confirmEnd = confirm(`Are you sure you want to end session ${sessionId}?`);
    if (!confirmEnd) return;
    try {
      const res = await fetch(`/api/sessions/${sessionId}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        alert(`Session ${sessionId} ended`);
        loadSessions();
      } else {
        alert(`Error ending session: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error(error);
      alert('Error ending session');
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  return (
    <main
      style={{
        minHeight: '100vh',
        padding: '2rem',
        background: 'linear-gradient(135deg, #2c3e50 0%, #fd746c 100%)',
        color: '#fff',
        fontFamily: '"Press Start 2P", monospace', // or any retro font
      }}
    >
      <h1
        style={{
          fontSize: '2rem',
          textAlign: 'center',
          marginBottom: '2rem',
          textShadow: '2px 2px #000',
        }}
      >
        Admin Overview
      </h1>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <p style={{ maxWidth: 600, margin: '0 auto' }}>
          Welcome, <strong>Queue Master!</strong> From here, you can create new sessions for
          your vinyl night, see what’s active, and end sessions once the party’s over.
        </p>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <button
          onClick={createSession}
          style={{
            fontSize: '1rem',
            padding: '0.75rem 1.5rem',
            marginRight: '1rem',
            background: 'transparent',
            color: '#fff',
            border: '2px solid #fff',
            borderRadius: '8px',
            cursor: 'pointer',
            textShadow: '1px 1px #000',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 10px #fff';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
          }}
        >
          Create New Session
        </button>

        <button
          onClick={loadSessions}
          style={{
            fontSize: '1rem',
            padding: '0.75rem 1.5rem',
            background: 'transparent',
            color: '#fff',
            border: '2px solid #fff',
            borderRadius: '8px',
            cursor: 'pointer',
            textShadow: '1px 1px #000',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 10px #fff';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
          }}
        >
          Refresh List
        </button>
      </div>

      {sessions.length === 0 && (
        <p style={{ textAlign: 'center' }}>No sessions found.</p>
      )}

      <ul style={{ maxWidth: 600, margin: '0 auto' }}>
        {sessions.map((s) => (
          <li
            key={s.sessionId}
            style={{
              marginBottom: '2rem',
              listStyle: 'none',
              background: 'rgba(0, 0, 0, 0.4)',
              border: '2px solid #fff',
              borderRadius: '8px',
              padding: '1rem',
              boxShadow: '2px 2px 5px rgba(0,0,0,0.5)',
            }}
          >
            <p style={{ margin: '0.25rem 0' }}>
              <b>Session:</b> {s.sessionId}
            </p>
            <p style={{ margin: '0.25rem 0' }}>
              <b>Created:</b> {new Date(s.createdAt).toLocaleString()}
            </p>
            <p style={{ margin: '0.25rem 0' }}>
              <b>Status:</b> {s.status}
            </p>
            <div style={{ marginTop: '1rem' }}>
              <button
                onClick={() => endSession(s.sessionId)}
                style={{
                  fontSize: '0.9rem',
                  padding: '0.5rem 1rem',
                  marginRight: '1rem',
                  background: 'transparent',
                  color: '#fff',
                  border: '2px solid #fff',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textShadow: '1px 1px #000',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 5px #fff';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                }}
              >
                End Session
              </button>
              <a
                href={`/admin/${s.sessionId}`}
                style={{
                  fontSize: '0.9rem',
                  padding: '0.5rem 1rem',
                  background: 'transparent',
                  color: '#fff',
                  border: '2px solid #fff',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textShadow: '1px 1px #000',
                  textDecoration: 'none',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.05)';
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 5px #fff';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)';
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none';
                }}
              >
                View Details
              </a>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
