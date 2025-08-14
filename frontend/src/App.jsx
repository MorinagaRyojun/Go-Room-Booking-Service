import React from 'react';
import { BrowserRouter, Routes, Route, Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, CssBaseline, Box } from '@mui/material';

// Import page components
import LoginPage from './pages/LoginPage.jsx';
import RoomSearchPage from './pages/RoomSearchPage.jsx';
import MyBookingsPage from './pages/MyBookingsPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Meeting Room Booking
          </Typography>
          <Button color="inherit" component={RouterLink} to="/login">Login</Button>
          <Button color="inherit" component={RouterLink} to="/search">Search Rooms</Button>
          <Button color="inherit" component={RouterLink} to="/bookings">My Bookings</Button>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 4, mb: 4 }}>
        <Box>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/search" element={<RoomSearchPage />} />
            <Route path="/bookings" element={<MyBookingsPage />} />
            <Route path="/" element={<RoomSearchPage />} /> {/* Default route */}
          </Routes>
        </Box>
      </Container>
    </BrowserRouter>
  );
}

export default App;
