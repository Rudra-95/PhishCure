import React, { useState, useEffect } from 'react';
import '../components/Dashboard.css';

const URL_DATABASE = [
  { url: 'https://paypal-secure-update.com/login', isPhishing: true },
  { url: 'https://www.paypal.com/signin', isPhishing: false },
  { url: 'http://apple-id-verification-092.net', isPhishing: true },
  { url: 'https://apple.com/support', isPhishing: false },
  { url: 'https://netflix.com/browse', isPhishing: false },
  { url: 'https://netfIIx.com/payment-failed', isPhishing: true }, // homograph
  { url: 'http://chase.banking.secure-ssl.xyz/auth', isPhishing: true },
  { url: 'https://chase.com', isPhishing: false },
  { url: 'https://github.com/login', isPhishing: false },
  { url: 'https://gihub.com/security/verify', isPhishing: true },
  { url: 'https://amazon.com/gp/cart', isPhishing: false },
  { url: 'http://amaz0n-services.com/rewards', isPhishing: true },
  { url: 'https://linkedin.com/feed', isPhishing: false },
  { url: 'https://linkedln.com/messages/urgent', isPhishing: true },
  { url: 'https://gmail-security-alerts.systems/auth', isPhishing: true },
  { url: 'https://mail.google.com', isPhishing: false }
];

export default function Arcade() {
  const [gameState, setGameState] = useState('idle'); // idle, playing, over
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [currentUrl, setCurrentUrl] = useState(null);
  const [flashColor, setFlashColor] = useState('transparent');

  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('over');
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const startGame = () => {
    setScore(0);
    setMultiplier(1);
    setTimeLeft(60);
    setGameState('playing');
    pickRandomUrl();
  };

  const pickRandomUrl = () => {
    const randomIdx = Math.floor(Math.random() * URL_DATABASE.length);
    setCurrentUrl(URL_DATABASE[randomIdx]);
  };

  const handleGuess = (guessIsPhishing) => {
    if (gameState !== 'playing') return;

    if (guessIsPhishing === currentUrl.isPhishing) {
      // Correct!
      setScore(prev => prev + (100 * multiplier));
      setMultiplier(prev => Math.min(prev + 1, 10)); // Max 10x
      triggerFlash('rgba(46, 204, 113, 0.3)'); // green flash
    } else {
      // Wrong!
      setScore(prev => prev - 50);
      setMultiplier(1);
      triggerFlash('rgba(231, 76, 60, 0.3)'); // red flash
    }
    pickRandomUrl();
  };

  const triggerFlash = (color) => {
    setFlashColor(color);
    setTimeout(() => setFlashColor('transparent'), 150);
  };

  return (
    <div className="slide-up" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', color: 'var(--color-text-main)' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '3rem', color: '#f39c12', textShadow: '0 0 20px rgba(243, 156, 18, 0.4)', marginBottom: '0.5rem' }}>THREAT HUNTER ARCADE</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)' }}>Train your eyes. Spot the zero-day threats. Gain the highest score before time runs out.</p>
      </div>

      <div className="glass-panel" style={{ 
        padding: '3rem', 
        textAlign: 'center', 
        border: '2px solid #f39c12',
        boxShadow: '0 0 40px rgba(243, 156, 18, 0.1)',
        background: flashColor,
        transition: 'background 0.15s ease'
      }}>
        
        {gameState === 'idle' && (
          <div className="fade-in">
            <h2 style={{ marginBottom: '2rem', color: 'var(--color-text-main)' }}>Rules of Engagement</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>
              You have exactly 60 seconds. <br/> URLs will rapidly appear. You must instantly decide if they are <strong>Safe</strong> or <strong>Phishing</strong>. <br/> Successive hits build your multiplier up to 10x! One mistake resets it.
            </p>
            <button onClick={startGame} className="btn-primary" style={{ padding: '15px 40px', fontSize: '1.5rem', background: '#f39c12', boxShadow: '0 8px 24px rgba(243, 156, 18, 0.4)' }}>
              START ENGAGEMENT
            </button>
          </div>
        )}

        {gameState === 'playing' && currentUrl && (
          <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem', fontSize: '1.2rem', fontWeight: 600 }}>
              <div style={{ color: '#e74c3c' }}>TIME: {timeLeft}s</div>
              <div style={{ color: '#f39c12', fontSize: '1.5rem' }}>SCORE: {score}</div>
              <div style={{ color: '#3498db' }}>MULT: {multiplier}x</div>
            </div>

            <div style={{ 
              background: 'rgba(0,0,0,0.4)', 
              padding: '2rem', 
              borderRadius: '12px', 
              fontFamily: 'monospace', 
              fontSize: '1.8rem', 
              marginBottom: '3rem',
              wordBreak: 'break-all',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              {currentUrl.url}
            </div>

            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
              <button 
                onClick={() => handleGuess(false)} 
                className="btn-primary" 
                style={{ padding: '20px 50px', fontSize: '1.5rem', background: '#3498db' }}
              >
                ✅ SAFE
              </button>
              <button 
                onClick={() => handleGuess(true)} 
                className="btn-primary" 
                style={{ padding: '20px 50px', fontSize: '1.5rem', background: '#e74c3c' }}
              >
                🚨 PHISHING
              </button>
            </div>
          </div>
        )}

        {gameState === 'over' && (
          <div className="fade-in">
            <h2 style={{ fontSize: '3rem', color: '#e74c3c', marginBottom: '1rem' }}>SYSTEM LOCKDOWN</h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Timer Expired.</p>
            
            <div style={{ fontSize: '4rem', color: '#f39c12', fontWeight: 'bold', marginBottom: '3rem', textShadow: '0 0 20px rgba(243, 156, 18, 0.5)' }}>
              FINAL SCORE: {score}
            </div>

            <button onClick={startGame} className="btn-primary" style={{ padding: '15px 40px', fontSize: '1.2rem' }}>
              REDEPLOY
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
