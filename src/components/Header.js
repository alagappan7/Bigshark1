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

  return React.createElement(
    'header',
    { className: 'header' },
    React.createElement(
      'div',
      { className: 'container' },
      React.createElement(
        'div',
        { className: 'header-content' },

        // Logo
        React.createElement(
          Link,
          { to: '/', className: 'logo' },
          React.createElement('span', { className: 'logo-icon' }, '⚡'),
          React.createElement('span', { className: 'logo-text' }, 'PatentConnect')
        ),

        // Navigation
        React.createElement(
          'nav',
          { className: 'nav' },

          isAuthenticated
            ? React.createElement(
                React.Fragment,
                null,

                // Dashboard link
                React.createElement(
                  Link,
                  { to: '/dashboard', className: 'nav-link' },
                  'Dashboard'
                ),

                // Inventor-only link
                user.role === 'inventor'
                  ? React.createElement(
                      Link,
                      { to: '/post-invention', className: 'nav-link' },
                      'Post Invention'
                    )
                  : null,

                // Investor-only link
                user.role === 'investor'
                  ? React.createElement(
                      Link,
                      { to: '/browse-inventions', className: 'nav-link' },
                      'Browse Inventions'
                    )
                  : null,

                // User menu
                React.createElement(
                  'div',
                  { className: 'user-menu' },
                  React.createElement(
                    'div',
                    { className: 'user-info' },

                    // Avatar
                    React.createElement(
                      'div',
                      { className: 'user-avatar' },
                      user.profilePicture
                        ? React.createElement('img', {
                            src: user.profilePicture,
                            alt: user.firstName
                          })
                        : React.createElement(
                            'span',
                            null,
                            `${user.firstName[0]}${user.lastName[0]}`
                          )
                    ),

                    // Name
                    React.createElement(
                      'span',
                      { className: 'user-name' },
                      user.firstName
                    )
                  ),

                  // Logout button
                  React.createElement(
                    'button',
                    { onClick: handleLogout, className: 'btn-logout' },
                    'Logout'
                  )
                )
              )
            : React.createElement(
                Link,
                { to: '/login', className: 'btn-primary' },
                'Sign In'
              )
        )
      )
    )
  );
};

export default Header;