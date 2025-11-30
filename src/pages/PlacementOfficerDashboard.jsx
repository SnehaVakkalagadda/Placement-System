import { useState, useEffect } from 'react';
import './css/PlacementOfficerDashboard.css';

function PlacementOfficerDashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const [stats, setStats] = useState({});
  const [students, setStudents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [report, setReport] = useState([]);

  // --- 1. DATA INTEGRATION (The Fetching Logic) ---
  const fetchAllData = () => {
    // Fetch Stats
    fetch('https://placement-system-0pah.onrender.com/api/admin/stats')
      .then(res => res.json()).then(setStats);

    // Fetch Students (From Signup)
    fetch('https://placement-system-0pah.onrender.com/api/admin/students')
      .then(res => res.json()).then(setStudents);

    // Fetch Jobs (From Employer Dashboard)
    fetch('https://placement-system-0pah.onrender.com/api/admin/jobs')
      .then(res => res.json()).then(setJobs);

    // Fetch Applications (From Student Actions)
    fetch('https://placement-system-0pah.onrender.com/api/admin/report')
      .then(res => res.json()).then(setReport);
  };

  // Run on page load
  useEffect(() => {
    fetchAllData();
  }, []);

  // --- ACTIONS ---

  const handleJobAction = async (jobId, action) => {
    const newStatus = action === 'approve' ? 'Open' : 'Closed';
    await fetch(`https://placement-system-0pah.onrender.com/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
    });
    // Refresh Data immediately to show update
    fetchAllData();
  };

  // --- RENDERERS ---

  const renderOverview = () => (
    <div className="section-container">
        <h3>Placement Overview</h3>
        <div className="stats-grid">
            <div className="stat-card purple">
                <h3>Total Students</h3>
                <h1>{stats.totalStudents || 0}</h1>
            </div>
            <div className="stat-card blue">
                <h3>Active Jobs</h3>
                <h1>{stats.totalJobs || 0}</h1>
            </div>
            <div className="stat-card orange">
                <h3>Applications</h3>
                <h1>{stats.totalApplications || 0}</h1>
            </div>
            <div className="stat-card green">
                <h3>Placed Students</h3>
                <h1>{stats.placedStudents || 0}</h1>
            </div>
        </div>
        <div className="card">
            <h4 style={{marginBottom:'10px'}}>System Health</h4>
            <p>Data is syncing in real-time from Student and Employer portals.</p>
            <button className="primary-btn" onClick={fetchAllData}>Refresh Data</button>
        </div>
    </div>
  );

  const renderJobs = () => (
      <div className="section-container">
          <h3>Job Posting Oversight</h3>
          <p>Monitor jobs posted by companies.</p>
          <div className="card table-card">
            <table className="officer-table">
                <thead>
                    <tr>
                        <th>Company</th>
                        <th>Role</th>
                        <th>Min CGPA</th>
                        <th>Status</th>
                        <th>Control</th>
                    </tr>
                </thead>
                <tbody>
                    {jobs.length === 0 && <tr><td colSpan="5">No jobs posted yet.</td></tr>}
                    {jobs.map(job => (
                        <tr key={job._id}>
                            <td><strong>{job.company}</strong></td>
                            <td>{job.title}</td>
                            <td>{job.minCGPA}+</td>
                            <td><span className={`pill ${job.status.toLowerCase()}`}>{job.status}</span></td>
                            <td>
                                {job.status === 'Open' ? (
                                    <button className="action-btn reject" onClick={() => handleJobAction(job._id, 'close')}>Close Job</button>
                                ) : (
                                    <button className="action-btn approve" onClick={() => handleJobAction(job._id, 'approve')}>Re-Open</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
      </div>
  );

  const renderTracking = () => (
      <div className="section-container">
          <div className="header-flex">
            <h3>Placement Tracker</h3>
            <p>Live view of student applications.</p>
          </div>
          <div className="card table-card">
            <table className="officer-table">
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Company</th>
                        <th>Job Role</th>
                        <th>Current Status</th>
                    </tr>
                </thead>
                <tbody>
                    {report.length === 0 && <tr><td colSpan="4">No applications yet.</td></tr>}
                    {report.map(app => (
                        <tr key={app._id}>
                            <td>
                                <strong>{app.userId?.name || "Unknown"}</strong><br/>
                                <small style={{color:'#666'}}>{app.userId?.email}</small>
                            </td>
                            <td>{app.jobId?.company || "Deleted Job"}</td>
                            <td>{app.jobId?.title || "Unknown Role"}</td>
                            <td><span className={`pill ${app.status.toLowerCase()}`}>{app.status}</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
      </div>
  );

  return (
    <div className="dashboard-layout">
        <div className="sidebar">
            <div className="user-profile-summary">
                <div className="avatar" style={{background: '#dc2626'}}>PO</div>
                <h4>Placement Officer</h4>
                <p>Coordinator</p>
            </div>
            <nav>
                <button className={activeSection === 'overview' ? 'active' : ''} onClick={() => setActiveSection('overview')}>📊 Overview</button>
                <button className={activeSection === 'jobs' ? 'active' : ''} onClick={() => setActiveSection('jobs')}>📢 Job Oversight</button>
                <button className={activeSection === 'tracking' ? 'active' : ''} onClick={() => setActiveSection('tracking')}>📈 Tracker</button>
            </nav>
        </div>

        <div className="main-content">
            {activeSection === 'overview' && renderOverview()}
            {activeSection === 'jobs' && renderJobs()}
            {activeSection === 'tracking' && renderTracking()}
        </div>
    </div>
  );
}

export default PlacementOfficerDashboard;