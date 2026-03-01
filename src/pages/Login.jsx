import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { linkedInService } from '../services/linkedInService';
import './Login.css';

const Login = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleLinkedInLogin = async () => {
    if (!selectedRole) {
      alert('Please select your role first');
      return;
    }

    setLoading(true);
    try {
      // For development, use mock login
      // In production, uncomment the next line:
      // linkedInService.initiateLogin(selectedRole);
      
      // Mock login for development
      const userData = linkedInService.mockLogin(selectedRole);
      login(userData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="login-pattern"></div>
      </div>
      
      <div className="login-container">
        <div className="login-card fade-in">
          <div className="login-header">
            <h1>Welcome to PatentConnect</h1>
            <p>Choose your role to get started</p>
          </div>

          <div className="role-selection">
            <div 
              className={`role-card ${selectedRole === 'inventor' ? 'selected' : ''}`}
              onClick={() => handleRoleSelect('inventor')}
            >
              <div className="role-icon">💡</div>
              <h3>I'm an Inventor</h3>
              <p>Showcase my patented innovations to investors</p>
              {selectedRole === 'inventor' && (
                <div className="selected-badge">Selected</div>
              )}
            </div>

            <div 
              className={`role-card ${selectedRole === 'investor' ? 'selected' : ''}`}
              onClick={() => handleRoleSelect('investor')}
            >
              <div className="role-icon">💰</div>
              <h3>I'm an Investor</h3>
              <p>Discover breakthrough patent-backed opportunities</p>
              {selectedRole === 'investor' && (
                <div className="selected-badge">Selected</div>
              )}
            </div>
          </div>

          <button 
            className={`btn-linkedin ${!selectedRole ? 'disabled' : ''}`}
            onClick={handleLinkedInLogin}
            disabled={!selectedRole || loading}
          >
            {loading ? (
              <span>Connecting...</span>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Continue with LinkedIn
              </>
            )}
          </button>

          <div className="login-note">
            <p>
              <strong>Note:</strong> For development, this uses mock authentication. 
              In production, you'll need to configure your LinkedIn OAuth credentials.
            </p>
          </div>

          <div className="login-footer">
            <p>
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
