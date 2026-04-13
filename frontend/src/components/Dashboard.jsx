import { useEffect, useState } from 'react';
import './Dashboard.css';

export default function Dashboard() {
  const [inputType, setInputType] = useState('url'); // 'url' or 'text'
  const [url, setUrl] = useState("");
  const [analysisState, setAnalysisState] = useState('idle');
  const [results, setResults] = useState(null);
  
  // Feature 3 & 6 states
  const [urlHint, setUrlHint] = useState('');
  const [recentScans, setRecentScans] = useState([]);

  useEffect(() => {
    // Feature 3: Load recent scans
    const history = JSON.parse(localStorage.getItem('phishcure_history') || '[]');
    setRecentScans(history.slice(0, 3));
  }, [analysisState]);

  useEffect(() => {
    // Feature 6: Smart URL Health Hints
    if (inputType === 'url' && url.length > 5) {
      if (!url.startsWith('http://') && !url.startsWith('https://')) setUrlHint('⚠️ Missing http/https protocol');
      else if (url.includes('.xyz') || url.includes('.top') || url.includes('.online')) setUrlHint('🚨 Suspicious high-risk TLD');
      else if (url.split('.').length > 3) setUrlHint('⚠️ Multiple subdomains detected');
      else setUrlHint('✅ Syntax OK');
    } else {
      setUrlHint('');
    }
  }, [url, inputType]);

  const analyze = async () => {
    if (!url.trim()) return;
    setAnalysisState('loading');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: inputType, value: url }),
      });

      if (!response.ok) throw new Error('Analysis failed');

      const data = await response.json();
      setResults(data);
      setAnalysisState('complete');

      // Hook for History feature caching
      try {
        const history = JSON.parse(localStorage.getItem('phishcure_history') || '[]');
        history.unshift({
          url: url.substring(0, 50) + (url.length > 50 ? '...' : ''),
          type: inputType,
          verdict: data.verdict,
          score: data.score,
          date: new Date().toISOString()
        });
        localStorage.setItem('phishcure_history', JSON.stringify(history.slice(0, 100))); // keep latest 100
        
        // Also log to backend if a user is logged in
        const usrStr = localStorage.getItem('currentUser');
        if (usrStr) {
          const user = JSON.parse(usrStr);
          fetch('http://localhost:5000/api/admin/logs/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user._id,
              username: user.username,
              type: inputType,
              value: url,
              score: data.score,
              verdict: data.verdict
            })
          }).catch(console.error); // Silent catch
        }
      } catch (err) {
        console.error('Failed to save history', err);
      }

    } catch (e) {
      console.error(e);
      setResults({
        score: 10,
        verdict: 'Error Connecting',
        summary: 'Failed to connect to the backend engine.',
        sources: [],
        details: [],
        trusted_alternatives: []
      });
      setAnalysisState('complete');
    }
  };

  const getScoreColor = (score) => {
    if (score < 40) return '#e74c3c';
    if (score < 70) return '#f39c12';
    return '#2ecc71';
  };

  return (
    <div className="dashboard-container slide-up" style={{ margin: '0 auto', padding: '2rem' }}>
      
      {/* Input Section built into Dashboard natively */}
      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '800px', margin: '0 auto 2rem auto' }}>
        <h2 style={{ color: 'var(--color-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          PhishCure Analyzer
          
          <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
            <button 
              onClick={() => { setInputType('url'); setUrl(""); }} 
              style={{ padding: '5px 12px', borderRadius: '20px', background: inputType === 'url' ? 'var(--color-primary)' : 'transparent', color: inputType === 'url' ? 'white' : 'inherit', border: '1px solid var(--color-primary)' }}
            >
              Analyze URL
            </button>
            <button 
              onClick={() => { setInputType('text'); setUrl(""); }} 
              style={{ padding: '5px 12px', borderRadius: '20px', background: inputType === 'text' ? 'var(--color-primary)' : 'transparent', color: inputType === 'text' ? 'white' : 'inherit', border: '1px solid var(--color-primary)' }}
            >
              Paste Full Article
            </button>
          </div>
        </h2>

        <div style={{ display: 'flex', gap: '1rem', flexDirection: inputType === 'text' ? 'column' : 'row' }}>
          {inputType === 'url' ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Enter suspect URL here (e.g. https://www...)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }}
              />
              {urlHint && <span style={{ fontSize: '0.85rem', color: urlHint.includes('OK') ? '#2ecc71' : urlHint.includes('Suspicious') ? '#e74c3c' : '#f39c12', fontWeight: 500, paddingLeft: '4px' }}>{urlHint}</span>}
            </div>
          ) : (
            <textarea
              placeholder="Paste the full text of the article or email here for analysis..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={{ flex: 1, padding: '1rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', minHeight: '150px', fontFamily: 'inherit', resize: 'vertical' }}
            />
          )}

          <div style={{ alignSelf: inputType === 'text' ? 'flex-end' : 'flex-start', marginTop: inputType === 'url' ? '0' : 'auto' }}>
            <button onClick={analyze} className="btn-primary" style={{ padding: '1rem 2rem', height: inputType === 'url' ? '54px' : 'auto' }}>
              Analyze Extract
            </button>
          </div>
        </div>
      </div>
      
      {/* Feature 3: Recent Activity Sidebar placement (if idle) */}
      {analysisState === 'idle' && recentScans.length > 0 && (
        <div className="glass-panel slide-up-delay" style={{ width: '100%', maxWidth: '800px', margin: '0 auto 2rem auto', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>Your Recent Security Scans</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {recentScans.map((scan, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{scan.url}</span>
                <span className="verdict-tag" style={{ background: scan.score > 70 ? 'rgba(46, 204, 113, 0.2)' : 'rgba(231, 76, 60, 0.2)', color: scan.score > 70 ? '#2ecc71' : '#e74c3c', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>{scan.verdict}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {analysisState === 'loading' && (
        <div className="loading-state">
          <div className="spinner"></div>
          <h2>Analyzing Sources...</h2>
          <p>Cross-referencing claims and evaluating lexical patterns.</p>
        </div>
      )}

      {analysisState === 'complete' && results && (
        <DashboardResults results={results} scoreColor={getScoreColor(results.score)} />
      )}
    </div>
  );
}

const DashboardResults = ({ results, scoreColor }) => {
  const { score, verdict, summary, sources, details, trusted_alternatives } = results;
  const showAlternatives = trusted_alternatives && trusted_alternatives.length > 0;

  return (
    <div className={`dashboard-layout ${showAlternatives ? 'has-sidebar' : ''}`}>
      <div className="dashboard-grid">
        <div className="glass-panel score-card">
          <div className="score-circle" style={{ '--score-color': scoreColor }}>
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path className="circle-bg"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path className="circle" strokeDasharray={`${score}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="score-text">
              <span className="number">{score}</span>
              <span className="label">Safety Score</span>
            </div>
          </div>
          <h3 className="verdict" style={{ color: scoreColor }}>{verdict}</h3>
        </div>

        <div className="glass-panel summary-card">
          <h3>AI Reasoning</h3>
          <p className="summary-text">{summary}</p>
          <div className="details-list">
            {details.map((detail, idx) => (
              <div key={idx} className="detail-item">
                <h4>{detail.title}</h4>
                <p>{detail.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel sources-card">
          <h3>Cross-Referenced Sources</h3>
          <ul className="source-list">
            {sources.map((src, idx) => (
              <li key={idx} className="source-item">
                <div className="source-info">
                  <span className="source-name">{src.name}</span>
                  <a href={src.url} target="_blank" rel="noreferrer" className="source-link">View Source ↗</a>
                </div>
                <span className={`status-badge status-${src.status.toLowerCase()}`}>
                  {src.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {showAlternatives && (
        <aside className="glass-panel alternatives-sidebar">
          <div className="alert-icon">⚠️</div>
          <h3>Trusted Alternatives</h3>
          <p className="alt-desc">We strongly suggest visiting these verified counterparts instead:</p>
          <div className="alt-list">
            {trusted_alternatives.map((alt, idx) => (
              <a key={idx} href={alt.url} target="_blank" rel="noreferrer" className="alt-card">
                <span className="alt-name">{alt.name}</span>
                <span className="alt-reason">{alt.reason}</span>
                <span className="go-arrow">→</span>
              </a>
            ))}
          </div>
        </aside>
      )}
    </div>
  );
};
