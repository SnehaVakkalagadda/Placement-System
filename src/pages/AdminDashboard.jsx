import { useState, useEffect } from 'react';
import './css/AdminDashboard.css';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState({ placementRate: 0, avgSalary: 0, hiredCount: 0 });
  
  // Mock Settings & Logs
  const [settings, setSettings] = useState({ oneOfferRule: true, allowBacklogs: false });
  const [logs, setLogs] = useState([
    "System Backup completed at 02:00 AM",
    "User 'John' failed login 3 times",
    "New Employer 'Google' registered"
  ]);

  // FETCH DATA
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch('http://localhost:5001/api/superadmin/users').then(res => res.json()).then(setUsers);
    fetch('http://localhost:5001/api/superadmin/analytics').then(res => res.json()).then(setAnalytics);
  };

  // --- ACTIONS ---

  const handleDeleteUser = async (id) => {
    if(!window.confirm("Are you sure? This deletes all their data.")) return;
    await fetch(`http://localhost:5001/api/superadmin/users/${id}`, { method: 'DELETE' });
    fetchData(); // Refresh list
  };

  const handleResetPassword = (id) => {
    alert(`Password reset link sent to User ID: ${id}`);
  };

  const toggleSetting = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  // --- HELPER FOR BADGES ---
  const getRoleBadge = (role) => {
    switch(role) {
      case 'admin': return 'badge-admin';
      case 'student': return 'badge-student';
      case 'employer': return 'badge-employer';
      case 'placement_officer': return 'badge-po';
      default: return '';
    }
  };

  // --- UI RENDERERS ---

  const renderUserManagement = () => (
    <div className="section-container">
        <h3>User & Role Management</h3>
        <p>Control access and manage permissions for all users across the portal.</p>
        
        <div className="card table-card">
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>User Details</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u._id}>
                            <td>
                                <div className="user-name">
                                    <strong>{u.name}</strong>
                                    <span className="user-email">{u.email}</span>
                                </div>
                            </td>
                            <td>
                                <span className={`role-badge ${getRoleBadge(u.role)}`}>
                                    {u.role.replace('_', ' ')}
                                </span>
                            </td>
                            <td>
                                <div className="actions-cell">
                                    <button className="icon-btn edit" title="Reset Password" onClick={() => handleResetPassword(u._id)}>
                                        🔑
                                    </button>
                                    <button className="icon-btn delete" title="Delete User" onClick={() => handleDeleteUser(u._id)}>
                                        🗑️
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );

  const renderSystemSettings = () => (
      <div className="section-container">
          <h3>System Settings</h3>
          <p>Configure global rules and placement policies.</p>
          
          <div className="card">
              <h4 className="card-title">Placement Policies</h4>
              <div className="setting-row">
                  <div>
                      <strong>One Offer Rule</strong>
                      <p className="small-text">If enabled, students cannot apply after accepting an offer.</p>
                  </div>
                  <label className="switch">
                      <input type="checkbox" checked={settings.oneOfferRule} onChange={() => toggleSetting('oneOfferRule')} />
                      <span className="slider round"></span>
                  </label>
              </div>
              <div className="setting-row">
                  <div>
                      <strong>Allow Students with Backlogs</strong>
                      <p className="small-text">Allow students with active backlogs to apply for jobs.</p>
                  </div>
                  <label className="switch">
                      <input type="checkbox" checked={settings.allowBacklogs} onChange={() => toggleSetting('allowBacklogs')} />
                      <span className="slider round"></span>
                  </label>
              </div>
          </div>
          {/* REMOVED: Institution Guidelines Card */}
      </div>
  );

  const renderAnalytics = () => (
      <div className="section-container">
          <h3>Data & Analytics</h3>
          <p>Real-time insights into placement performance.</p>
          <div className="stats-grid">
              <div className="stat-card blue">
                  <h3>Placement Rate</h3>
                  <h1>{analytics.placementRate}%</h1>
              </div>
              <div className="stat-card green">
                  <h3>Avg Salary</h3>
                  <h1>₹ {(analytics.avgSalary || 0).toLocaleString()}</h1>
              </div>
              <div className="stat-card purple">
                  <h3>Total Hired</h3>
                  <h1>{analytics.hiredCount}</h1>
              </div>
          </div>
          <div className="card">
             <h4 className="card-title">Export Reports</h4>
             <div className="btn-group">
                 <button className="secondary-btn" onClick={() => alert("Downloading CSV...")}>📄 Export Branch-wise Stats</button>
                 <button className="secondary-btn" onClick={() => alert("Downloading PDF...")}>📊 Export Annual Report</button>
             </div>
          </div>
      </div>
  );

  const renderSecurity = () => (
      <div className="section-container">
          <h3>Security & Maintenance</h3>
          <p>Monitor system health and secure data.</p>
          <div className="security-grid">
              <div className="card">
                  <h4 className="card-title">Data Backup</h4>
                  <p>Last backup: 2 hours ago.</p>
                  <button className="primary-btn">Trigger Backup Now</button>
              </div>
              <div className="card">
                  <h4 className="card-title">Security Protocols</h4>
                  <div style={{display:'flex', gap:'10px'}}>
                    <button className="secondary-btn">Enable 2FA for Admins</button>
                    <button className="secondary-btn">Force Logout All</button>
                  </div>
              </div>
          </div>
          <div className="card log-terminal">
              <h4 className="card-title" style={{color:'#fff', borderBottom:'1px solid #444'}}>System Logs</h4>
              <div className="logs-window">
                  {logs.map((log, i) => <div key={i} className="log-line"><span>{new Date().toLocaleTimeString()}</span> {log}</div>)}
              </div>
          </div>
      </div>
  );

  return (
    <div className="dashboard-layout">
        <div className="sidebar">
            <div className="user-profile-summary">
                <div className="avatar" style={{background: '#111827'}}>SA</div>
                <h4>Super Admin</h4>
                <p>System Controller</p>
            </div>
            <nav>
                <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>👥 Users & Roles</button>
                <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>⚙️ System Settings</button>
                <button className={activeTab === 'analytics' ? 'active' : ''} onClick={() => setActiveTab('analytics')}>📊 Data & Analytics</button>
                <button className={activeTab === 'security' ? 'active' : ''} onClick={() => setActiveTab('security')}>🛡️ Security</button>
            </nav>
        </div>

        <div className="main-content">
            {activeTab === 'users' && renderUserManagement()}
            {activeTab === 'settings' && renderSystemSettings()}
            {activeTab === 'analytics' && renderAnalytics()}
            {activeTab === 'security' && renderSecurity()}
        </div>
    </div>
  );
}

export default AdminDashboard;