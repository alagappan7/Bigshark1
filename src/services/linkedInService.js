// LinkedIn OAuth Configuration
// In production, these should be environment variables
const LINKEDIN_CONFIG = {
  clientId: 'YOUR_LINKEDIN_CLIENT_ID', // Replace with your LinkedIn app client ID
  redirectUri: 'http://localhost:3000/auth/linkedin/callback',
  scope: 'r_liteprofile r_emailaddress',
  state: Math.random().toString(36).substring(7)
};

export const linkedInService = {
  // Initiate LinkedIn OAuth flow
  initiateLogin: (role) => {
    // Store the role selection for after redirect
    localStorage.setItem('pendingRole', role);
    
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
      `response_type=code&` +
      `client_id=${LINKEDIN_CONFIG.clientId}&` +
      `redirect_uri=${encodeURIComponent(LINKEDIN_CONFIG.redirectUri)}&` +
      `state=${LINKEDIN_CONFIG.state}&` +
      `scope=${encodeURIComponent(LINKEDIN_CONFIG.scope)}`;
    
    window.location.href = authUrl;
  },

  // Handle OAuth callback
  handleCallback: async (code, state) => {
    // Verify state to prevent CSRF
    if (state !== LINKEDIN_CONFIG.state) {
      throw new Error('Invalid state parameter');
    }

    try {
      // Exchange code for access token
      // In production, this should be done on your backend server
      const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: LINKEDIN_CONFIG.redirectUri,
          client_id: LINKEDIN_CONFIG.clientId,
          client_secret: 'YOUR_CLIENT_SECRET' // Should be on backend!
        })
      });

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      // Store token
      localStorage.setItem('linkedinToken', accessToken);

      // Fetch user profile
      const profile = await this.getUserProfile(accessToken);
      
      // Get the role that was selected before OAuth redirect
      const role = localStorage.getItem('pendingRole') || 'inventor';
      localStorage.removeItem('pendingRole');

      return {
        ...profile,
        role
      };
    } catch (error) {
      console.error('LinkedIn authentication error:', error);
      throw error;
    }
  },

  // Get user profile from LinkedIn
  getUserProfile: async (accessToken) => {
    try {
      const profileResponse = await fetch('https://api.linkedin.com/v2/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'cache-control': 'no-cache',
          'X-Restli-Protocol-Version': '2.0.0'
        }
      });

      const profile = await profileResponse.json();

      // Get email
      const emailResponse = await fetch('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'cache-control': 'no-cache',
          'X-Restli-Protocol-Version': '2.0.0'
        }
      });

      const emailData = await emailResponse.json();
      const email = emailData.elements?.[0]?.['handle~']?.emailAddress;

      return {
        id: profile.id,
        firstName: profile.localizedFirstName,
        lastName: profile.localizedLastName,
        email: email,
        profileUrl: `https://www.linkedin.com/in/${profile.id}`,
        headline: profile.headline || '',
        profilePicture: profile.profilePicture?.displayImage || null
      };
    } catch (error) {
      console.error('Error fetching LinkedIn profile:', error);
      throw error;
    }
  },

  // Mock authentication for development/testing
  mockLogin: (role) => {
    return {
      id: `mock_${Date.now()}`,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      profileUrl: 'https://www.linkedin.com/in/johndoe',
      headline: role === 'inventor' ? 'Innovator & Patent Holder' : 'Angel Investor & Venture Capitalist',
      profilePicture: null,
      role: role
    };
  }
};
