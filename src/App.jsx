import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import StudentDashboard from './pages/StudentDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PlacementOfficerDashboard from './pages/PlacementOfficerDashboard';
import './App.css'; // You can keep the default Vite CSS or clear it

function App() {
  const [user, setUser] = useState(null); 

  return (
    <Router>
      {/* Pass user and logout function to Navbar if needed */}
      <Navbar user={user} setUser={setUser} />
      
      <div style={{ width: '100%' }}>
        <Routes>
          <Route path="/" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route 
            path="/student" 
            element={user?.role === 'student' ? <StudentDashboard user={user} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/employer" 
            element={user?.role === 'employer' ? <EmployerDashboard /> : <Navigate to="/" />} 
          />
          <Route 
            path="/admin" 
            element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} 
          />
          <Route 
            path="/placement-officer" 
            element={user?.role === 'placement_officer' ? <PlacementOfficerDashboard /> : <Navigate to="/" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;