import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Import page components (will be created in the next steps)
import LoginPage from './pages/LoginPage';
import RoomSearchPage from './pages/RoomSearchPage';
import MyBookingsPage from './pages/MyBookingsPage';

function App() {
  return (
    <BrowserRouter>
      <div>
        <nav style={{ padding: '1rem', background: '#f0f0f0' }}>
          <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
          <Link to="/search" style={{ marginRight: '1rem' }}>Search Rooms</Link>
          <Link to="/bookings">My Bookings</Link>
        </nav>
        <main style={{ padding: '1rem' }}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/search" element={<RoomSearchPage />} />
            <Route path="/bookings" element={<MyBookingsPage />} />
            <Route path="/" element={<RoomSearchPage />} /> {/* Default route */}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
