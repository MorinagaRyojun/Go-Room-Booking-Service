// Placeholder for Booking model
// This will define the schema for a single meeting room booking.

const bookingSchema = {
  id: String,
  userId: String, // Reference to the User who booked the room
  roomId: String, // Reference to the Room that was booked
  startTime: Date,
  endTime: Date,

  // Status of the booking, e.g., "confirmed", "cancelled", "pending_checkin"
  status: { type: String, default: "confirmed" },

  // Fields for the check-in process
  checkedIn: { type: Boolean, default: false },

  // The time by which the user must check in. e.g., 15 minutes after startTime.
  checkInDeadline: Date,

  // Optional URL for the associated Microsoft Teams meeting
  msTeamsMeetingUrl: String,

  createdAt: Date,
};

// In a real implementation, this would be a Mongoose, Sequelize, or similar ORM schema.
console.log("Booking model file created.");
