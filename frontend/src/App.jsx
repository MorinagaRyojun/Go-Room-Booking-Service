import React from 'react';
import { BrowserRouter, Routes, Route, Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, CssBaseline, Box } from '@mui/material';

// Import page components
import LoginPage from './pages/LoginPage.jsx';
import RoomSearchPage from './pages/RoomSearchPage.jsx';
import MyBookingsPage from './pages/MyBookingsPage.jsx';
import ManageRoomsPage from './pages/admin/ManageRoomsPage.jsx';
import ManageUsersPage from './pages/admin/ManageUsersPage.jsx'; // New Admin Page

function App() {
  // In a real app, you'd get the user role from a context or state management store
  const mockUserRole = 'admin'; // Mocking user role for visibility

  return (
    <BrowserRouter>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Meeting Room Booking
          </Typography>
          <Button color="inherit" component={RouterLink} to="/search">Search Rooms</Button>
          <Button color="inherit" component={RouterLink} to="/bookings">My Bookings</Button>
          {mockUserRole === 'admin' && (
            <>
              <Button color="inherit" component={RouterLink} to="/admin/rooms">Manage Rooms</Button>
              <Button color="inherit" component={RouterLink} to="/admin/users">Manage Users</Button>
            </>
          )}
          <Button color="inherit" component={RouterLink} to="/login">Login</Button>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 4, mb: 4 }}>
        <Box>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/search" element={<RoomSearchPage />} />
            <Route path="/bookings" element={<MyBookingsPage />} />
            <Route path="/admin/rooms" element={<ManageRoomsPage />} />
            <Route path="/admin/users" element={<ManageUsersPage />} /> {/* New User Admin Page */}
            <Route path="/" element={<RoomSearchPage />} /> {/* Default route */}
          </Routes>
        </Box>
      </Container>
    </BrowserRouter>
  );
}

export default App;
