import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <h1>Placement Portal</h1>
      <div>
        {user ? (
          <>
            <span style={{ marginRight: '15px' }}>Hello, {user.role}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          <span>Welcome, Guest</span>
        )}
      </div>
    </nav>
  );
}

export default Navbar;