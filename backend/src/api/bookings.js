const express = require('express');
const { checkPermission } = require('./middleware/rbac');
const router = express.Router();
const { allBookings } = require('./mockData');

let bookingCounter = allBookings.length + 1;

/**
 * POST /api/bookings
 * Create a new booking.
 * This route is protected and requires the 'book_room' permission.
 */
router.post('/', (req, res, next) => {
  // Mocking a user in the session for RBAC middleware to work
  // In a real app, the OAuth callback would populate req.session.user
  if (!req.session.user) {
    req.session.user = { id: 'user123', name: 'Test User', role: 'manager' };
  }
  next();
}, checkPermission('book_room'), (req, res) => {
  const { roomId, startTime, endTime, createTeamsMeeting } = req.body;
  const user = req.session.user;

  if (!roomId || !startTime || !endTime) {
    return res.status(400).json({ message: 'Room ID, startTime, and endTime are required.' });
  }

  // --- Placeholder for creating a booking ---
  const newBooking = {
    id: `booking${bookingCounter++}`,
    userId: user.id,
    roomId,
    startTime,
    endTime,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };

  // --- Placeholder for Microsoft Graph API Integration ---
  if (createTeamsMeeting) {
    console.log('MS Graph API Call: Creating calendar event with Teams meeting...');
    // const msGraphService = require('../services/msGraphService');
    // const event = await msGraphService.createCalendarEvent(user.accessToken, newBooking);
    // newBooking.msTeamsMeetingUrl = event.onlineMeeting.joinUrl;
    newBooking.msTeamsMeetingUrl = `https://teams.microsoft.com/l/meetup-join/..../mock-url-${bookingCounter}`;
    console.log(`Associated Teams Meeting URL: ${newBooking.msTeamsMeetingUrl}`);
  } else {
    console.log('MS Graph API Call: Creating calendar event without Teams meeting...');
  }

  allBookings.push(newBooking);
  console.log('New booking created:', newBooking);

  res.status(201).json(newBooking);
});

/**
 * GET /api/bookings/me
 * Get all bookings for the currently logged-in user.
 */
router.get('/me', (req, res) => {
  const user = req.session.user;

  if (!user) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  // --- Placeholder for fetching user's bookings ---
  const userBookings = allBookings.filter(b => b.userId === user.id);

  res.json(userBookings);
});

/**
 * POST /api/bookings/:id/checkin
 * Check in to a booking, verifying the user's location.
 */
router.post('/:id/checkin', (req, res) => {
  const { id: bookingId } = req.params;
  const { latitude, longitude } = req.body;
  const user = req.session.user;

  if (!user) {
    return res.status(401).json({ message: 'Authentication required.' });
  }
  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'Latitude and longitude are required for check-in.' });
  }

  // --- Mocking Database Lookups ---
  const booking = allBookings.find(b => b.id === bookingId);
  const mockRoom = {
    id: 'room101',
    name: 'Conference Room 101',
    coordinates: { latitude: 13.746864, longitude: 100.535235 } // Example: CP Tower
  };
  // ---

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found.' });
  }
  if (booking.userId !== user.id) {
    return res.status(403).json({ message: 'You are not authorized to check in for this booking.' });
  }
  if (booking.checkedIn) {
    return res.status(400).json({ message: 'Already checked in.' });
  }

  // Check location
  const { getDistanceInMeters } = require('../utils/location');
  const userCoords = { latitude, longitude };
  const distance = getDistanceInMeters(userCoords, mockRoom.coordinates);

  const CHECKIN_RADIUS_METERS = 100; // 100 meters

  if (distance > CHECKIN_RADIUS_METERS) {
    return res.status(403).json({
      message: `Check-in failed. You must be within ${CHECKIN_RADIUS_METERS} meters of the room.`,
      distance: `${Math.round(distance)}m away`,
    });
  }

  // Update booking status
  booking.checkedIn = true;
  console.log(`Booking ${bookingId} checked in successfully.`);

  res.json({ message: 'Check-in successful!', booking });
});

module.exports = router;
