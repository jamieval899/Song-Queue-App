'use client';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function SessionRequestPage() {
  const params = useParams() as { sessionId: string };
  const sessionId = params.sessionId;

  const [userName, setUserName] = useState('');
  const [albumName, setAlbumName] = useState('');
  const [trackName, setTrackName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/sessions/${sessionId}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, albumName, trackName }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        alert(`Error: ${error || 'Failed to add request'}`);
        return;
      }
      alert('Request submitted!');
      // Reset fields
      setUserName('');
      setAlbumName('');
      setTrackName('');
    } catch (error) {
      console.error(error);
      alert('Network error');
    }
  };

  return (
    <main style={{ padding: '1rem' }}>
      <h1>Session {sessionId}</h1>
      <p>Request a Song</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Your Name:</label><br />
          <input
            required
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div style={{ marginTop: '0.5rem' }}>
          <label>Album Name:</label><br />
          <input
            required
            value={albumName}
            onChange={(e) => setAlbumName(e.target.value)}
          />
        </div>
        <div style={{ marginTop: '0.5rem' }}>
          <label>Track Name (optional):</label><br />
          <input
            value={trackName}
            onChange={(e) => setTrackName(e.target.value)}
          />
        </div>
        <button type="submit" style={{ marginTop: '1rem' }}>
          Submit
        </button>
      </form>
    </main>
  );
}
