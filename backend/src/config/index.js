// Configuration for the application, including third-party service credentials.

module.exports = {
  eko: {
    clientId: '8d72c401-2132-4920-a0b3-0b65bf3619fd',
    clientSecret: process.env.EKO_CLIENT_SECRET || 'YOUR_EKO_CLIENT_SECRET_PLACEHOLDER', // It's best practice to use environment variables for secrets.

    // Assuming standard OAuth2 endpoint naming based on the provided URLs
    authorizationUrl: 'https://cpall-h1.ekoapp.com/oauth/authorize',
    tokenUrl: 'https://cpall-h1.ekoapp.com/oauth/token',

    // The callback URL that Eko will redirect to after authentication.
    // This must be registered with the Eko application.
    redirectUri: 'http://localhost:3000/api/auth/callback',

    // The scopes determine what information we can access.
    scope: 'openid profile email'
  },
  session: {
    secret: process.env.SESSION_SECRET || 'a_secure_random_string_for_session_encryption'
  }
};
