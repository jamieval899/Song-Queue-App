'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SongRequest {
  id: number;
  userName: string;
  albumName: string;
  trackName?: string;
  status: 'pending' | 'playing' | 'played';
}

export default function DisplayPage() {
  const params = useParams() as { sessionId: string };
  const sessionId = params.sessionId;

  const [requests, setRequests] = useState<SongRequest[]>([]);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const res = await fetch(`/api/sessions/${sessionId}/requests`);
        const data = await res.json();
        if (res.ok) {
          setRequests(data);
        } else {
          console.error(data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    loadRequests(); // initial load
    const interval = setInterval(loadRequests, 5000); // poll every 5s
    return () => clearInterval(interval);
  }, [sessionId]);

  const pending = requests.filter((r) => r.status === 'pending');
  const playing = requests.find((r) => r.status === 'playing');

  // URL for patrons to submit requests
  const requestPageURL = `/session/${sessionId}/request`;

  // ======= STYLING =======
  const containerStyle: React.CSSProperties = {
    position: 'relative',      // needed for absolutely positioned elements
    minHeight: '100vh',
    margin: 0,
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    // Vibrant retro gradient
    background: 'linear-gradient(135deg, #2c3e50 0%, #fd746c 100%)',
    color: '#fff',
    // Example retro font; ensure you import it in your <head> or global CSS
    fontFamily: '"Press Start 2P", monospace',
    textAlign: 'center',
    overflow: 'hidden', // so the record doesn't cause scrollbars if it extends
  };

  // Position for the spinning record on the left
  const leftRecordStyle: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)', // center vertically
    width: '150px',                // adjust size as desired
    height: 'auto',
  };

  // Position for the spinning record on the right
  const rightRecordStyle: React.CSSProperties = {
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: '150px',
    height: 'auto',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '3rem',
    textShadow: '3px 3px #000',
    marginBottom: '1rem',
  };

  const subTitleStyle: React.CSSProperties = {
    fontSize: '2rem',
    textShadow: '2px 2px #000',
    margin: '1.5rem 0 1rem 0',
  };

  const nowPlayingStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    marginTop: '1rem',
    padding: '1rem 2rem',
    background: 'rgba(0,0,0,0.3)',
    border: '2px solid #fff',
    borderRadius: '8px',
    display: 'inline-block',
  };

  const listStyle: React.CSSProperties = {
    listStyle: 'none',
    padding: 0,
    margin: '1rem 0 2rem 0',
    maxWidth: '600px',
    width: '100%',
  };

  const listItemStyle: React.CSSProperties = {
    background: 'rgba(0,0,0,0.3)',
    border: '2px solid #fff',
    borderRadius: '8px',
    margin: '0.5rem 0',
    padding: '1rem',
    textAlign: 'center',
    textShadow: '1px 1px #000',
  };

  const qrStyle: React.CSSProperties = {
    width: 200,
    height: 200,
    margin: '1rem 0',
  };

  return (
    <main style={containerStyle}>
      {/* Left spinning record */}
      <img
        src="/record.gif"
        alt="Spinning record"
        style={leftRecordStyle}
      />

      {/* Right spinning record */}
      <img
        src="/record.gif"
        alt="Spinning record"
        style={rightRecordStyle}
      />

      <h1 style={titleStyle}>Now Playing</h1>

      {playing ? (
        <div style={nowPlayingStyle}>
          <p style={{ fontSize: '1.2rem', margin: 0 }}>
            <strong>{playing.albumName}</strong>
            {playing.trackName && ` - ${playing.trackName}`}
          </p>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
            Requested by {playing.userName}
          </p>
        </div>
      ) : (
        <p style={{ ...nowPlayingStyle, fontSize: '1.2rem' }}>Nothing playing</p>
      )}

      <h2 style={subTitleStyle}>Up Next</h2>
      {pending.length === 0 && <p style={{ fontSize: '1.2rem' }}>No pending requests</p>}
      <ul style={listStyle}>
        {pending.map((req) => (
          <li key={req.id} style={listItemStyle}>
            <strong>{req.albumName}</strong>
            {req.trackName && ` - ${req.trackName}`}
            <br />
            <small>by {req.userName}</small>
          </li>
        ))}
      </ul>

      <h3 style={{ fontSize: '1.5rem', textShadow: '2px 2px #000' }}>Scan to Request!</h3>
      <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>Use your phone's camera or QR scanner</p>

      <img
        src={`/api/qr?sessionId=${sessionId}`}
        alt="QR code to request a song"
        style={{ width: 200, height: 200, borderRadius: '8px', margin: '1rem 0' }}
      />

      <p style={{ marginTop: '1rem', fontSize: '1rem' }}>
        Or visit:{' '}
        <a href={requestPageURL} style={{ color: '#fff', textDecoration: 'underline' }}>
          {requestPageURL}
        </a>
      </p>
    </main>
  );
}
