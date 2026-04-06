import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PostInvention from './pages/PostInvention';
import BrowseInventions from './pages/BrowseInventions';
import LinkedInCallback from './pages/LinkedInCallback';
import './index.css';
import AuthCallback from './pages/Authcallback';

// Protected Route Component
const ProtectedRoute = ({ children, inventorOnly, investorOnly }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return React.createElement(
      'div',
      {
        style: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          fontSize: '1.5rem',
          color: 'var(--color-text-light)'
        }
      },
      'Hey There! Wait for a bit there while you are being authenticated...'
    );
  }

  if (!isAuthenticated) {
    return React.createElement(Navigate, { to: '/login', replace: true });
  }

  if (inventorOnly && user.role !== 'inventor') {
    return React.createElement(Navigate, { to: '/dashboard', replace: true });
  }

  if (investorOnly && user.role !== 'investor') {
    return React.createElement(Navigate, { to: '/dashboard', replace: true });
  }

  return children;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return React.createElement(
      'div',
      {
        style: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          fontSize: '1.5rem',
          color: 'var(--color-text-light)'
        }
      },
      'Loading...'
    );
  }

  if (isAuthenticated) {
    return React.createElement(Navigate, { to: '/dashboard', replace: true });
  }

  return children;
};

function AppRoutes() {
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(Header),
    React.createElement(
      Routes,
      null,
      React.createElement(Route, { path: '/', element: React.createElement(Home) }),
      React.createElement(Route, {
        path: '/login',
        element: React.createElement(PublicRoute, null, React.createElement(Login))
      }),
      React.createElement(Route, {
        path: '/auth/linkedin/callback',
        element: React.createElement(LinkedInCallback)
      }),
      React.createElement(Route, {
        path: '/dashboard',
        element: React.createElement(ProtectedRoute, null, React.createElement(Dashboard))
      }),
      React.createElement(Route, {
        path: '/auth/callback',
        element: React.createElement(ProtectedRoute, null, React.createElement(AuthCallback))
      }),
      React.createElement(Route, {
        path: '/post-invention',
        element: React.createElement(
          ProtectedRoute,
          { inventorOnly: true },
          React.createElement(PostInvention)
        )
      }),
      React.createElement(Route, {
        path: '/browse-inventions',
        element: React.createElement(
          ProtectedRoute,
          { investorOnly: true },
          React.createElement(BrowseInventions)
        )
      }),
      React.createElement(Route, {
        path: '*',
        element: React.createElement(Navigate, { to: '/', replace: true })
      })
    )
  );
}

function App() {
  return React.createElement(
    Router,
    null,
    React.createElement(
      AuthProvider,
      null,
      React.createElement(AppRoutes)
    )
  );
}

export default App;