import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/bookings/me');
        setBookings(response.data);
      } catch (err) {
        setError('Failed to fetch your bookings. You may need to log in.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCheckIn = (bookingId) => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await axios.post(`/api/bookings/${bookingId}/checkin`, {
            latitude,
            longitude,
          });
          alert('Check-in successful!');
          // Update the booking status in the UI
          setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, checkedIn: true, status: 'Checked In' } : b));
        } catch (err) {
          alert(`Check-in failed: ${err.response?.data?.message || err.message}`);
        }
      },
      () => {
        alert('Unable to retrieve your location.');
      }
    );
  };

  return (
    <div>
      <h2>My Bookings</h2>
      <p>Here are your upcoming and past bookings.</p>

      {isLoading && <p>Loading your bookings...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="booking-list">
        {!isLoading && !error && bookings.length === 0 && <p>You have no bookings.</p>}
        {bookings.map(booking => (
          <div key={booking.id} style={{ border: '1px solid #eee', padding: '1rem', marginTop: '1rem' }}>
            <strong>Room ID: {booking.roomId}</strong>
            <p>Start: {new Date(booking.startTime).toLocaleString()}</p>
            <p>End: {new Date(booking.endTime).toLocaleString()}</p>
            <p>Status: {booking.checkedIn ? 'Checked In' : booking.status}</p>
            {!booking.checkedIn && booking.status === 'confirmed' && (
              <button onClick={() => handleCheckIn(booking.id)}>Check-in</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyBookingsPage;
