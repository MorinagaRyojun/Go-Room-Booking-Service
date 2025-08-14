const express = require('express');
const { checkPermission } = require('./middleware/rbac');
const { allRooms, allUsers } = require('./mockData');
const crypto = require('crypto');

const router = express.Router();

// Middleware to ensure user is an admin for all routes in this file
router.use((req, res, next) => {
    // Mocking an admin user in the session for demonstration
    // In a real app, this would be populated by the login flow
    if (!req.session.user) {
        req.session.user = { id: 'admin-user', name: 'Admin', role: 'admin' };
    }
    next();
}, checkPermission('manage_resources'));


// GET /api/admin/rooms - Get all rooms for management
router.get('/rooms', (req, res) => {
    res.json(allRooms);
});

// POST /api/admin/rooms - Create a new room
router.post('/rooms', (req, res) => {
    const { name, building, floor, capacity, allowedRoles, allowAllRoles, coordinates } = req.body;
    if (!name || !building || !floor || !capacity) {
        return res.status(400).json({ message: 'Missing required room details.' });
    }
    const newRoom = {
        id: `room${crypto.randomBytes(4).toString('hex')}`,
        name,
        building,
        floor,
        capacity,
        allowedRoles: allowedRoles || [],
        allowAllRoles: allowAllRoles || false,
        coordinates: coordinates || null,
    };
    allRooms.push(newRoom);
    res.status(201).json(newRoom);
});

// PUT /api/admin/rooms/:id - Update an existing room
router.put('/rooms/:id', (req, res) => {
    const { id } = req.params;
    const roomIndex = allRooms.findIndex(r => r.id === id);

    if (roomIndex === -1) {
        return res.status(404).json({ message: 'Room not found.' });
    }

    const updatedRoom = { ...allRooms[roomIndex], ...req.body };
    allRooms[roomIndex] = updatedRoom;

    res.json(updatedRoom);
});

// DELETE /api/admin/rooms/:id - Delete a room
router.delete('/rooms/:id', (req, res) => {
    const { id } = req.params;
    const roomIndex = allRooms.findIndex(r => r.id === id);

    if (roomIndex === -1) {
        return res.status(404).json({ message: 'Room not found.' });
    }

    allRooms.splice(roomIndex, 1);
    res.status(204).send(); // No Content
});

// --- User Management Routes ---

// GET /api/admin/users - Get all users
router.get('/users', (req, res) => {
    res.json(allUsers);
});

// POST /api/admin/users - Manually create a new user
router.post('/users', (req, res) => {
    const { name, email, role } = req.body;
    if (!name || !email || !role) {
        return res.status(400).json({ message: 'Name, email, and role are required.' });
    }
    const newUser = {
        id: `user-${crypto.randomBytes(4).toString('hex')}`,
        ekoId: null, // Manually created users don't have an Eko ID
        name,
        email,
        role,
    };
    allUsers.push(newUser);
    res.status(201).json(newUser);
});

// PUT /api/admin/users/:id/role - Update a user's role
router.put('/users/:id/role', (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    if (!role) {
        return res.status(400).json({ message: 'Role is required.' });
    }

    const user = allUsers.find(u => u.id === id);
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    user.role = role;
    res.json(user);
});

// DELETE /api/admin/users/:id - Delete a user
router.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const userIndex = allUsers.findIndex(u => u.id === id);

    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found.' });
    }

    allUsers.splice(userIndex, 1);
    res.status(204).send();
});

module.exports = router;
