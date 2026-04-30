import React, { useState, useEffect } from 'react';

// Simulated coordinates for threat origins and targets
const CITIES = [
  { name: "Moscow", x: 60, y: 30 },
  { name: "Beijing", x: 80, y: 40 },
  { name: "New York", x: 25, y: 45 },
  { name: "London", x: 45, y: 35 },
  { name: "Tokyo", x: 85, y: 45 },
  { name: "Sydney", x: 90, y: 80 },
  { name: "São Paulo", x: 35, y: 75 },
  { name: "Lagos", x: 48, y: 60 }
];

const THREAT_TYPES = [
  "Zero-Day Phishing",
  "Credential Harvesting",
  "Homograph Attack",
  "Ransomware Payload",
  "Spear-Phishing"
];

export default function GlobalThreatRadar() {
  const [activeThreats, setActiveThreats] = useState([]);
  const [stats, setStats] = useState({ intercepted: 14205, active: 42 });

  useEffect(() => {
    // Simulate real-time threat interception
    const interval = setInterval(() => {
      const origin = CITIES[Math.floor(Math.random() * CITIES.length)];
      let target;
      do {
        target = CITIES[Math.floor(Math.random() * CITIES.length)];
      } while (target.name === origin.name);

      const newThreat = {
        id: Date.now(),
        origin,
        target,
        type: THREAT_TYPES[Math.floor(Math.random() * THREAT_TYPES.length)]
      };

      setActiveThreats(prev => [...prev.slice(-4), newThreat]);
      setStats(prev => ({
        intercepted: prev.intercepted + 1,
        active: Math.floor(Math.random() * 20) + 30
      }));
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel slide-up-delay" style={{ 
      marginTop: '4rem', 
      padding: '0', 
      overflow: 'hidden',
      border: '1px solid rgba(231, 76, 60, 0.3)',
      boxShadow: '0 0 40px rgba(231, 76, 60, 0.1)'
    }}>
      <div style={{ 
        background: 'rgba(0,0,0,0.4)', 
        padding: '1.5rem 2rem', 
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#e74c3c', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ 
              width: '12px', height: '12px', borderRadius: '50%', background: '#e74c3c', 
              boxShadow: '0 0 10px #e74c3c', animation: 'pulse 1.5s infinite' 
            }}></span>
            Live Global Threat Radar
          </h2>
          <p style={{ margin: '0.2rem 0 0 0', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Monitoring anomalous lexical signatures worldwide
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#f39c12', fontFamily: 'monospace' }}>
            {stats.intercepted.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Threats Intercepted
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', height: '400px', background: '#0a0f1c', overflow: 'hidden' }}>
        {/* World Map Background Simulation (Simplified Grid for futuristic feel) */}
        <div style={{
          position: 'absolute', width: '100%', height: '100%',
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          backgroundPosition: 'center center'
        }}></div>

        {/* Radar Sweep */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', width: '800px', height: '800px',
          marginLeft: '-400px', marginTop: '-400px', borderRadius: '50%',
          background: 'conic-gradient(from 0deg, transparent 70%, rgba(231, 76, 60, 0.1) 95%, rgba(231, 76, 60, 0.8) 100%)',
          animation: 'radar-spin 4s linear infinite',
          pointerEvents: 'none'
        }}></div>
        
        {/* Radar Rings */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: '200px', height: '200px', marginLeft: '-100px', marginTop: '-100px', borderRadius: '50%', border: '1px solid rgba(231, 76, 60, 0.2)' }}></div>
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: '400px', height: '400px', marginLeft: '-200px', marginTop: '-200px', borderRadius: '50%', border: '1px solid rgba(231, 76, 60, 0.1)' }}></div>
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: '600px', height: '600px', marginLeft: '-300px', marginTop: '-300px', borderRadius: '50%', border: '1px solid rgba(231, 76, 60, 0.05)' }}></div>

        {/* Animated Threat Arcs */}
        {activeThreats.map(threat => {
          return (
            <React.Fragment key={threat.id}>
              {/* Origin Marker */}
              <div style={{
                position: 'absolute', left: `${threat.origin.x}%`, top: `${threat.origin.y}%`,
                width: '8px', height: '8px', borderRadius: '50%', background: '#e74c3c',
                boxShadow: '0 0 15px #e74c3c', transform: 'translate(-50%, -50%)',
                animation: 'fade-out 2.5s forwards'
              }}></div>

              {/* Target Marker */}
              <div style={{
                position: 'absolute', left: `${threat.target.x}%`, top: `${threat.target.y}%`,
                width: '8px', height: '8px', borderRadius: '50%', background: '#3498db',
                boxShadow: '0 0 15px #3498db', transform: 'translate(-50%, -50%)',
                animation: 'fade-out 2.5s forwards'
              }}></div>

              {/* Connecting Arc/Line */}
              <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', animation: 'fade-out 2.5s forwards' }}>
                <line 
                  x1={`${threat.origin.x}%`} y1={`${threat.origin.y}%`} 
                  x2={`${threat.target.x}%`} y2={`${threat.target.y}%`} 
                  stroke="rgba(231, 76, 60, 0.5)" strokeWidth="2" strokeDasharray="5,5" 
                />
              </svg>

              {/* Alert Tag */}
              <div style={{
                position: 'absolute', left: `${(threat.origin.x + threat.target.x)/2}%`, top: `${(threat.origin.y + threat.target.y)/2}%`,
                background: 'rgba(0,0,0,0.8)', border: '1px solid #e74c3c', color: '#fff',
                padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', transform: 'translate(-50%, -50%)',
                whiteSpace: 'nowrap', animation: 'slide-up-fade 2.5s forwards', zIndex: 10
              }}>
                🚨 {threat.type} intercepted
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <style>{`
        @keyframes radar-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fade-out {
          0% { opacity: 1; }
          70% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes slide-up-fade {
          0% { opacity: 0; transform: translate(-50%, -20%); }
          10% { opacity: 1; transform: translate(-50%, -50%); }
          80% { opacity: 1; transform: translate(-50%, -50%); }
          100% { opacity: 0; transform: translate(-50%, -80%); }
        }
        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(231, 76, 60, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(231, 76, 60, 0); }
        }
      `}</style>
    </div>
  );
}
