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
import UserFormDialog from './components/UserFormDialog.jsx';

function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/admin/users');
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users. You may not have admin privileges.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenDialog = (user = null) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditingUser(null);
    setIsDialogOpen(false);
  };

  const handleSaveUser = async (formData, userId) => {
    try {
      if (userId) {
        // Update existing user's role
        await axios.put(`/api/admin/users/${userId}/role`, { role: formData.role });
        alert('User role updated successfully.');
      } else {
        // Create new user
        await axios.post('/api/admin/users', formData);
        alert('User created successfully.');
      }
      handleCloseDialog();
      fetchUsers(); // Refresh the list
    } catch (err) {
      alert(`Failed to save user: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/api/admin/users/${userId}`);
        alert('User deleted successfully.');
        fetchUsers(); // Refresh the list
      } catch (err) {
        alert(`Failed to delete user: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Manage Users
        </Typography>
        <Button variant="contained" startIcon={<AddCircleIcon />} onClick={() => handleOpenDialog()}>
          Add New User
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
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Eko ID</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.ekoId || 'N/A'}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpenDialog(user)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(user.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <UserFormDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveUser}
        user={editingUser}
      />
    </Box>
  );
}

export default ManageUsersPage;
