import { useNavigate } from "react-router-dom";
import GlobalThreatRadar from "../components/GlobalThreatRadar";
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

        {/* Feature 5: Browser Extension Interactive Tutorial */}
        <div className="extension-tutorial glass-panel slide-up-delay" style={{ marginTop: '4rem', padding: '3rem 2rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'center' }}>
            <div style={{ flex: '1 1 400px', textAlign: 'left' }}>
              <h2 style={{ fontSize: '2.5rem', color: '#f39c12', marginBottom: '1rem', textShadow: '0 0 15px rgba(243, 156, 18, 0.4)' }}>
                Enable X-Ray Vision.
              </h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
                Don't wait until you've already clicked a malicious link. Install our Proactive DOM Scanner to violently intercept zero-day phishing sites the millisecond they attempt to load in your browser.
              </p>
              
              <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '12px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h4 style={{ color: '#2ecc71', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>🚀</span> 3-Step Activation Protocol
                </h4>
                <ol style={{ color: 'var(--color-text-main)', paddingLeft: '1.5rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <li>Go to <strong>chrome://extensions</strong> in your browser.</li>
                  <li>Enable <strong>Developer mode</strong> in the top right.</li>
                  <li>Click <strong>Load unpacked</strong> and select the PhishCure <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>extension/</code> folder.</li>
                </ol>
              </div>
              
              <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(52, 152, 219, 0.1)', borderLeft: '4px solid #3498db', borderRadius: '4px' }}>
                <p style={{ margin: 0, color: 'var(--color-text-main)', fontSize: '0.95rem' }}>
                  <strong>Pro-Tip:</strong> Once installed, simply hold <kbd style={{ background: '#333', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem' }}>Shift</kbd> + <strong>Click</strong> on any link across the web to instantly force a deep AI scan!
                </p>
              </div>
            </div>
            
            <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center' }}>
               <div style={{ 
                 width: '100%', maxWidth: '400px', height: '300px', 
                 background: 'linear-gradient(145deg, #1a1f2e, #111520)',
                 borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)',
                 boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                 position: 'relative', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center'
               }}>
                 <div style={{ textAlign: 'center', zIndex: 2 }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛑</div>
                    <h3 style={{ color: '#e74c3c', margin: '0 0 0.5rem 0' }}>Navigation Blocked</h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', padding: '0 20px' }}>PhishCure AI intercepted a high-risk connection mid-air.</p>
                 </div>
                 {/* Decorative background grid */}
                 <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'linear-gradient(rgba(231,76,60,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(231,76,60,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px', zIndex: 1 }}></div>
               </div>
            </div>
          </div>
        </div>

        <GlobalThreatRadar />

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
