import { useState, useEffect } from 'react';
import './css/EmployerDashboard.css';

function EmployerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({ title: '', company: '' });

  // 1. Fetch Jobs on Load
  useEffect(() => {
    fetch('http://localhost:5001/api/auth/signup')
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error("Error fetching jobs:", err));
  }, []);

  // 2. Post New Job
  const handlePost = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.company) return;

    const response = await fetch('http://localhost:5000/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      const newJob = await response.json();
      setJobs([newJob, ...jobs]); // Add new job to list instantly
      setFormData({ title: '', company: '' });
    }
  };

  return (
    <div className="employer-container">
      <h2>Employer Dashboard</h2>
      
      <div className="post-job-card">
        <h3>Post a New Job</h3>
        <form onSubmit={handlePost}>
          <input 
            placeholder="Job Title" 
            value={formData.title} 
            onChange={(e) => setFormData({...formData, title: e.target.value})} 
          />
          <input 
            placeholder="Company Name" 
            value={formData.company} 
            onChange={(e) => setFormData({...formData, company: e.target.value})} 
          />
          <button type="submit">Post Job</button>
        </form>
      </div>

      <div className="job-list">
        {jobs.map((j) => (
          <div key={j._id} className="employer-job-card">
            <h4>{j.title}</h4>
            <p>{j.company}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmployerDashboard;