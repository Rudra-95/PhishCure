import { useNavigate } from "react-router-dom";
import './Home.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page fade-in">
      <div className="input-hero" style={{ marginTop: '2vh' }}>
        <div className="hero-text">
          <h1>Detect Phishing Websites Instantly.</h1>
          <p>PhishCure helps you identify malicious URLs using advanced Large Language Models and deterministic fact-checking.</p>
        </div>
        
        <button 
          onClick={() => navigate("/dashboard")}
          className="btn-primary"
          style={{ fontSize: '1.2rem', padding: '15px 40px', marginTop: '1rem' }}
        >
          Open Analyzer Dashboard
        </button>
      </div>
      
      <div className="features-section slide-up-delay" style={{ marginTop: '3rem' }}>
        <h2 className="section-title">Why PhishCure?</h2>
        <div className="features-grid">
          
          <div className="feature-card glass-panel">
            <div className="feature-icon">⚡</div>
            <h3>Fast Detection</h3>
            <p>Instant results checking against billions of indexed threat signatures and lexical LLM analysis.</p>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-icon">🔐</div>
            <h3>Secure Validation</h3>
            <p>Protect your data and identity. Identified claims are immediately cross-referenced securely.</p>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-icon">🌐</div>
            <h3>Smart Suggestions</h3>
            <p>Don't just get blocked. Receive safe alternative verified sources seamlessly in your dashboard.</p>
          </div>

        </div>

        {/* Feature 4: Anatomy of an AI-Scan Interactive Timeline */}
        <div className="anatomy-section glass-panel slide-up-delay" style={{ marginTop: '4rem', padding: '3rem 2rem', textAlign: 'left' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--color-primary)' }}>The Anatomy of an AI-Scan</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-primary)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', flexShrink: 0 }}>1</div>
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', color: 'var(--color-text-main)' }}>Lexical & Heuristic Extraction</h4>
                <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>The engine immediately strips the core domain, checking SSL certificates, WHOIS registration age, and performing deep regex matches for obfuscated homograph attacks.</p>
              </div>
            </div>
            <div style={{ width: '2px', height: '30px', background: 'var(--color-panel-border)', margin: '0 0 0 19px' }}></div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-secondary)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', flexShrink: 0 }}>2</div>
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', color: 'var(--color-text-main)' }}>LLM Content Processing</h4>
                <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>If a text or article is provided, Claude 3.5 evaluates emotional urgency, logical fallacies, and structural manipulation tactics typically used in spear-phishing campaigns.</p>
              </div>
            </div>
            <div style={{ width: '2px', height: '30px', background: 'var(--color-panel-border)', margin: '0 0 0 19px' }}></div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#2ecc71', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', flexShrink: 0 }}>3</div>
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', color: 'var(--color-text-main)' }}>Zero-Trust Verdict Generation</h4>
                <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>A comprehensive security score is synthesized alongside safe, verified alternative paths—allowing you to confidently navigate without compromise.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 5: Browser Extension Promo CTA */}
        <div className="extension-promo slide-up-delay" style={{ 
          marginTop: '4rem', 
          background: 'linear-gradient(135deg, rgba(126, 87, 194, 0.2), rgba(209, 196, 233, 0.1))',
          border: '1px solid var(--color-primary)',
          borderRadius: '24px',
          padding: '4rem 2rem',
          textAlign: 'center',
          backdropFilter: 'blur(20px)'
        }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', color: 'var(--color-text-main)', marginBottom: '1rem' }}>Protect Every Click Automatically.</h2>
          <p style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)', color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
            Don't waste time copying and pasting URLs. Install the PhishCure Chrome Extension to violently block zero-day phishing sites the millisecond they try to load on your machine.
          </p>
          <button 
            className="btn-primary" 
            style={{ 
              padding: '16px 32px', 
              fontSize: '1.1rem', 
              background: '#e74c3c', 
              boxShadow: '0 8px 24px rgba(231, 76, 60, 0.4)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              width: 'clamp(250px, 80%, 400px)'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(231, 76, 60, 0.6)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(231, 76, 60, 0.4)'; }}
            onClick={() => {
              if (window.confirm("You are about to be redirected to the Chrome Webstore to install the PhishCure extension. Would you like to proceed?")) {
                window.open("https://chrome.google.com/webstore", "_blank");
              }
            }}
          >
            ⬇ Install Chrome Extension — Free
          </button>
        </div>

        <div className="trusted-by" style={{ marginTop: '4rem' }}>
          <p>ARCHITECTURE POWERED BY</p>
          <div className="badges">
            <span className="badge">PostgreSQL</span>
            <span className="badge">Redis Caching</span>
            <span className="badge">FastAPI Async</span>
            <span className="badge">Claude 3.5</span>
          </div>
        </div>
      </div>
    </div>
  );
}
