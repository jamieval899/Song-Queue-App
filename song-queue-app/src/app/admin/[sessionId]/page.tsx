'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SongRequest {
  id: number;
  userName: string;
  albumName: string;
  trackName?: string;
  status: 'pending' | 'playing' | 'played';
}

interface Session {
  sessionId: string;
  createdAt: string;
  status: 'ACTIVE' | 'ENDED';
  requests: SongRequest[];
}

export default function AdminSessionDetail() {
  const params = useParams() as { sessionId: string };
  const router = useRouter();
  const sessionId = params.sessionId;

  const [session, setSession] = useState<Session | null>(null);

  // For drag-and-drop, we store the 'dragged item index'
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // ======= API Calls =======
  const loadSession = async () => {
    try {
      const res = await fetch(`/api/sessions/${sessionId}`);
      const data = await res.json();
      if (!res.ok) {
        alert(`Session not found: ${data.error || ''}`);
        router.push('/admin');
        return;
      }
      setSession(data);
    } catch (error) {
      console.error(error);
      alert('Error loading session');
      router.push('/admin');
    }
  };

  const refreshRequests = async () => {
    if (!sessionId) return;
    try {
      const res = await fetch(`/api/sessions/${sessionId}/requests`);
      const data = await res.json();
      if (res.ok && session) {
        setSession({ ...session, requests: data });
      } else {
        alert(`Error loading requests: ${data.error || ''}`);
      }
    } catch (error) {
      console.error(error);
      alert('Error refreshing requests');
    }
  };

  const endSession = async () => {
    if (!sessionId) return;
    const confirmEnd = confirm(`Are you sure you want to end session ${sessionId}?`);
    if (!confirmEnd) return;
    try {
      const res = await fetch(`/api/sessions/${sessionId}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        alert('Session ended');
        router.push('/admin');
      } else {
        alert(`Error: ${data.error || ''}`);
      }
    } catch (error) {
      console.error(error);
      alert('Error ending session');
    }
  };

  const openDisplayPage = () => {
    window.open(`/display/${sessionId}`, '_blank');
  };

  // Hypothetical endpoint to delete a request from the queue
  const deleteRequest = async (requestId: number) => {
    if (!sessionId) return;
    const confirmDel = confirm('Are you sure you want to delete this request?');
    if (!confirmDel) return;

    try {
      // Example: DELETE /api/sessions/:sessionId/requests/:requestId
      const res = await fetch(`/api/sessions/${sessionId}/requests/${requestId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        alert(`Error deleting request: ${data.error || ''}`);
        return;
      }
      // Remove the request locally
      setSession((prev) => {
        if (!prev) return prev;
        const updatedRequests = prev.requests.filter((r) => r.id !== requestId);
        return { ...prev, requests: updatedRequests };
      });
      alert('Request deleted');
    } catch (error) {
      console.error(error);
      alert('Error deleting request');
    }
  };

  useEffect(() => {
    loadSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // ======= DRAG-AND-DROP HANDLERS =======
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  // By default, dropping is disabled unless we call e.preventDefault() in onDragOver
  const handleDragOver = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
  };

  const handleDrop = (dropIndex: number) => {
    if (draggedIndex === null || !session) return;
    if (dropIndex === draggedIndex) return; // same spot

    const requestsCopy = [...session.requests];
    const draggedItem = requestsCopy[draggedIndex];
    // Remove the dragged item
    requestsCopy.splice(draggedIndex, 1);
    // Insert it at the new location
    requestsCopy.splice(dropIndex, 0, draggedItem);

    // Update local state
    setSession({ ...session, requests: requestsCopy });
    setDraggedIndex(null);

    // Optionally, you might call an API to persist the new order here:
    // await fetch(`/api/sessions/${sessionId}/requests/reorder`, { method: 'PUT', body: JSON.stringify(requestsCopy) });
  };

  if (!session) {
    return (
      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #2c3e50 0%, #fd746c 100%)',
          color: '#fff',
          fontFamily: '"Press Start 2P", monospace',
        }}
      >
        <h2>Loading session...</h2>
      </main>
    );
  }

  // ======= STYLES =======
  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    padding: '2rem',
    background: 'linear-gradient(135deg, #2c3e50 0%, #fd746c 100%)',
    color: '#fff',
    fontFamily: '"Press Start 2P", monospace',
  };

  const headerStyle: React.CSSProperties = {
    fontSize: '2rem',
    textAlign: 'center',
    marginBottom: '2rem',
    textShadow: '2px 2px #000',
  };

  const buttonStyle: React.CSSProperties = {
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
  };

  const requestItemStyle: React.CSSProperties = {
    listStyle: 'none',
    background: 'rgba(0, 0, 0, 0.4)',
    border: '2px solid #fff',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1rem',
    cursor: 'move',
  };

  // Hover/focus effects can be handled inline or in a separate CSS
  // For brevity, we'll just do onMouseEnter in the button if we want

  return (
    <main style={containerStyle}>
      <h1 style={headerStyle}>Admin Detail - Session {session.sessionId}</h1>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <p>
          <b>Created at:</b> {new Date(session.createdAt).toLocaleString()}
          <br />
          <b>Status:</b> {session.status}
        </p>
        <button
          style={buttonStyle}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 10px #fff';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
          }}
          onClick={refreshRequests}
        >
          Refresh Requests
        </button>
        <button
          style={buttonStyle}
          onClick={endSession}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 10px #fff';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
          }}
        >
          End Session
        </button>
        <button
          style={buttonStyle}
          onClick={openDisplayPage}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 10px #fff';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
          }}
        >
          Display QR Code
        </button>
      </div>

      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Requests</h2>
      {session.requests.length === 0 && (
        <p style={{ textAlign: 'center' }}>No requests yet!</p>
      )}

      <ul style={{ maxWidth: 600, margin: '0 auto' }}>
        {session.requests.map((r, index) => (
          <li
            key={r.id}
            style={requestItemStyle}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(index)}
          >
            <p>
              <b>{r.albumName}</b>
              {r.trackName && ` - ${r.trackName}`} <br />
              <small>by {r.userName}</small>
            </p>
            <p>Status: {r.status}</p>
            <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
              <button
                style={{
                  ...buttonStyle,
                  fontSize: '0.8rem',
                  padding: '0.4rem 0.8rem',
                }}
                onClick={() => deleteRequest(r.id)}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 10px #fff';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
