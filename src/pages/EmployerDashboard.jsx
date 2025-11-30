import { useState, useEffect } from 'react';
import './css/EmployerDashboard.css';

function EmployerDashboard() {
  const [activeSection, setActiveSection] = useState('manage-jobs');
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  
  // Workflow Specific State
  const [workflowJobId, setWorkflowJobId] = useState(''); 
  const [shortlisted, setShortlisted] = useState([]); 

  // Forms State
  const [jobForm, setJobForm] = useState({ title: '', company: '', minCGPA: '', requiredSkills: '' });
  const [filterStatus, setFilterStatus] = useState('All'); // REMOVED CGPA Filter
  const [schedule, setSchedule] = useState({ date: '', time: '', type: 'Online Test' });

  // 1. Fetch Jobs
  const fetchJobs = () => {
    fetch('https://placement-system-0pah.onrender.com/api/jobs')
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchJobs(); }, []);

  // 2. Fetch Applicants
  const fetchApplicants = async (jobId) => {
    const res = await fetch(`https://placement-system-0pah.onrender.com/api/applications/job/${jobId}`);
    const data = await res.json();
    setApplicants(data);
  };

  // 3. Fetch Shortlisted (For Workflow)
  const fetchShortlisted = async (jobId) => {
    setWorkflowJobId(jobId);
    if(!jobId) { setShortlisted([]); return; }
    const res = await fetch(`https://placement-system-0pah.onrender.com/api/applications/job/${jobId}`);
    const data = await res.json();
    const shortList = data.filter(app => app.status === 'Shortlisted');
    setShortlisted(shortList);
  };

  // --- ACTIONS ---

  const handlePostJob = async (e) => {
    e.preventDefault();
    await fetch('https://placement-system-0pah.onrender.com/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobForm)
    });
    setJobForm({ title: '', company: '', minCGPA: '', requiredSkills: '' });
    fetchJobs();
    alert("Job Posted Successfully!");
  };

  const toggleJobStatus = async (job) => {
    const newStatus = job.status === 'Open' ? 'Closed' : 'Open';
    await fetch(`https://placement-system-0pah.onrender.com/api/jobs/${job._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    fetchJobs();
  };

  const handleStatusUpdate = async (appId, status, context = 'applicants') => {
    await fetch(`https://placement-system-0pah.onrender.com/api/applications/status/${appId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    
    if(context === 'applicants' && selectedJob) fetchApplicants(selectedJob._id);
    if(context === 'workflow' && workflowJobId) fetchShortlisted(workflowJobId);
  };

  const handleSchedule = async (e) => {
      e.preventDefault();
      
      // Validation: Must select a job first
      if(!workflowJobId) {
          alert("Please select a Job Role from the dropdown first.");
          return;
      }

      // Find Job Title for the message
      const jobTitle = jobs.find(j => j._id === workflowJobId)?.title || "Job";

      try {
          const response = await fetch('https://placement-system-0pah.onrender.com/api/notifications/schedule', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  jobId: workflowJobId,
                  jobTitle: jobTitle,
                  ...schedule // contains date, time, type
              })
          });

          const data = await response.json();
          if(response.ok) {
              alert(data.message); // "Invites sent to X candidates"
          } else {
              alert(data.message); // Error message
          }
      } catch (error) {
          console.error(error);
          alert("Failed to send invites.");
      }
  };

  // --- UI SECTIONS ---

  const renderManageJobs = () => (
    <div className="section-container">
      <div className="section-header">
        <h3>Job Management</h3>
        <p>Create and manage your recruitment drives.</p>
      </div>
      
      <div className="card">
        <h4 className="card-title">Create New Listing</h4>
        <form onSubmit={handlePostJob} className="grid-form">
            <div className="input-group">
                <label>Job Title</label>
                <input placeholder="e.g. Software Engineer" value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} required />
            </div>
            <div className="input-group">
                <label>Company Name</label>
                <input placeholder="e.g. TechCorp" value={jobForm.company} onChange={e => setJobForm({...jobForm, company: e.target.value})} required />
            </div>
            <div className="input-group">
                <label>Min CGPA</label>
                <input placeholder="e.g. 7.5" type="number" value={jobForm.minCGPA} onChange={e => setJobForm({...jobForm, minCGPA: e.target.value})} />
            </div>
            <div className="input-group">
                <label>Required Skills</label>
                <input placeholder="e.g. React, Node.js" value={jobForm.requiredSkills} onChange={e => setJobForm({...jobForm, requiredSkills: e.target.value})} />
            </div>
            <button type="submit" className="primary-btn full-width">Post Job</button>
        </form>
      </div>

      <h4 className="sub-heading">Your Postings</h4>
      <div className="job-list-container">
        {jobs.length === 0 ? <p className="no-data">No jobs posted yet.</p> : null}
        
        {jobs.map(job => (
            <div key={job._id} className="job-row-card">
                <div className="job-details">
                    <div className="job-title-row">
                        <h4>{job.title}</h4>
                        <span className={`status-pill ${job.status.toLowerCase()}`}>{job.status}</span>
                    </div>
                    <p className="job-meta">CGPA: {job.minCGPA}+ • Skills: {job.requiredSkills || 'Any'}</p>
                </div>
                <div className="job-actions">
                    <button className="view-btn" onClick={() => { setSelectedJob(job); setActiveSection('applicants'); fetchApplicants(job._id); }}>View Applicants</button>
                    <button className={`toggle-btn ${job.status === 'Open' ? 'close' : 'repost'}`} onClick={() => toggleJobStatus(job)}>
                        {job.status === 'Open' ? 'Close Job' : 'Repost'}
                    </button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );

  const renderApplicants = () => {
    if(!selectedJob) return (
        <div className="empty-state">
            <h3>No Job Selected</h3>
            <p>Please go to "Manage Jobs" and click "View Applicants" on a job listing.</p>
            <button className="primary-btn" onClick={() => setActiveSection('manage-jobs')}>Go to Jobs</button>
        </div>
    );

    // 1. DEFINE the variable FIRST
    const filteredApplicants = applicants.filter(app => {
        const meetsStatus = filterStatus === 'All' ? true : app.status === filterStatus;
        return meetsStatus;
    });

    // 2. LOG it SECOND (Now it exists, so it won't crash)
    console.log("ALL APPLICANTS FROM DB:", applicants);
    console.log("FILTERED LIST:", filteredApplicants);
    return (
        <div className="section-container">
            <div className="section-header flex-row">
                <div>
                    <h3>Applicants</h3>
                    <p>For Role: <strong>{selectedJob.title}</strong></p>
                </div>
                <button className="secondary-btn" onClick={() => alert("Downloading...")}>📥 Download Resumes</button>
            </div>

            {/* FILTERS - Removed Min CGPA Input */}
            <div className="card filters-card">
                <div className="filter-group full-width-filter">
                    <label>Filter by Status:</label>
                    <select onChange={e => setFilterStatus(e.target.value)} value={filterStatus}>
                        <option value="All">All Applications</option>
                        <option value="Applied">Pending Review</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Hired">Hired</option>
                    </select>
                </div>
            </div>

            {/* TABLE */}
            <div className="table-container card">
                <table className="applicant-table">
                    <thead>
                        <tr>
                            <th style={{width: '35%'}}>Candidate Details</th>
                            <th style={{width: '15%'}}>CGPA</th>
                            <th style={{width: '20%'}}>Skills</th>
                            <th style={{width: '15%'}}>Status</th>
                            <th style={{width: '15%'}}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredApplicants.length === 0 ? <tr><td colSpan="5" style={{textAlign:'center', padding: '2rem'}}>No applicants found.</td></tr> : null}
                        
                        {filteredApplicants.map(app => (
                            <tr key={app._id}>
                                <td>
                                    <div className="candidate-info">
                                        <div className="candidate-avatar">{app.userId?.name?.charAt(0) || "U"}</div>
                                        <div>
                                            {/* Showing Name and Email Clearly */}
                                            <strong>{app.userId?.name || "Unknown User"}</strong>
                                            <span>{app.userId?.email}</span>
                                            <a href="#" style={{fontSize: '0.8rem', color: '#4f46e5'}}>View Profile</a>
                                        </div>
                                    </div>
                                </td>
                                <td>{app.userId?.cgpa || "N/A"}</td>
                                <td>{app.userId?.skills?.join(', ') || "None"}</td>
                                <td><span className={`status-badge ${app.status.toLowerCase()}`}>{app.status}</span></td>
                                <td>
                                    <div className="action-buttons-row">
                                        {app.status === 'Applied' && (
                                            <>
                                                <button className="icon-btn check" title="Shortlist" onClick={() => handleStatusUpdate(app._id, 'Shortlisted')}>✓</button>
                                                <button className="icon-btn cross" title="Reject" onClick={() => handleStatusUpdate(app._id, 'Rejected')}>✕</button>
                                            </>
                                        )}
                                        {app.status === 'Shortlisted' && (
                                            <button className="hire-btn-small" onClick={() => handleStatusUpdate(app._id, 'Hired')}>Hire</button>
                                        )}
                                        {app.status === 'Rejected' && <span style={{color:'#999', fontSize:'0.8rem'}}>Rejected</span>}
                                        {app.status === 'Hired' && <span style={{color:'#166534', fontSize:'0.8rem', fontWeight:'bold'}}>Hired!</span>}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
  };

  const renderWorkflow = () => (
      <div className="section-container">
          <div className="section-header">
            <h3>Recruitment Workflow</h3>
            <p>Manage rounds and finalize selections.</p>
          </div>

          {/* 1. GLOBAL JOB SELECTOR (Moves to top) */}
          <div className="card" style={{padding: '1.5rem', marginBottom: '20px', borderLeft: '4px solid #0ea5e9'}}>
              <label style={{fontWeight: 'bold', display: 'block', marginBottom: '10px'}}>Select Recruitment Drive:</label>
              <select 
                  className="job-selector" 
                  value={workflowJobId} 
                  onChange={(e) => fetchShortlisted(e.target.value)}
              >
                  <option value="">-- Select Job Role --</option>
                  {jobs.map(j => <option key={j._id} value={j._id}>{j.title}</option>)}
              </select>
          </div>
          
          <div className="workflow-grid">
            {/* LEFT: SCHEDULE */}
            <div className="card">
                <h4 className="card-title">Schedule Interview / Test</h4>
                <form onSubmit={handleSchedule}>
                    <div className="input-group">
                        <label>Round Type</label>
                        <select value={schedule.type} onChange={e => setSchedule({...schedule, type: e.target.value})}>
                            <option>Online Test</option>
                            <option>Technical Interview</option>
                            <option>HR Discussion</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label>Date</label>
                        <input type="date" onChange={e => setSchedule({...schedule, date: e.target.value})} required/>
                    </div>
                    <div className="input-group">
                        <label>Time</label>
                        <input type="time" onChange={e => setSchedule({...schedule, time: e.target.value})} required/>
                    </div>
                    <button className="primary-btn full-width">Send Invites to Shortlisted</button>
                </form>
            </div>

            {/* RIGHT: FINAL SELECTION */}
            <div className="card final-selection-card">
                <h4 className="card-title">Shortlisted Candidates</h4>
                
                <div className="shortlist-container">
                    {!workflowJobId && <p className="no-data-small">Select a job above to view candidates.</p>}
                    {workflowJobId && shortlisted.length === 0 && <p className="no-data-small">No shortlisted candidates yet.</p>}
                    
                    {shortlisted.map(app => (
                        <div key={app._id} className="shortlist-item">
                            <div className="candidate-mini">
                                <div className="candidate-avatar-small">{app.userId?.name?.charAt(0)}</div>
                                <div>
                                    <strong>{app.userId?.name}</strong>
                                    <small style={{display:'block', color:'#666'}}>{app.userId?.cgpa} CGPA</small>
                                </div>
                            </div>
                            <button className="hire-btn-small" onClick={() => handleStatusUpdate(app._id, 'Hired', 'workflow')}>
                                Hire
                            </button>
                        </div>
                    ))}
                </div>
            </div>
          </div>
      </div>
  );
  return (
    <div className="dashboard-layout">
        <div className="sidebar">
            <div className="user-profile-summary">
                <div className="avatar" style={{background: '#0ea5e9'}}>R</div>
                <h4>Recruiter</h4>
                <p>Company Admin</p>
            </div>
            <nav>
                <button className={activeSection === 'manage-jobs' ? 'active' : ''} onClick={() => setActiveSection('manage-jobs')}>📢 Manage Jobs</button>
                <button className={activeSection === 'applicants' ? 'active' : ''} onClick={() => setActiveSection('applicants')}>👥 Applicants</button>
                <button className={activeSection === 'workflow' ? 'active' : ''} onClick={() => setActiveSection('workflow')}>📅 Interviews</button>
            </nav>
        </div>

        <div className="main-content">
            {activeSection === 'manage-jobs' && renderManageJobs()}
            {activeSection === 'applicants' && renderApplicants()}
            {activeSection === 'workflow' && renderWorkflow()}
        </div>
    </div>
  );
}

export default EmployerDashboard;