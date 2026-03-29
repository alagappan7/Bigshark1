import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

// This component lives at the redirect URI registered in LinkedIn Developer Portal
// Route: /auth/linkedin/callback
// When LinkedIn redirects back to your app, this component handles everything

const LinkedInCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState('Completing sign in...');
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      // ── Step 1: Read what LinkedIn put in the URL ──────────────────────
      // After the user approves on LinkedIn, the URL will look like:
      // http://localhost:3000/auth/linkedin/callback?code=AQT8s2kP...&state=k7f2m9p1
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const returnedState = params.get('state');
      const linkedInError = params.get('error');
      console.log('LinkedIn callback URL params:', { code, returnedState, linkedInError });

      // If the user cancelled or LinkedIn returned an error
      if (linkedInError) {
        setError('LinkedIn sign in was cancelled or failed. Please try again after a few minutes.');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      // ── Step 2: Validate the state to prevent CSRF attacks ─────────────
      // The state we saved in sessionStorage before redirecting to LinkedIn
      // must match what LinkedIn sent back — if not, something suspicious happened
      

      // ── Step 3: Get the role the user selected before LinkedIn login ────
      // This was saved to sessionStorage in Login.js before the LinkedIn redirect
      

      try {
        // ── Step 4: Send the code to your Supabase Edge Function ───────────
        // The Edge Function will:
        //   - Exchange the code for a LinkedIn access token
        //   - Fetch the user profile from LinkedIn /v2/userinfo
        //   - Save/update the user in your Supabase users table
        //   - Return the profile data back here
        setStatus('Verifying your LinkedIn account...');

        const edgeFunctionResponse = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/hyper-handler`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({ code })
          }
        );

        if (!edgeFunctionResponse.ok) {
          const errData = await edgeFunctionResponse.json();
          console.error('Edge function error:', errData);
          throw new Error(errData.error || 'Failed to authenticate with LinkedIn');
        }

        const linkedInProfile = await edgeFunctionResponse.json();

        // ── Step 5: Save the role to the Supabase users table ─────────────
        // The Edge Function saves everything except the role
        // because the role was selected on the frontend before the LinkedIn redirect
        // We now patch the user's row to attach their chosen role
        setStatus('Setting up your account...');

        const roleUpdateResponse = await fetch(
          `${process.env.REACT_APP_SUPABASE_URL}/rest/v1/users?linkedin_id=eq.${linkedInProfile.sub}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'apikey': process.env.REACT_APP_SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`,
              'Prefer': 'return=representation'
            },
            body: JSON.stringify({ role: pendingRole })
          }
        );

        if (!roleUpdateResponse.ok) {
          throw new Error('Failed to save your role. Please try again.');
        }

        // ── Step 6: Build the user object and call login() ─────────────────
        // This is the shape that AuthContext, Dashboard, PostInvention
        // and BrowseInventions all expect
        const userData = {
          id:            linkedInProfile.sub,         // LinkedIn unique ID
          dbId:          linkedInProfile.db_id,       // Supabase row UUID
          firstName:     linkedInProfile.given_name,
          lastName:      linkedInProfile.family_name,
          email:         linkedInProfile.email,
          profileUrl:    linkedInProfile.profile_url || '',
          headline:      linkedInProfile.headline    || '',
          picture:       linkedInProfile.picture     || '',
          role:          pendingRole,                 // 'inventor' or 'investor'
          linkedinToken: linkedInProfile.token
        };

        // login() saves userData to both React state and localStorage
        // so the session persists across page refreshes
        login(userData);

        // ── Step 7: Clean up sessionStorage ───────────────────────────────
        // Remove the temporary values we stored before the LinkedIn redirect
        sessionStorage.removeItem('pendingRole');
        sessionStorage.removeItem('linkedinOAuthState');

        // Also clean the code and state out of the browser URL
        // so it looks clean and the code cannot be reused
        window.history.replaceState({}, document.title, '/auth/linkedin/callback');

        setStatus('Success! Redirecting you now...');

        // ── Step 8: Redirect based on role ────────────────────────────────
        // Inventors go to their dashboard to manage inventions
        // Investors go to browse to discover inventions
        if (pendingRole === 'inventor') {
          navigate('/dashboard');
        } else {
          navigate('/browse');
        }

      } catch (err) {
        console.error('LinkedIn callback error:', err);
        setError(err.message || 'Something went wrong during sign in. Please try again.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [login, navigate]);

  // ── UI ─────────────────────────────────────────────────────────────────────
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

export default LinkedInCallback;