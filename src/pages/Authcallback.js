import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabaseClient';
import './Login.css';

// Route: /auth/callback
//
// Supabase Edge Function redirects the user here after processing LinkedIn login.
//
// URL looks like:
// http://localhost:3000/auth/callback
//   ?session=eyJ1c2VySW...   (base64 encoded user data including role for returning users)
//   &state=k7f2m9p1
//
// New user flow:
//   role is null in session → read pendingRole from localStorage → save to DB → login()
//
// Returning user flow:
//   role already in session from DB → use it directly → login()
//   pendingRole in localStorage is ignored for returning users

const AuthCallback = () => {
  const navigate  = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState('Completing sign in...');
  const [error,  setError]  = useState('');

  // Guard against React Strict Mode running useEffect twice in development
  const hasRun = useRef(false);
  console.log('Inside auth call');
  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const handleCallback = async () => {

      // ── Step 1: Read what Supabase put in the redirect URL ─────────────
      const params     = new URLSearchParams(window.location.search);
      const session    = params.get('session');
      const state      = params.get('state');
      const errorParam = params.get('error');

      console.log('--- AuthCallback received ---')
      console.log('Session present:', !!session)
      console.log('State received:', state)
      console.log('Error param:', errorParam || 'none')

      // ── Step 2: Handle errors from Edge Function ────────────────────────
      if (errorParam) {
        const errorMessages = {
          linkedin_cancelled:    'LinkedIn sign in was cancelled. Please try again.',
          missing_code:          'Authorisation code missing. Please try again.',
          token_exchange_failed: 'Failed to connect to LinkedIn. Please try again.',
          profile_fetch_failed:  'Could not retrieve your LinkedIn profile. Please try again.',
          db_error:              'Database error. Please try again.',
          db_insert_failed:      'Could not create your account. Please try again.',
          db_update_failed:      'Could not update your account. Please try again.',
          server_error:          'An unexpected error occurred. Please try again.',
        }
        setError(errorMessages[errorParam] || 'Something went wrong. Please try again.')
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      if (!session) {
        setError('No session data received. Please try signing in again.')
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      // ── Step 3: Validate the state to prevent CSRF attacks ─────────────
      //const savedState = localStorage.getItem('linkedinstate');
      //console.log('State match:', state === savedState)
      //console.log('State details:', { received: state, saved: savedState })

     // if (state !== savedState) {
        //setError('Security check failed. Please try signing in again. State mismatch detected.')
        //setTimeout(() => navigate('/login'), 3000);
        //return;
      //}

      // ── Step 4: Decode the user payload from base64 ─────────────────────
      let userPayload;
      try {
        userPayload = JSON.parse(atob(session));
        console.log('User payload decoded:', {
          email:     userPayload.email,
          firstName: userPayload.firstName,
          isNewUser: userPayload.isNewUser,
          roleFromDB: userPayload.role    // null for new users, saved value for returning
        })
      } catch (e) {
        console.error('Failed to decode session:', e)
        setError('Invalid session data. Please try signing in again.')
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      try {
        let roleToUse

        if (userPayload.isNewUser) {
          // ── New user: save the role they selected to the DB ──────────────
          // pendingRole was saved to localStorage in Login.js before
          // the user was redirected to LinkedIn
          setStatus('Setting up your account...')

          const pendingRole = localStorage.getItem('pendingRole');
          console.log('New user — pendingRole from localStorage:', pendingRole)

          if (!pendingRole) {
            setError('Role not found. Please go back and select a role.')
            setTimeout(() => navigate('/login'), 3000);
            return;
          }

          // Save the role to the DB for this and all future logins
          console.log('Saving role to DB for new user:', pendingRole)

          const { error: roleError } = await supabase
            .from('users')
            .update({ role: pendingRole })
            .eq('linkedin_id', userPayload.linkedinId)

          if (roleError) {
            console.error('Role save error:', roleError)
            throw new Error('Failed to save your role. Please try again.')
          }

          roleToUse = pendingRole
          console.log('Role saved to DB successfully:', roleToUse)

        } else {
          // ── Returning user: use the role already stored in the DB ─────────
          // Edge Function retrieved it and included it in the session payload
          // No DB call needed here — it is already in userPayload.role
          roleToUse = userPayload.role
          console.log('Returning user — using role from DB:', roleToUse)

          // Clean up pendingRole if it exists from a previous aborted login
          // It is not needed for returning users
          localStorage.removeItem('pendingRole');
        }

        // ── Step 5: Build the full user object and call login() ─────────────
        // This is the shape AuthContext, Dashboard, PostInvention
        // and BrowseInventions all read from
        const userData = {
          id:            userPayload.linkedinId,
          dbId:          userPayload.id,
          firstName:     userPayload.firstName,
          lastName:      userPayload.lastName,
          email:         userPayload.email,
          picture:       userPayload.picture    || '',
          headline:      userPayload.headline   || '',
          profileUrl:    userPayload.profileUrl || '',
          role:          roleToUse,              // from DB for returning, from localStorage for new
          linkedinToken: userPayload.token,
          isNewUser:     userPayload.isNewUser
        };

        console.log('Calling login() with role:', roleToUse)

        // Saves to React state + localStorage so session persists on refresh
        login(userData);

        // ── Step 6: Clean up temporary values ───────────────────────────────
        localStorage.removeItem('linkedinOAuthState');
        // pendingRole already removed above for returning users
        // remove it here for new users too after successful save
        localStorage.removeItem('pendingRole');

        // Clear the encoded session data from the URL
        window.history.replaceState({}, document.title, '/auth/callback');

        setStatus('Success! Redirecting you now...');

        // ── Step 7: Redirect based on role ──────────────────────────────────
        console.log('Redirecting — role:', roleToUse)

        if (roleToUse === 'inventor') {
          navigate('/dashboard');
        } else {
          navigate('/browse');
        }

      } catch (err) {
        console.error('AuthCallback error:', err);
        setError(err.message || 'Something went wrong. Please try again.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [login, navigate]);

  return React.createElement('div', { className: 'login-page' },
    React.createElement('div', { className: 'login-container' },
      React.createElement('div', { className: 'login-header fade-in' },
        error
          ? React.createElement('div', null,
              React.createElement('div', { className: 'no-results-icon' }, '⚠️'),
              React.createElement('h2', null, 'Sign in failed'),
              React.createElement('p', { className: 'login-error' }, error),
              React.createElement('p', null, 'Redirecting you back to the login page...')
            )
          : React.createElement('div', null,
              React.createElement('div', { className: 'no-results-icon' }, '🔄'),
              React.createElement('h2', null, status),
              React.createElement('p', null, 'Please wait, this only takes a moment')
            )
      )
    )
  );
};

export default AuthCallback;