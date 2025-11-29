import { useState, useEffect } from 'react';
import './css/PlacementOfficerDashboard.css'; // We will create this CSS

function PlacementOfficerDashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const [stats, setStats] = useState({});
  const [students, setStudents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [report, setReport] = useState([]);
  const [announcement, setAnnouncement] = useState("");

  // FETCH DATA
  useEffect(() => {
    // We reuse the admin API routes we created earlier as they serve the same purpose
    fetch('http://localhost:5001/api/admin/stats').then(res => res.json()).then(setStats);
    fetch('http://localhost:5001/api/admin/students').then(res => res.json()).then(setStudents);
    fetch('http://localhost:5001/api/admin/jobs').then(res => res.json()).then(setJobs);
    fetch('http://localhost:5001/api/admin/report').then(res => res.json()).then(setReport);
  }, []);

  // --- ACTIONS ---

  const handleJobAction = async (jobId, action) => {
    const newStatus = action === 'approve' ? 'Open' : 'Closed';
    await fetch(`http://localhost:5001/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
    });
    alert(`Job ${newStatus} Successfully`);
    fetch('http://localhost:5001/api/admin/jobs').then(res => res.json()).then(setJobs);
  };

  const verifyStudent = (id) => {
    alert(`Student ${id} Verified (Mock Action)`);
  };

  const broadcastMsg = () => {
    if(!announcement) return;
    alert(`Announcement Sent: "${announcement}"`);
    setAnnouncement("");
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
            <h4>Broadcast Communication</h4>
            <p>Send an announcement to all registered students.</p>
            <textarea 
                placeholder="Type your message here..." 
                rows="3"
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                className="broadcast-input"
            ></textarea>
            <button className="primary-btn mt-2" onClick={broadcastMsg}>Send Announcement</button>
        </div>
    </div>
  );

  const renderStudents = () => (
      <div className="section-container">
          <h3>Student Management</h3>
          <div className="card table-card">
            <table className="officer-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>CGPA</th>
                        <th>Backlogs</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(std => (
                        <tr key={std._id}>
                            <td>{std.name}</td>
                            <td>{std.email}</td>
                            <td>{std.cgpa || "N/A"}</td>
                            <td>{std.backlogs || 0}</td>
                            <td>
                                <button className="action-btn verify" onClick={() => verifyStudent(std._id)}>Verify</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
      </div>
  );

  const renderJobs = () => (
      <div className="section-container">
          <h3>Job Posting Oversight</h3>
          <div className="card table-card">
            <table className="officer-table">
                <thead>
                    <tr>
                        <th>Company</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {jobs.map(job => (
                        <tr key={job._id}>
                            <td>{job.company}</td>
                            <td>{job.title}</td>
                            <td><span className={`pill ${job.status.toLowerCase()}`}>{job.status}</span></td>
                            <td>
                                {job.status !== 'Open' && <button className="action-btn approve" onClick={() => handleJobAction(job._id, 'approve')}>Approve</button>}
                                {job.status === 'Open' && <button className="action-btn reject" onClick={() => handleJobAction(job._id, 'close')}>Close</button>}
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
            <button className="secondary-btn" onClick={() => alert("Report Downloaded!")}>📥 Download Excel</button>
          </div>
          <div className="card table-card">
            <table className="officer-table">
                <thead>
                    <tr>
                        <th>Student</th>
                        <th>Company</th>
                        <th>Role</th>
                        <th>Current Status</th>
                    </tr>
                </thead>
                <tbody>
                    {report.map(app => (
                        <tr key={app._id}>
                            <td>{app.userId?.name || "Unknown"}</td>
                            <td>{app.jobId?.company || "Unknown"}</td>
                            <td>{app.jobId?.title}</td>
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
                <button className={activeSection === 'students' ? 'active' : ''} onClick={() => setActiveSection('students')}>🎓 Students</button>
                <button className={activeSection === 'jobs' ? 'active' : ''} onClick={() => setActiveSection('jobs')}>📢 Jobs</button>
                <button className={activeSection === 'tracking' ? 'active' : ''} onClick={() => setActiveSection('tracking')}>📈 Tracker</button>
            </nav>
        </div>

        <div className="main-content">
            {activeSection === 'overview' && renderOverview()}
            {activeSection === 'students' && renderStudents()}
            {activeSection === 'jobs' && renderJobs()}
            {activeSection === 'tracking' && renderTracking()}
        </div>
    </div>
  );
}

export default PlacementOfficerDashboard;