'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        // Retro gradient colors (experiment with different combos)
        background: 'linear-gradient(135deg, #ff8a00 0%, #e52e71 100%)',
        color: '#fff',
        fontFamily: '"Press Start 2P", monospace', // example retro font
      }}
    >
      {/* Big Retro Title */}
      <h1
        style={{
          fontSize: '3rem',
          marginBottom: '2rem',
          textShadow: '3px 3px 0 #000',
          textAlign: 'center',
        }}
      >
         Song Queue
      </h1>

      {/* Big "Get Started" Button */}
      <Link href="/admin">
        <button
          style={{
            fontSize: '1.5rem',
            padding: '1rem 2rem',
            backgroundColor: '#000',
            color: '#fff',
            border: '2px solid #fff',
            borderRadius: '8px',
            cursor: 'pointer',
            textShadow: '2px 2px #ff69b4',
            transition: 'transform 0.2s, background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#222';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#000';
          }}
        >
          Get Started
        </button>
      </Link>
    </main>
  );
}
