import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './css/Login.css'; // We can reuse the same CSS for consistent design

function Signup({ setUser }) {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'student'
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // Clear error on typing
  };

  const validate = () => {
    let newErrors = {};
    let isValid = true;

    // Name Constraint
    if (!formData.name.trim()) {
      newErrors.name = "Full Name is required";
      isValid = false;
    }

    // Email Constraint (Regex)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailPattern.test(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    // Phone Constraint (Exactly 10 digits)
    const phonePattern = /^\d{10}$/;
    if (!formData.phone || !phonePattern.test(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (validate()) {
      // Create user and log them in immediately
      setUser({ name: formData.name, role: formData.role });
      
      // Redirect based on role
      if (formData.role === 'student') navigate('/student');
      else if (formData.role === 'employer') navigate('/employer');
      else if (formData.role === 'admin') navigate('/admin');
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img 
          src="https://img.freepik.com/free-vector/job-interview-conversation_74855-7566.jpg" 
          alt="Signup" 
        />
      </div>

      <div className="login-right">
        <div className="login-card">
          <h2 style={{ textAlign: 'center' }}>Create Account</h2>
          <form onSubmit={handleSignup}>
            
            <div className="form-group">
              <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <input type="text" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <input type="text" name="phone" placeholder="Phone (10 digits)" maxLength="10" value={formData.phone} onChange={handleChange} />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label>I am a:</label>
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