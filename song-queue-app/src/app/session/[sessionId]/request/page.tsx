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

  // ====== STYLES ======
  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    margin: 0,
    padding: '2rem',
    // Vibrant retro gradient
    background: 'linear-gradient(135deg, #2c3e50 0%, #fd746c 100%)',
    color: '#fff',
    // Example retro font (make sure you load this in head.tsx or global)
    fontFamily: '"Press Start 2P", monospace',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    textShadow: '1px 1px #000',
  };

  const headingStyle: React.CSSProperties = {
    fontSize: '1.8rem',
    marginBottom: '1rem',
  };

  const subHeadingStyle: React.CSSProperties = {
    fontSize: '1.2rem',
    marginBottom: '1.5rem',
  };

  const formStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '100%',
    maxWidth: '400px',
  };

  const labelStyle: React.CSSProperties = {
    marginBottom: '0.3rem',
    fontSize: '0.9rem',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.6rem',
    fontFamily: '"Press Start 2P", monospace',
    border: '2px solid #fff',
    borderRadius: '8px',
    background: 'rgba(0, 0, 0, 0.2)',
    color: '#fff',
    outline: 'none',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '0.8rem',
    fontSize: '1rem',
    fontFamily: '"Press Start 2P", monospace',
    cursor: 'pointer',
    border: '2px solid #fff',
    borderRadius: '8px',
    background: 'rgba(0,0,0,0.2)',
    color: '#fff',
    textShadow: '1px 1px #000',
    transition: 'transform 0.2s, boxShadow 0.2s',
  };

  return (
    <main style={containerStyle}>
      <h1 style={headingStyle}>Request a Song</h1>
      {/* <p style={subHeadingStyle}>Session: <strong>{sessionId}</strong></p> */}

      <form onSubmit={handleSubmit} style={formStyle}>
        <div>
          <label style={labelStyle} htmlFor="userName">Your Name:</label>
          <input
            required
            name="userName"
            id="userName"
            value={formData.userName}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle} htmlFor="albumName">Album Name:</label>
          <input
            required
            name="albumName"
            id="albumName"
            value={formData.albumName}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle} htmlFor="trackName">Track Name (optional):</label>
          <input
            name="trackName"
            id="trackName"
            value={formData.trackName}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <button
          type="submit"
          style={buttonStyle}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 10px #fff';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
          }}
        >
          Submit Request
        </button>
      </form>
    </main>
  );
}
