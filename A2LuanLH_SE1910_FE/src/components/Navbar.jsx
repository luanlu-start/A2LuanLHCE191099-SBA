import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Newspaper, LogOut, LogIn, User, ShieldCheck, Briefcase } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAdmin, isStaff } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <Newspaper size={26} />
          <span>FUNews Management</span>
        </Link>

        <ul className="nav-links">
          <li>
            <Link to="/" className="nav-link">Home (News)</Link>
          </li>

          {isAdmin && (
            <li>
              <Link to="/admin/accounts" className="nav-link">Accounts</Link>
            </li>
          )}

          {isStaff && (
            <>
              <li>
                <Link to="/staff/categories" className="nav-link">Categories</Link>
              </li>
              <li>
                <Link to="/staff/news" className="nav-link">Articles</Link>
              </li>
              <li>
                <Link to="/staff/history" className="nav-link">My Articles</Link>
              </li>
              <li>
                <Link to="/staff/profile" className="nav-link">Profile</Link>
              </li>
            </>
          )}
        </ul>

        <div className="nav-user">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className={`badge ${isAdmin ? 'badge-danger' : 'badge-info'}`}>
                {isAdmin ? <ShieldCheck size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} /> : <Briefcase size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />}
                {user.roleName || (isAdmin ? 'Admin' : 'Staff')}
              </span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user.accountName}</span>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Logout">
                <LogOut size={14} /> Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              <LogIn size={14} /> Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

