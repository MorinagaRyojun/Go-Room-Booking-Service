const express = require('express');
const router = express.Router();
const { allRooms, allBookings } = require('./mockData');

/**
 * GET /api/rooms
 * Search for available rooms.
 *
 * Query Parameters:
 * - building (string): Filter by building.
 * - floor (number): Filter by floor.
 * - startTime (ISO string): The start of the desired time slot.
 * - endTime (ISO string): The end of the desired time slot.
 */
router.get('/', (req, res) => {
  const { building, floor, startTime, endTime } = req.query;

  let availableRooms = [...allRooms];

  // 1. Filter by location (building and floor)
  if (building) {
    availableRooms = availableRooms.filter(room => room.building === building);
  }
  if (floor) {
    availableRooms = availableRooms.filter(room => room.floor == floor);
  }

  // 2. Filter by availability (startTime and endTime)
  // This is a simplified check. A real implementation would need to handle all edge cases of time overlaps.
  if (startTime && endTime) {
    const requestedStartTime = new Date(startTime);
    const requestedEndTime = new Date(endTime);

    availableRooms = availableRooms.filter(room => {
      // Check for any conflicting bookings for this room
      const hasConflict = allBookings.some(booking => {
        if (booking.roomId !== room.id) return false;

        const bookingStartTime = new Date(booking.startTime);
        const bookingEndTime = new Date(booking.endTime);

        // Conflict exists if: (StartA < EndB) and (EndA > StartB)
        return requestedStartTime < bookingEndTime && requestedEndTime > bookingStartTime;
      });

      return !hasConflict;
    });
  }

  res.json(availableRooms);
});

module.exports = router;
