import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RoomSearchPage() {
  const [rooms, setRooms] = useState([]);
  const [filters, setFilters] = useState({ building: '', floor: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRooms = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Use query parameters to send filter data to the backend
      const response = await axios.get('/api/rooms', { params: filters });
      setRooms(response.data);
    } catch (err) {
      setError('Failed to fetch rooms. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch rooms on initial component load
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
      // This is a simplified booking request.
      const response = await axios.post('/api/bookings', {
        roomId: roomId,
        startTime: new Date().toISOString(), // Using placeholder times for now
        endTime: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(),
        createTeamsMeeting: true,
      });
      alert(`Booking successful! Booking ID: ${response.data.id}`);
    } catch (err) {
      alert(`Booking failed: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div>
      <h2>Find a Meeting Room</h2>

      <form onSubmit={handleSearch} style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc' }}>
        <h4>Filters</h4>
        <input name="building" value={filters.building} onChange={handleFilterChange} placeholder="Building (e.g., A)" />
        <input name="floor" value={filters.floor} onChange={handleFilterChange} placeholder="Floor (e.g., 1)" style={{ marginLeft: '1rem' }}/>
        <button type="submit" style={{ marginLeft: '1rem' }}>Search</button>
      </form>

      <div className="results">
        <h4>Available Rooms</h4>
        {isLoading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!isLoading && !error && rooms.length === 0 && <p>No available rooms match your criteria.</p>}
        {rooms.map(room => (
          <div key={room.id} style={{ border: '1px solid #eee', padding: '1rem', marginTop: '1rem' }}>
            <strong>{room.name}</strong>
            <p>Building: {room.building}, Floor: {room.floor}</p>
            <p>Capacity: {room.capacity}</p>
            <button onClick={() => handleBookNow(room.id)}>Book Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RoomSearchPage;
