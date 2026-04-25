import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedUser, setExpandedUser] = useState(null);
  const [userLogs, setUserLogs] = useState({}); // Cache logs perfectly via Map or Object { username: logsArray }
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingLogsFor, setLoadingLogsFor] = useState(null);
  
  // Modal State
  const [modalData, setModalData] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Check if current user is admin
    const usrStr = localStorage.getItem('currentUser');
    if (!usrStr) {
      navigate('/login');
      return;
    }
    const user = JSON.parse(usrStr);
    if (!user.username || user.username.toLowerCase() !== 'admin') {
      navigate('/dashboard'); // redirect non-admins
      return;
    }

    // Fetch master user list
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`)
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoadingUsers(false);
      })
      .catch(err => {
        console.error(err);
        setLoadingUsers(false);
      });
  }, [navigate]);

  const toggleAccordion = (username) => {
    if (expandedUser === username) {
      setExpandedUser(null);
      return;
    }
    setExpandedUser(username);

    // Fetch logs only if not cached already
    if (!userLogs[username]) {
      setLoadingLogsFor(username);
      fetch(`${import.meta.env.VITE_API_URL}/api/admin/logs/${encodeURIComponent(username)}`)
        .then(res => res.json())
        .then(data => {
          setUserLogs(prev => ({ ...prev, [username]: data }));
          setLoadingLogsFor(null);
        })
        .catch(err => {
          console.error(err);
          setLoadingLogsFor(null);
        });
    }
  };

  const deleteLog = async (e, username, logId) => {
    e.stopPropagation(); // prevent accordion toggle jump
    if (!window.confirm("Are you sure you want to permanently delete this search artifact?")) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/logs/delete/${logId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        // Optimistically remove from state cache
        setUserLogs(prev => ({
          ...prev,
          [username]: prev[username].filter(log => log._id !== logId)
        }));
      } else {
        alert("Failed to delete log");
      }
    } catch (error) {
      console.error(error);
      alert("Network exception deleting log.");
    }
  };

  const openDetailsModal = (e, log, userObj) => {
    e.stopPropagation(); // keep accordion steady
    setModalData({ log, user: userObj });
  };

  const closeModal = () => {
    setModalData(null);
  };

  const getScoreColor = (score) => {
    if (score < 40) return '#e74c3c';
    if (score < 70) return '#f39c12';
    return '#2ecc71';
  };

  return (
    <div className="admin-dashboard-container slide-up">
      <div className="admin-header glass-panel">
        <h2>Admin Control Panel</h2>
        <p>Monitor platform usage seamlessly through expanding global user profiles.</p>
        <input 
          type="text" 
          className="admin-search-bar" 
          placeholder="Search by username..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="admin-master-view">
        {loadingUsers ? (
          <div className="spinner-small"></div>
        ) : users.length === 0 ? (
          <div className="empty-state">No users registered yet out here in the void.</div>
        ) : (
          users
            .filter(u => u.username.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(u => {
            const isExpanded = expandedUser === u.username;
            const currentLogs = userLogs[u.username] || [];
            const isLoading = loadingLogsFor === u.username;

            return (
              <div 
                key={u._id} 
                className={`user-row-wrapper ${isExpanded ? 'expanded' : ''}`}
              >
                {/* Parent Row Toggle */}
                <div 
                  className="user-row-header" 
                  onClick={() => toggleAccordion(u.username)}
                >
                  <div className="user-primary-info">
                    <div className="user-avatar">👤</div>
                    <div className="user-details">
                      <h3>{u.username}</h3>
                      <p>{u.email}</p>
                    </div>
                  </div>
                  <div className="expand-icon">
                    ▼
                  </div>
                </div>

                {/* Sub Panel Accordion -> Drops Down Underneath */}
                <div className={`user-accordion-content ${isExpanded ? 'open' : ''}`}>
                  <div className="logs-container">
                    {isLoading ? (
                       <div className="spinner-small"></div>
                    ) : currentLogs.length === 0 ? (
                      <div className="empty-state" style={{ padding: '1.5rem' }}>No scanning history available for {u.username}.</div>
                    ) : (
                      <table className="logs-table">
                        <thead>
                          <tr>
                            <th>Time</th>
                            <th>Query Type</th>
                            <th>Analyzed Source</th>
                            <th>AI Score</th>
                            <th>Manage Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentLogs.map(log => (
                            <tr key={log._id}>
                              <td className="log-date">{new Date(log.date).toLocaleString()}</td>
                              <td className="log-type">{log.type.toUpperCase()}</td>
                              <td className="log-value">{log.value}</td>
                              <td>
                                <span className="verdict-badge" style={{ 
                                    background: `${getScoreColor(log.score)}22`, 
                                    color: getScoreColor(log.score) 
                                }}>
                                  {log.score}
                                </span>
                              </td>
                              <td className="action-buttons">
                                <button className="btn-icon btn-view" title="View Detail Grid" onClick={(e) => openDetailsModal(e, log, u)}>
                                  ⊞
                                </button>
                                <button className="btn-icon btn-delete" title="Delete Artifact" onClick={(e) => deleteLog(e, u.username, log._id)}>
                                  🗑
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Spectacular Detail Overlap Modal */}
      {modalData && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Search Diagnostics</h3>
              <button className="close-modal" onClick={closeModal}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="modal-detail-row">
                <span className="modal-detail-label">User Target</span>
                <span className="modal-detail-value">{modalData.user.username} ({modalData.user.email})</span>
              </div>
              <div className="modal-detail-row">
                <span className="modal-detail-label">Query Time</span>
                <span className="modal-detail-value">{new Date(modalData.log.date).toLocaleString()}</span>
              </div>
              <div className="modal-detail-row">
                <span className="modal-detail-label">Query Context</span>
                <span className="modal-detail-value">{modalData.log.value}</span>
              </div>
              <div className="modal-detail-row">
                <span className="modal-detail-label">Engine Verdict</span>
                <span className="modal-detail-value" style={{ color: getScoreColor(modalData.log.score), fontWeight: 'bold' }}>
                  {modalData.log.verdict} (Score: {modalData.log.score})
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
