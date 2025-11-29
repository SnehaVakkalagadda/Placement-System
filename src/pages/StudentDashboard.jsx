import { useState, useEffect } from 'react';
import './css/StudentDashboard.css';

function StudentDashboard() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5001/api/auth/signup')
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="student-container">
      <h2>Student Dashboard</h2>
      <div className="student-grid">
        {jobs.map(job => (
          <div key={job._id} className="student-job-card">
            <h3>{job.title}</h3>
            <p>{job.company}</p>
            <button className="apply-btn" onClick={() => alert("Applied!")}>Apply Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentDashboard;