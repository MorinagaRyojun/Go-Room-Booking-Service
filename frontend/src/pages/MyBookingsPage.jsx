import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography, Box, Grid, Card, CardContent, CardActions,
  Button, CircularProgress, Alert, Chip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';

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
          await axios.post(`/api/bookings/${bookingId}/checkin`, { latitude, longitude });
          alert('Check-in successful!');
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

  const getStatusChip = (booking) => {
    if (booking.checkedIn) {
      return <Chip label="Checked In" color="success" icon={<CheckCircleIcon />} />;
    }
    switch (booking.status) {
      case 'confirmed':
        return <Chip label="Confirmed" color="primary" />;
      case 'cancelled':
        return <Chip label="Cancelled" color="error" />;
      default:
        return <Chip label={booking.status} />;
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        My Bookings
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Here are your upcoming and past bookings.
      </Typography>

      {isLoading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>}
      {error && <Alert severity="error">{error}</Alert>}
      {!isLoading && !error && bookings.length === 0 && <Alert severity="info">You have no bookings.</Alert>}

      <Grid container spacing={3}>
        {bookings.map(booking => (
          <Grid item xs={12} md={6} key={booking.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">Room ID: {booking.roomId}</Typography>
                <Typography color="text.secondary">Start: {new Date(booking.startTime).toLocaleString()}</Typography>
                <Typography color="text.secondary">End: {new Date(booking.endTime).toLocaleString()}</Typography>
                <Box sx={{ mt: 1 }}>{getStatusChip(booking)}</Box>
              </CardContent>
              <CardActions>
                {!booking.checkedIn && booking.status === 'confirmed' && (
                  <Button size="small" startIcon={<LocationOnIcon />} onClick={() => handleCheckIn(booking.id)}>
                    Check-in
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default MyBookingsPage;
