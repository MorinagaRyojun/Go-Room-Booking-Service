// Placeholder for Room model
// This will define the schema for meeting rooms.

const roomSchema = {
  id: String,
  name: String, // e.g., "Main Conference Room"
  building: String, // e.g., "Building A"
  floor: Number, // e.g., 15
  capacity: Number,

  // An array of Role IDs that are permitted to book this room.
  // An empty array could mean it's restricted unless allowAllRoles is true.
  allowedRoles: [String],

  // If true, this room can be booked by any user, regardless of their role.
  allowAllRoles: { type: Boolean, default: false },

  // GPS coordinates for location-based check-in
  coordinates: {
    latitude: Number,
    longitude: Number,
  },

  createdAt: Date,
};

// In a real implementation, this would be a Mongoose, Sequelize, or similar ORM schema.
console.log("Room model file created.");
