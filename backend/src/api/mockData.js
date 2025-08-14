// A centralized place for mock data to be shared across API route files.

const allRooms = [
  { id: 'room101', name: 'Conference Room 101', building: 'A', floor: 1, capacity: 10, coordinates: { latitude: 13.746864, longitude: 100.535235 }, allowedRoles: ['manager', 'admin'], allowAllRoles: false },
  { id: 'room102', name: 'Focus Room 102', building: 'A', floor: 1, capacity: 4, coordinates: { latitude: 13.746864, longitude: 100.535235 }, allowedRoles: [], allowAllRoles: true },
  { id: 'room205', name: 'Large Assembly Hall', building: 'B', floor: 2, capacity: 50, coordinates: { latitude: 13.746864, longitude: 100.535235 }, allowedRoles: ['admin'], allowAllRoles: false },
  { id: 'room206', name: 'Small Meeting Room', building: 'B', floor: 2, capacity: 6, coordinates: { latitude: 13.746864, longitude: 100.535235 }, allowedRoles: [], allowAllRoles: true },
];

const allBookings = [
  { id: 'booking1', roomId: 'room101', startTime: '2025-09-01T10:00:00Z', endTime: '2025-09-01T11:00:00Z', checkedIn: false, status: 'confirmed' },
];

const allUsers = [
    { id: 'user-admin-01', ekoId: null, name: 'Admin User', email: 'admin@example.com', role: 'admin' },
    { id: 'user-eko-01', ekoId: 'eko-sub-12345', name: 'John Doe (Eko)', email: 'john.doe@eko.com', role: 'employee' },
];

module.exports = {
  allRooms,
  allBookings,
  allUsers,
};
