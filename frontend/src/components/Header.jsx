import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Dummy Threat Ticker Data
const ACTIVE_THREATS = [
  "WARNING: Detected 1500% spike in malicious domains targeting banking sector credentials.",
  "LIVE INTEL: Zero-day phishing templates impersonating Office365 currently active.",
  "SECURITY ADVISORY: 43 new cryptocurrency scam URLs automatically blocked in the last hour."
];

export default function Header() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [currentUser, setCurrentUser] = useState(null);
  const [threatIdx, setThreatIdx] = useState(0);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const syncAuth = () => {
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        try {
          setCurrentUser(JSON.parse(userStr));
        } catch (e) {
          console.error(e);
        }
      } else {
        setCurrentUser(null);
      }
    };

    // Run once on mount
    syncAuth();

    // Listen to custom global auth events
    window.addEventListener('auth-change', syncAuth);

    const interval = setInterval(() => {
      setThreatIdx(prev => (prev + 1) % ACTIVE_THREATS.length);
    }, 5000);
    return () => {
      clearInterval(interval);
      window.removeEventListener('auth-change', syncAuth);
    };
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.dispatchEvent(new Event('auth-change'));
    window.location.href = "/login";
  };

  return (
    <>
    <header className="app-header" style={{ borderBottom: 'none', background: 'transparent' }}>
      <Link to="/" className="logo">
        <div className="logo-icon">P</div>
        <span>PhishCure</span>
      </Link>
      <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Link to="/" style={{ fontWeight: 500, transition: 'var(--transition-smooth)' }}>Home</Link>
        <Link to="/history" style={{ fontWeight: 500, transition: 'var(--transition-smooth)' }}>History</Link>
        <Link to="/arcade" style={{ fontWeight: 600, color: '#f39c12', transition: 'var(--transition-smooth)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          🎮 Arcade
        </Link>
        <Link to="/docs" className="btn-primary" style={{ background: 'transparent', color: 'var(--color-primary)', border: '1px solid var(--color-primary)', display: 'inline-block' }}>
          Documentation
        </Link>
        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '35px', height: '35px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
              display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontWeight: 'bold'
            }}>
              {currentUser.username ? currentUser.username[0].toUpperCase() : 'U'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Hi, {currentUser.username}</span>
            </div>
            <button onClick={handleLogout} className="btn-primary" style={{ padding: '8px 16px', background: 'rgba(231, 76, 60, 0.8)', fontSize: '0.85rem' }}>
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn-primary" style={{ display: 'inline-block' }}>
            Login
          </Link>
        )}
        <button 
          onClick={toggleTheme} 
          style={{ background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--color-text-main)' }}
          title="Toggle Theme"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </nav>
    </header>
    
    <div className="threat-ticker" style={{ 
      background: 'rgba(231, 76, 60, 0.1)', 
      borderBottom: '1px solid rgba(231, 76, 60, 0.2)',
      padding: '4px 2rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      backdropFilter: 'blur(10px)',
      overflow: 'hidden'
    }}>
      <span style={{ color: '#e74c3c', fontWeight: 'bold', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>LIVE THREAT INTEL:</span>
      <p key={threatIdx} style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-main)', animation: 'slideUp 0.5s ease' }}>
        {ACTIVE_THREATS[threatIdx]}
      </p>
    </div>
    </>
  );
}
