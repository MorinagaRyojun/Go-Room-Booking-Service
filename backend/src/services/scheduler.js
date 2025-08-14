const cron = require('node-cron');

// In a real app, this would be a shared DB connection/model, not a separate mock DB.
const { bookingsDB } = require('../api/bookings'); // This is not ideal, but works for mocking.

/**
 * A cron job that runs every minute to cancel bookings that missed their check-in time.
 */
const startAutoReleaseJob = () => {
  console.log('Scheduler initialized. Auto-release job will run every minute.');

  // Schedule a task to run every minute.
  cron.schedule('* * * * *', () => {
    console.log('Running auto-release job at', new Date().toISOString());
    const now = new Date();

    // Find bookings that are confirmed but not checked in and are past their deadline.
    // In a real app, this would be a single database query:
    // `Booking.updateMany({ status: 'confirmed', checkedIn: false, checkInDeadline: { $lt: now } }, { status: 'cancelled' })`

    const bookingsToCancel = bookingsDB.filter(b =>
      b.status === 'confirmed' &&
      !b.checkedIn &&
      b.checkInDeadline &&
      new Date(b.checkInDeadline) < now
    );

    if (bookingsToCancel.length > 0) {
      bookingsToCancel.forEach(booking => {
        console.log(`Cancelling booking ${booking.id} due to missed check-in deadline.`);
        booking.status = 'cancelled';
      });
    } else {
      console.log('No bookings to cancel at this time.');
    }
  });
};

module.exports = {
  startAutoReleaseJob,
};
