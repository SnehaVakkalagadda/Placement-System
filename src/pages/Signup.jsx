import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './css/Login.css'; 

function Signup({ setUser }) {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // 1. Basic Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (formData.phone.length !== 10) {
        alert("Phone must be exactly 10 digits");
        return;
    }

    try {
      // 2. Call the Backend
      const response = await fetch('https://placement-system-0pah.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            role: formData.role
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setUser(data.user);
        alert("Registration Successful!");
        
        // --- REDIRECTION LOGIC FOR ALL ROLES ---
        if (data.user.role === 'student') navigate('/student');
        else if (data.user.role === 'employer') navigate('/employer');
        else if (data.user.role === 'admin') navigate('/admin');
        else if (data.user.role === 'placement_officer') navigate('/placement-officer'); // <--- ADDED THIS
      
      } else {
        // --- THE FIX FOR "UNDEFINED" ---
        // We check for data.message OR data.error
        alert(data.message || data.error || "Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server connection failed");
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
              <input name="email" type="email" placeholder="Email Address" onChange={handleChange} />
            </div>
            
            <div className="form-group">
              <input name="phone" placeholder="Phone (10 digits)" maxLength="10" onChange={handleChange} />
            </div>
            
            <div className="form-group">
              <input name="password" type="password" placeholder="Password (Min 8 chars, 1 special)" onChange={handleChange} />
            </div>

            <div className="form-group">
              <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} />
            </div>

            <div className="form-group">
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="student">Student</option>
                <option value="employer">Employer</option>
                <option value="admin">Admin</option>
                <option value="placement_officer">Placement Officer</option>
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