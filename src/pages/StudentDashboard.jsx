import { useState, useEffect } from 'react';
import './css/StudentDashboard.css';



function StudentDashboard({ user }) {
  const [activeSection, setActiveSection] = useState('profile'); // Default view
  const [jobs, setJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  
  // --- STATE FOR PROFILE ---
  const [profile, setProfile] = useState({
    cgpa: user?.cgpa || 0,
    skills: user?.skills?.join(', ') || '',
    github: user?.githubLink || '',
    resume: null // For file upload simulation
  });
  const [resumeScore, setResumeScore] = useState(null); // AI Score simulation

  // --- STATE FOR NOTIFICATIONS ---
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New Job Posted: Google React Dev", type: "new" },
    { id: 2, text: "Your Resume Score is ready!", type: "info" }
  ]);

  // 1. Fetch Notifications
  useEffect(() => {
    if(user?._id) {
        fetch(`http://localhost:5001/api/notifications/${user._id}`)
            .then(res => res.json())
            .then(data => setNotifications(data))
            .catch(err => console.error(err));
    }
  }, [user]);
  // 1. Fetch Data on Load
  useEffect(() => {
    // Fetch Jobs
    fetch('http://localhost:5001/api/jobs')
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error(err));

    // Fetch My Applications
    if(user?._id) {
      fetch(`http://localhost:5001/api/applications/user/${user._id}`)
        .then(res => res.json())
        .then(data => setMyApplications(data))
        .catch(err => console.error(err));
    }
  }, [user]);

  // --- HANDLERS ---
