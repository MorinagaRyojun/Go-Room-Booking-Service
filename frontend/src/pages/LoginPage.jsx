import React from 'react';
import { Button, Typography, Paper, Box } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';

function LoginPage() {
  const handleLogin = () => {
    // This redirects the user to our backend's login route,
    // which in turn redirects them to the Eko authentication page.
    window.location.href = '/api/auth/login';
  };

  return (
    <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Please log in to book a meeting room.
      </Typography>
      <Button
        variant="contained"
        size="large"
        startIcon={<LoginIcon />}
        onClick={handleLogin}
      >
        Login with Eko
      </Button>
    </Paper>
  );
}

export default LoginPage;
