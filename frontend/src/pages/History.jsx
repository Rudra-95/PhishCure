import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('phishcure_history') || '[]');
      setHistory(data);
    } catch (err) {
      setHistory([]);
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('phishcure_history');
    setHistory([]);
  };

  const getScoreColor = (score) => {
    if (score < 40) return '#e74c3c';
    if (score < 70) return '#f39c12';
    return '#2ecc71';
  };

  return (
    <div className="dashboard-container slide-up" style={{ margin: '0 auto', padding: '2rem', maxWidth: '1000px' }}>
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Analysis History</h2>
        {history.length > 0 && (
          <button onClick={clearHistory} className="btn-primary" style={{ background: 'transparent', border: '1px solid #e74c3c', color: '#e74c3c', padding: '8px 16px' }}>
            Clear Logs
          </button>
        )}
      </div>

      <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem' }}>
        {history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <p>No analysis history found.</p>
            <Link to="/dashboard" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>Run your first scan!</Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-panel-border)', color: 'var(--color-text-muted)' }}>
                  <th style={{ padding: '1rem' }}>Date</th>
                  <th style={{ padding: '1rem' }}>Type</th>
                  <th style={{ padding: '1rem' }}>Input Fragment</th>
                  <th style={{ padding: '1rem' }}>Safety Score</th>
                  <th style={{ padding: '1rem' }}>Verdict</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', transition: 'background 0.2s', ':hover': { background: 'rgba(0,0,0,0.02)' } }}>
                    <td style={{ padding: '1rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--color-primary)', fontWeight: '500', textTransform: 'uppercase', fontSize: '0.85rem' }}>
                      {item.type}
                    </td>
                    <td style={{ padding: '1rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.url}
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 'bold', color: getScoreColor(item.score) }}>
                      {item.score}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '12px', 
                        fontSize: '0.85rem',
                        background: `${getScoreColor(item.score)}22`, 
                        color: getScoreColor(item.score)
                      }}>
                        {item.verdict}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
