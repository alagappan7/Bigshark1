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
      const userData = linkedInService.initiateLogin(selectedRole);
      login(userData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return React.createElement(
    "div",
    { className: "login-page" },

    // Background
    React.createElement(
      "div",
      { className: "login-background" },
      React.createElement("div", { className: "login-pattern" })
    ),

    // Container
    React.createElement(
      "div",
      { className: "login-container" },

      React.createElement(
        "div",
        { className: "login-card fade-in" },

        // Header
        React.createElement(
          "div",
          { className: "login-header" },
          React.createElement("h1", null, "Welcome to PatentConnect"),
          React.createElement("p", null, "Choose your role to get started")
        ),

        // Role Selection
        React.createElement(
          "div",
          { className: "role-selection" },

          // Inventor
          React.createElement(
            "div",
            {
              className: `role-card ${selectedRole === 'inventor' ? 'selected' : ''}`,
              onClick: () => handleRoleSelect('inventor')
            },
            React.createElement("div", { className: "role-icon" }, "💡"),
            React.createElement("h3", null, "I'm an Inventor"),
            React.createElement("p", null, "Showcase my patented innovations to investors"),
            selectedRole === 'inventor' &&
              React.createElement("div", { className: "selected-badge" }, "Selected")
          ),

          // Investor
          React.createElement(
            "div",
            {
              className: `role-card ${selectedRole === 'investor' ? 'selected' : ''}`,
              onClick: () => handleRoleSelect('investor')
            },
            React.createElement("div", { className: "role-icon" }, "💰"),
            React.createElement("h3", null, "I'm an Investor"),
            React.createElement("p", null, "Discover breakthrough patent-backed opportunities"),
            selectedRole === 'investor' &&
              React.createElement("div", { className: "selected-badge" }, "Selected")
          )
        ),

        // LinkedIn Button
        React.createElement(
          "button",
          {
            className: `btn-linkedin ${!selectedRole ? 'disabled' : ''}`,
            onClick: handleLinkedInLogin,
            disabled: !selectedRole || loading
          },
          loading
            ? React.createElement("span", null, "Connecting...")
            : React.createElement(
                React.Fragment,
                null,
                React.createElement(
                  "svg",
                  { width: "20", height: "20", viewBox: "0 0 24 24", fill: "currentColor" },
                  React.createElement("path", {
                    d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.900 1.637-1.850 3.370-1.850 3.601 0 4.267 2.370 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.920-2.063 2.063-2.063 1.140 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.200 24 24 23.227 24 22.271V1.729C24 .774 23.200 0 22.222 0h.003z"
                  })
                ),
                "Continue with LinkedIn"
              )
        ),

        // Note
        React.createElement(
          "div",
          { className: "login-note" },
          React.createElement(
            "p",
            null,
            React.createElement("strong", null, "Note:"),
            " For development, this uses mock authentication. In production, you'll need to configure your LinkedIn OAuth credentials."
          )
        ),

        // Footer
        React.createElement(
          "div",
          { className: "login-footer" },
          React.createElement(
            "p",
            null,
            "By signing in, you agree to our Terms of Service and Privacy Policy"
          )
        )
      )
    )
  );
};

export default Login;