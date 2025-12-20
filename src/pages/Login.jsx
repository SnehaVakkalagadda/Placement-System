import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './css/Login.css';

function Login({ setUser }) {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // <--- New State
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if(!email || !password) return alert("Please enter email and password");

    try {
      const response = await fetch('https://placement-system-0pah.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
                  email: email.trim(),
                  password: password.trim(),
                  role
        })

      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        alert("Login Successful!");
        
        setUser(data.user);
        if (data.user.role === 'student') navigate('/student');
        else if (data.user.role === 'employer') navigate('/employer');
        else if (data.user.role === 'admin') navigate('/admin');
        else if (data.user.role === 'placement_officer') navigate('/placement-officer');
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Server connection failed");
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

            {/* NEW PASSWORD FIELD */}
            <div className="form-group">
              <input 
                type="password" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Select Role:</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="student">Student</option>
                <option value="employer">Employer</option>
                <option value="admin">Admin</option>
                <option value="placement_officer">Placement Officer</option>
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