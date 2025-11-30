import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './css/Login.css';

function Login({ setUser }) {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple Login Logic (Since we don't have a database yet)
    if(email) {
        setUser({ name: 'User', role: role });
        
        if(role === 'student') navigate('/student');
        else if(role === 'employer') navigate('/employer');
        else if(role === 'admin') navigate('/admin');
    } else {
        alert("Please enter an email");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img 
          src="https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-83.jpg" 
          alt="Login" 
        />
      </div>

      <div className="login-right">
        <div className="login-card">
          <h2 style={{ textAlign: 'center' }}>Welcome Back</h2>
          <form onSubmit={handleLogin}>
            
            <div className="form-group">
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Select Role:</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="student">Student</option>
                <option value="employer">Employer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button type="submit" className="login-btn">Login</button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '15px' }}>
            Don't have an account? <Link to="/signup" style={{ color: '#4f46e5', fontWeight: 'bold' }}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;