// Add this function inside StudentDashboard component
  const handleSaveProfile = async () => {
    if (!user?._id) return alert("User not found");

    try {
      const response = await fetch(`http://localhost:5001/api/auth/update/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cgpa: profile.cgpa,
          skills: profile.skills, // Sending the string, backend will split it
          githubLink: profile.github
        })
      });

      if (response.ok) {
        alert("Profile Updated Successfully!");
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error(error);
      alert("Server error.");
    }
  };
  // Mock AI Resume Scorer
  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    setProfile({ ...profile, resume: file });
    // Simulate AI Processing
    setTimeout(() => {
        setResumeScore(Math.floor(Math.random() * (95 - 70 + 1)) + 70); // Random score 70-95
        setNotifications(prev => [{id: Date.now(), text: "Resume Scored: " + resumeScore, type: 'info'}, ...prev]);
    }, 2000);
  };

  const handleApply = async (jobId) => {
    const res = await fetch('http://localhost:5001/api/applications/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, jobId })
    });
    if(res.ok) {
        alert("Applied Successfully!");
        // Refresh apps
    } else {
        alert("Already Applied");
    }
  };

  // Eligibility Check Logic
  const checkEligibility = (job) => {
    // Example logic: You need CGPA > 7.0
    if (profile.cgpa < 7.0) return { eligible: false, reason: "CGPA too low" };
    return { eligible: true, reason: "Eligible" };
  };

  // --- SECTIONS UI ---

  const renderProfile = () => (
    <div className="section-container">
      <h3>My Profile & Documents</h3>
      <div className="profile-grid">
        <div className="card">
            <h4>Academic Details</h4>
            <label>Current CGPA</label>
            <input 
                type="number" 
                value={profile.cgpa} 
                onChange={(e) => setProfile({...profile, cgpa: e.target.value})} 
                placeholder="e.g. 8.5"
            />
            <label>Skills (comma separated)</label>
            <input 
                value={profile.skills} 
                onChange={(e) => setProfile({...profile, skills: e.target.value})} 
                placeholder="React, Node, Java" 
            />
            <button className="save-btn" onClick={handleSaveProfile}>
                  Save Profile
            </button>
        </div>

        <div className="card">
            <h4>Resume & Portfolio</h4>
            <label>GitHub Profile</label>
            <input 
                value={profile.github} 
                onChange={(e) => setProfile({...profile, github: e.target.value})} 
                placeholder="https://github.com/..." 
            />
            
            <label>Upload Resume (PDF)</label>
            <input type="file" onChange={handleResumeUpload} />
            
            {profile.resume && (
                <div className="ai-score-box">
                    {resumeScore ? (
                        <>
                            <span className="score">{resumeScore}/100</span>
                            <p>AI Suggestion: Add more keywords related to "Backend Development".</p>
                        </>
                    ) : (
                        <p>AI is analyzing your resume...</p>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );

  const renderJobs = () => (
    <div className="section-container">
        <h3>Job Search & Applications</h3>
        <div className="job-list">
            {jobs.map(job => {
                const eligibility = checkEligibility(job);
                return (
                    <div key={job._id} className="job-card-advanced">
                        <div className="job-info">
                            <h4>{job.title}</h4>
                            <p>{job.company}</p>
                            <div className="tags">
                                {eligibility.eligible ? 
                                    <span className="tag eligible">Eligible</span> : 
                                    <span className="tag not-eligible">{eligibility.reason}</span>
                                }
                            </div>
                        </div>
                        <div className="job-actions">
                            <button className="save-btn-outline">Save</button>
                            <button 
                                className="apply-btn" 
                                disabled={!eligibility.eligible}
                                onClick={() => handleApply(job._id)}
                            >
                                {eligibility.eligible ? "1-Click Apply" : "Not Eligible"}
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );

  const renderTracking = () => (
    <div className="section-container">
        <h3>Application Tracking</h3>
        <div className="tracking-list">
            {myApplications.map(app => (
                <div key={app._id} className="track-card">
                    <div className="step-progress">
                        <div className={`step ${['Applied', 'Shortlisted', 'Interview', 'Hired'].indexOf(app.status) >= 0 ? 'active' : ''}`}>Applied</div>
                        <div className="line"></div>
                        <div className={`step ${['Shortlisted', 'Interview', 'Hired'].indexOf(app.status) >= 0 ? 'active' : ''}`}>Shortlisted</div>
                        <div className="line"></div>
                        <div className={`step ${['Interview', 'Hired'].indexOf(app.status) >= 0 ? 'active' : ''}`}>Interview</div>
                        <div className="line"></div>
                        <div className={`step ${app.status === 'Hired' ? 'active' : ''}`}>Offer</div>
                    </div>
                    <div className="track-details">
                        <h4>{app.jobId?.title}</h4>
                        <p>{app.jobId?.company}</p>
                        <span className={`status-badge ${app.status.toLowerCase()}`}>{app.status}</span>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );

  const renderResources = () => (
    <div className="section-container">
        <h3>Career Development</h3>
        <div className="resource-grid">
            <div className="resource-card">
                <h4>Mock Tests</h4>
                <p>Practice aptitude and coding rounds.</p>
                <button>Start Test</button>
            </div>
            <div className="resource-card">
                <h4>Recommended Courses</h4>
                <p>Based on your interest in <strong>React</strong>.</p>
                <button>View Courses</button>
            </div>
            <div className="resource-card">
                <h4>Resume Builder</h4>
                <p>Use our template to create a ATS friendly resume.</p>
                <button>Create Now</button>
            </div>
        </div>
    </div>
  );

  const renderSupport = () => (
      <div className="section-container">
          <h3>Help Desk</h3>
          <div className="chat-interface">
              <div className="chat-box">
                  <div className="msg received">Hello! How can I help you today?</div>
                  <div className="msg sent">I have a query about the TCS drive.</div>
              </div>
              <div className="chat-input">
                  <input placeholder="Type your message..." />
                  <button>Send</button>
              </div>
          </div>
      </div>
  );

  return (
    <div className="dashboard-layout">
        {/* SIDEBAR */}
        <div className="notifications-box">
                <h5>🔔 Notifications</h5>
                {notifications.length === 0 && <p style={{fontSize:'0.8rem', color:'#666'}}>No new alerts.</p>}
                {notifications.map(n => (
                    <div key={n._id} className="notif-item">
                        {n.message}
                        <br/>
                        <small style={{color:'#999', fontSize:'0.7rem'}}>{new Date(n.createdAt).toLocaleDateString()}</small>
                    </div>
                ))}
            </div>
        <div className="sidebar">
            <div className="user-profile-summary">
                <div className="avatar">{user?.name?.charAt(0)}</div>
                <h4>{user?.name}</h4>
                <p>Student</p>
            </div>
            <nav>
                <button className={activeSection === 'profile' ? 'active' : ''} onClick={() => setActiveSection('profile')}>👤 Profile</button>
                <button className={activeSection === 'jobs' ? 'active' : ''} onClick={() => setActiveSection('jobs')}>💼 Find Jobs</button>
                <button className={activeSection === 'tracking' ? 'active' : ''} onClick={() => setActiveSection('tracking')}>📊 Track Status</button>
                <button className={activeSection === 'resources' ? 'active' : ''} onClick={() => setActiveSection('resources')}>📚 Resources</button>
                <button className={activeSection === 'support' ? 'active' : ''} onClick={() => setActiveSection('support')}>💬 Support</button>
            </nav>
            
            <div className="notifications-box">
                <h5>🔔 Notifications</h5>
                {notifications.map(n => (
                    <div key={n.id} className="notif-item">{n.text}</div>
                ))}
            </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="main-content">
            {activeSection === 'profile' && renderProfile()}
            {activeSection === 'jobs' && renderJobs()}
            {activeSection === 'tracking' && renderTracking()}
            {activeSection === 'resources' && renderResources()}
            {activeSection === 'support' && renderSupport()}
        </div>
    </div>
  );
}

export default StudentDashboard;