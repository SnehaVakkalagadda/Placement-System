import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './css/Login.css'; 

function Signup({ setUser }) {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'student'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // 1. Validations
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill all fields");
      return;
    }
    if (formData.phone.length !== 10) {
      alert("Phone must be 10 digits");
      return;
    }

    try {
      // 2. Send Data to Backend
      const response = await fetch('http://localhost:5001/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        // 3. Success! Log the user in
        setUser(data.user);
        alert("Registration Successful!");
        
        if (data.user.role === 'student') navigate('/student');
        else if (data.user.role === 'employer') navigate('/employer');
        else navigate('/admin');
      } else {
        // 4. Error from Backend (e.g., User already exists)
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server connection failed. Is the backend running?");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
         <img src="https://img.freepik.com/free-vector/job-interview-conversation_74855-7566.jpg" alt="Signup" />
      </div>
      <div className="login-right">
        <div className="login-card">
          <h2 style={{ textAlign: 'center' }}>Create Account</h2>
          <form onSubmit={handleSignup}>
            <div className="form-group">
              <input name="name" placeholder="Full Name" onChange={handleChange} />
            </div>
            <div className="form-group">
              <input name="email" placeholder="Email Address" onChange={handleChange} />
            </div>
            <div className="form-group">
              <input name="phone" placeholder="Phone (10 digits)" maxLength="10" onChange={handleChange} />
            </div>
            <div className="form-group">
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="student">Student</option>
                <option value="employer">Employer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit" className="login-btn">Sign Up</button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '15px' }}>
            Already have an account? <Link to="/" style={{ color: '#4f46e5', fontWeight: 'bold' }}>Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;