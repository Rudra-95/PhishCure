import React from 'react';

export default function Footer() {
  return (
    <footer style={{ 
      padding: '2.5rem', 
      textAlign: 'center', 
      borderTop: '1px solid rgba(255,255,255,0.1)',
      backdropFilter: 'blur(20px)',
      background: 'rgba(0,0,0,0.6)',
      color: 'var(--color-text-muted)',
      marginTop: 'auto'
    }}>
      <p style={{ marginBottom: '1.5rem', fontWeight: 500, letterSpacing: '0.5px' }}>
        © 2026 PhishCure Security. All rights reserved.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <span className="footer-tag">#CyberSecurity</span>
        <span className="footer-tag">#AI-Detection</span>
        <span className="footer-tag">#Phishing</span>
        <span className="footer-tag">#ZeroTrust</span>
        <span className="footer-tag">#ThreatIntel</span>
      </div>
    </footer>
  );
}
