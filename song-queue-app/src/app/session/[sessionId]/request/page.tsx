'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';

interface RequestFormData {
  userName: string;
  albumName: string;
  trackName?: string;
}

export default function MobileRequestPage() {
  const params = useParams() as { sessionId: string };
  const sessionId = params.sessionId;

  const [formData, setFormData] = useState<RequestFormData>({
    userName: '',
    albumName: '',
    trackName: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/sessions/${sessionId}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(`Error adding request: ${data.error || 'Unknown error'}`);
        return;
      }

      alert('Request submitted!');
      setFormData({ userName: '', albumName: '', trackName: '' });
    } catch (error) {
      console.error(error);
      alert('Network error');
    }
  };

  return (
    <main style={{ maxWidth: 400, margin: '0 auto', padding: '1rem' }}>
      <h1>Request a Song</h1>
      <p>Session: <strong>{sessionId}</strong></p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div>
          <label htmlFor="userName">Your Name:</label>
          <input
            required
            name="userName"
            id="userName"
            value={formData.userName}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div>
          <label htmlFor="albumName">Album Name:</label>
          <input
            required
            name="albumName"
            id="albumName"
            value={formData.albumName}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div>
          <label htmlFor="trackName">Track Name (optional):</label>
          <input
            name="trackName"
            id="trackName"
            value={formData.trackName}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <button type="submit" style={{ padding: '0.75rem', marginTop: '1rem' }}>
          Submit Request
        </button>
      </form>
    </main>
  );
}
