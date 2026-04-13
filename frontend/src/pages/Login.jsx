import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'incorrect username or password');
        return;
      }

      // If login successful
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      window.dispatchEvent(new Event('auth-change'));
      
      if (data.user.username && data.user.username.toLowerCase() === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }

    } catch (err) {
      console.error(err);
      setError('Could not connect to the server');
    }
  };

  return (
    <div className="login-container slide-up">
      <div className="glass-panel login-card">
        <div className="login-header">
          <h1>PhishCure</h1>
          <p>Sign in to your account</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <Link to="/forgot-password" className="forgot-password-link">
            Forgot Password?
          </Link>

          <button type="submit" className="btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
