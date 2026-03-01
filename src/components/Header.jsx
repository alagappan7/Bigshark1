import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">PatentConnect</span>
          </Link>

          <nav className="nav">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                {user.role === 'inventor' && (
                  <Link to="/post-invention" className="nav-link">Post Invention</Link>
                )}
                {user.role === 'investor' && (
                  <Link to="/browse-inventions" className="nav-link">Browse Inventions</Link>
                )}
                <div className="user-menu">
                  <div className="user-info">
                    <div className="user-avatar">
                      {user.profilePicture ? (
                        <img src={user.profilePicture} alt={user.firstName} />
                      ) : (
                        <span>{user.firstName[0]}{user.lastName[0]}</span>
                      )}
                    </div>
                    <span className="user-name">{user.firstName}</span>
                  </div>
                  <button onClick={handleLogout} className="btn-logout">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link to="/login" className="btn-primary">Sign In</Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
