import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import './Login.css'; 

export default function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Error updating password');
      } else {
        setMessage('Password uniquely reset! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2500);
      }
    } catch (err) {
      console.error(err);
      setError('Could not connect to the secure server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container slide-up">
      <div className="glass-panel login-card">
        <div className="login-header">
          <h1>Secure Reset</h1>
          <p>Please enter your new cryptographic password.</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        <form className="login-form" onSubmit={handleReset}>
          <div className="input-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter secured password"
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '1rem', width: '100%' }} disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Set Secure Password'}
          </button>
          
          <Link to="/login" className="forgot-password-link" style={{ textAlign: 'center', marginTop: '0.5rem', alignSelf: 'center' }}>
            Abort to Login
          </Link>
        </form>
      </div>
    </div>
  );
}
