import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography, Box, Button, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Alert, IconButton
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RoomFormDialog from './components/RoomFormDialog.jsx';

function ManageRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const fetchRooms = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/admin/rooms');
      setRooms(response.data);
    } catch (err) {
      setError('Failed to fetch rooms. You may not have admin privileges.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleOpenDialog = (room = null) => {
    setEditingRoom(room);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditingRoom(null);
    setIsDialogOpen(false);
  };

  const handleSaveRoom = async (formData, roomId) => {
    try {
      if (roomId) {
        // Update existing room
        await axios.put(`/api/admin/rooms/${roomId}`, formData);
        alert('Room updated successfully.');
      } else {
        // Create new room
        await axios.post('/api/admin/rooms', formData);
        alert('Room created successfully.');
      }
      handleCloseDialog();
      fetchRooms(); // Refresh the list
    } catch (err) {
      alert(`Failed to save room: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDelete = async (roomId) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await axios.delete(`/api/admin/rooms/${roomId}`);
        alert('Room deleted successfully.');
        fetchRooms(); // Refresh the list
      } catch (err) {
        alert(`Failed to delete room: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Manage Rooms
        </Typography>
        <Button variant="contained" startIcon={<AddCircleIcon />} onClick={() => handleOpenDialog()}>
          Add New Room
        </Button>
      </Box>

      {isLoading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {!isLoading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Building</TableCell>
                <TableCell>Floor</TableCell>
                <TableCell>Capacity</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell>{room.name}</TableCell>
                  <TableCell>{room.building}</TableCell>
                  <TableCell>{room.floor}</TableCell>
                  <TableCell>{room.capacity}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpenDialog(room)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(room.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <RoomFormDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveRoom}
        room={editingRoom}
      />
    </Box>
  );
}

export default ManageRoomsPage;
