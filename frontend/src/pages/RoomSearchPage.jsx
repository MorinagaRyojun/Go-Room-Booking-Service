import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField, Button, Typography, Paper, Box, Grid,
  Card, CardContent, CardActions, CircularProgress, Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

function RoomSearchPage() {
  const [rooms, setRooms] = useState([]);
  const [filters, setFilters] = useState({ building: '', floor: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRooms = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/rooms', { params: filters });
      setRooms(response.data);
    } catch (err) {
      setError('Failed to fetch rooms. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRooms();
  };

  const handleBookNow = async (roomId) => {
    try {
      const response = await axios.post('/api/bookings', {
        roomId: roomId,
        startTime: new Date().toISOString(),
        endTime: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(),
        createTeamsMeeting: true,
      });
      alert(`Booking successful! Booking ID: ${response.data.id}`);
    } catch (err) {
      alert(`Booking failed: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Find a Meeting Room
      </Typography>

      <Paper component="form" onSubmit={handleSearch} sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={5}>
            <TextField fullWidth name="building" label="Building (e.g., A)" value={filters.building} onChange={handleFilterChange} />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField fullWidth name="floor" label="Floor (e.g., 1)" value={filters.floor} onChange={handleFilterChange} />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button fullWidth type="submit" variant="contained" startIcon={<SearchIcon />}>
              Search
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Box className="results">
        <Typography variant="h5" component="h2" gutterBottom>
          Available Rooms
        </Typography>
        {isLoading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>}
        {error && <Alert severity="error">{error}</Alert>}
        {!isLoading && !error && rooms.length === 0 && <Alert severity="info">No available rooms match your criteria.</Alert>}
        <Grid container spacing={3}>
          {rooms.map(room => (
            <Grid item xs={12} sm={6} md={4} key={room.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div">{room.name}</Typography>
                  <Typography color="text.secondary">Building: {room.building}, Floor: {room.floor}</Typography>
                  <Typography color="text.secondary">Capacity: {room.capacity}</Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" startIcon={<EventAvailableIcon />} onClick={() => handleBookNow(room.id)}>
                    Book Now
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default RoomSearchPage;
