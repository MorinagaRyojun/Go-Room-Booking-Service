const request = require('supertest');
const app = require('../server');

describe('Bookings API', () => {

  describe('GET /api/bookings/me', () => {
    it('should return 401 Unauthorized if the user is not logged in', async () => {
      const response = await request(app)
        .get('/api/bookings/me')
        .expect(401);

      expect(response.body.message).toBe('Authentication required.');
    });

    // A test for a logged-in user would require mocking the session.
    // For example:
    // it('should return 200 OK and the user's bookings if logged in', async () => { ... });
  });

  describe('POST /api/bookings/:id/checkin', () => {
    it('should return 401 Unauthorized if the user is not logged in', async () => {
      await request(app)
        .post('/api/bookings/some-id/checkin')
        .send({ latitude: 1, longitude: 1 })
        .expect(401);
    });
  });

});
