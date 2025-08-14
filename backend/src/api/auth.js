const express = require('express');
const crypto = require('crypto');
const axios = require('axios');
const { decode } = require('jwt-decode');
const config = require('../config');
const { allUsers } = require('./mockData');
const crypto = require('crypto');

const router = express.Router();

// Route 1: Redirect user to Eko for authentication
// GET /api/auth/login
router.get('/login', (req, res) => {
  // 1. Create a unique session token (CSRF token)
  const state = crypto.randomBytes(16).toString('hex');
  req.session.oauth_state = state;

  // 2. Construct the Eko authorization URL
  const authorizationUrl = new URL(config.eko.authorizationUrl);
  authorizationUrl.searchParams.set('response_type', 'code');
  authorizationUrl.searchParams.set('client_id', config.eko.clientId);
  authorizationUrl.searchParams.set('redirect_uri', config.eko.redirectUri);
  authorizationUrl.searchParams.set('scope', config.eko.scope);
  authorizationUrl.searchParams.set('state', state);

  // 3. Redirect the user
  res.redirect(authorizationUrl.toString());
});

// Route 2: The callback URL Eko redirects to
// GET /api/auth/callback
router.get('/callback', async (req, res) => {
  const { code, state } = req.query;
  const storedState = req.session.oauth_state;

  // 1. Verify the state to prevent CSRF attacks
  if (!state || state !== storedState) {
    return res.status(400).send('State mismatch. Possible CSRF attack.');
  }
  // Clear the state from session
  delete req.session.oauth_state;

  try {
    // 2. Exchange authorization code for tokens
    const tokenResponse = await axios.post(config.eko.tokenUrl, new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: config.eko.redirectUri,
      client_id: config.eko.clientId,
      client_secret: config.eko.clientSecret,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token, id_token } = tokenResponse.data;

    // 3. Decode the ID token to get user info
    const decodedIdToken = decode(id_token);

    // 4. Find user in our database by their Eko ID. If they don't exist, create them.
    const ekoId = decodedIdToken.sub;
    let userProfile = allUsers.find(u => u.ekoId === ekoId);

    if (!userProfile) {
      // User doesn't exist, create a new one
      console.log(`Creating new user for Eko ID: ${ekoId}`);
      userProfile = {
        id: `user-${crypto.randomBytes(4).toString('hex')}`,
        ekoId: ekoId,
        name: decodedIdToken.name,
        email: decodedIdToken.email,
        role: 'employee', // Assign a default role for new users
      };
      allUsers.push(userProfile);
    } else {
      console.log(`Found existing user: ${userProfile.name}`);
    }

    // 5. Save the final user profile into the session
    req.session.user = userProfile;
    // Also save the access token if we need to make API calls to Eko on behalf of the user
    req.session.accessToken = access_token;

    // 6. Redirect the user to the frontend application
    // This could be a dashboard or their bookings page.
    res.redirect('/bookings'); // Assuming frontend router handles this path

  } catch (error) {
    console.error('Error during token exchange:', error.response ? error.response.data : error.message);
    res.status(500).send('An error occurred during authentication.');
  }
});

module.exports = router;
