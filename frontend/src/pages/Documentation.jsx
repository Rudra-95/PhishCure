import React from 'react';
import '../components/Dashboard.css';

export default function Documentation() {
  return (
    <div className="slide-up" style={{ padding: '4rem 2rem', maxWidth: '1000px', margin: '0 auto', color: 'var(--color-text-main)' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>PhishCure Technical Manual</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)' }}>Architecture, Heuristics, and Zero-Trust Integration</p>
      </div>

      <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--color-primary)', borderBottom: '1px solid var(--color-panel-border)', paddingBottom: '0.8rem', marginBottom: '1.5rem' }}>1. The System Architecture</h2>
        <p style={{ lineHeight: '1.8', marginBottom: '1rem' }}>
          PhishCure operates on a highly decoupled MERN stack fused with asynchronous Python microservices. Our primary node cluster manages authentication, route protection, and cryptographic token generation, while our FastAPI engine handles the heavy lexical load.
        </p>
        <ul style={{ listStyleType: 'disc', paddingLeft: '2rem', lineHeight: '2', color: 'var(--color-text-muted)' }}>
          <li><strong>Frontend:</strong> React 18, React Router v6, Global Singleton Auth Engine.</li>
          <li><strong>Database Core:</strong> MongoDB utilizing encrypted Schema definitions.</li>
          <li><strong>Caching Layer:</strong> Redis implementation mitigating redundant API spamming.</li>
        </ul>
      </div>

      <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
        <h2 style={{ color: '#f39c12', borderBottom: '1px solid var(--color-panel-border)', paddingBottom: '0.8rem', marginBottom: '1.5rem' }}>2. Heuristic Detection Pipeline</h2>
        <p style={{ lineHeight: '1.8', marginBottom: '1rem' }}>
          When a URL is submitted, the engine bypasses traditional blocklists and performs zero-day analysis:
        </p>
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px', border: '1px outset var(--color-panel-border)' }}>
          <h4 style={{ color: '#e74c3c', marginBottom: '0.5rem' }}>Phase A: Deep Regex & TLD Analysis</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>The system immediately scans for suspicious TLDs (.xyz, .top), IP-based hostnames, and sub-domain stacking (e.g., login.paypal.com.secure-update.net).</p>
          
          <h4 style={{ color: '#3498db', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Phase B: LLM Lexical Review</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Text payloads are passed to Claude 3.5 via secure API. The model dissects "Action Biases"—looking for high-urgency language combined with financial triggers.</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <h2 style={{ color: '#2ecc71', borderBottom: '1px solid var(--color-panel-border)', paddingBottom: '0.8rem', marginBottom: '1.5rem' }}>3. Enterprise Security & Routing</h2>
        <p style={{ lineHeight: '1.8' }}>
          PhishCure does not rely on soft-routing. The Dashboard, Admin panel, and History views are violently shielded by <code>&lt;ProtectedRoute&gt;</code> wrappers that execute cryptographic validation of the `localStorage` user object. Password Resets utilize 32-byte hexadecimal tokens ensuring account hijacking is mathematically impossible.
        </p>
      </div>

    </div>
  );
}
