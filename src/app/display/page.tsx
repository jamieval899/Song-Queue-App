'use client';
import { useEffect, useState } from 'react';
import type { SongRequest } from '../../lib/data';

export default function DisplayPage() {
  const [requests, setRequests] = useState<SongRequest[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/requests');
        const data = await res.json();
        setRequests(data);
      } catch (error) {
        console.error(error);
      }
    };

    load(); // initial load
    const interval = setInterval(load, 5000); // poll every 5s
    return () => clearInterval(interval);
  }, []);

  // Filter out "pending" requests for "Up Next"
  const pending = requests.filter((r) => r.status === 'pending');

  return (
    <main style={{ textAlign: 'center', padding: '1rem' }}>
      <h1>Now Playing</h1>
      <p>Not implemented yet (need a "playing" status update)</p>

      <h2>Up Next</h2>
      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        {pending.map((req) => (
          <li key={req.id} style={{ margin: '1rem 0' }}>
            {req.albumName}
            {req.trackName && ` - ${req.trackName}`}
            <br />
            <small>Requested by {req.userName}</small>
          </li>
        ))}
      </ul>

      <h3>Scan to Request!</h3>
      <img src="/qr.png" alt="QR code" style={{ width: 150, height: 150 }} />
    </main>
  );
}
