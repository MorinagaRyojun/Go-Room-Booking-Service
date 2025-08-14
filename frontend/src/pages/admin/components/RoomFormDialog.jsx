import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle,
  Button, TextField, Grid, FormControlLabel, Checkbox
} from '@mui/material';

function RoomFormDialog({ open, onClose, onSave, room }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // When the dialog opens for a room, populate the form with its data.
    // If no room is provided, it's a "create" dialog, so we use empty/default values.
    if (room) {
      setFormData({
        name: room.name || '',
        building: room.building || '',
        floor: room.floor || '',
        capacity: room.capacity || '',
        allowAllRoles: room.allowAllRoles || false,
      });
    } else {
      setFormData({
        name: '',
        building: '',
        floor: '',
        capacity: '',
        allowAllRoles: false,
      });
    }
  }, [room, open]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = () => {
    // Pass the form data and the original room ID (if editing) to the parent
    onSave(formData, room ? room.id : null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{room ? 'Edit Room' : 'Add New Room'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              name="name"
              label="Room Name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="building"
              label="Building"
              value={formData.building}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="floor"
              label="Floor"
              type="number"
              value={formData.floor}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="capacity"
              label="Capacity"
              type="number"
              value={formData.capacity}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  name="allowAllRoles"
                  checked={formData.allowAllRoles}
                  onChange={handleChange}
                />
              }
              label="Allow all roles to book this room"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default RoomFormDialog;
