import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle,
  Button, TextField, Grid, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';

// The available roles in the system
const roles = ['admin', 'manager', 'employee'];

function UserFormDialog({ open, onClose, onSave, user }) {
  const [formData, setFormData] = useState({ role: 'employee' });
  const isEditing = !!user;

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'employee',
      });
    } else {
      // Reset for "create" mode
      setFormData({
        name: '',
        email: '',
        role: 'employee',
      });
    }
  }, [user, open]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData, user ? user.id : null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditing ? 'Edit User Role' : 'Add New User'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              name="name"
              label="User Name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              disabled={isEditing} // Name is not editable
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
              disabled={isEditing} // Email is not editable
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="role-select-label">Role</InputLabel>
              <Select
                labelId="role-select-label"
                name="role"
                value={formData.role}
                label="Role"
                onChange={handleChange}
              >
                {roles.map(role => (
                  <MenuItem key={role} value={role}>{role}</MenuItem>
                ))}
              </Select>
            </FormControl>
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

export default UserFormDialog;
