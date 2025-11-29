import { useState } from 'react';
import './css/EmployerDashboard.css';
function EmployerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({ title: '', company: '' });

  const handlePost = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.company) return; // Basic validation
    setJobs([...jobs, formData]);
    setFormData({ title: '', company: '' });
  };

  return (
    <div className="employer-container">
      <h2>Employer Dashboard</h2>

      {/* 1. APPLY "card" CLASS TO THE FORM AREA */}
      <div className="post-job-card">
        <h3>Post a New Job</h3>
        <form onSubmit={handlePost}>
          <input 
            placeholder="Job Title (e.g. React Developer)" 
            value={formData.title} 
            onChange={(e) => setFormData({...formData, title: e.target.value})} 
          />
          <input 
            placeholder="Company Name" 
            value={formData.company} 
            onChange={(e) => setFormData({...formData, company: e.target.value})} 
          />
          <button type="submit" style={{ width: '100%' }}>Post Job</button>
        </form>
      </div>

      <h3>Active Listings</h3>

      {/* 2. USE "job-grid" INSTEAD OF <ul> */}
      <div className="job-list">
        {jobs.length === 0 ? <p>No jobs posted yet.</p> : null}

        {jobs.map((j, i) => (
          /* 3. USE "job-card" FOR EACH ITEM */
          <div key={i} className="employer-job-card">
            <h4>{j.title}</h4>
            <p style={{ color: '#555' }}>{j.company}</p>
            <div style={{ marginTop: '10px' }}>
                <span style={{ fontSize: '0.8rem', background: '#e0e7ff', padding: '4px 8px', borderRadius: '4px', color: '#4f46e5' }}>Active</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmployerDashboard;