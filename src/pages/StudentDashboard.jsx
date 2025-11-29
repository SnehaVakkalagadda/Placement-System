import './css/StudentDashboard.css'; // Make sure this path is correct for your folder structure

function StudentDashboard() {
  const jobs = [
    { id: 1, title: 'React Developer', company: 'TechCorp' },
    { id: 2, title: 'Data Scientist', company: 'DataAI' }
  ];

  return (
    <div className="student-container">
      <h2>Student Dashboard</h2>
      
      {/* The Grid Parent: This wraps ALL the cards */}
      <div className="student-grid">
        
        {jobs.map(job => (
          /* The Card Child: This is the individual item */
          /* Note: You need the 'student-job-card' class in your CSS for the white box look */
          <div key={job.id} className="student-job-card"> 
            <h3>{job.title}</h3>
            <p>{job.company}</p>
            <button onClick={() => alert('Applied!')} className="apply-btn">Apply Now</button>
          </div>
        ))}
        
      </div>
    </div>
  );
}

export default StudentDashboard;