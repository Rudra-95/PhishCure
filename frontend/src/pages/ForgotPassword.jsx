import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [simulatedLink, setSimulatedLink] = useState('');

  const handleRequest = async (e) => {
    e.preventDefault();
    setError('');
    setSimulatedLink('');
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Error sending link');
      } else {
        // We simulate the Email inbox right on the screen
        setSimulatedLink(`${window.location.origin}/reset-password/${data.resetToken}`);
      }
    } catch (err) {
      console.error(err);
      setError('Could not connect to the server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container slide-up">
      <div className="glass-panel login-card">
        <div className="login-header">
          <h1>Recover Account</h1>
          <p>We'll dispatch a cryptographic reset token securely.</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        
        {simulatedLink ? (
          <div style={{ padding: '1.5rem', background: 'rgba(46, 204, 113, 0.1)', border: '1px solid #2ecc71', borderRadius: '12px', textAlign: 'center' }}>
            <h3 style={{ color: '#2ecc71', marginBottom: '1rem', fontSize: '1.2rem' }}>Email Successfully Sent! 📨</h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--color-text-main)' }}>
              (Note: For testing, your isolated reset link is provided explicitly below)
            </p>
            <a href={simulatedLink} style={{ color: '#3498db', fontSize: '0.9rem', wordBreak: 'break-all' }}>
              {simulatedLink}
            </a>
          </div>
        ) : (
          <form className="login-form" onSubmit={handleRequest}>
            <div className="input-group">
              <label htmlFor="email">Registered Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your security email"
                required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '1rem', width: '100%' }} disabled={isLoading}>
              {isLoading ? 'Dispatching...' : 'Send Recovery Token'}
            </button>
          </form>
        )}
        
        <Link to="/login" className="forgot-password-link" style={{ textAlign: 'center', marginTop: '1rem', alignSelf: 'center' }}>
          Back to Login Protocol
        </Link>
      </div>
    </div>
  );
}
