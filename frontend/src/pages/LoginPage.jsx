import React from 'react';

function LoginPage() {
  const handleLogin = () => {
    // This redirects the user to our backend's login route,
    // which in turn redirects them to the Eko authentication page.
    window.location.href = '/api/auth/login';
  };

  return (
    <div>
      <h2>Login</h2>
      <p>Please log in to book a meeting room.</p>
      <button onClick={handleLogin}>
        Login with Eko
      </button>
    </div>
  );
}

export default LoginPage;
