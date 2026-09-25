import React, { useState, useEffect } from 'react';

export default function App() {
  const [serverStatus, setServerStatus] = useState('checking');

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'ok') {
          setServerStatus('connected');
        } else {
          setServerStatus('error');
        }
      })
      .catch(() => {
        setServerStatus('disconnected');
      });
  }, []);

  return (
    <div className="app-container">
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          AI Trip Planner
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.975rem' }}>
          Plan your customized travel itinerary with AI-powered structure.
        </p>
        <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <span>Backend status:</span>
          <span style={{
            fontWeight: 600,
            color: serverStatus === 'connected' ? 'var(--success-color)' : serverStatus === 'checking' ? 'var(--accent-color)' : 'var(--danger-color)'
          }}>
            {serverStatus}
          </span>
        </div>
      </header>
    </div>
  );
}
